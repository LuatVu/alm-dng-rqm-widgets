/* https://www.intranet.bosch.com/doku/CCPS-ALM/Test/com.bosch.rtc.GlossaryWidget.WORK/index.xml */

var origin;
var config;
var artifact;
var targetArtifact;
var table;
var alreadyCheckedWords = [];
var globalResults = [];

var RM = window.parent.RM || RM ;
origin = window.location.origin;

$(function () {
	RM.Client.getCurrentConfigurationContext(function (result) {
		if (result.code === RM.OperationResult.OPERATION_OK) {
			config = result.data;
		} else {
			console.log("Error in fetching configuration");
		}
	});
});

RM.Event.subscribe(RM.Event.ARTIFACT_SELECTED, async function (selected) {
	$("#glossary").empty();
	alreadyCheckedWords = [];
	globalResults = [];
	// console.log('------- ARTIFACT -------')
	// console.log(selected[0]);
	if (selected.length === 1) {
		artifact = selected[0];
	}
});


/**
 * 
 * @param {String[]} tokens 
 * @returns 
 */
const removeStopwords = function (tokens) {
	if (typeof tokens !== 'object' || typeof stopwords !== 'object') {
		throw new Error('expected Arrays try: removeStopwords(Array[, Array])')
	}
	return tokens.filter(function (value) {
		return stopwords.indexOf(value.trim().toLowerCase()) === -1
	})
}

/**
 * all commonly used stopwords in english
 */
const stopwords = ['about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are',
	'as', 'at', 'be', 'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came',
	'can', 'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had', 'he',
	'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into', 'is', 'it', 'like',
	'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must', 'my', 'never', 'now', 'of', 'on',
	'only', 'or', 'other', 'our', 'out', 'over', 'said', 'same', 'should', 'since', 'some', 'still',
	'such', 'take', 'than', 'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this',
	'those', 'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were', 'what',
	'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i'
];

/**
 * filters stopwords from a given array of strings
 * @param {String} input 
 * @returns filtered string array 
 */
const handleInput = (input) => {
	input = input.replace(/\n/g, " ");
	const token = input.split(" ");
	var filtered = token.filter(function (value) {
		return value != "";
	});
	filtered = removeStopwords(filtered);
	return filtered;
};

/**
 * 
 * @param {object} config 
 * @param {String} term 
 */
const getChangeSetsFromArtifact = (config, term) => {
	var settings = {
		"url": origin + "/rm/glossary/termslookup?termMatch=startsWith&oslc.pageSize=20&oslc.pageno=1&format=full&scope=allProjects",
		"method": "POST",
		"timeout": 0,
		"headers": {
			"DoorsRP-Request-Type": " private",
			"oslc.configuration": config,
			"Accept": " none",
			"Accept-Language": " de-DE",
			"Accept-Encoding": " gzip, deflate, br",
			"Content-Type": " application/x-www-form-urlencoded",
			"X-Requested-With": " XMLHttpRequest",
			"Connection": " keep-alive",
		},
		"data": "terms=" + term,
	};
	var results = [];

	$.ajax(settings).done(function (response) {
		console.log(response);
		table = makeNamedTable();
		var currentElement = response.firstChild.firstElementChild.firstElementChild
		while (currentElement.localName == 'li') {
			let content = {};
			currentArtifact = currentElement.firstElementChild;
			content['url'] = currentArtifact.attributes[0].value;
			for (let item of currentArtifact.children) {
				switch (item.localName) {
					case 'matchedGlossaryTerms':
						try {
							var el = item.firstElementChild;
							content['glossary_term'] = el.textContent;
						} catch (err) {};
						break;
					case 'primaryGlossaryTerm':
						try {
							content['glossary_term'] = item.textContent;
						} catch (err) {};
						break;
					case 'PrimaryText':
						var el = item.firstElementChild;
						content['primary_txt'] = el.textContent;
						break;
					default:
						break;
				};
			};
			results.push(content);
			currentElement = currentElement.nextElementSibling;
		};
		results.forEach(el => {
			addTableRows(term, [el['glossary_term'], el['primary_txt']], el['url'], table, ['nameCell', 'contentCell'])
		});
		if (results.length) {
			$("#glossary").append(table);
			table.before(makeHeadeing(term));
		} else {
			$("#glossary").append(makeHeadeing("No result for: " + term));
		}
		$("#glossary").scrollTop(1000000000);
		globalResults.push(results);
		$('.nameCell').off();
	});
}

/**
 * 
 * @param {String} term 
 * @param {String} value 
 */
