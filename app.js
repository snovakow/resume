const page = document.createElement('div');
page.className = 'page';
document.body.appendChild(page);

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

const contactLines = `+1 (647) 465-3759
snovakow@gmail.com
Toronto, ON, Canada`.split('\n');
for (const line of contactLines) {
	// let hidden = "";
	// for (let i = 0; i < line.length; i++) hidden += "x";
	contact.appendChild(document.createTextNode(line));
	contact.appendChild(document.createElement('br'));
}

const content = document.createElement('div');
content.className = 'content';
page.appendChild(content);

const addSubHeader = (text) => {
	const header = document.createElement('div');
	header.className = 'subheader';
	header.appendChild(document.createTextNode(text));
	content.appendChild(header);
}
const addHeader = (text) => {
	const header = document.createElement('div');
	header.className = 'header';
	header.appendChild(document.createTextNode(text));
	content.appendChild(header);
}
const addParagraph = (text) => {
	const paragraph = document.createElement('div');
	paragraph.className = 'paragraph';
	paragraph.appendChild(document.createTextNode(text));
	content.appendChild(paragraph);
}
const link = (url, title) => {
	title ??= url;
	const a = document.createElement('a');
	a.href = url;
	a.textContent = title;
	a.target = "_blank";
	return a;
}
const createItem = (item) => {
	if (Array.isArray(item)) {
		const ul = document.createElement('ul');
		ul.className = 'bulletMain';
		for (const element of item) ul.appendChild(createItem(element));
		return ul;
	}

	const li = document.createElement('li');
	li.className = 'bulletSub';

	if (typeof item === 'string') li.appendChild(document.createTextNode(item));
	else li.appendChild(item);

	return li;
}

addHeader('SUMMARY');
addParagraph('I am looking to advance my career as a computer programmer, expanding my scope of responsability, and having a larger impact.');

addHeader('SKILLS');
addParagraph('I have developed Virtual and Augmented Reality WebXR applications. I have experience developing for the Mac, iPhone, and AppleTV platforms. I have developed client web applications for 3D Human Anatomy, 360 3D video, and multi-client live video streaming');
addParagraph('Experienced lead developer. DEEP Inc.');
addParagraph('I am experienced developing 3D Graphics, encoding and rendering video. 3D graphics OpenGL, GLSL, WebGL, GLES, and GLES2.');
addParagraph('360 and stereoscopic video encoding and rendering video.');

addParagraph('2 technical skills');
addParagraph('2 soft skills');
addParagraph('I have worked with interns and summer students throughout my career.');
addParagraph('OpenGL, WebGL, OpenGL ES, OpenGL ES 2.0, and WebGL. I have extensive experience programming with C and Objective-C.');
addParagraph('I have worked with servers and have back-end experience using PHP and MySQL.');

addHeader('EXPERIENCE');
const experience = createItem([
	'Senior Developer, Liquid Cinema — November 2015—Present',
	[
		link('https://liquidcinemavr.com'),
		'Developed an interactive cinematic 360/VR video player as the web component of the Liquid Cinema platform, and was Senior iPhone and AppleTV developer.',
		'Developed and integrated a multi-client live video streaming VR compatible 3D conferencing solution into the Liquid Cinema web player.',
		'"Magic of Flight" interactive VR educationsal experience, Lead WebXR Developer',
		[
			'2021 WebXR Poly Awards winner:',
			[
				'Education Experience of the Year',
				'Video Experience of the Year',
				'Experience of the Year',
			],
			link('https://liquidcinemavr.com/fly/'),
		],
		'OMAF 360 VR Video Streaming',
		[
			'Worked with Fraunhofer HHI to integrate OMAF video streaming into the Liquid Cinema web platform.',
			link('https://www.hhi.fraunhofer.de/en/departments/vca/technologies-and-solutions/mpeg-omaf.html'),
		],
	],
	'University of Calgary; Calgary, AB — 2005—2015',
	[
		'The Lindsay Project, — May 2009—October 2015',
		[
			link('https://www.cbc.ca/news/canada/calgary/new-medical-tool-honours-u-of-c-student-s-memory-1.1240316'),
			'Lead Programmer and Software Designer at the University of Calgary for 6 years. During this time he developed “Zygote 3D Anatomy Atlas & Dissection Lab”, available for mobile devices on the iTunes App Store; and “ZygoteBodyU™, currently being commercialized and promoted by Zygote Media Group as the world’s leading digital wet lab for medical education.',
			'Lead Programmer and Software Designer. The Lindsay project was funded by the department of Undergraduate Medical Education in the Cumming School of Medicine at the University of Calgary. The mandate was to develop an innovative teaching and learning environment based on 3D anatomy models. I have worked closely with Zygote Media Group, a company that provides the 3D computer models, to integrate their models of the complete human anatomy into Mac, iOS, and web applications.',
			'Released commercially as “Zygote 3D Anatomy Atlas & Dissection Lab” on the iTunes App Store.',
			[
				link('https://www.youtube.com/@Zygote3D/videos'),
			],
			'Atlas, 3D Human anatomy application iOS and web applications. OpenGL ES, ES2, Atlas is currently being commercialized as ZygoteBodyU, an integrative online resource for anatomy education targeting universities, promoted through Zygote Media Group.',
			'Developed front and back-end applications. real-time rendering in applications on the Mac, iOS, and web platforms. 3D Model pipeline',
			'Teaching tool',
		],
		'Vaccine Design and Implementation Project, University of Calgary; Calgary, AB — May 2008—May 2009',
		[
			'OpenGL',
			'Developed interactive realtime 3D visualizations to represent the modelling part of a vaccine design project funded through the AHFMR Interdisciplinary Team in Vaccine Design and Implementation program at the University of Calgary.',
		],

		'Swarm Art Software Developer, University of Calgary; Calgary, AB — 2005—April 2008',
		[
			'Artistic based apps and tools that use agent based swarm systems to generate visuals and facilitate interactive displays.',
			'Featured in:',
			[
				'Images published in the Leonardo Journal, Volume 40, issue 3, by MIT Press, 2007.',
				'Digital’06: “Bio/Med SciART” submission accepted for public display in the New York Hall of Science in 2006.',
				'Victoria Conference Center street front window interctive public display, Victoria BC, August to December 2006',
				'Discovery Channel "A Daily Planet" segment on swarm intelligence aired on October 23, 2006.',
				'Nickle Galleries Museum interactive display, Calgary AB, 2005.',
			]
		],
	],
]);
content.appendChild(experience);

addHeader('EDUCATION');
addParagraph('University of Calgary, Calgary, AB — Bachelor of Science in Computer Science, 2006.');

const createPublication = (main, sub1a, subName, sub1b, sub2) => {
	const mainElement = document.createElement('div');
	mainElement.className = 'publicationMain';
	mainElement.appendChild(document.createTextNode(main));

	const subElement1 = document.createElement('div');
	subElement1.className = 'publicationSub1';

	subElement1.appendChild(document.createTextNode(sub1a));

	const subElementName = document.createElement('span');
	subElementName.className = 'publicationName';
	subElementName.appendChild(document.createTextNode(subName));
	subElement1.appendChild(subElementName);

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
const publications = createItem([
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

addParagraph('References available upon request');
