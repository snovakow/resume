#!/usr/bin/env node
// Prints the resume page to public/ScottNovakowski-Resume.pdf with headless Chrome, as Chrome's own
// Print > Save as PDF does: the paper size and margins main.css gives @page, no header or footer, and the
// links kept. Chrome stamps every PDF with the time it was made, so a reprint of the same page never has
// the same bytes; it reprints only where the page has changed since the PDF last did.
//
//     node scripts/pdf.mjs                reprint where index.html, src/ or vite.config.js changed after
//                                         the commit that last changed the PDF
//     node scripts/pdf.mjs --check        say whether it would, and change nothing
//     node scripts/pdf.mjs --force        reprint whatever changed
//     node scripts/pdf.mjs --out <file>   print to that file instead, and leave the PDF as it is
//
// It builds the working tree with npm run build and prints dist/index.html. Chrome is found where it is
// usually installed, or where CHROME_PATH says. Node 18 or later, no dependencies.
//
// /deploy's settings file imports staleness, to stop a deploy whose page changed after its PDF was printed.

import { execFileSync, spawn } from 'node:child_process';
import { mkdtempSync, readFileSync, renameSync, rmSync, statSync, unlinkSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { basename, dirname, extname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

// The PDF, and what the page is made from. A dependency, the favicon or the version leave the printed page
// as it is, so a version commit never calls for a reprint
export const PDF = 'public/ScottNovakowski-Resume.pdf';
export const PAGE = ['index.html', 'src', 'vite.config.js'];

const git = (repoRoot, ...args) => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
const lines = (text) => text.split('\n').filter(Boolean);

// The commit that last changed the PDF, at rev or at HEAD, and the page's files changed after it: up to rev,
// or in the working tree, untracked files included. since is null where the PDF has never been committed
export const staleness = (repoRoot, rev = null) => {
	const since = git(repoRoot, 'log', '-1', '--format=%H', rev ?? 'HEAD', '--', PDF) || null;
	if (!since) return { since, changed: [...PAGE] };
	const changed = rev
		? lines(git(repoRoot, 'diff', '--name-only', since, rev, '--', ...PAGE))
		: [...new Set([
			...lines(git(repoRoot, 'diff', '--name-only', since, '--', ...PAGE)),
			...lines(git(repoRoot, 'ls-files', '--others', '--exclude-standard', '--', ...PAGE)),
		])];
	return { since, changed };
};

class Stop extends Error {}
const stop = (text) => { throw new Stop(text); };
const say = (text) => console.log(text);
const isFile = (path) => { try { return statSync(path).isFile(); } catch { return false; } };
const inside = (dir, path) => { const rel = relative(dir, path); return rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel); };
const named = (paths) => (paths.length > 5 ? `${paths.slice(0, 5).join(', ')} and ${paths.length - 5} more` : paths.join(', '));
const countPages = (pdf) => (pdf.toString('latin1').match(/\/Type\s*\/Page(?![A-Za-z])/g) ?? []).length;
const within = (promise, ms) => new Promise((done) => {
	const timer = setTimeout(() => done(false), ms);
	promise.then(() => { clearTimeout(timer); done(true); });
});

const USAGE = 'Usage: pdf.mjs [--check] [--force] [--out <file>]';
const CHROMES = [
	'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
	join(homedir(), 'Applications/Google Chrome.app/Contents/MacOS/Google Chrome'),
	'/Applications/Chromium.app/Contents/MacOS/Chromium',
	'/usr/bin/google-chrome',
	'/usr/bin/google-chrome-stable',
	'/usr/bin/chromium',
	'/usr/bin/chromium-browser',
];
// The page reaches Chrome from dist/ under an origin no network has, and every other request fails: Chrome
// runs no module script from file://, and the page's analytics tag never counts a print as a visit
const ORIGIN = 'http://resume.invalid';
const TYPES = {
	'.html': 'text/html; charset=utf-8',
	'.js': 'text/javascript; charset=utf-8',
	'.css': 'text/css; charset=utf-8',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.ico': 'image/x-icon',
	'.woff2': 'font/woff2',
	'.pdf': 'application/pdf',
};
const TIMEOUT = 60_000;

const findChrome = () => {
	const given = process.env.CHROME_PATH;
	if (given) return isFile(given) ? given : stop(`CHROME_PATH is ${given}, which isn't a file`);
	return CHROMES.find(isFile) ?? stop('Chrome isn\'t where it is usually installed; set CHROME_PATH to it');
};

// Prints dist/index.html in a headless Chrome of its own, driven over a pipe with the DevTools protocol, so
// it needs no port and touches no profile but a throwaway one
const print = async (dist) => {
	const chromePath = findChrome();
	const profile = mkdtempSync(join(tmpdir(), 'resume-pdf-'));
	const chrome = spawn(chromePath, [
		'--headless',
		'--remote-debugging-pipe',
		`--user-data-dir=${profile}`,
		'--no-first-run',
		'--no-default-browser-check',
		'--use-mock-keychain',
		'--disable-extensions',
		'--disable-default-apps',
		'--disable-sync',
		'--disable-background-networking',
		'--disable-component-update',
		'--mute-audio',
		'about:blank',
	], { stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe'] });
	const exited = new Promise((done) => { chrome.once('exit', done); chrome.once('error', done); });

	// Anything that ends Chrome early, or the time running out, fails whatever is waiting on it
	let stderr = '';
	let die;
	const dead = new Promise((_, reject) => { die = reject; });
	dead.catch(() => {});
	const timer = setTimeout(() => die(new Stop(`Chrome didn't print the page within ${TIMEOUT / 1000} s`)), TIMEOUT);
	chrome.once('error', (error) => die(new Stop(`Chrome didn't start: ${error.message}`)));
	chrome.once('exit', (code, signal) => {
		const tail = stderr.trim().split('\n').slice(-10).join('\n');
		die(new Stop(`Chrome quit (${signal ?? `exit ${code}`}) before the page was printed${tail ? `:\n${tail}` : ''}`));
	});
	const guard = (promise) => Promise.race([promise, dead]);

	// The protocol: one JSON message per command and per reply or event, each ended by a NUL
	const toChrome = chrome.stdio[3];
	const fromChrome = chrome.stdio[4];
	const pending = new Map();
	const listeners = new Set();
	let nextId = 0;
	let buffer = '';
	const send = (method, params = {}, sessionId) => new Promise((done, reject) => {
		const id = ++nextId;
		pending.set(id, { method, resolve: done, reject });
		toChrome.write(`${JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })}\0`);
	});
	const event = (method, sessionId) => new Promise((done) => {
		const listener = (message) => {
			if (message.method !== method || message.sessionId !== sessionId) return;
			listeners.delete(listener);
			done(message.params);
		};
		listeners.add(listener);
	});

	try {
		chrome.stderr.setEncoding('utf8');
		chrome.stderr.on('data', (chunk) => { stderr = (stderr + chunk).slice(-4000); });
		toChrome.on('error', () => {});
		fromChrome.on('error', () => {});
		fromChrome.setEncoding('utf8');
		fromChrome.on('data', (chunk) => {
			buffer += chunk;
			for (let end = buffer.indexOf('\0'); end !== -1; end = buffer.indexOf('\0')) {
				const message = JSON.parse(buffer.slice(0, end));
				buffer = buffer.slice(end + 1);
				if (message.id === undefined) {
					for (const listener of listeners) listener(message);
					continue;
				}
				const call = pending.get(message.id);
				pending.delete(message.id);
				if (message.error) call?.reject(new Stop(`Chrome refused ${call?.method}: ${message.error.message}`));
				else call?.resolve(message.result);
			}
		});

		const { targetId } = await guard(send('Target.createTarget', { url: 'about:blank' }));
		const { sessionId } = await guard(send('Target.attachToTarget', { targetId, flatten: true }));

		// Serve dist/, fail every other request, and keep what the page threw or couldn't find. A favicon
		// isn't printed, so one that is missing doesn't count
		const thrown = [];
		const missing = [];
		listeners.add((message) => {
			if (message.sessionId !== sessionId) return;
			if (message.method === 'Runtime.exceptionThrown') {
				const { exceptionDetails: details } = message.params;
				thrown.push(details.exception?.description?.split('\n')[0] ?? details.text);
				return;
			}
			if (message.method !== 'Fetch.requestPaused') return;
			const { requestId, request } = message.params;
			const url = new URL(request.url);
			if (url.origin !== ORIGIN) {
				send('Fetch.failRequest', { requestId, errorReason: 'BlockedByClient' }, sessionId).catch(() => {});
				return;
			}
			let path = null;
			try { path = join(dist, decodeURIComponent(url.pathname)); } catch { /* a malformed path finds nothing */ }
			if (path && inside(dist, path) && isFile(path)) {
				const headers = [{ name: 'Content-Type', value: TYPES[extname(path)] ?? 'application/octet-stream' }];
				send('Fetch.fulfillRequest', { requestId, responseCode: 200, responseHeaders: headers, body: readFileSync(path).toString('base64') }, sessionId).catch(() => {});
				return;
			}
			if (!/(?:^|\/)favicon\.\w+$/.test(url.pathname)) missing.push(url.pathname);
			send('Fetch.fulfillRequest', { requestId, responseCode: 404, responseHeaders: [{ name: 'Content-Type', value: 'text/plain' }], body: '' }, sessionId).catch(() => {});
		});
		await guard(send('Fetch.enable', { patterns: [{ urlPattern: '*' }] }, sessionId));
		await guard(send('Runtime.enable', {}, sessionId));
		await guard(send('Page.enable', {}, sessionId));

		// The page builds itself in a module script, which runs before the load event
		const loaded = event('Page.loadEventFired', sessionId);
		const { errorText } = await guard(send('Page.navigate', { url: `${ORIGIN}/index.html` }, sessionId));
		if (errorText) stop(`Chrome couldn't open the page: ${errorText}`);
		await guard(loaded);
		const { result } = await guard(send('Runtime.evaluate', {
			expression: 'document.fonts.ready.then(() => (document.querySelector("#app .page .content")?.childElementCount ?? 0) > 0)',
			awaitPromise: true,
			returnByValue: true,
		}, sessionId));
		if (thrown.length) stop(`The page threw, so nothing was printed: ${thrown.join('; ')}`);
		if (missing.length) stop(`The page loads ${missing.join(', ')}, which dist/ doesn't have, so nothing was printed`);
		if (result?.value !== true) stop('The page built no content, so nothing was printed');

		// As the print dialog does with its default margins: the size and margins @page gives, and no header or
		// footer. Tagged, as Chrome's own print is, so a reader can follow its structure
		const { data } = await guard(send('Page.printToPDF', {
			preferCSSPageSize: true,
			displayHeaderFooter: false,
			printBackground: false,
			generateTaggedPDF: true,
		}, sessionId));
		return Buffer.from(data, 'base64');
	} finally {
		clearTimeout(timer);
		if (chrome.exitCode === null && chrome.signalCode === null && chrome.pid !== undefined) {
			try { toChrome.write(`${JSON.stringify({ id: ++nextId, method: 'Browser.close', params: {} })}\0`); } catch { /* already gone */ }
			if (!(await within(exited, 5000))) {
				chrome.kill('SIGKILL');
				await exited;
			}
		}
		try { rmSync(profile, { recursive: true, force: true }); } catch { /* the temp folder is cleared in time */ }
	}
};

// Writes beside the target, then renames over it, so nothing ever reads a half-written PDF
const place = (bytes, target) => {
	const temp = join(dirname(target), `.${basename(target)}.pdf-${process.pid}`);
	try {
		writeFileSync(temp, bytes);
		renameSync(temp, target);
	} catch (error) {
		try { unlinkSync(temp); } catch { /* never written */ }
		throw error;
	}
};

const main = async () => {
	const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
	const options = { check: false, force: false, out: null };
	const args = process.argv.slice(2);
	for (let index = 0; index < args.length; index += 1) {
		const arg = args[index];
		if (arg === '--check') options.check = true;
		else if (arg === '--force') options.force = true;
		else if (arg === '--out') {
			options.out = args[++index];
			if (!options.out || options.out.startsWith('-')) stop(`--out needs a file. ${USAGE}`);
		} else if (arg === '--help' || arg === '-h') {
			say(USAGE);
			return;
		} else stop(`Unknown argument ${arg}. ${USAGE}`);
	}

	const { since, changed } = staleness(repoRoot);
	const last = since ? git(repoRoot, 'log', '-1', '--format=%h "%s"', since) : null;
	const state = !since
		? `${PDF} has never been committed`
		: changed.length
			? `The PDF is out of date: ${named(changed)} changed after it was last printed, at ${last}`
			: `The PDF is current: nothing the page is made from changed after it was last printed, at ${last}`;
	if (options.check || (!changed.length && !options.force && !options.out)) {
		say(state);
		return;
	}
	if (!options.out) say(options.force && !changed.length ? `${state}; reprinting it all the same` : state);

	try {
		execFileSync('npm', ['run', 'build'], { cwd: repoRoot, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 1 << 26 });
	} catch (error) {
		const output = `${error.stdout ?? ''}\n${error.stderr ?? ''}`.trim().split('\n').slice(-25).join('\n');
		stop(`npm run build failed, so nothing was printed:\n${output || error.message}`);
	}
	const pdf = await print(join(repoRoot, 'dist'));
	if (pdf.subarray(0, 5).toString('latin1') !== '%PDF-') stop('What Chrome printed isn\'t a PDF, so nothing was written');
	const pages = countPages(pdf);

	// npm runs a script from the package's folder and says in INIT_CWD where it was run from
	const target = options.out ? resolve(process.env.INIT_CWD ?? process.cwd(), options.out) : join(repoRoot, PDF);
	const before = isFile(target) ? countPages(readFileSync(target)) : null;
	place(pdf, target);
	const count = `${pages} ${pages === 1 ? 'page' : 'pages'}${before === null || before === pages ? '' : `, was ${before}`}`;
	say(options.out ? `Printed ${target}, ${count}; ${PDF} is as it was` : `Reprinted ${PDF}, ${count}`);
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
	main().catch((error) => {
		console.error(error instanceof Stop ? error.message : `The PDF wasn't printed: ${error?.stack ?? error}`);
		process.exitCode = 1;
	});
}
