// This project's additions to the /deploy skill, which builds a branch's committed files in a temp folder
// and copies the build into the live folder. The skill is shared between projects, so this file names
// this one's folder among the machine's live folders, which git config deploy.liveRoot says where to find.
//
// The PDF is the page printed, and /commit reprints it whenever the page changes. A branch whose page changed
// after its PDF was printed would put an out-of-date PDF live, so it stops the deploy before anything is
// copied. The jobs repository, where it is checked out beside this one, reads the resume from its
// root/resume.pdf, so the deploy copies the PDF it puts live over that file too; jobs commits it from there.
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { PDF, staleness } from '../scripts/pdf.mjs';

const isFile = (path) => { try { return statSync(path).isFile(); } catch { return false; } };

export default {
	liveName: 'resume',

	steps({ repoRoot, out, options }) {
		const { branch } = options;
		const sha = execFileSync('git', ['rev-parse', '--verify', '-q', `refs/heads/${branch}^{commit}`], { cwd: repoRoot, encoding: 'utf8' }).trim();
		const { since, changed } = staleness(repoRoot, sha);
		if (!since) throw new Error(`${branch} has no ${PDF}; npm run pdf prints it`);
		if (changed.length) {
			throw new Error(`${branch} changes ${changed.join(', ')} after its PDF was last printed, at ${since.slice(0, 7)}, so the live PDF would be out of date. /commit reprints it with the page; commit the reprint to ${branch} and deploy again`);
		}

		const jobs = join(dirname(repoRoot), 'jobs');
		const target = join(jobs, 'root', 'resume.pdf');
		if (!existsSync(join(jobs, '.git')) || !isFile(target)) {
			console.log('Note: no jobs checkout with a root/resume.pdf beside this one, so the PDF goes to the live folder only');
			return [];
		}
		return [{ files: [{ from: join(out, basename(PDF)), to: target, label: `the PDF over ${relative(dirname(repoRoot), target)}` }] }];
	},
};
