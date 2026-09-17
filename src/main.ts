import './main.css'

const body = document.querySelector<HTMLDivElement>('#app')!;

const page = document.createElement('div');
page.className = 'page';
body.appendChild(page);

const top = document.createElement('div');
top.className = 'top';
page.appendChild(top);

const titleArea = document.createElement('div');
titleArea.className = 'titleArea';
top.appendChild(titleArea);

const title = document.createElement('h1');
title.className = 'title';
titleArea.appendChild(title);
const subtitle = document.createElement('div');
subtitle.className = 'subtitle';
titleArea.appendChild(subtitle);

const contact = document.createElement('div');
contact.className = 'contact';
top.appendChild(contact);

title.appendChild(document.createTextNode('Scott Novakowski'));
subtitle.appendChild(document.createTextNode('Senior Software Engineer'));

const link = (url: string, title?: string) => {
	title ??= url;
	const a = document.createElement('a');
	a.href = url;
	a.textContent = title;
	a.target = "_blank";
	a.rel = "noopener noreferrer";
	return a;
}

const createContact = (printLines: Array<string>, lines: Array<string>, links: Array<HTMLAnchorElement>, pdfHidden: HTMLAnchorElement) => {
	// Kept out of the live page so scrapers don't harvest it; still printed into the PDF
	for (const line of printLines) {
		const node = document.createElement('span');
		node.appendChild(document.createTextNode(line));
		node.appendChild(document.createElement('br'));
		node.classList.add('print-only');
		contact.appendChild(node);
	}
	for (const line of lines) {
		contact.appendChild(document.createTextNode(line));
		contact.appendChild(document.createElement('br'));
	}
	let first = true;
	for (const link of links) {
		if (first) first = false;
		else contact.appendChild(document.createTextNode(' | '));
		contact.appendChild(link);
	}
	const node = document.createElement('span');
	node.appendChild(document.createTextNode(' | '));
	node.appendChild(pdfHidden);
	node.classList.add('pdf-link');
	contact.appendChild(node);
}
createContact([
	"+1 (647) 465-3759",
], [
	"snovakow@gmail.com",
	"Toronto, ON, Canada",
], [
	link('https://github.com/snovakow', 'GitHub'),
	link('https://snovakow.com', 'Website'),
	link('https://www.linkedin.com/in/snovakow', 'LinkedIn')
],
	link('./ScottNovakowski-Resume.pdf', 'PDF')
);

const content = document.createElement('div');
content.className = 'content';
page.appendChild(content);

const addHeader = (text: string) => {
	const header = document.createElement('h2');
	header.className = 'header';
	header.appendChild(document.createTextNode(text));
	content.appendChild(header);
}

const addParagraph = (text?: string) => {
	const paragraph = document.createElement('div');
	paragraph.className = 'paragraph';
	if (text) paragraph.appendChild(document.createTextNode(text));
	content.appendChild(paragraph);
	return paragraph;
}

const makeBoldLine = (text: string) => {
	const line = document.createElement('div');
	line.className = 'bold';
	line.appendChild(document.createTextNode(text));
	return line;
}

type RecursiveArray<T> = Array<T | RecursiveArray<T>>;
type ListValue = string | Node;
const createListNode = (item: RecursiveArray<ListValue> | ListValue) => {
	if (!Array.isArray(item)) {
		const li = document.createElement('li');
		li.className = 'bulletSub';
		const node = typeof item === 'string' ? document.createTextNode(item) : item;
		li.appendChild(node);
		return li;
	}

	const ul = document.createElement('ul');
	ul.className = 'bulletMain';
	for (const element of item) {
		if (!Array.isArray(element)) {
			ul.appendChild(createListNode(element));
			continue;
		}

		const parentLi = ul.lastElementChild as HTMLLIElement | null;
		if (!parentLi) {
			console.warn('Invalid list structure: nested arrays must follow a list item to become a sublist.');
			continue;
		}
		parentLi.appendChild(createListNode(element));
	}
	return ul;
}