const link = (term, value) => {

	rdm = Math.random().toString().slice(2);

	var data = '<rdf:RDF xmlns:rm="http://www.ibm.com/xmlns/rdm/rdf/" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\
					<rm:Link rdf:about="">\
					<rdf:subject rdf:resource="' + artifact.toUri() + '"/>\
					<rdf:object rdf:resource="' + targetArtifact + '"/>\
					<rdf:predicate rdf:resource="http://www.ibm.com/xmlns/rdm/types/ArtifactTermReferenceLink"/>\
					<rm:suspectSubjectCleared/>\
					<rm:suspectObjectCleared/>\
					<rdf:type rdf:resource="http://www.ibm.com/xmlns/rdm/rdf/Link"/>\
					<rdf:value rdf:datatype="http://www.w3.org/2001/XMLSchema#string"></rdf:value>\
					<rm:subjectElementId>_' + rdm + '</rm:subjectElementId>\
					<rm:subjectElementLabel>Term Reference</rm:subjectElementLabel>\
				</rm:Link>\
			</rdf:RDF>'

	var settings = {
		"url": origin + "/rm/links",
		"method": "POST",
		"timeout": 0,
		"headers": {
			"DoorsRP-Request-Type": " private",
			"oslc.configuration": config.globalConfigurationUri,
			"Accept": " none",
			"Accept-Language": " de-DE",
			"Accept-Encoding": " gzip, deflate, br",
			"net.jazz.jfs.owning-context": artifact.componentUri,
			"Content-Type": "application/rdf+xml",
			"X-Requested-With": " XMLHttpRequest",
			"Connection": " keep-alive",
		},
		"data": data,
	};
	$.ajax(settings).done(function (response) {
		$txtarea = $(window.top.document).find('.rdm-artifactgrid-contenteditablecellwidget > .primaryTextWrapper.cke_editable > div > p')
		if ($txtarea.html() === undefined) {
			$txtarea = $(window.top.document).find('.rdm-artifactgrid-contenteditablecellwidget > .primaryTextWrapper.cke_editable > p')
		}
		console.log($txtarea.html());
		var size = $txtarea.size();
		temp = $txtarea[size - 1].innerHTML;
		var re = new RegExp('\\b' + value + '\\b', "gi");
		var li = '<a id="_' + rdm + '"href="' + targetArtifact + '">' + value + '</a>'
		temp = temp.replace(re, li);
		$txtarea[size - 1].innerHTML = temp;
		// $txtarea.append('<a id="_' + rdm + '"href="' + targetArtifact + '">' + value + '</a>');
		rmIndexing();
	});
}

/**
 * HTTP request often used by IBM JAZZ
 */
const rmIndexing = () => {
	var settings = {
		"url": origin + "/rm/rmIndexing?dojo.preventCache=1632206096470",
		"method": "GET",
		"timeout": 0,
		"headers": {
			"DoorsRP-Request-Type": " private",
			"oslc.configuration": config,
			"Accept": " none",
			"Accept-Language": " de-DE",
			"Accept-Encoding": " gzip, deflate, br",
			"Content-Type": " application/x-www-form-urlencoded",
			"X-Requested-With": " XMLHttpRequest",
			"Connection": " keep-alive",
		}
	};
	$.ajax(settings).done(function (response) {});
}

/**
 * constructs a HTML h2 element from a string
 * @param {String} text 
 * @returns h2 html element
 */
const makeHeadeing = (text) => {
	var heading = $("<h2>").text(text);
	return heading;
}

/**
 * constructs a HTML table element
 * @returns table HTML element
 */
const makeNamedTable = () => {
	var table = $("<table>");
	return table;
};

/**
 * creates a new row in a given table HTML element with given classes and links the first column to a glossary element
 * @param {String} term 
 * @param {String[]} values 
 * @param {String} url 
 * @param {object} table 
 * @param {String[]} classes 
 */
const addTableRows = (term, values, url, table, classes) => {
	var row = $('<tr>');
	var nameDiv = $('<div>');
	var nameTd = $('<td>');

	row.append(nameTd.append(nameDiv.attr('class', classes[0]).text(values[0])));

	nameTd.click(function () {
		targetArtifact = url;
		link(term, values[0]);
	})

	row.append($('<td>').append($('<div>').attr('class', classes[1]).text(values[1])));

	table.append(row);
};

$(window.top.document).find("body").on('keyup', '.rdm-artifactgrid-contenteditablecellwidget > .primaryTextWrapper', function (event) {
	if (event.keyCode == 32) {
		// user has pressed space
		var token = handleInput(event.currentTarget.innerText);
		var currentWord = token[token.length - 1].toLowerCase().trim();
		if (alreadyCheckedWords.includes(currentWord) == false) {
			alreadyCheckedWords.push(currentWord);
			getChangeSetsFromArtifact(config.globalConfigurationUri, currentWord);
		}
	}
});