// A load of Excel functions recreated in JavaScript:

const CONCAT = (...args) => {
	return args.reduce((previous, current) => `${previous}${current}`);
}
const SUBSTITUTE = (text, oldText, newText) => {
	return text.replaceAll(oldText, newText);
}
const LOWER = (text) => {
	return text.toLowerCase();
}
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
const UPPER = (text) => {
	return text.toUpperCase();
}
const COUNTIF = (array, searchValue) => {
	return [...array].filter(value => value === searchValue).length;
}
const IF = (condition, trueReturn, falseReturn) => {
	return condition ? trueReturn : falseReturn;
}
const LEN = (text) => {
	return `${text}`.length;
}
const reversestr = (text) => {
	return `${text}`.split('').reverse().join('');
}
const SUM = (...args) => {
	return args.reduce((previous, current) => previous + current);
}


// Defining a value then emptying the array gives us IntelliSense without TypeScript :)
const existingWords = [{word: 'string', lemmata: ['string']}].filter(_ => false);

const addToWordsArray = (word, lemmata) => {
	existingWords.push({word, lemmata});
}

const clearWordsArray = () => {
	existingWords.length = 0;
}

// Constant used when a field would be the empty string, such as the consonants in a word of all vowels.
const EMPTY = '∅';


const memoisedData = {};

const memoise = (func, functionName, word, lemmata) => {
	if (memoisedData[word]?.[functionName] === undefined) {
		const wordObject = {... memoisedData[word]}
		wordObject[functionName] = func(word, lemmata);
		memoisedData[word] = wordObject;
	}
	return memoisedData[word][functionName];
}

const clearMemoisationCache = () => {
	for (const key in memoisedData) {
		delete memoisedData[key];
	}
}


// Functions replacing the fields in `wordsform` sheet.

