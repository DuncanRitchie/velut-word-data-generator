// A load of Excel functions recreated in JavaScript,
// and some of my own:

// Eg, SUBSTITUTES('velut', 'e', 'E', 'u', 'U') => 'vElUt'
const SUBSTITUTES = (text, ...args) => {
	const oldTexts = args.filter((v, i) => i % 2 === 0);
	const newTexts = args.filter((v, i) => i % 2 !== 0);
	let substituted = text;
	for (let i = 0; i < oldTexts.length; i++) {
		substituted = substituted.replaceAll(oldTexts[i], newTexts[i]);
		}
	return substituted;
}
const itojj = (text) => {
	return `${text}`.replace(/(?<=[āēīōūȳ])i(?=[aeiouyāēīōūȳ])/gi, 'jj');
}
const RIGHT = (text, characterCount) => {
	return `${text}`.substring(`${text}`.length - characterCount);
}
const REPLACE = (oldText, startNum, numChars, newText) => {
	return `${oldText}`.substring(0, startNum - 1) + newText + `${oldText}`.substring(startNum + numChars - 1);
}
const reversestr = (text) => {
	return `${text}`.split('').reverse().join('');
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
			if (existingWords.some(record => record.word === wordMinusPossibleEnclitic)) {
				return wordMinusPossibleEnclitic;
			}
			if (["á","é","í","ó","ú","ý","ḗ"].some(acute => wordMinusPossibleEnclitic.includes(acute))) {
				const removeAcutes = (word) => {
					return word.replaceAll("á","a").replaceAll("é","e").replaceAll("í","i").replaceAll("ó","o").replaceAll("ú","u").replaceAll("ý","y").replaceAll("ḗ","ē");
				}
				const wordMinusPossibleEncliticWithoutAcutesOrUDiaeresis = removeAcutes(wordMinusPossibleEnclitic).replaceAll("ü","u");
				if (existingWords.some(record => record.word === wordMinusPossibleEncliticWithoutAcutesOrUDiaeresis)) {
					return wordMinusPossibleEncliticWithoutAcutesOrUDiaeresis;
				}
			}
			return word;
		},
	Enclitic:
		(word, lemmata) => {
			if (word.length === f.Uncompounded(word, lemmata).length) {
				return '';
			}
			if (word.endsWith('que')) { return 'que'; }
			if (word.endsWith('ne')) { return 'ne'; }
			if (word.endsWith('ve')) { return 've'; }
			console.error('Uncompounded is different to Word but Word doesn’t end with an enclitic.');
		},
	UncompoundedPhonetic:
		(word, lemmata) => {
			const getPhoneticBeforeGeneralSubstitutions = () => {
				const uncompounded = f.Uncompounded(word, lemmata);
				if (uncompounded === "ai") {
					return 'à';
				}
				if (uncompounded === 'ei') {
					return 'è';
				}
				if (uncompounded === 'eia') {
					return 'èa';
				}
				if (uncompounded === 'hei') {
					return 'hè';
				}
				if (uncompounded === 'heia') {
					return 'hèa';
				}
				if (uncompounded === 'hoc') {
					return 'hocc';
				}
				if (uncompounded === 'oi') {
					return 'ò';
				}
				if (uncompounded === 'oiei') {
					return 'òè';
				}
				if (uncompounded === 'dehinc') {
					return 'dènc';
				}
				if (['dein', 'deinde', 'proin', 'proindē'].includes(uncompounded)) {
					return SUBSTITUTES(
						uncompounded,
						"dein",
						"dèn",
						"proin",
						"pròn"
					);
				}
				if (f.Lemma1(word, lemmata) === "praeeō") {
					return word.replaceAll('praei', 'prài');
				}
				if (
					f.Lemma1(word, lemmata).startsWith('cui')
					|| f.Lemma1(word, lemmata).startsWith('quis')
					|| f.Lemma1(word, lemmata).startsWith('quī')
					|| f.Lemma1(word, lemmata) === "aliquis"
					|| f.Lemma1(word, lemmata) === "ecquis"
					|| f.Lemma1(word, lemmata) === "nesciōquis"
					|| f.Lemma1(word, lemmata) === "ūnusquisque"
				) {
					return SUBSTITUTES(
						itojj(uncompounded),
						"cuiā",
						"cùjā",
						"cui",
						"cù"
					);
				}
				if (
					f.NoMacra(word, lemmata).includes("ngua")
					|| f.NoMacra(word, lemmata).includes("ngue")
					|| f.NoMacra(word, lemmata).includes("ngui")
					|| f.NoMacra(word, lemmata).includes("nguo")
					|| f.NoMacra(word, lemmata).includes("nguu")
				) {
					return uncompounded.replace('ngu', 'ngv');
				}
				if (
					f.Lemma1(word, lemmata).includes("suād")
					|| f.Lemma1(word, lemmata).includes("suās")
					|| f.Lemma1(word, lemmata).includes("suāv")
				) {
					return uncompounded.replace('suā', 'svā');
				}
				if (word.startsWith('Eduard')) {
					return uncompounded.replace('Eduard', 'edvard');
				}
				if (f.Lemma1(word, lemmata).toLowerCase().includes("suē")) {
					return uncompounded
						.replace('suē', 'svē')
						.replace('Suē', 'Svē')
						.replace('sue', 'sve')
						.replace('sui', 'svi')
						.replace('suī', 'svī')
						.replace('suu', 'svu');
				}
				if (f.Lemma1(word, lemmata) === "urgueō") {
					return uncompounded.replaceAll('urgu', 'urgv');
				}
				if ((
					f.Lemma1(word, lemmata).endsWith('iaceō')
					|| f.Lemma1(word, lemmata).endsWith('iectō')
					|| f.Lemma1(word, lemmata).endsWith('iaciō')
					|| f.Lemma1(word, lemmata).endsWith('iectus')
					|| f.Lemma1(word, lemmata).endsWith('iectē')
					|| [
						"abiciō",
						"adiciō",
						"circumiciō",
						"coniciō",
						"dēiciō",
						"disiciō",
						"ēiciō",
						"iniciō",
						"intericiō",
						"obiciō",
						"periciō",
						"praeiciō",
						"reiciō",
						"subiciō",
						"trāiciō",
						"obex",
						"subicēs",
					].includes(f.Lemma1(word, lemmata))
				)) {
					return uncompounded
						.replace('iēc', 'jēc')
						.replace('iec', 'jec')
						.replace('iac', 'jac')
						.replaceAll('bex', 'bjex')
						.replaceAll('ic', 'jic')
						.replaceAll('rej', 'rèj');
				}
				if (uncompounded.startsWith('coniū')) {
					return REPLACE(
						uncompounded,
						1,
						5,
						"conjū"
					);
				}
				if (uncompounded.startsWith('coniu')) {
					return REPLACE(
						uncompounded.toLowerCase(),
						1,
						5,
						"conju"
					);
				}
				if (uncompounded.startsWith('disiu')) {
					return REPLACE(
						uncompounded.toLowerCase(),
						1,
						5,
						"disju"
					);
				}
				if (uncompounded.startsWith('disiū')) {
					return REPLACE(
						uncompounded.toLowerCase(),
						1,
						5,
						"disjū"
					);
				}
				if (
					f.Lemma1(word, lemmata) === "iniugis"
					|| f.Lemma1(word, lemmata) === "biiugis"
					|| f.Lemma1(word, lemmata) === "biiugus"
					|| f.Lemma1(word, lemmata) === "subiugō"
				) {
					return uncompounded.replaceAll('iug', 'jug');
				}
				if (
					uncompounded.startsWith('adiu')
					|| uncompounded.startsWith('adiū')
				) {
					return REPLACE(
						uncompounded,
						1,
						3,
						"adj"
					);
				}
				if (uncompounded.startsWith('iniūr')) {
					return REPLACE(
						uncompounded,
						1,
						5,
						"injūr"
					);
				}
				if (f.Lemma1(word, lemmata) === "iūsiūrandum") {
					return SUBSTITUTES(
						uncompounded,
						"iūr",
						"jūr",
						"iūs",
						"jūs"
					);
				}
				if (f.Lemma1(word, lemmata) === "periūrus") {
					return REPLACE(
						uncompounded,
						4,
						1,
						"j"
					);
				}
				if ((
					/^i[aeiouyāēīōūȳ]/i.test(word)
					&& !phoneticExceptions["Vocalic initial i"].includes(f.Lemma1(word, lemmata))
					&& uncompounded !== "iīs"
				)) {
					return uncompounded.replace(/^i/i, 'j');
				}
				if ((
					["magnus", "magis", "maiestās", "maiōrēs"]
						.includes(f.Lemma1(word, lemmata))
					|| (
						f.NoMacra(
							f.Lemma1(word, lemmata)
						) === "aio"
						&& ['a','e','i','o','u','y'].includes(f.NoMacra(word, lemmata).substring(2, 3))
					)
				)) {
					return uncompounded.replaceAll('ai', 'ajj');
				}
				if (["malus", "male"]
					.includes(f.Lemma1(word, lemmata))
				) {
					return uncompounded.replaceAll('ei', 'ejj');
				}
				if (word.includes('eius') && word.replace('eius', 'is') === f.Lemma1(word, lemmata)) {
					return uncompounded.replace('eius', 'ejjus');
				}
				if (word.startsWith('-')) {
					return '';
				}
				return uncompounded;
			}

			return SUBSTITUTES(
				(
					'_'
					+ itojj(
						getPhoneticBeforeGeneralSubstitutions().toLowerCase()
					)
					+ '_'
				),
				"am_",
				"ã",
				"em_",
				"ẽ",
				"im_",
				"ĩ",
				"om_",
				"õ",
				"um_",
				"ũ",
				"ym_",
				"ỹ",
				"qu",
				"q",
				"ds",
				"ts",
				"z",
				"ds",
				"x",
				"cs",
				"bs",
				"ps",
				"bt",
				"pt",
				"ch",
				"χ",
				"ph",
				"φ",
				"rh",
				"r",
				"th",
				"θ",
				"ae",
				"à",
				"au",
				"â",
				"oe",
				"ò",
				"ë",
				"e",
				"ï",
				"i",
				"ü",
				"u",
				"ṻ",
				"ū",
				"á",
				"a",
				"é",
				"e",
				"í",
				"i",
				"ó",
				"o",
				"ú",
				"u",
				"ý",
				"y",
				"ḗ",
				"ē",
				"āns",
				"ãs",
				"ēns",
				"ẽs",
				"īns",
				"ĩs",
				"ōns",
				"õs",
				"ūns",
				"ũs",
				"ȳns",
				"ỹs",
				"ānf",
				"ãf",
				"ēnf",
				"ẽf",
				"īnf",
				"ĩf",
				"ōnf",
				"õf",
				"ūnf",
				"ũf",
				"ȳnf",
				"ỹf",
				"lectiient",
				"lectijent",
				"ōsuestr",
				"ōsvestr",
				"reiciav",
				"rejcjav",
				"k",
				"c",
				"eu",
				(
					phoneticExceptions["Diphthong eu"].includes(f.Lemma1(word, lemmata)) > 0
					? "€"
					: "eu"
				),
				"_eu",
				"_€",
				"_€nd",
				"eund",
				"_€nt",
				"eunt",
				"eu_",
				"€",
				"_",
				""
			)
		},
	EncliticPhonetic:
		(word, lemmata) => {
			return f.Enclitic(word, lemmata).replace('qu', 'q');
		},
	Phonetic:
		(word, lemmata) => {
			if (word === '') {
				return '_';
			}
			return (
				f.UncompoundedPhonetic(word, lemmata)
				+ f.EncliticPhonetic(word, lemmata)
			);
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
	// Returns the stress position: 3 for antepenult, 2 for penult, 1 for ultima, 0 for words of no syllables.
	Stress:
		(word, lemmata) => {
			// Eg ‘st’ has 0 syllables, so cannot have a stressed syllable.
			if (f.SyllableCount(word, lemmata) === 0) {
				return 0;
			}
			// Eg ‘-que’ is an enclitic, with the stress on the penult (the syllable before the enclitic!).
			if (word.startsWith('-')) {
				return 2;
			}
			// Monosyllables have only one syllable that could be stressed.
			if (f.SyllableCount(word, lemmata) === 1) {
				return 1;
			}
			// These other words are stressed on the ultima.
			if ([
				"abhinc",
				"adhūc",
				"Antiās",
				"Arpīnās",
				"Asprēnās",
				"Fīdēnās",
				"illāc",
				"illīc",
				"illinc",
				"illūc",
				"istīc",
				"Maecēnās",
				"nostrās",
				"posthāc",
				"Samnīs",
				"satin",
				"Suffēnās",
				"tantōn",
				"viden",
				"vidēn",
			].includes(word)) {
				return 1;
			}
			// Some irregular imperatives have ultima stress.
			if (f.Phonetic(word, lemmata).endsWith("dīc")
			|| f.Phonetic(word, lemmata).endsWith("dūc")
			|| f.Phonetic(word, lemmata).endsWith("fac")) {
				return 1;
			}
			// Any other word of two syllables.
			if (f.SyllableCount(word, lemmata) === 2) {
				return 2;
			}
			// “-inde” behaves as an enclitic, moving stress to the antepenult.
			if ([
				"deïnde",
				"exindē",
				"perinde",
				"proïndē",
				"subinde",
			].includes(word)) {
				return 3;
			}
			// Words with long penult are stressed on it.
			if (f.Scansion(word, lemmata)[f.SyllableCount(word, lemmata) - 2] === '–') {
				return 2
			}
			// Encliticized words have stress on the syllable before the enclitic (ie the penult).
			if (word.length !== f.Uncompounded(word, lemmata).length) {
				return 2;
			}
			// More encliticized words (not ending in the regular -que -ne -ve).
			if ([
				"agedum",
				"egomet",
				"ibidem",
				"meamet",
				"satine",
				"suamet",
				"ubinam",
			].includes(word)) {
				return 2;
			}
			// I use acutes to mark stress in words like ‘domínĭ’, to differentiate from homographs stressed on the antepenult.
			if (
				f.Uncompounded(word, lemmata).includes("á")
				|| f.Uncompounded(word, lemmata).includes("é")
				|| f.Uncompounded(word, lemmata).includes("í")
				|| f.Uncompounded(word, lemmata).includes("ó")
				|| f.Uncompounded(word, lemmata).includes("ú")
				|| f.Uncompounded(word, lemmata).includes("ý")
			) {
				return 2;
			}
			// More contractions such as ‘imperī’ from ‘imperium’, where I haven’t used an acute.
			if (
				(
					f.Lemma1(word, lemmata).endsWith("ius")
					|| f.Lemma1(word, lemmata).endsWith("ïus")
					|| f.Lemma1(word, lemmata).endsWith("ium")
					|| f.Lemma1(word, lemmata).endsWith("ius[prn]")
					|| f.Lemma1(word, lemmata).endsWith("ius[adj]")
					|| f.Lemma1(word, lemmata).endsWith("ius[n]")
					|| f.Lemma1(word, lemmata).endsWith("ium[prn]")
					|| f.Lemma1(word, lemmata).endsWith("ium[n]")
				)
				&& (
					reversestr(SUBSTITUTES(word,"á","a","é","e","í","i","ó","o","ú","u","ý","y"))
					== REPLACE(reversestr(SUBSTITUTES(f.Lemma1(word, lemmata),"[n]","","[prn]","","[adj]","")), 1, 3, "ī")
				)
			) {
				return 2;
			}
			// All other words are stressed on the antepenult.
			return 3;
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
			return (
					f.EcclesRhymeVowels(word, lemmata)
					+ '-'
					+ f.EcclesPerfectRhyme(word, lemmata)
						.replace(/[eiouyàâè€òùãẽĩõũỹ]/g, 'a')
					+ '-'
					+ reversestr(
						f.EcclesVowels(word, lemmata)
							.substring(0, f.EcclesVowels(word, lemmata).length - f.EcclesRhymeVowels(word, lemmata).length)
					)
					+ '-'
					+ reversestr(
						f.EcclesPhonetic(word, lemmata)
							.substring(0, f.EcclesPhonetic(word, lemmata).length - f.EcclesPerfectRhyme(word, lemmata).length)
					).replace(/[eiouyàâè€òùãẽĩõũỹ]/g, 'a')
					+ '-'
					+ word.toLowerCase()
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
			return f.Scansion(word, lemmata)
				.substring(0, f.SyllableCount(word, lemmata) - 1);
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
			return (
				SUBSTITUTES(
					f.RhymeVowels(word, lemmata)
					+ '-'
					+ SUBSTITUTES(
						f.NoMacra(f.PerfectRhyme(word, lemmata)),
						"a","a","e","a","i","a","o","a","u","a","y","a","à","a","â","a","è","a","€","a","ò","a","ù","a","ã","a","ẽ","a","ĩ","a","õ","a","ũ","a","ỹ","a"
					)
					+ '-'
					+ reversestr(
						f.AllVowels(word, lemmata).substring(0, f.SyllableCount(word, lemmata) - f.Stress(word, lemmata))
					)
					+ '-'
					+ SUBSTITUTES(
						reversestr(
							f.Phonetic(word, lemmata).substring(0, f.Phonetic(word, lemmata).length - f.PerfectRhyme(word, lemmata).length)
						),
						"a","a","e","a","i","a","o","a","u","a","y","a","à","a","â","a","è","a","€","a","ò","a","ù","a","ã","a","ẽ","a","ĩ","a","õ","a","ũ","a","ỹ","a"
					),
					"ā","azzzz","ē","ezzzz","ī","izzzz","ō","ozzzz","ū","uzzzz","ȳ","yzzzz","ã","azzzzzz","ẽ","ezzzzzz","ĩ","izzzzzz","õ","ozzzzzz","ũ","uzzzzzz","ỹ","yzzzzzz","à","azzzzzzzz","â","azzzzzzzzzzzz","è","ezzzzzzzz","€","ezzzzzzzzzzzz","ò","ozzzzzzzz","ù","uzzzzzzzz"
				)
				+ '-'
				+ word.toLowerCase()
				+ (word === word.toLowerCase() ? '/' : '')
			);
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