const makeBoldSegment = (text: string) => {
	const bold = document.createElement('span');
	bold.className = 'bold';
	bold.appendChild(document.createTextNode(text));
	return bold;
}
const makeSkillLine = (title: string, description: string) => {
	const line = document.createElement('span');
	line.appendChild(makeBoldSegment(title));
	line.appendChild(document.createTextNode(': ' + description));

	return line;
}

addHeader('SUMMARY');
addParagraph(`Software engineer with two decades of shipping across the stack — real-time 3D, VR and AR,
	native macOS, iOS, and tvOS apps, web frontends, multiplayer and streaming, video pipelines, and research software.
	Lead the frontend of a browser-native platform for interactive multimedia and guided 3D experiences, used by
	ARTE, ZDF, BBC, and AT&T to ship their own work; a Meta collaboration won three 2021 WebXR Poly Awards. Designed and built the 3D anatomy teaching tools for the University of Calgary’s Cumming
	School of Medicine. Fluent across domains, languages, and platforms, and now working agent-first with AI coding
	tools; drawn to work that blends technical complexity with creative potential.`);

addHeader('SKILLS');
content.appendChild(createListNode([
	makeSkillLine('Languages',
		'JavaScript, TypeScript, HTML, CSS, C, Objective-C, Swift, PHP, SQL (MySQL), GLSL'
	),
	makeSkillLine('3D Graphics & Immersive Media',
		'OpenGL, OpenGL ES2, WebGL, Three.js, WebXR, Gaussian Splatting, 360° and Stereoscopic Video, Virtual Reality (VR), Augmented Reality (AR)'
	),
	makeSkillLine('Frameworks & Tooling',
		'React, Vite, Webpack, Node.js and npm build systems, WebRTC, FFmpeg'
	),
	makeSkillLine('Platforms',
		'Web, macOS, iOS (iPhone), tvOS (Apple TV), Meta Quest (VR)'
	),
	makeSkillLine('AI-Assisted Development',
		'Claude Code, GitHub Copilot, agent-directed planning and implementation in an established codebase'
	),
	makeSkillLine('Leadership',
		'Senior and lead engineer roles, cross-team technical guidance, intern and student mentorship'
	),
]));

