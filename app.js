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
subtitle.appendChild(document.createTextNode('Lead Software Engineer'));

const contactLines = `Phone: (647) 465-3759
Email: snovakow@gmail.com
LinkedIn: www.linkedin.com/in/scott-novakowski
Address: Unit 2411 - 118 Balliol St
Toronto, ON M4S 0A9, Canada`.split('\n');
for (const line of contactLines) {
	contact.appendChild(document.createTextNode(line));
	contact.appendChild(document.createElement('br'));
}

const content = document.createElement('div');
content.className = 'content';
page.appendChild(content);

const addHeader = (text) => {
	const header = document.createElement('div');
	header.className = 'header';
	header.appendChild(document.createTextNode(text));
	content.appendChild(header);
}
const addParagraph = (text, node = false) => {
	const paragraph = document.createElement('div');
	paragraph.className = 'paragraph';
	paragraph.appendChild(node ? text : document.createTextNode(text));
	content.appendChild(paragraph);
}

addHeader('SUMMARY / PROFILE');
addParagraph('I am looking to advance my career as an OpenGL/WebGL developer, a lead software developer and designer.');
addParagraph('Experienced lead developer. DEEP Inc.: Apple, iOS, tvOS; web: WebGL. 3D graphics, OpenGL, GLSL.');

addHeader('SKILLS');
addParagraph('I have 6 years experience as a lead programmer and software designer. I have acquired extensive experience as a 3D graphics programmer, having worked with OpenGL for 7 years, including OpenGL ES, OpenGL ES 2.0, and WebGL. I have developed Mac applications for 9 years, iOS programs for 6 years, and web applications for 4 years. I have extensive experience programming with C and Objective-C. For the web, I have experience with PHP, MySQL, HTML5, CSS3, AJAX, WebGL, and have developed an in depth understanding of Javascript. I have also integrated language localizations into iOS and web applications. I am very familiar with the Xcode IDE and have experience with Subversion and GIT repositories. I have operated using the SCRUM agile software development techniques.');
addParagraph('I have acquired extensive experience as a 3D graphics programmer, having worked with OpenGL for 7 years, including OpenGL ES, OpenGL ES 2.0, and WebGL. I have built in- house graphics frameworks in C for OpenGL, and in Javascript for WebGL. I have extensive experience programming with C, Objective-C, Javascript, and GLSL shaders. I have also integrated language localizations into iOS and web applications. I have worked with the Subversion and GIT source control systems, and have developed using the SCRUM agile software development techniques.');

addHeader('EXPERIENCE');
addParagraph('Senior Web Developer, DEEP Inc. — November 2015—Present');
addParagraph('Scott Novakowski is a software developer. Scott is developing an interactive cinematic 360 video player as the web component of the Liquid Cinema platform for DEEP. Before that he was Lead Programmer and Software Designer at the University of Calgary for 6 years. During this time he developed “Zygote 3D Anatomy Atlas & Dissection Lab”, available for mobile devices on the iTunes App Store; and “ZygoteBodyU™, currently being commercialized and promoted by Zygote Media Group as the world’s leading digital wet lab for medical education.');
addParagraph('Scott has experience with OpenGL/WebGL, and developing for the OSX and iOS platforms, as well as both client and server side web development.');
addParagraph('Developing an interactive cinematic 360/VR video player as the web component of the Liquid Cinema platform for DEEP, as well as leading the development of the iOS and tvOS platforms.');

// const addList = (list, append) => {
// 	const ul = document.createElement('ul');
// 	if(append) content.appendChild(ul);

// 		let prev = null;
// 		for(const item of list){
// 			if(typeof item === 'string') {
// 				const li = document.createElement('li');
// 				ul.appendChild(li);
		
// 				li.appendChild(document.createTextNode(item));	
// 				prev = item;
// 			} else {
// 				prev?.appendChild(item);
// 			}
// 		}	
// 	return ul;
// }

// const l2 = addList(['1', '1', '1']);
// const l1 = addList([
// 	'The Lindsay Project, — May 2009—October 2015', l2,
// 	'Vaccine Design and Implementation Project, University of Calgary; Calgary, AB — May 2008—May 2009',
// 	'Swarm Art Software Developer, University of Calgary; Calgary, AB — 2005—April 2008',
// ], true);

// l1.appendChild(l2);

const link = (url, title) => {
	title ??= url;
	const a = document.createElement('a');
	a.href = url;
	a.textContent = title;
	a.target = "_blank";
	return a;
}

addHeader('Magic of Flight');
addParagraph(link('https://liquidcinemavr.com/fly/'), true);

addHeader('Lindsay Project');
addParagraph(link('https://www.cbc.ca/news/canada/calgary/new-medical-tool-honours-u-of-c-student-s-memory-1.1240316'), true);

addHeader('Anatomy');
addParagraph(link('https://www.youtube.com/@Zygote3D/videos'), true);

addHeader('Liquid Cinema');
addParagraph(link('https://liquidcinemavr.com'), true);

addHeader('OMAF');
addParagraph('https://www.hhi.fraunhofer.de/en/departments/vca/technologies-and-solutions/mpeg-omaf.html');
addParagraph('MPEG OMAF Format Integration at Liquid Cinema');
addParagraph('Oct 2019 - Dec 2019Oct 2019 - Dec 2019');
addParagraph('• OMAF is a new streaming format that reduces the bandwidth needed to stream 360 media. Developed by Fraunhofer HHI');
addParagraph('• Worked closely with a team to integrate the OMAF dash streaming format into the Liquid Cinema android app');
addParagraph('• Designed a custom dash download manager to accommodate the new format');
addParagraph('• Integrated a C++ library into the Kotlin and Java code of the app');

