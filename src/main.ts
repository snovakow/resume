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

const title = document.createElement('div');
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

const createContact = (lines: Array<string>, links: Array<HTMLAnchorElement>) => {
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
}
createContact([
	"+1 (647) 465-3759",
	"snovakow@gmail.com",
	"Toronto, ON, Canada",
], [
	link('https://github.com/snovakow', 'GitHub'),
	link('https://snovakow.com', 'Website'),
	link('https://www.linkedin.com/in/snovakow', 'LinkedIn'),
]);

const content = document.createElement('div');
content.className = 'content';
page.appendChild(content);

const addHeader = (text: string) => {
	const header = document.createElement('div');
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
addParagraph(`Passionate and creative software developer with a variety of experience — from 3D graphics and immersive VR/AR 
	experiences to video encoding, real-time multiplayer systems, mobile development, and interactive educational applications. 
	I bring experience across diverse platforms (web, iOS, tvOS, Meta Quest) as well as mastering specialized territories like WebGL rendering, 
	FFmpeg-based video workflows, and WebXR. Driven by a strong desire for problem-solving and building work with lasting impact, 
	I thrive in roles that challenge me to grow, take on greater responsibility, and contribute meaningfully.`);

addHeader('SKILLS');
content.appendChild(createListNode([
	makeSkillLine('3D Graphics & Immersive Tech',
		'OpenGL, OpenGL ES2, WebGL, WebXR, 360° Video, Stereoscopic Video, Virtual Reality (VR), Augmented Reality (AR)'
	),
	makeSkillLine('Software Development Platforms',
		'Web, macOS, iOS (iPhone), tvOS (AppleTV), Meta Quest (VR Headset)'
	),
	makeSkillLine('Backend Systems',
		'PHP, MySQL, WebRTC, PeerJS, Ant Media Server (Multi-Client Video Streaming), Colyseus (Multiplayer Framework), FeathersJS (Real-time Framework)'
	),
	makeSkillLine('Leadership',
		'Team leadership, intern supervision, student mentorship'
	),
]));

addHeader('EXPERIENCE');
const boldSection = (text: string) => {
	const bold = document.createElement('div');
	bold.className = 'header';
	bold.appendChild(document.createTextNode(text));
	return bold;
}
const makeExperience = (title: string, subtitle: string, description: RecursiveArray<ListValue>) => {
	content.appendChild(boldSection(title));
	content.appendChild(document.createTextNode(subtitle));
	content.appendChild(createListNode(description));
}
makeExperience(
	'Senior Developer',
	'Liquid Cinema — November 2015 to Present',
	[
		link('https://liquidcinemavr.com'),
		'Built the frontend web component of the Liquid Cinema platform, a browser-native, interactive cinematic 360° video WebGL player',
		'Developed backend storage for user viewing directions and a frontend heat map-style visualization to represent view concentration',
		'Responsible for client-side Apple iOS and tvOS components of the Liquid Cinema platform',
		'Developed Virtual and Augmented Reality support using the WebXR standard for the web-based Liquid Cinema platform',
		'FFmpeg video encoding and Vimeo video hosting integration',

		'OMAF 360° VR Video Streaming',
		[
			'Fraunhofer HHI collaboration to integrate OMAF 360° VR video streaming into the Liquid Cinema web platform',
			link('https://www.hhi.fraunhofer.de/en/departments/vca/technologies-and-solutions/mpeg-omaf.html'),
		],

		'"Magic of Flight" interactive VR educational experience, Lead WebXR Developer',
		[
			'Meta collaboration to create an interactive web experience for the Quest VR Headset',
			'2021 WebXR Poly Awards winner:',
			[
				'Education Experience of the Year',
				'Video Experience of the Year',
				'Experience of the Year',
			],
			link('https://liquidcinemavr.com/fly/'),
		],

		'Multi-user WebRTC live web video chat integration using PeerJS, using the Colyseus and Feathers backend systems',

		'Senior Metaverse collaborative environment frontend Lead',
		[
			'Conestoga College Collaboration',
			'3D Avatar conferencing solution',
			'Virtual Reality multi-user live interactive environment',
			'Messaging and live video and screen-share streaming',
		],
	]
);
makeExperience(
	'The Lindsay Project: Lead Programmer and Software Designer',
	'University of Calgary — 2009 to 2015',
	[
		'Funded by the department of Undergraduate Medical Education in the Cumming School of Medicine at the University of Calgary',
		'Worked with Zygote 3D human anatomy models, originally used in Google Body, now Zygote Body, as part of a full stack pipeline for multiple applications',
		'Developed “Zygote 3D Anatomy Atlas & Dissection Lab”',
		[
			'Released as an iPhone and iPad app on the iTunes App Store',
			'Now archived, references available:',
			[
				link('https://lindsayvirtualhuman.com/?p=273'),
				link('https://www.youtube.com/watch?v=3MZps2_Z1zo'),
				link('https://www.youtube.com/watch?v=38d7P3JB4SE'),
				link('https://www.youtube.com/watch?v=M0xubQ0_5Q0'),
			],
		],
		'Developed "Atlas", a 3D Human anatomy education oriented web application',
		[
			'CBC segment on The Lindsay Project, featuring the Atlas application:',
			[
				link('https://www.cbc.ca/news/canada/calgary/new-medical-tool-honours-u-of-c-student-s-memory-1.1240316'),
			]
		],
	]
);
makeExperience(
	'Vaccine Design and Implementation Project',
	'University of Calgary — 2008',
	[
		'Developed interactive real-time 3D OpenGL visualizations to represent the modelling part of a vaccine design project funded through the AHFMR Interdisciplinary Team in Vaccine Design and Implementation program',
	]
);
makeExperience(
	'Swarm Art Software Developer',
	'University of Calgary — 2005 to 2007',
	[
		'Artistic based apps and tools that use agent based swarm systems to generate visuals and facilitate interactive displays',
		'Featured in:',
		[
			'Images published in the Leonardo Journal, Volume 40, issue 3, by MIT Press, 2007',
			'Digital’06: “Bio/Med SciART” submission accepted for public display in the New York Hall of Science, 2006',
			'Victoria Conference Center street front window interactive public display, Victoria BC, August to December 2006',
			'Discovery Channel "A Daily Planet" segment on swarm intelligence, featuring the Swarm Art system, aired on October 23, 2006',
			'Nickle Galleries Museum interactive display, Calgary AB, 2005',
		]
	]
);

addHeader('EDUCATION');
const education = addParagraph();
education.appendChild(makeBoldLine('Bachelor of Science in Computer Science'));
education.appendChild(document.createTextNode('University of Calgary, AB – 2006'));

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
		'C. Jacob, S. von Mammen, T. Davison, A. Sarraf-Shirazi, V. Sarpe, A. Esmaeili, D. Phillips, I. Yazdanbod, ',
		'S. Novakowski',
		', S. Steil, C. Gingras, H. Jamniczky, B. Hallgrimsson, and B. Wright.',
		'Advances in Intelligent Modelling and Simulation, Studies in Computational Intelligence Volume 422, pp 327-349; Springer-Verlag Berlin Heidelberg, 2012',
	),
	createPublication(
		'Evolutionary Swarm Design: How Can Swarm-based Systems Help to Generate and Evaluate Designs?',
		'Sebastian von Mammen, ', 'Scott Novakowski', ', Gerald Hushlak, and Christian Jacob.',
		'Design Principles and Practices: An International Journal, Volume 3, Issue 3, pp. 371-386, 2009.',
	),
	createPublication(
		'Evolutionary design of dynamic SwarmScapes',
		'Namrata Khemka, ', 'Scott Novakowski', ', Gerald Hushlak, and Christian Jacob.',
		'Genetic and Evolutionary Computation Conference, GECCO 2008, Proceedings, Atlanta, GA, USA, July 12-16, 2008.',
	),
	createPublication(
		'Motion swarms: video interaction for art in complex environments',
		'Quoc Nguyen, ', 'Scott Novakowski', ', Jeffrey E. Boyd, Christian Jacob, and Gerald Hushlak.',
		'Proceedings of the 14th annual ACM international conference on Multimedia, Santa Barbara, CA, USA, October 23-27, 2006.',
	),
]);
content.appendChild(publications);