addHeader('EXPERIENCE');
const boldSection = (text: string) => {
	const bold = document.createElement('h3');
	bold.className = 'header';
	bold.appendChild(document.createTextNode(text));
	return bold;
}
const makeExperience = (title: string, subtitle: string | Node, description: RecursiveArray<ListValue>) => {
	content.appendChild(boldSection(title));
	content.appendChild(typeof subtitle === 'string' ? document.createTextNode(subtitle) : subtitle);
	content.appendChild(createListNode(description));
}
const embed = (...nodes: Array<string | Node>) => {
	const fragment = document.createDocumentFragment();
	for (const node of nodes) {
		if (typeof node === 'string') fragment.appendChild(document.createTextNode(node));
		else fragment.appendChild(node);
	}
	return fragment;
}
const embeddedLink = (start: string | null = null, title: string, end: string | null = null, url: string) => {
	const embedded = [];
	if (start) embedded.push(start);
	embedded.push(link(url, title));
	if (end) embedded.push(end);
	return embed(...embedded);
}
makeExperience(
	'Senior Developer, Frontend Lead',
	embeddedLink(null, 'Liquid Cinema', ' — 2015 to Present', 'https://liquidcinemavr.com'),
	[
		'A browser-native engine for interactive multimedia, combining real-time 3D, live video streaming, and multi-user sessions across flat screens and headsets',
		'Shipped the frontend behind immersive productions for Meta and public broadcasters ARTE, ZDF, and BBC, and the internal training content AT&T authored on the platform',
		'Developed the native iOS and tvOS clients, integrated FFmpeg encoding with Vimeo hosting, and ran video encoding for ARTE’s productions',
		'Built audience analytics on a PHP and MySQL backend, shipped with the broadcaster productions, recording where viewers looked and rendering it as a heat map of attention',
		'Mentored an intern, advised the other technical leads in their areas, and challenged platform design decisions with management',

		'Wrote the internal WebGL rendering library behind the web player, later migrating it to Three.js; the player is now the platform’s single frontend across desktop, mobile, and headset',
		[
			'Real-time 3D scenes composited with interactive cinematic 360° and stereoscopic video',
			'Virtual and augmented reality support built on the WebXR standard',
			'Gaussian splatting for photoreal captured scenes and objects, rendered live in the browser',
			embeddedLink(
				null,
				'Fraunhofer HHI',
				' collaboration to integrate OMAF 360° VR video streaming into the web platform',
				'https://www.hhi.fraunhofer.de/en/departments/vca/technologies-and-solutions/mpeg-omaf.html'
			),
		],


		embeddedLink(
			'Led WebXR development of ',
			'“Magic of Flight”',
			', an interactive educational experience built with Meta for the Quest headset',
			'https://liquidcinemavr.com/fly/'
		),
		[
			'Won three 2021 WebXR Poly Awards: Experience of the Year, Education Experience of the Year, and Video Experience of the Year',
			'Featured on the Meta Quest browser’s splash page and sustained around 1,000 visits a day',
			'Sixteen episodes playable individually or as one continuous run, kept stable on Quest 2 by strict memory loading and unloading through a purpose-built episode transition sequence',
		],

		'Grew the platform into a collaborative metaverse, a shared immersive 3D environment, leading the frontend in a Conestoga College partnership from late 2022',
		[
			'Guided sessions in which one presenter drives every participant through an environment or presentation, controlling what the group sees',
			'Live presence and shared session state on Colyseus, turning the single-viewer player into a shared space',
			'“Vavatars” — video-avatars streaming each participant’s live camera onto their 3D avatar for conferencing in virtual reality',
			'Live video chat, messaging, screen sharing, and 3D line drawing to mark up the scene as the group talks',
			'Video distribution moved from peer-to-peer WebRTC over PeerJS to Ant Media Server, targeted at and tested with sessions of 20 concurrent participants',
			'Comment threads pinned to objects and places in the scene, for feedback during a session or after it',
			'A phone as the presentation remote after a QR scan, for slide-style navigation through a guided experience',
		],

		'Ported the 70,000-line web player to TypeScript with AI coding agents, reviewing and refactoring every module to modern standards and switching agents per file where one fell short',

		'Currently building Blockly-based visual scripting for code-free interaction authoring, and next the frontend for AI-guided experiences that respond to a visitor’s questions, location, and actions',
	]
);
makeExperience(
	'The Lindsay Project: Lead Programmer and Software Designer',
	'University of Calgary — 2009 to 2015',
	[
		'Designed and built the 3D human anatomy teaching tools for the Cumming School of Medicine, funded by the Department of Undergraduate Medical Education',
		'Built a full-stack pipeline (PHP, MySQL) around Zygote 3D human anatomy models, originally used in Google Body (now Zygote Body), powering multiple applications',
		'Mentored summer students on the project team',
		embeddedLink(
			'Developed ',
			'“Zygote 3D Anatomy Atlas & Dissection Lab”',
			', an iPhone and iPad app that averaged around 2,000 downloads a year on the App Store',
			'https://lindsayvirtualhuman.com/?p=273'
		),
		[
			embed(
				'Demo videos: ',
				link('https://www.youtube.com/watch?v=3MZps2_Z1zo', 'Intro'),
				' · ',
				link('https://www.youtube.com/watch?v=38d7P3JB4SE', 'Rendering'),
				' · ',
				link('https://www.youtube.com/watch?v=M0xubQ0_5Q0', 'Slice Tool'),
			),
		],
		'Created “Atlas”, a 3D human anatomy web application provided to the school’s medical students',
		[
			embeddedLink(
				null,
				'CBC segment',
				' on The Lindsay Project, featuring the Atlas application',
				'https://www.cbc.ca/news/canada/calgary/new-medical-tool-honours-u-of-c-student-s-memory-1.1240316',
			),
		],
		embeddedLink(
			'Wrote ',
			'“Presenter”',
			', a Mac application for 3D anatomy slide presentations, adopted by a professor for a semester of teaching',
			'https://lindsayvirtualhuman.com/?page_id=451'
		),
	]
);
makeExperience(
	'Vaccine Design and Implementation Project',
	'University of Calgary — 2008',
	[
		'Built interactive 3D OpenGL visualizations for an AHFMR-funded vaccine design study',
	]
);
makeExperience(
	'Swarm Art Software Developer',
	'University of Calgary — 2005 to 2007',
	[
		'Developed agent-based swarm systems that generated visuals for interactive art installations',
		'Featured in the Leonardo Journal (MIT Press, 2007), the New York Hall of Science (Digital’06 “Bio/Med SciART”, 2006), a Discovery Channel “Daily Planet” segment on swarm intelligence (2006), and interactive public displays at the Victoria Conference Centre (Victoria, BC, 2006) and the Nickle Arts Museum (Calgary, 2005)',
	]
);

