// A load of Excel functions recreated in JavaScript:

const CONCAT = (...args) => {
	return args.reduce((previous, current) => `${previous}${current}`);
}
const SUBSTITUTE = (text, oldText, newText) => {
	return text.replaceAll(oldText, newText);
}
const LOWER = (text) => { return text.toLowerCase(); }
const itojj = (text) => {
	return `${text}`.replace(/(?<=[aeiouyāēīōūȳ])i(?=[aeiouy])/gi, 'jj');
}
const IFS = (...args) => {
	const conditions = args.filter((v, i) => i % 2 === 0);
	const returns = args.filter((v, i) => i % 2 !== 0);
	for (let i = 0; i < conditions.length; i++) {
		if (conditions[i] === true) {
			return returns[i];
		}
		if (conditions[i] === false) {
			continue;
		}
		console.error(`Value of ${conditions[i]} was passed into IFS as a condition`);
	}
	console.error('Ran out of conditions in IFS');
}
const OR = (...args) => {
	return args.reduce((previous, current) => previous || current);
}
const LEFT = (text, characterCount) => {
	return `${text}`.substring(0, characterCount);
}
const ISNUMBER = (value) => {
	return !Number.isNaN(parseInt(value));
}
const SEARCH = (substring, superstring) => {
	return `${superstring}`.search(substring);
}
const RIGHT = (text, characterCount) => {
	return `${text}`.substring(`${text}`.length - characterCount);
}
const REPLACE = (oldText, startNum, numChars, newText) => {
	return `${oldText}`.substring(0, startNum - 1) + newText + `${oldText}`.substring(startNum + numChars);
}
const AND = (...args) => {
	return args.reduce((previous, current) => previous && current);
}
const NOT = (condition) => {
	return !condition;
}
const EXACT = (comparand, comparer) => {
	return comparand === comparer;
}
const UPPER = (text) => { return text.toUpperCase(); }
const COUNTIF = (array, searchValue) => {
	return [...array].filter(value => value === searchValue).length;
}
const IF = (condition, trueReturn, falseReturn) => {
	return condition ? trueReturn : falseReturn;
}
const LEN = (text) => {
	return `${text}`.length;
}


// Functions replacing the fields in `wordsform` sheet.