const resume = `
University of Calgary; Calgary, AB — 2005—2015
	❖The Lindsay Project, — May 2009—October 2015
	•	Lead Programmer and Software Designer. The Lindsay project was funded by the department of Undergraduate Medical Education in the Cumming School of Medicine at the University of Calgary. The mandate was to develop an innovative teaching and learning environment based on 3D anatomy models. I have worked closely with Zygote Media Group, a company that provides the 3D computer models, to integrate their models of the complete human anatomy into Mac, iOS, and web applications. 
	•	I designed, developed, and maintained Atlas, a 3D virtual human anatomy atlas. Atlas began as an OpenGL based application for iOS devices in 2010, and was released to the University of Calgary community through enterprise distribution. Subsequently it was released commercially as “Zygote 3D Anatomy Atlas & Dissection Lab” on the iTunes App Store. 
	•	Since 2012, I have developed an enriched web version of Atlas that publishes content for consumption across both the iOS and web applications. The web version employs 3D techniques using WebGL to implement advanced features such as slicing, dragging pins over, and drawing on, the anatomical parts. It has been an integral part of the Undergraduate Medical Education curriculum since 2014. Atlas is currently being commercialized as ZygoteBodyU, an integrative online resource for anatomy education targeting universities, promoted through Zygote Media Group. A subsequent partnership with Nankodo, a Japanese publisher, added full language flexibility to both the web and iOS versions of the application. 
	•	I developed and maintained Modeller, a Mac tool to facilitate the pipeline for 3D models from Maya to real-time rendering in applications on the Mac, iOS, and web platforms. From 2009 to 2012 I developed Presenter, a Mac desktop application in the PowerPoint style, integrating fully interactive 3D anatomical models. Presenter was used to teach Anatomical courses in a classroom setting.
	❖Vaccine Design and Implementation Project, University of Calgary; Calgary, AB — May 2008—May 2009
	•	I developed interactive realtime 3D visualizations to represent the modelling part of a vaccine design project funded through the AHFMR Interdisciplinary Team in Vaccine Design and Implementation program at the University of Calgary. 
	❖Swarm Art Software Developer, University of Calgary; Calgary, AB — 2005—April 2008
	•	Swarm Painter Programmer. Swarm Painter is an artistic tool, developed in conjunction with University of Calgary art professor Gerald Hushlak, that uses agent based swarm systems to aid in the generation of images and large prints. A submission to Digital’06: “Bio/Med SciART”, a collaboration between biological and medical sciences and art, was accepted for public display in the New York Hall of Science in 2006. Images were also published in the Leonardo Journal, Volume 40, issue 3, by MIT Press.
	•	Swarm Art Researcher and Software Developer. Swarm Art represents artistic interactive systems where the audience participate in generating sounds and visuals. I developed various systems for interactive art and science installations. They involve motion video capture and gesture recognition that translate into visuals generated by agent based swarm systems, and sound generation.
	•	Victoria Conference Center Display: 3 separate Swarm Art systems were displayed for public interaction in street front windows at the Victoria Conference Center, Victoria, BC, from August to December, 2006.
	•	Discovery Channel Filming: A Daily Planet segment on swarm intelligence aired on October 23, 2006, featuring a Swarm Art system I developed.
	•	Nickle Arts Museum Display: A Swarm Art system ran for three months on public display at the University of Calgary’s Nickle Arts Museum in 2005.
EDUCATION
University of Calgary, Calgary, AB — Bachelor of Science in Computer Science, 2006.
PUBLICATIONS
LINDSAY Virtual Human: Multi-Scale, Agent-based, and Interactive
C. Jacob, S. von Mammen, T. Davison, A. Sarraf-Shirazi, V. Sarpe, A. Esmaeili, D. Phillips, I. Yazdanbod, S. Novakowski, S. Steil, C. Gingras, H. Jamniczky, B. Hallgrimsson, and B. Wright.
Advances in Intelligent Modelling and Simulation, Studies in Computational Intelligence Volume 422, pp 327-349; Springer-Verlag Berlin Heidelberg, 2012
Evolutionary Swarm Design: How Can Swarm-based Systems Help to Generate and Evaluate Designs?
Sebastian von Mammen, Scott Novakowski, Gerald Hushlak, and Christian Jacob.
Design Principles and Practices: An International Journal, Volume 3, Issue 3, pp. 371-386, 2009.
Evolutionary design of dynamic SwarmScapes
Namrata Khemka, Scott Novakowski, Gerald Hushlak, and Christian Jacob.
Genetic and Evolutionary Computation Conference, GECCO 2008, Proceedings, Atlanta, GA, USA, July 12-16, 2008.
Motion swarms: video interaction for art in complex environments
Quoc Nguyen, Scott Novakowski, Jeffrey E. Boyd, Christian Jacob, and Gerald Hushlak.
Proceedings of the 14th annual ACM international conference on Multimedia, Santa Barbara, CA, USA, October 23-27, 2006.

References available upon request
`;

const lines = resume.split('\n');
for (const line of lines) {
	const div = document.createElement('div');
	div.appendChild(document.createTextNode(line));
	content.appendChild(div);
	content.appendChild(document.createElement('br'));
}