const unmemoisedFuncs = {
	Ord:
		(word, lemmata) => {
			return existingWords.length + 1;
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
				return EMPTY;
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
			if (["á","é","í","ó","ú","ý","ḗ"].some(acute => wordMinusPossibleEnclitic.includes(acute))) {
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
																																																																																																																						word,
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
																																																																																																																					f.NoMacra(word, lemmata).includes("ngua"),
																																																																																																																						f.NoMacra(word, lemmata).includes("ngue"),
																																																																																																																						f.NoMacra(word, lemmata).includes("ngui"),
																																																																																																																						f.NoMacra(word, lemmata).includes("nguo"),
																																																																																																																						f.NoMacra(word, lemmata).includes("nguu")
																																																																																																																				),
																																																																																																																				SUBSTITUTE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						"ngu",
																																																																																																																						"ngv",
																																																																																																																						1
																																																																																																																				),
																																																																																																																				OR(
																																																																																																																						f.Lemma1(word, lemmata).includes("suād"),
																																																																																																																						f.Lemma1(word, lemmata).includes("suās"),
																																																																																																																						f.Lemma1(word, lemmata).includes("suāv")
																																																																																																																				),
																																																																																																																				SUBSTITUTE(
																																																																																																																						f.Uncompounded(word, lemmata),
																																																																																																																						"suā",
																																																																																																																						"svā",
																																																																																																																						1
																																																																																																																				),
																																																																																																																				LEFT(
																																																																																																																						word,
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
																																																																																																																														word,
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
																																																																																																																						word,
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
								word
						) ===
						LEN(
								f.Uncompounded(word, lemmata)
						),
						"",
						RIGHT(
								SUBSTITUTE(
										word,
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
			return f.Phonetic(word, lemmata)
				.replace(/[eiouy]/g, 'a')
				.replace(/[ēīōūȳãẽĩõũỹàâ€èòùḗ]/g, 'ā')
				.replace(/bl|cl|cr|dr|fr|fl|gl|gr|pr|pl|tr|θl|θr|φl|φr|χl|χr/g, 'br')
				.replace(/br/g, 'b')
				.replace(/h/g, '')
				.replace(/c|d|f|g|j|k|l|m|n|p|q|r|s|t|v|φ|χ|θ/g, 'b')
				.replace(/z/g, 'bb')
				.replace(/abb/g, 'ā')
				.replace(/b/g, '')
				.replace(/a/g, '⏑')
				.replace(/ā/g, '–') || EMPTY;
		},
	AllVowels:
		(word, lemmata) => {
			if (f.Scansion(word, lemmata) === EMPTY || word[0] === '-') {
				return EMPTY;
			}
			return f.Phonetic(word, lemmata).replace(/[bcdfghjklmnpqrstvxzχφθ]/g, '');
		},
	SyllableCount:
		(word, lemmata) => {
			return f.AllVowels(word, lemmata).replace(EMPTY, '').length;
		},
	Stress:
		(word, lemmata) => {
			return IFS(
				f.SyllableCount(word, lemmata) == 0,
				0,
				LEFT(word,1) == "-",
				2,
				OR(
					word == "abhinc",
					EXACT(word,"adhūc"),
					EXACT(word,"Antiās"),
					EXACT(word,"Arpīnās"),
					EXACT(word,"Asprēnās"),
					word == "Fīdēnās",
					word == "illāc",
					word == "illīc",
					word == "illinc",
					word == "illūc",
					word == "istīc",
					word == "Maecēnās",
					word == "nostrās",
					f.Phonetic(word, lemmata) == "posθāc",
					word == "Samnīs",
					word == "satin",
					word == "Suffēnās",
					word == "tantōn",
					word == "viden",
					word == "vidēn",
					RIGHT(f.Phonetic(word, lemmata),3) == "dīc",
					RIGHT(f.Phonetic(word, lemmata),3) == "dūc",
					RIGHT(f.Phonetic(word, lemmata),3) == "fac",
					f.SyllableCount(word, lemmata) == 1
				),
				1,
				f.SyllableCount(word, lemmata) == 2,
				2,
				OR(
					word == "deïnde",
					word == "exindē",
					word == "perinde",
					word == "proïndē",
					word == "subinde"
				),
				3,
				LEFT(RIGHT(f.Scansion(word, lemmata),2),1) == "–",
				2,
				LEN(word)!==LEN(f.Uncompounded(word, lemmata)),
				2,
				OR(
					word == "agedum",
					word == "egomet",
					word == "ibidem",
					word == "meamet",
					f.Phonetic(word, lemmata) == "satine",
					word == "suamet",
					word == "ubinam"
				),
				2,
				OR(
					f.Uncompounded(word, lemmata).includes("á"),
					f.Uncompounded(word, lemmata).includes("é"),
					f.Uncompounded(word, lemmata).includes("í"),
					f.Uncompounded(word, lemmata).includes("ó"),
					f.Uncompounded(word, lemmata).includes("ú"),
					f.Uncompounded(word, lemmata).includes("ý"),
				),
				2,
				AND(
					OR(
						RIGHT(f.Lemma1(word, lemmata),3) == "ius",
						RIGHT(f.Lemma1(word, lemmata),3) == "ïus",
						RIGHT(f.Lemma1(word, lemmata),3) == "ium",
						RIGHT(f.Lemma1(word, lemmata),8) == "ius[prn]",
						RIGHT(f.Lemma1(word, lemmata),8) == "ius[adj]",
						RIGHT(f.Lemma1(word, lemmata),6) == "ius[n]",
						RIGHT(f.Lemma1(word, lemmata),8) == "ium[prn]",
						RIGHT(f.Lemma1(word, lemmata),6) == "ium[n]"
					),
					reversestr(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(word,"á","a"),"é","e"),"í","i"),"ó","o"),"ú","u"),"ý","y")) == REPLACE(reversestr(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(f.Lemma1(word, lemmata),"[n]",""),"[prn]",""),"[adj]","")),1,3,"ī")
				),
				2,
				1 == 1,
				3
			);
		},
	UltimaRhyme:
		(word, lemmata) => {
			if (f.SyllableCount(word, lemmata) === 0) {
				return f.Phonetic(word, lemmata);
			}
			const ultimaVowel = f.AllVowels(word, lemmata).at(-1)
			const lastIndex = `${f.Phonetic(word, lemmata)}`.lastIndexOf(ultimaVowel)
			return `${f.Phonetic(word, lemmata)}`.substring(lastIndex);
		},
	RhymeVowels:
		(word, lemmata) => {
			if (f.Scansion(word, lemmata) === EMPTY) {
				return EMPTY;
			}
			return RIGHT(f.AllVowels(word, lemmata), f.Stress(word, lemmata));
		},
	PerfectRhyme:
		(word, lemmata) => {
			if (word.startsWith('-')
			  || f.Stress(word, lemmata) === 0
			) {
				return f.Phonetic(word, lemmata);
			}
			const rhymeVowels = f.RhymeVowels(word, lemmata).split('');
			// Subtract syllables from the end until the rhyme-vowels are used up.
			// Eg vocābulōrũ => vocābul
			let wordMinusRhyme = rhymeVowels.reduceRight((substring, vowel) => {
				return substring.substring(0, substring.lastIndexOf(vowel));
			}, f.Phonetic(word, lemmata));
			// Remove this from the initial word to give the syllables that were subtracted in the `reduceRight`.
			// Eg vocābulōrũ - vocābul => ōrũ
			return f.Phonetic(word, lemmata).replace(wordMinusRhyme, '');
		},
	RhymeConsonants:
		(word, lemmata) => {
			return (f.PerfectRhyme(word, lemmata) + '.')
				.replace(/[€āàâeēiīoōóòuūùyȳ]/g, 'a')
				.replace(/[ãẽĩõũỹ]f/g, 'anf')
				.replace(/[ãẽĩõũỹ]s/g, 'ans')
				.replace(/[ãẽĩõũỹ]/g, 'am')
				.replace('.', '');
		},
	Ultima:
		(word, lemmata) => {
			if (f.Stress(word, lemmata) === 2) {
				return '2 ' + f.UltimaRhyme(word, lemmata);
			}
			return f.UltimaRhyme(word, lemmata);
		},
	RhymeVowelsAndUltimaCoda:
		(word, lemmata) => {
			if (f.Stress(word, lemmata) === 0) {
				return f.UltimaRhyme(word, lemmata);
			}

			return f.RhymeVowels(word, lemmata) + f.UltimaRhyme(word, lemmata).substring(1);
		},
	EcclesPhonetic:
		(word, lemmata) => {
			return `${f.Phonetic(word, lemmata)}.`
				.replace(/ā/g, 'a')
				.replace(/ē/g, 'e')
				.replace(/ī/g, 'i')
				.replace(/ō/g, 'o')
				.replace(/ū/g, 'u')
				.replace(/ȳ/g, 'y')
				.replaceAll("ihi","iki")
				.replaceAll("òè","ojej")
				.replaceAll("à","e")
				.replaceAll("èn","ein")
				.replaceAll("è","ej")
				.replaceAll("ò","e")
				.replaceAll("ù","uj")
				.replaceAll("y","i")
				.replaceAll("ã.","am")
				.replaceAll("ẽ.","em")
				.replaceAll("ĩ.","im")
				.replaceAll("õ.","om")
				.replaceAll("ũ.","um")
				.replaceAll("ỹ.","ym")
				.replaceAll("ã","an")
				.replaceAll("ẽ","en")
				.replaceAll("ĩ","in")
				.replaceAll("õ","on")
				.replaceAll("ũ","un")
				.replaceAll("ỹ","yn")
				.replaceAll("χ","c")
				.replaceAll("φ","f")
				.replaceAll("θ","t")
				.replaceAll("h","")
				.replaceAll(".","");
		},
	EcclesVowels:
		(word, lemmata) => {
			if (word.startsWith('-')) {
				return EMPTY;
			}
			return f.EcclesPhonetic(word, lemmata)
				.replace(/[bcdghjklmnpqrstvxz]/g, '');
		},
	EcclesRhymeVowels:
		(word, lemmata) => {
			if (word === 'dehinc') {
				return 'ei';
			}
			if (f.Scansion(word, lemmata) === EMPTY) {
				return EMPTY;
			}
			return RIGHT(f.EcclesVowels(word, lemmata), f.Stress(word, lemmata));
		},
	EcclesRhymeVowelsAndUltimaCoda:
		(word, lemmata) => {
			if (f.Scansion(word, lemmata) === EMPTY) {
				return EMPTY;
			}
			const phonetic = f.EcclesPhonetic(word, lemmata);
			const rhymeVowels = f.EcclesRhymeVowels(word, lemmata);
			const ultimaVowel = rhymeVowels.substring(rhymeVowels.length - 1);
			const ultimaVowelIndex = phonetic.lastIndexOf(ultimaVowel);
			return rhymeVowels + phonetic.substring(ultimaVowelIndex + 1);
		},
	EcclesPerfectRhyme:
		(word, lemmata) => {
			if (word === 'dehinc') {
				return 'einc';
			}
			if (word.startsWith('-')
			  || f.Stress(word, lemmata) === 0
			) {
				f.EcclesPhonetic(word, lemmata)
			}
			const rhymeVowels = f.EcclesRhymeVowels(word, lemmata).split('');
			// Subtract syllables from the end until the rhyme-vowels are used up.
			// Eg vocabulorum => vocabul
			let wordMinusRhyme = rhymeVowels.reduceRight((substring, vowel) => {
				return substring.substring(0, substring.lastIndexOf(vowel));
			}, f.EcclesPhonetic(word, lemmata));
			// Remove this from the initial word to give the syllables that were subtracted in the `reduceRight`.
			// Eg vocabulorum - vocabul => orum
			return f.EcclesPhonetic(word, lemmata).replace(wordMinusRhyme, '');
		},
	EcclesSort:
		(word, lemmata) => {
			return CONCAT(
					f.EcclesRhymeVowels(word, lemmata),
					"-",
					f.EcclesPerfectRhyme(word, lemmata)
						.replace(/[eiouyàâè€òùãẽĩõũỹ]/g, 'a'),
					"-",
					reversestr(
						LEFT(
							f.EcclesVowels(word, lemmata),
							LEN(f.EcclesVowels(word, lemmata)) - LEN(f.EcclesRhymeVowels(word, lemmata))
						)
					) || "",
					"-",
					reversestr(
						LEFT(
							f.EcclesPhonetic(word, lemmata),
							LEN(f.EcclesPhonetic(word, lemmata)) - LEN(f.EcclesPerfectRhyme(word, lemmata))
						)
					).replace(/[eiouyàâè€òùãẽĩõũỹ]/g, 'a'),
					"-",
					word.toLowerCase()
				).replaceAll('ā', 'azzzz')
					.replaceAll('ē', 'ezzzz')
					.replaceAll('ḗ', 'ezzzz')
					.replaceAll('ī', 'izzzz')
					.replaceAll('ō', 'ozzzz')
					.replaceAll('ū', 'uzzzz')
					.replaceAll('ȳ', 'yzzzz')
					.replaceAll('ã', 'azzzzzz')
					.replaceAll('ẽ', 'ezzzzzz')
					.replaceAll('ĩ', 'izzzzzz')
					.replaceAll('õ', 'ozzzzzz')
					.replaceAll('ũ', 'uzzzzzz')
					.replaceAll('ỹ', 'yzzzzzz')
					.replaceAll('à', 'azzzzzzzz')
					.replaceAll('â', 'azzzzzzzzzzzz')
					.replaceAll('è', 'ezzzzzzzz')
					.replaceAll('€', 'ezzzzzzzzzzzz')
					.replaceAll('ò', 'ozzzzzzzz')
					.replaceAll('ù', 'uzzzzzzzz')
				+ (word === word.toLowerCase() ? '/' : '');
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
			if (!"aeiouyāēīōūӯãẽĩõũỹàâé€òù".includes(f.UltimaRhyme(word, lemmata))
			) {
				return f.Scansion(word, lemmata);
			}
			if (f.SyllableCount(word, lemmata) === 1) {
				return EMPTY;
			}
			return LEFT(
				f.Scansion(word, lemmata),
				f.SyllableCount(word, lemmata) - 1
			)
		},
	IsFitForDactyl:
		(word, lemmata) => {
			const scansionWithElision = f.ScansionWithElision(word, lemmata);
			if (
				scansionWithElision.includes('–⏑–') ||
				scansionWithElision.includes('⏑⏑⏑') ||
				scansionWithElision.includes('⏑––⏑')
			) {
				return 0;
			} return 1;
			// A dactylic hexameter fits the regex /–(–|⏑⏑)–(–|⏑⏑)–(–|⏑⏑)–(–|⏑⏑)–⏑⏑–[–⏑]/
			// Another way of writing that is /(––|–⏑⏑){4}–⏑⏑–[–⏑]/
			// If a word contains (eg) –⏑– it cannot be part of a full hexameter.
		},
	LemmaArray:
		(word, lemmata) => {
			return lemmata.split(' ');
		},
	IsLemma:
		(word, lemmata) => {
			return f.LemmaArray(word, lemmata).some(lemma => {
				return lemma.replace(/\[[^\]]+\]/, '') === word;
			}) ? 1 : 0;
		},
	IsNonLemma:
		(word, lemmata) => {
			return f.LemmaArray(word, lemmata).some(lemma => {
				return lemma.replace(/\[[^\]]+\]/, '') !== word;
			}) ? 1 : 0;
		},
	DuplicateWords:
		(word, lemmata) => {
			const duplicateFound = existingWords.find(record => record.word === word);
			if (duplicateFound) {
				if (JSON.stringify(duplicateFound.lemmata) === JSON.stringify(lemmata)) {
					console.error(`Duplicate found for ${word} with matching lemmata — please delete the duplicate`);
					return word;
				}
				if (lemmata.some(lemmaInNewRecord => !duplicateFound.lemmata.includes(lemmaInNewRecord))) {
					console.error(`Duplicate found for ${word} with new lemmata [${lemmata}] that are not in [${duplicateFound.lemmata}] — please merge two records`);
					return word;
				}
				console.error(`Duplicate found for ${word} with lemmata [${lemmata}] that match existing lemmata [${duplicateFound.lemmata}] — please delete the duplicate`);
				return word;
			}
			return null;
		},
	NewLemmata:
		(word, lemmata) => {
			// I’m not going to write something useful for this.
			// In the Excel file, this column checks whether lemmata are missing from
			// a sheet called `lemmata` — but that sheet cannot be replicated here.
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
			return f.NoMacraLowerCase(word, lemmata).split('').sort().join('');
		},
	Sort:
		(word, lemmata) => {
			return CONCAT(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(CONCAT(f.RhymeVowels(word, lemmata),"-",SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(f.NoMacra(f.PerfectRhyme(word, lemmata)),"a","a"),"e","a"),"i","a"),"o","a"),"u","a"),"y","a"),"à","a"),"â","a"),"è","a"),"€","a"),"ò","a"),"ù","a"),"ã","a"),"ẽ","a"),"ĩ","a"),"õ","a"),"ũ","a"),"ỹ","a"),"-",reversestr(LEFT(f.AllVowels(word, lemmata),LEN(f.AllVowels(word, lemmata))-LEN(f.RhymeVowels(word, lemmata)))),"-",SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(SUBSTITUTE(reversestr(LEFT(f.Phonetic(word, lemmata),LEN(f.Phonetic(word, lemmata))-LEN(f.PerfectRhyme(word, lemmata)))),"a","a"),"e","a"),"i","a"),"o","a"),"u","a"),"y","a"),"à","a"),"â","a"),"è","a"),"€","a"),"ò","a"),"ù","a"),"ã","a"),"ẽ","a"),"ĩ","a"),"õ","a"),"ũ","a"),"ỹ","a")),"ā","azzzz"),"ē","ezzzz"),"ī","izzzz"),"ō","ozzzz"),"ū","uzzzz"),"ȳ","yzzzz"),"ã","azzzzzz"),"ẽ","ezzzzzz"),"ĩ","izzzzzz"),"õ","ozzzzzz"),"ũ","uzzzzzz"),"ỹ","yzzzzzz"),"à","azzzzzzzz"),"â","azzzzzzzzzzzz"),"è","ezzzzzzzz"),"€","ezzzzzzzzzzzz"),"ò","ozzzzzzzz"),"ù","uzzzzzzzz"),"-",LOWER(word),IF(EXACT(word,LOWER(word)),"/",""));
		},
	RepeatWord:
		(word, lemmata) => {
			return word;
		},
}

// Object with the same shape as `unmemoisedFuncs`, but all the functions are memoised.
const wordsformFunctionsMemoised = Object.entries(unmemoisedFuncs)
	.reduce((memoisedFuncs, [currentFuncName, currentFunc]) => {
		memoisedFuncs[currentFuncName] = ((word, lemmata) => memoise(currentFunc, currentFuncName, word, lemmata));
		return memoisedFuncs;
	}, {});

// Aliases
const f = wordsformFunctionsMemoised
const wordsformFunctions = wordsformFunctionsMemoised;