const f = {
	Ord:
		(word, lemmata) => {
			// Should really be a serial number, not hardcoded
			return 123;
		},
	Word:
		(word, lemmata) => {
			return word;
		},
	Lemmata:
		(word, lemmata) => {
			return lemmata;
		},
	Length:
		(word, lemmata) => {
			return word.length;
		},
	AllConsonants:
		(word, lemmata) => {
			const replaced = f.NoMacraLowerCase(word).replace(/[aeiouy]/gi, '');
			return replaced || '-';
		},
	Uncompounded:
		(word, lemmata) => {
			if (['-ne', '-que', '-ve'].includes(word)) {
				return '∅';
			}
			if (f.Lemma1(word, lemmata).endsWith('que')) {
				return word;
			}
			if (!word.endsWith('ne') && !word.endsWith('que') && !word.endsWith('ve')) {
				return word;
			}
			const wordMinusPossibleEnclitic = word.replace(/(ne|que|ve)$/, '');
			// This should really be all the words already in the database, but this web-project does not have a database connection.
			const wordsAlreadyInDatabase = [];
			if (wordsAlreadyInDatabase.includes(wordMinusPossibleEnclitic)) {
				return wordMinusPossibleEnclitic;
			}
			if (["á","é","í","ó","ú","ý","ḗ"].some(acute => wordMinusPossibleEnclitic.contains(acute))) {
				const removeAcutes = (word) => {
					return word.replaceAll("á","a").replaceAll("é","e").replaceAll("í","i").replaceAll("ó","o").replaceAll("ú","u").replaceAll("ý","y").replaceAll("ḗ","ē");
				}
				const wordMinusPossibleEncliticWithoutAcutesOrUDiaeresis = removeAcutes(wordMinusPossibleEnclitic).replaceAll("ü","u");
				if (wordsAlreadyInDatabase.includes(wordMinusPossibleEncliticWithoutAcutesOrUDiaeresis)) {
					return wordMinusPossibleEncliticWithoutAcutesOrUDiaeresis;
				}
			}
			return word;
		},
	Phonetic:
		(word, lemmata) => {

			const formula = CONCAT(
				SUBSTITUTE(
						SUBSTITUTE(
								SUBSTITUTE(
										SUBSTITUTE(
												SUBSTITUTE(
														SUBSTITUTE(
																SUBSTITUTE(
																		SUBSTITUTE(
																				SUBSTITUTE(
																						SUBSTITUTE(
																								SUBSTITUTE(
																										SUBSTITUTE(
																												SUBSTITUTE(
																														SUBSTITUTE(
																																SUBSTITUTE(
																																		SUBSTITUTE(
																																				SUBSTITUTE(
																																						SUBSTITUTE(
																																								SUBSTITUTE(
																																										SUBSTITUTE(
																																												SUBSTITUTE(
																																														SUBSTITUTE(
																																																SUBSTITUTE(
																																																		SUBSTITUTE(
																																																				SUBSTITUTE(
																																																						SUBSTITUTE(
																																																								SUBSTITUTE(
																																																										SUBSTITUTE(
																																																												SUBSTITUTE(
																																																														SUBSTITUTE(
																																																																SUBSTITUTE(
																																																																		SUBSTITUTE(
																																																																				SUBSTITUTE(
																																																																						SUBSTITUTE(
																																																																								SUBSTITUTE(
																																																																										SUBSTITUTE(
																																																																												SUBSTITUTE(
																																																																														SUBSTITUTE(
																																																																																SUBSTITUTE(
																																																																																		SUBSTITUTE(
																																																																																				SUBSTITUTE(
																																																																																						SUBSTITUTE(
																																																																																								SUBSTITUTE(
																																																																																										SUBSTITUTE(
																																																																																												SUBSTITUTE(
																																																																																														SUBSTITUTE(
																																																																																																SUBSTITUTE(
																																																																																																		SUBSTITUTE(
																																																																																																				SUBSTITUTE(
																																																																																																						SUBSTITUTE(
																																																																																																								SUBSTITUTE(
																																																																																																										SUBSTITUTE(
																																																																																																												CONCAT(
																																																																																																														"_",
																																																																																																														LOWER(
																																																																																																																itojj(
																																																																																																																		IFS(
																																																																																																																				f.Uncompounded(word, lemmata) === "ai",
																																																																																																																				"à",
																																																																																																																				f.Uncompounded(word, lemmata) === "ei",
																																																																																																																				"è",
																																																																																																																				f.Uncompounded(word, lemmata) === "eia",
																																																																																																																				"èa",
																																																																																																																				f.Uncompounded(word, lemmata) === "hei",
																																																																																																																				"hè",
																																																																																																																				f.Uncompounded(word, lemmata) === "heia",
																																																																																																																				"hèa",
																																																																																																																				f.Uncompounded(word, lemmata) === "hoc",
																																																																																																																				"hocc",
																																																																																																																				f.Uncompounded(word, lemmata) === "oi",
																																																																																																																				"ò",
																																																																																																																				f.Uncompounded(word, lemmata) === "oiei",
																																																																																																																				"òè",
																																																																																																																				f.Uncompounded(word, lemmata) === "dehinc",
																																																																																																																				"dènc",
																																																																																																																				OR(
																																																																																																																						f.Uncompounded(word, lemmata) === "dein",
																																																																																																																						f.Uncompounded(word, lemmata) === "deinde",
																																																																																																																						f.Uncompounded(word, lemmata) === "proin",
																																																																																																																						f.Uncompounded(word, lemmata) === "proindē"
																																																																																																																				),
																																																																																																																				SUBSTITUTE(
																																																																																																																						SUBSTITUTE(
																																																																																																																								f.Uncompounded(word, lemmata),
																																																																																																																								"dein",
																																																																																																																								"dèn"
																																																																																																																						),
																																																																																																																						"proin",
																																																																																																																						"pròn"
																																																																																																																				),
																																																																																																																				f.Lemma1(word, lemmata) === "praeeō",
																																																																																																																				SUBSTITUTE(
																																																																																																																						f.Word(word, lemmata),
																																																																																																																						"praei",
																																																																																																																						"prài"
																																																																																																																				),
																																																																																																																				OR(
																																																																																																																						LEFT(
																																																																																																																								f.Lemma1(word, lemmata),
																																																																																																																								3
																																																																																																																						) === "cui",
																																																																																																																						LEFT(
																																																																																																																								f.Lemma1(word, lemmata),
																																																																																																																								4
																																																																																																																						) === "quis",
																																																																																																																						LEFT(
																																																																																																																								f.Lemma1(word, lemmata),
																																																																																																																								3
																																																																																																																						) === "quī",
																																																																																																																						f.Lemma1(word, lemmata) === "aliquis",
																																																																																																																						f.Lemma1(word, lemmata) === "ecquis",
																																																																																																																						f.Lemma1(word, lemmata) === "nesciōquis",
																																																																																																																						f.Lemma1(word, lemmata) === "ūnusquisque"
																																																																																																																				),
																																																																																																																				SUBSTITUTE(
																																																																																																																						SUBSTITUTE(
																																																																																																																								itojj(
																																																																																																																										f.Uncompounded(word, lemmata)
																																																																																																																								),
																																																																																																																								"cuiā",
																																																																																																																								"cùjā"
																																																																																																																						),
																																																																																																																						"cui",
																																																																																																																						"cù"
																																																																																																																				),
																																																																																																																				OR(
																																																																																																																						ISNUMBER(
																																																																																																																								SEARCH(
																																																																																																																										"ngua",
																																																																																																																										f.NoMacra(word, lemmata)
																																																																																																																								)
																																																																																																																						),
																																																																																																																						ISNUMBER(
																																																																																																																								SEARCH(
																																																																																																																										"ngue",
																																																																																																																										f.NoMacra(word, lemmata)
																																																																																																																								)
																																																																																																																						),
																																																																																																																						ISNUMBER(
																																																																																																																								SEARCH(
																																																																																																																										"ngui",
																																																																																																																										f.NoMacra(word, lemmata)
																																																																																																																								)
																																																																																																																						),
																																																																																																																						ISNUMBER(
																																																																																																																								SEARCH(
																																																																																																																										"nguo",
																																																																																																																										f.NoMacra(word, lemmata)
																																																																																																																								)
																																																																																																																						),
																																																																																																																						ISNUMBER(
																																																																																																																								SEARCH(
																																																																																																																										"nguu",
																																																																																																																										f.NoMacra(word, lemmata)
																																																																																																																								)
																																																																																																																						)
																																																																																																																				),
																																																																																																																				SUBSTITUTE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						"ngu",
																																																																																																																						"ngv",
																																																																																																																						1
																																																																																																																				),
																																																																																																																				OR(
																																																																																																																						ISNUMBER(
																																																																																																																								SEARCH(
																																																																																																																										"suād",
																																																																																																																										f.Lemma1(word, lemmata)
																																																																																																																								)
																																																																																																																						),
																																																																																																																						ISNUMBER(
																																																																																																																								SEARCH(
																																																																																																																										"suās",
																																																																																																																										f.Lemma1(word, lemmata)
																																																																																																																								)
																																																																																																																						),
																																																																																																																						ISNUMBER(
																																																																																																																								SEARCH(
																																																																																																																										"suāv",
																																																																																																																										f.Lemma1(word, lemmata)
																																																																																																																								)
																																																																																																																						)
																																																																																																																				),
																																																																																																																				SUBSTITUTE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						"suā",
																																																																																																																						"svā",
																																																																																																																						1
																																																																																																																				),
																																																																																																																				LEFT(
																																																																																																																						f.Word(word, lemmata),
																																																																																																																						6
																																																																																																																				) === "Eduard",
																																																																																																																				SUBSTITUTE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						"Eduard",
																																																																																																																						"Edvard"
																																																																																																																				),
																																																																																																																				ISNUMBER(
																																																																																																																						SEARCH(
																																																																																																																								"suē",
																																																																																																																								LOWER(
																																																																																																																										f.Lemma1(word, lemmata)
																																																																																																																								)
																																																																																																																						)
																																																																																																																				),
																																																																																																																				SUBSTITUTE(
																																																																																																																						SUBSTITUTE(
																																																																																																																								SUBSTITUTE(
																																																																																																																										SUBSTITUTE(
																																																																																																																												SUBSTITUTE(
																																																																																																																														SUBSTITUTE(
																																																																																																																																f.Uncompounded(word, lemmata),
																																																																																																																																"suē",
																																																																																																																																"svē",
																																																																																																																																1
																																																																																																																														),
																																																																																																																														"Suē",
																																																																																																																														"Svē",
																																																																																																																														1
																																																																																																																												),
																																																																																																																												"sue",
																																																																																																																												"sve",
																																																																																																																												1
																																																																																																																										),
																																																																																																																										"sui",
																																																																																																																										"svi",
																																																																																																																										1
																																																																																																																								),
																																																																																																																								"suī",
																																																																																																																								"svī",
																																																																																																																								1
																																																																																																																						),
																																																																																																																						"suu",
																																																																																																																						"svu",
																																																																																																																						1
																																																																																																																				),
																																																																																																																				f.Lemma1(word, lemmata) === "urgueō",
																																																																																																																				SUBSTITUTE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						"urgu",
																																																																																																																						"urgv"
																																																																																																																				),
																																																																																																																				OR(
																																																																																																																						RIGHT(
																																																																																																																								f.Lemma1(word, lemmata),
																																																																																																																								5
																																																																																																																						) === "iaceō",
																																																																																																																						RIGHT(
																																																																																																																								f.Lemma1(word, lemmata),
																																																																																																																								5
																																																																																																																						) === "iectō",
																																																																																																																						RIGHT(
																																																																																																																								f.Lemma1(word, lemmata),
																																																																																																																								5
																																																																																																																						) === "iaciō",
																																																																																																																						RIGHT(
																																																																																																																								f.Lemma1(word, lemmata),
																																																																																																																								6
																																																																																																																						) === "iectus",
																																																																																																																						RIGHT(
																																																																																																																								f.Lemma1(word, lemmata),
																																																																																																																								5
																																																																																																																						) === "iectē",
																																																																																																																						f.Lemma1(word, lemmata) === "abiciō",
																																																																																																																						f.Lemma1(word, lemmata) === "adiciō",
																																																																																																																						f.Lemma1(word, lemmata) === "circumiciō",
																																																																																																																						f.Lemma1(word, lemmata) === "coniciō",
																																																																																																																						f.Lemma1(word, lemmata) === "dēiciō",
																																																																																																																						f.Lemma1(word, lemmata) === "disiciō",
																																																																																																																						f.Lemma1(word, lemmata) === "ēiciō",
																																																																																																																						f.Lemma1(word, lemmata) === "iniciō",
																																																																																																																						f.Lemma1(word, lemmata) === "intericiō",
																																																																																																																						f.Lemma1(word, lemmata) === "obiciō",
																																																																																																																						f.Lemma1(word, lemmata) === "periciō",
																																																																																																																						f.Lemma1(word, lemmata) === "praeiciō",
																																																																																																																						f.Lemma1(word, lemmata) === "reiciō",
																																																																																																																						f.Lemma1(word, lemmata) === "subiciō",
																																																																																																																						f.Lemma1(word, lemmata) === "trāiciō",
																																																																																																																						f.Lemma1(word, lemmata) === "obex",
																																																																																																																						f.Lemma1(word, lemmata) === "subicēs"
																																																																																																																				),
																																																																																																																				SUBSTITUTE(
																																																																																																																						SUBSTITUTE(
																																																																																																																								SUBSTITUTE(
																																																																																																																										SUBSTITUTE(
																																																																																																																												SUBSTITUTE(
																																																																																																																														SUBSTITUTE(
																																																																																																																																f.Uncompounded(word, lemmata),
																																																																																																																																"iēc",
																																																																																																																																"jēc",
																																																																																																																																1
																																																																																																																														),
																																																																																																																														"iec",
																																																																																																																														"jec",
																																																																																																																														1
																																																																																																																												),
																																																																																																																												"iac",
																																																																																																																												"jac",
																																																																																																																												1
																																																																																																																										),
																																																																																																																										"bex",
																																																																																																																										"bjex"
																																																																																																																								),
																																																																																																																								"ic",
																																																																																																																								"jic"
																																																																																																																						),
																																																																																																																						"rej",
																																																																																																																						"rèj"
																																																																																																																				),
																																																																																																																				LEFT(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						5
																																																																																																																				) === "coniū",
																																																																																																																				REPLACE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						1,
																																																																																																																						5,
																																																																																																																						"conjū"
																																																																																																																				),
																																																																																																																				LEFT(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						5
																																																																																																																				) === "coniu",
																																																																																																																				REPLACE(
																																																																																																																						LOWER(
																																																																																																																								f.Uncompounded(word, lemmata)
																																																																																																																						),
																																																																																																																						1,
																																																																																																																						5,
																																																																																																																						"conju"
																																																																																																																				),
																																																																																																																				LEFT(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						5
																																																																																																																				) === "disiu",
																																																																																																																				REPLACE(
																																																																																																																						LOWER(
																																																																																																																								f.Uncompounded(word, lemmata)
																																																																																																																						),
																																																																																																																						1,
																																																																																																																						5,
																																																																																																																						"disju"
																																																																																																																				),
																																																																																																																				LEFT(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						5
																																																																																																																				) === "disiū",
																																																																																																																				REPLACE(
																																																																																																																						LOWER(
																																																																																																																								f.Uncompounded(word, lemmata)
																																																																																																																						),
																																																																																																																						1,
																																																																																																																						5,
																																																																																																																						"disjū"
																																																																																																																				),
																																																																																																																				OR(
																																																																																																																						f.Lemma1(word, lemmata) === "iniugis",
																																																																																																																						f.Lemma1(word, lemmata) === "biiugis",
																																																																																																																						f.Lemma1(word, lemmata) === "biiugus",
																																																																																																																						f.Lemma1(word, lemmata) === "subiugō"
																																																																																																																				),
																																																																																																																				SUBSTITUTE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						"iug",
																																																																																																																						"jug"
																																																																																																																				),
																																																																																																																				OR(
																																																																																																																						LEFT(
																																																																																																																								f.Uncompounded(word, lemmata),
																																																																																																																								4
																																																																																																																						) === "adiu",
																																																																																																																						LEFT(
																																																																																																																								f.Uncompounded(word, lemmata),
																																																																																																																								4
																																																																																																																						) === "adiū"
																																																																																																																				),
																																																																																																																				REPLACE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						1,
																																																																																																																						3,
																																																																																																																						"adj"
																																																																																																																				),
																																																																																																																				LEFT(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						5
																																																																																																																				) === "iniūr",
																																																																																																																				REPLACE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						1,
																																																																																																																						5,
																																																																																																																						"injūr"
																																																																																																																				),
																																																																																																																				f.Lemma1(word, lemmata) === "iūsiūrandum",
																																																																																																																				SUBSTITUTE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						"iūr",
																																																																																																																						"jūr"
																																																																																																																				),
																																																																																																																				f.Lemma1(word, lemmata) === "periūrus",
																																																																																																																				REPLACE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						4,
																																																																																																																						1,
																																																																																																																						"j"
																																																																																																																				),
																																																																																																																				AND(
																																																																																																																						OR(
																																																																																																																								LEFT(
																																																																																																																										LOWER(
																																																																																																																												f.NoMacra(word, lemmata)
																																																																																																																										),
																																																																																																																										2
																																																																																																																								) === "ia",
																																																																																																																								LEFT(
																																																																																																																										LOWER(
																																																																																																																												f.NoMacra(word, lemmata)
																																																																																																																										),
																																																																																																																										2
																																																																																																																								) === "ie",
																																																																																																																								LEFT(
																																																																																																																										LOWER(
																																																																																																																												f.NoMacra(word, lemmata)
																																																																																																																										),
																																																																																																																										2
																																																																																																																								) === "ii",
																																																																																																																								LEFT(
																																																																																																																										LOWER(
																																																																																																																												f.NoMacra(word, lemmata)
																																																																																																																										),
																																																																																																																										2
																																																																																																																								) === "io",
																																																																																																																								LEFT(
																																																																																																																										LOWER(
																																																																																																																												f.NoMacra(word, lemmata)
																																																																																																																										),
																																																																																																																										2
																																																																																																																								) === "iu",
																																																																																																																								LEFT(
																																																																																																																										LOWER(
																																																																																																																												f.NoMacra(word, lemmata)
																																																																																																																										),
																																																																																																																										2
																																																																																																																								) === "iy"
																																																																																																																						),
																																																																																																																						NOT(
																																																																																																																								EXACT(
																																																																																																																										UPPER(
																																																																																																																												LEFT(
																																																																																																																														f.Word(word, lemmata),
																																																																																																																														1
																																																																																																																												)
																																																																																																																										),
																																																																																																																										"Ī"
																																																																																																																								)
																																																																																																																						),
																																																																																																																						COUNTIF(
																																																																																																																								phoneticExceptions["Vocalic initial i"],
																																																																																																																								f.Lemma1(word, lemmata)
																																																																																																																						) === 0,
																																																																																																																						f.Uncompounded(word, lemmata) !== "iīs"
																																																																																																																				),
																																																																																																																				REPLACE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						1,
																																																																																																																						1,
																																																																																																																						"j"
																																																																																																																				),
																																																																																																																				OR(
																																																																																																																						f.Lemma1(word, lemmata) === "magnus",
																																																																																																																						f.Lemma1(word, lemmata) === "magis",
																																																																																																																						f.Lemma1(word, lemmata) === "maiestās",
																																																																																																																						f.Lemma1(word, lemmata) === "maiōrēs",
																																																																																																																						f.Lemma1(word, lemmata) === "malus",
																																																																																																																						f.Lemma1(word, lemmata) === "male",
																																																																																																																						AND(
																																																																																																																								f.NoMacra(
																																																																																																																										f.Lemma1(word, lemmata)
																																																																																																																								) === "aio",
																																																																																																																								OR(
																																																																																																																										RIGHT(
																																																																																																																												LEFT(
																																																																																																																														f.NoMacra(word, lemmata),
																																																																																																																														3
																																																																																																																												),
																																																																																																																												1
																																																																																																																										) === "a",
																																																																																																																										RIGHT(
																																																																																																																												LEFT(
																																																																																																																														f.NoMacra(word, lemmata),
																																																																																																																														3
																																																																																																																												),
																																																																																																																												1
																																																																																																																										) === "e",
																																																																																																																										RIGHT(
																																																																																																																												LEFT(
																																																																																																																														f.NoMacra(word, lemmata),
																																																																																																																														3
																																																																																																																												),
																																																																																																																												1
																																																																																																																										) === "i",
																																																																																																																										RIGHT(
																																																																																																																												LEFT(
																																																																																																																														f.NoMacra(word, lemmata),
																																																																																																																														3
																																																																																																																												),
																																																																																																																												1
																																																																																																																										) === "o",
																																																																																																																										RIGHT(
																																																																																																																												LEFT(
																																																																																																																														f.NoMacra(word, lemmata),
																																																																																																																														3
																																																																																																																												),
																																																																																																																												1
																																																																																																																										) === "u",
																																																																																																																										RIGHT(
																																																																																																																												LEFT(
																																																																																																																														f.NoMacra(word, lemmata),
																																																																																																																														3
																																																																																																																												),
																																																																																																																												1
																																																																																																																										) === "y"
																																																																																																																								)
																																																																																																																						)
																																																																																																																				),
																																																																																																																				SUBSTITUTE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						"ai",
																																																																																																																						"ajj"
																																																																																																																				),
																																																																																																																				LEFT(
																																																																																																																						f.Word(word, lemmata),
																																																																																																																						1
																																																																																																																				) === "-",
																																																																																																																				"",
																																																																																																																				1 === 1,
																																																																																																																				f.Uncompounded(word, lemmata)
																																																																																																																		)
																																																																																																																)
																																																																																																														),
																																																																																																														"_"
																																																																																																												),
																																																																																																												"am_",
																																																																																																												"ã"
																																																																																																										),
																																																																																																										"em_",
																																																																																																										"ẽ"
																																																																																																								),
																																																																																																								"im_",
																																																																																																								"ĩ"
																																																																																																						),
																																																																																																						"om_",
																																																																																																						"õ"
																																																																																																				),
																																																																																																				"um_",
																																																																																																				"ũ"
																																																																																																		),
																																																																																																		"ym_",
																																																																																																		"ỹ"
																																																																																																),
																																																																																																"qu",
																																																																																																"q"
																																																																																														),
																																																																																														"ds",
																																																																																														"ts"
																																																																																												),
																																																																																												"z",
																																																																																												"ds"
																																																																																										),
																																																																																										"x",
																																																																																										"cs"
																																																																																								),
																																																																																								"bs",
																																																																																								"ps"
																																																																																						),
																																																																																						"bt",
																																																																																						"pt"
																																																																																				),
																																																																																				"ch",
																																																																																				"χ"
																																																																																		),
																																																																																		"ph",
																																																																																		"φ"
																																																																																),
																																																																																"rh",
																																																																																"r"
																																																																														),
																																																																														"th",
																																																																														"θ"
																																																																												),
																																																																												"ae",
																																																																												"à"
																																																																										),
																																																																										"au",
																																																																										"â"
																																																																								),
																																																																								"oe",
																																																																								"ò"
																																																																						),
																																																																						"ë",
																																																																						"e"
																																																																				),
																																																																				"ï",
																																																																				"i"
																																																																		),
																																																																		"ü",
																																																																		"u"
																																																																),
																																																																"ṻ",
																																																																"ū"
																																																														),
																																																														"á",
																																																														"a"
																																																												),
																																																												"é",
																																																												"e"
																																																										),
																																																										"í",
																																																										"i"
																																																								),
																																																								"ó",
																																																								"o"
																																																						),
																																																						"ú",
																																																						"u"
																																																				),
																																																				"ý",
																																																				"y"
																																																		),
																																																		"ḗ",
																																																		"ē"
																																																),
																																																"āns",
																																																"ãs"
																																														),
																																														"ēns",
																																														"ẽs"
																																												),
																																												"īns",
																																												"ĩs"
																																										),
																																										"ōns",
																																										"õs"
																																								),
																																								"ūns",
																																								"ũs"
																																						),
																																						"ȳns",
																																						"ỹs"
																																				),
																																				"ānf",
																																				"ãf"
																																		),
																																		"ēnf",
																																		"ẽf"
																																),
																																"īnf",
																																"ĩf"
																														),
																														"ōnf",
																														"õf"
																												),
																												"ūnf",
																												"ũf"
																										),
																										"ȳnf",
																										"ỹf"
																								),
																								"lectiient",
																								"lectijent"
																						),
																						"ōsuestr",
																						"ōsvestr"
																				),
																				"reiciav",
																				"rejcjav"
																		),
																		"k",
																		"c"
																),
																"eu",
																IF(
																		COUNTIF(
																				phoneticExceptions["Diphthong eu"],
																				f.Lemma1(word, lemmata)
																		) > 0,
																		"€",
																		"eu"
																)
														),
														"_eu",
														"_€"
												),
												"_€nd",
												"eund"
										),
										"_€nt",
										"eunt"
								),
								"eu_",
								"€"
						),
						"_",
						""
				),
				IF(
						LEN(
								f.Word(word, lemmata)
						) ===
						LEN(
								f.Uncompounded(word, lemmata)
						),
						"",
						RIGHT(
								SUBSTITUTE(
										f.Word(word, lemmata),
										"qu",
										"q"
								),
								2
						)
				)
		);

			if (word === '') {
				return '_';
			}

			return formula;
		},
	Scansion:
		(word, lemmata) => {
			return '';
		},
	AllVowels:
		(word, lemmata) => {
			return '';
		},
	SyllableCount:
		(word, lemmata) => {
			return '';
		},
	Stress:
		(word, lemmata) => {
			return '';
		},
	UltimaRhyme:
		(word, lemmata) => {
			return '';
		},
	RhymeVowels:
		(word, lemmata) => {
			return '';
		},
	PerfectRhyme:
		(word, lemmata) => {
			return '';
		},
	RhymeConsonants:
		(word, lemmata) => {
			return '';
		},
	Ultima:
		(word, lemmata) => {
			return '';
		},
	RhymeVowelsAndUltimaCoda:
		(word, lemmata) => {
			return '';
		},
	EcclesPhonetic:
		(word, lemmata) => {
			return '';
		},
	EcclesVowels:
		(word, lemmata) => {
			return '';
		},
	EcclesRhymeVowels:
		(word, lemmata) => {
			return '';
		},
	EcclesRhymeVowelsAndUltimaCoda:
		(word, lemmata) => {
			return '';
		},
	EcclesPerfectRhyme:
		(word, lemmata) => {
			return '';
		},
	EcclesSort:
		(word, lemmata) => {
			return '';
		},
	LemmaCount:
		(word, lemmata) => {
			return f.LemmaArray(word, lemmata).length;
		},
	Lemma1:
		(word, lemmata) => {
			return f.LemmaArray(word, lemmata)[0];
		},
	Lemma2:
		(word, lemmata) => {
			return f.LemmaArray(word, lemmata)[1] || null;
		},
	Lemma3:
		(word, lemmata) => {
			return f.LemmaArray(word, lemmata)[2] || null;
		},
	Lemma4:
		(word, lemmata) => {
			return f.LemmaArray(word, lemmata)[3] || null;
		},
	Lemma5:
		(word, lemmata) => {
			return f.LemmaArray(word, lemmata)[4] || null;
		},
	ScansionWithElision:
		(word, lemmata) => {
			return '';
		},
	IsFitForDactylic:
		(word, lemmata) => {
			return '';
		},
	LemmaArray:
		(word, lemmata) => {
			return lemmata.split(' ');
		},
	IsLemma:
		(word, lemmata) => {
			return '';
		},
	IsNonLemma:
		(word, lemmata) => {
			return '';
		},
	DuplicateWords:
		(word, lemmata) => {
			return '';
		},
	NewLemmata:
		(word, lemmata) => {
			return '';
		},
	NoMacra:
		(word, lemmata) => {
			// Function from https://ricardometring.com/javascript-replace-special-characters
			return word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
		},
	NoMacraLowerCase:
		(word, lemmata) => {
			return f.NoMacra(word).toLowerCase();
		},
	AlphOrderNoMacra:
		(word, lemmata) => {
			return '';
		},
	Sort:
		(word, lemmata) => {
			return '';
		},
	RepeatWord:
		(word, lemmata) => {
			return '';
		},
}

const wordsformFunctions = f;