addHeader('PROJECTS');
makeExperience(
	'Tims Hockey Challenge Helper',
	embed(
		'Personal project — 2026 · ',
		link('https://snovakow.com/timspicks/', 'App'),
		' · ',
		link('https://github.com/snovakow/timspicks', 'Source'),
	),
	[
		'Web app that ranks NHL goal-scorer picks for the Tim Hortons Hockey Challenge from sportsbook implied probabilities',
		'Built in React over several months as a deliberate way to learn the framework, developed agent-first with GitHub Copilot',
		'Picks made with the app ranked in the top 0.38% of roughly 600,000 players in Challenge 6 of the 2025–26 season, and the top 1.33% in the playoffs',
	]
);
makeExperience(
	'Sudoku',
	embed(
		'Personal project — 2025 · ',
		link('https://snovakow.com/sudoku', 'App'),
		' · ',
		link('https://github.com/snovakow/sudoku', 'Source'),
	),
	[
		'Puzzle generator and strategy explorer that grades each puzzle by the techniques its solution requires, across fifteen strategies from naked singles to Swordfish and Jellyfish',
		'Wrote the strategy-based solver behind it over many months, detecting each technique the way a person reasoning through the grid would find it',
	]
);

addHeader('EDUCATION');
const education = addParagraph();
education.appendChild(makeBoldLine('Bachelor of Science in Computer Science'));
education.appendChild(document.createTextNode('University of Calgary, AB — 2006'));

const createPublication = (main: string, sub1a: string, subName: string, sub1b: string, sub2: string) => {
	const mainElement = document.createElement('div');
	mainElement.className = 'publicationMain';
	mainElement.appendChild(document.createTextNode(main));

	const subElement1 = document.createElement('div');
	subElement1.className = 'publicationSub1';

	subElement1.appendChild(document.createTextNode(sub1a));

	subElement1.appendChild(makeBoldSegment(subName));

	subElement1.appendChild(document.createTextNode(sub1b));

	const subElement2 = document.createElement('div');
	subElement2.className = 'publicationSub2';
	subElement2.appendChild(document.createTextNode(sub2));

	const element = document.createElement('div');
	element.appendChild(mainElement);
	element.appendChild(subElement1);
	element.appendChild(subElement2);
	return element;
}
addHeader('PUBLICATIONS');
const publications = createListNode([
	createPublication(
		'LINDSAY Virtual Human: Multi-Scale, Agent-based, and Interactive',
		'C. Jacob, S. von Mammen, T. Davison, … ',
		'S. Novakowski',
		', … and B. Wright.',
		'Advances in Intelligent Modelling and Simulation, Springer, 2012.',
	),
	createPublication(
		'Evolutionary Swarm Design: How Can Swarm-based Systems Help to Generate and Evaluate Designs?',
		'Sebastian von Mammen, ', 'Scott Novakowski', ', Gerald Hushlak, and Christian Jacob.',
		'Design Principles and Practices: An International Journal, 2009.',
	),
	createPublication(
		'Evolutionary design of dynamic SwarmScapes',
		'Namrata Khemka, ', 'Scott Novakowski', ', Gerald Hushlak, and Christian Jacob.',
		'GECCO 2008 Proceedings, Atlanta, GA, 2008.',
	),
	createPublication(
		'Motion swarms: video interaction for art in complex environments',
		'Quoc Nguyen, ', 'Scott Novakowski', ', Jeffrey E. Boyd, Christian Jacob, and Gerald Hushlak.',
		'ACM International Conference on Multimedia, Santa Barbara, CA, 2006.',
	),
]);
content.appendChild(publications);
