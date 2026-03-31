////
//// This file is very long.
//// It is used from the HTML page, or can be run by itself in Node.
//// It has a section at the end that only runs in Node.
//// The Node-only section reads from a hardcoded filepath, writes to a second
//// hardcoded filepath, and compares the output to a third hardcoded filepath.
////
//// Contents:
//// - Schema of output data
//// - Constants and helper functions
//// - Object of functions replacing the fields in the `wordsform` sheet of the velut Excel file
//// - Same object of functions, but memoised
//// - Functions for building the output Json
//// - Node-only code
////


////
//// Schema of output data:
////

const wordsSchema = {
	Ord: 'int',
	Word: 'string',
	// Lemmata: 'string',
	Length: 'int',
	AllConsonants: 'string',
	// Uncompounded: 'string',
	// Phonetic: 'string',
	Scansion: 'string',
	ScansionWithElision: 'string',
	// IsFitForDactyl: 'int',
	// AllVowels: 'string',
	// SyllableCount: 'int',
	// Stress: 'int',
	// UltimaRhyme: 'string',
	RhymeVowels: 'string',
	PerfectRhyme: 'string',
	// RhymeConsonants: 'string',
	// Ultima: 'string',
	RhymeVowelsAndUltimaCoda: 'string',
	// EcclesPhonetic: 'string',
	// EcclesVowels: 'string',
	EcclesRhymeVowels: 'string',
	EcclesRhymeVowelsAndUltimaCoda: 'string',
	EcclesPerfectRhyme: 'string',
	EcclesSort: 'string',
	// LemmaCount: 'int',
	// Lemma1: 'string',
	// Lemma2: 'string',
	// Lemma3: 'string',
	// Lemma4: 'string',
	// Lemma5: 'string',
	LemmaArray: 'array',
	// IsLemma: 'int',
	// IsNonLemma: 'int',
	// DuplicateWords: 'string',
	// NewLemmata: 'string',
	NoMacra: 'string',
	NoMacraLowerCase: 'string',
	AlphOrderNoMacra: 'string',
	Sort: 'string',
	// RepeatWord: 'string',
};


////
//// Constants and helper functions:
////

const phoneticExceptions = {
	'Diphthong eu': [
		'Aegeus',
		'Andreus',
		'Atreus',
		'būleuta',
		'būleutērion',
		'Caeneus',
		'Deucaliōn',
		'Epimētheus',
		'Leucōn',
		'Leuconoē',
		'Theseus',
		'halipleumōn',
		'Morpheus',
		'Narseus',
		'Nȳseus',
		'Orpheus',
		'Pēleus',
		'Perseus',
		'Phorōneus',
		'Pīraeeus',
		'Pittheus',
		'proceleusmaticus',
		'Promētheus',
		'Prōteus',
		'Seleucīa',
		'Seleucus',
		'Sinōpeus',
		'toreuma',
		'zeugma',
		'Typhōeus',
		'Rhoeteus',
		'Patareus',
		'Eurystheus',
		'Lynceus',
		'Tēreus',
		'Phīneus',
		'Leucippus',
		'Erechtheus',
		'Enīpeus',
	],

	'Vocalic initial i': [
		'eō',
		'Iālysius',
		'Iālysus',
		'iambus',
		'Ianthē',
		'ianthinus',
		'Iāsōn',
		'Iāsonius',
		'Iāsonidēs',
		'Ïēsus',
		'Iobatēs',
		'Iōnia',
		'Iōnicus',
		'iōnicus',
		'Iōnius',
		'iōta',
		'iūlis',
		'Iūlus',
		'iūlus',
		'iynx',
		'Iambē',
		'iaspis',
		'iō',
	],
	// Short vowel + “bl” or short vowel + “br” usually gives a short syllable.
	// (The consonant cluster is called ‘mūta cum liquidā’.)
	// Words beginning with a prefix ‘ab’/‘ob’ in front of ‘l’/‘r’ have the prefix as a long syllable
	// because the syllable boundary is the morpheme boundary.
	// (Incidentally, this is not true for words with a prefix in front of a vowel: so ‘abarceō’ begins with a short syllable, a•bar•ce•ō.)
	// Words beginning with ‘abl’/‘abr’/‘obl’/‘obr’ where this is not a prefix should revert to the ‘mūta cum liquidā’ rule.
	// Listing them here helps distinguish them from the prefixed words that have the long syllable.
	// So: ‘fabrica’ & ‘labrum’ begin with a short syllable (fa•bri•ca, la•brum).
	// ‘abrādō’ & ‘obrutus’ begin with a long syllable (ab•rā•dō, ob•ru•tus).
	// ‘inobrutus’ likewise has a long second syllable (i•nob•ru•tus), as in Ovid Met. 7.356; and there’s inoblītā (i•nob•lī•tā) in Ovid Pont. 4.15.37.
	// ‘abra’ & ‘obrussa’ begin with a short syllable (a•bra, o•brus•sa).
	lemmataWithMutaCumLiquidaNotPrefix: ['abra', 'obrussa']
};

// Eg 'rāia' => 'rājja' because the “i” is consonantal.
function replaceIntervocalicI(text) {
	return `${text}`.replace(/(?<=[āēīōūȳ])i(?=[aeiouyāēīōūȳ])/gi, 'jj');
}
// Eg 'velut' => 'tulev'
function reverseString(text) {
	return `${text}`.split('').reverse().join('');
}

// Defining a value then emptying the array gives us IntelliSense without TypeScript :)
const existingWords = [{ word: 'string', lemmata: ['string'] }].filter(
	(_) => false
);
let allWordsOnlyWord = ['string'].filter((_) => false);

function addToWordsArray(word, lemmata, enclitic) {
	existingWords.push({ word, lemmata });
}

function clearWordsArray() {
	existingWords.length = 0;
}

// Constant used when a field would be the empty string, such as the consonants in a word of all vowels.
const EMPTY = '∅';
// Syllable length symbols.
const SHORT = '⏑';
const LONG = '–';

// A dactylic hexameter fits the regex /–(–|⏑⏑)–(–|⏑⏑)–(–|⏑⏑)–(–|⏑⏑)–⏑⏑–[–⏑]/
// Another way of writing that is /(––|–⏑⏑){4}–⏑⏑–[–⏑]/
// `allValidHexameters` is all the possible variations.
// However, the last syllable is excluded, because IsFitForDactyl
// ignores the last syllable of the word it tests,
// but this would need to be included in the line.
const allValidHexameters = (() => {
	const DACTYL = LONG + SHORT + SHORT;
	const SPONDEE = LONG + LONG;
	return [DACTYL, SPONDEE]
		.flatMap((foot) => [foot + DACTYL, foot + SPONDEE])
		.flatMap((foot) => [foot + DACTYL, foot + SPONDEE])
		.flatMap((foot) => [foot + DACTYL, foot + SPONDEE])
		.flatMap((foot) => [foot + DACTYL])
		.flatMap((foot) => [foot + LONG]);
})();

const memoisedData = {};

function memoise(func, functionName, word, lemmata, enclitic) {
	if (memoisedData[word]?.[functionName] === undefined) {
		const wordObject = { ...memoisedData[word] };
		wordObject[functionName] = func(word, lemmata, enclitic);
		memoisedData[word] = wordObject;
	}
	return memoisedData[word][functionName];
}

function clearMemoisationCache() {
	for (const key in memoisedData) {
		delete memoisedData[key];
	}
}


////
//// Functions replacing the fields in `wordsform` sheet:
////

const unmemoisedFuncs = {
	Ord: (word, lemmata, enclitic) => {
		return existingWords.length + 1;
	},
	Word: (word, lemmata, enclitic) => {
		return word;
	},
	Lemmata: (word, lemmata, enclitic) => {
		return lemmata;
	},
	Length: (word, lemmata, enclitic) => {
		return word.length;
	},
	AllConsonants: (word, lemmata, enclitic) => {
		const replaced = f.NoMacraLowerCase(word).replace(/[aeiouy]/gi, '');
		return replaced || '-';
	},
	Uncompounded: (word, lemmata, enclitic) => {
		if (['-ne', '-que', '-ve'].includes(word)) {
			return EMPTY;
		}
		if (f.Lemma1(word, lemmata, enclitic).endsWith('que')) {
			return word;
		}
		if (enclitic === 'unencliticized') {
			return word;
		}
		const wordMinusPossibleEnclitic = word.replace(/(ne|n|que|ve)$/, '');

		function removeAcutesAndDiaereses(word) {
			return word
				.replace(/á(?=[^aeiouyāēīōūȳ]*)$/, 'a')
				.replace(/é(?=[^aeiouyāēīōūȳ]*)$/, 'e')
				.replace(/í(?=[^aeiouyāēīōūȳ]*)$/, 'i')
				.replace(/ó(?=[^aeiouyāēīōūȳ]*)$/, 'o')
				.replace(/ú(?=[^aeiouyāēīōūȳ]*)$/, 'u')
				.replace(/ý(?=[^aeiouyāēīōūȳ]*)$/, 'y')
				.replace(/ḗ(?=[^aeiouyāēīōūȳ]*)$/, 'ē').replaceAll('ü', 'u');
		}
		return removeAcutesAndDiaereses(wordMinusPossibleEnclitic)
	},
	Enclitic: (word, lemmata, enclitic) => {
		if (enclitic === 'unencliticized') {
			return ''
		}
		if (enclitic === 'ne' & word.endsWith('n')) {
			return 'n'
		}
		return enclitic;
	},
	UncompoundedPhonetic: (word, lemmata, enclitic) => {
		function getPhoneticBeforeGeneralSubstitutions() {
			const uncompounded = f.Uncompounded(word, lemmata, enclitic);
			// Interjection ‘ai’ but not ‘ain’ (which is from aiō)
			if (uncompounded === 'ai' && f.Enclitic(word, lemmata, enclitic) !== 'n') {
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
			if (uncompounded === 'quoiās') {
				return 'qòjās';
			}
			if (uncompounded === 'dehinc') {
				return 'dènc';
			}
			if (['dein', 'deinde', 'proin', 'proindē'].includes(uncompounded)) {
				return uncompounded.replace('dein', 'dèn').replace('proin', 'pròn');
			}
			if (f.Lemma1(word, lemmata, enclitic) === 'praeeō') {
				return uncompounded.replaceAll('praei', 'prài');
			}
			if (f.Lemma1(word, lemmata, enclitic).startsWith('cui') ||
				f.Lemma1(word, lemmata, enclitic).startsWith('quis') ||
				f.Lemma1(word, lemmata, enclitic).startsWith('quī') ||
				f.Lemma1(word, lemmata, enclitic) === 'aliquis' ||
				f.Lemma1(word, lemmata, enclitic) === 'ecquis' ||
				f.Lemma1(word, lemmata, enclitic) === 'nesciōquis' ||
				f.Lemma1(word, lemmata, enclitic) === 'ūnusquisque') {
				return replaceIntervocalicI(uncompounded)
					.replaceAll('cuiā', 'cùjā')
					.replaceAll('cuiu', 'cùju')
					.replaceAll('cui', 'cù');
			}
			if (uncompounded.includes('huius')) {
				return replaceIntervocalicI(uncompounded).replaceAll('huius', 'hùjus');
			}
			if (f.NoMacra(word, lemmata, enclitic).includes('ngua') ||
				f.NoMacra(word, lemmata, enclitic).includes('ngue') ||
				f.NoMacra(word, lemmata, enclitic).includes('ngui') ||
				f.NoMacra(word, lemmata, enclitic).includes('nguo') ||
				f.NoMacra(word, lemmata, enclitic).includes('nguu')) {
				return uncompounded.replace('ngu', 'ngv');
			}
			if (f.Lemma1(word, lemmata, enclitic).includes('suād') ||
				f.Lemma1(word, lemmata, enclitic).includes('suās') ||
				f.Lemma1(word, lemmata, enclitic).includes('suāv')) {
				return uncompounded.replace('suā', 'svā');
			}
			if (word.startsWith('Eduard')) {
				return uncompounded.replace('Eduard', 'edvard');
			}
			if (word.startsWith('Osuald')) {
				return uncompounded.replace('Osuald', 'osvald');
			}
			if (f.Lemma1(word, lemmata, enclitic).toLowerCase().includes('suē')) {
				return uncompounded
					.replace('suē', 'svē')
					.replace('Suē', 'Svē')
					.replace('sue', 'sve')
					.replace('sui', 'svi')
					.replace('suī', 'svī')
					.replace('suu', 'svu');
			}
			if (f.Lemma1(word, lemmata, enclitic) === 'urgueō') {
				return uncompounded.replaceAll('urgu', 'urgv');
			}
			if (f.Lemma1(word, lemmata, enclitic).endsWith('iaceō') ||
				f.Lemma1(word, lemmata, enclitic).endsWith('iectō') ||
				f.Lemma1(word, lemmata, enclitic).endsWith('iaciō') ||
				f.Lemma1(word, lemmata, enclitic).endsWith('iectus') ||
				f.Lemma1(word, lemmata, enclitic).endsWith('iectē') ||
				[
					'abiciō',
					'adiciō',
					'circumiciō',
					'coiciō',
					'coniciō',
					'dēiciō',
					'disiciō',
					'ēiciō',
					'iniciō',
					'intericiō',
					'obiciō',
					'periciō',
					'praeiciō',
					'reiciō',
					'subiciō',
					'trāiciō',
					'obex',
					'subicēs',
				].includes(f.Lemma1(word, lemmata, enclitic))) {
				return uncompounded
					.replace('coiē', 'còiē')
					.replace('coie', 'còie')
					.replace('iēc', 'jēc')
					.replace('iec', 'jec')
					.replace('iac', 'jac')
					.replaceAll('bex', 'bjex')
					.replaceAll('ic', 'jic')
					.replaceAll('rej', 'rèj');
			}
			if (uncompounded.startsWith('coniū') ||
				uncompounded.startsWith('coniu')) {
				return uncompounded.replace('coni', 'conj');
			}
			if (uncompounded.startsWith('disiū') ||
				uncompounded.startsWith('disiu')) {
				return uncompounded.replace('disi', 'disj');
			}
			if (f.Lemma1(word, lemmata, enclitic) === 'iniugis' ||
				f.Lemma1(word, lemmata, enclitic) === 'biiugis' ||
				f.Lemma1(word, lemmata, enclitic) === 'biiugus' ||
				f.Lemma1(word, lemmata, enclitic) === 'subiugō') {
				return uncompounded.replaceAll('iug', 'jug');
			}
			if (uncompounded.startsWith('adiu') || uncompounded.startsWith('adiū')) {
				return uncompounded.replace('adi', 'adj');
			}
			if (uncompounded.startsWith('iniūr') || uncompounded.startsWith('iniūst')) {
				return uncompounded.replace('iniū', 'injū');
			}
			if (f.Lemma1(word, lemmata, enclitic) === 'iūsiūrandum') {
				return uncompounded.replaceAll('iū', 'jū');
			}
			if (f.Lemma1(word, lemmata, enclitic).startsWith('periūr')) {
				return uncompounded.replace('periūr', 'perjūr');
			}
			if (/^i[aeiouyāēīōūȳ]/i.test(word) &&
				!phoneticExceptions['Vocalic initial i'].includes(
					f.Lemma1(word, lemmata, enclitic)
				) &&
				uncompounded !== 'iīs') {
				return uncompounded.replace(/^i/i, 'j');
			}
			if (['magnus', 'magis', 'maiestās', 'maiōrēs'].includes(
				f.Lemma1(word, lemmata, enclitic)
			) ||
				(f.NoMacra(f.Lemma1(word, lemmata, enclitic)) === 'aio' &&
					['a', 'e', 'i', 'o', 'u', 'y'].includes(
						f.NoMacra(word, lemmata, enclitic).substring(2, 3)
					))) {
				return uncompounded.replaceAll('ai', 'ajj');
			}
			if (['malus', 'male'].includes(f.Lemma1(word, lemmata, enclitic))) {
				return uncompounded.replaceAll('ei', 'èj');
			}
			if (uncompounded.includes('eius')
				// &&
				// uncompounded.replace('eius', 'is') === f.Lemma1(word, lemmata, enclitic)
			) {
				return uncompounded.replace('eius', 'èjus');
			}
			if (lemmata.includes('dēsum')) {
				return uncompounded.replace('dees', 'dēs')
			}
			// ‘far’ is pronounced with geminate r, apparently.
			if (word === 'far') {
				return 'farr'
			}
			if (word.startsWith('-')) {
				return '';
			}
			return uncompounded;
		}

		return `_${replaceIntervocalicI(
			getPhoneticBeforeGeneralSubstitutions().toLowerCase()
		)}_`
			.replaceAll('am_', 'ã')
			.replaceAll('em_', 'ẽ')
			.replaceAll('im_', 'ĩ')
			.replaceAll('om_', 'õ')
			.replaceAll('um_', 'ũ')
			.replaceAll('ym_', 'ỹ')
			.replaceAll('qu', 'q')
			.replaceAll('ds', 'ts')
			.replaceAll('z', 'ds')
			.replaceAll('x', 'cs')
			.replaceAll('bs', 'ps')
			.replaceAll('bt', 'pt')
			.replaceAll('ch', 'χ')
			.replaceAll('ph', 'φ')
			.replaceAll('rh', 'r')
			.replaceAll('th', 'θ')
			.replaceAll('ae', 'à')
			.replaceAll('au', 'â')
			.replaceAll('oe', 'ò')
			.replaceAll('ë', 'e')
			.replaceAll('ï', 'i')
			.replaceAll('ü', 'u')
			.replaceAll('ṻ', 'ū')
			.replaceAll('á', 'a')
			.replaceAll('é', 'e')
			.replaceAll('í', 'i')
			.replaceAll('ó', 'o')
			.replaceAll('ú', 'u')
			.replaceAll('ý', 'y')
			.replaceAll('ḗ', 'ē')
			.replaceAll('āns', 'ãs')
			.replaceAll('ēns', 'ẽs')
			.replaceAll('īns', 'ĩs')
			.replaceAll('ōns', 'õs')
			.replaceAll('ūns', 'ũs')
			.replaceAll('ȳns', 'ỹs')
			.replaceAll('ānf', 'ãf')
			.replaceAll('ēnf', 'ẽf')
			.replaceAll('īnf', 'ĩf')
			.replaceAll('ōnf', 'õf')
			.replaceAll('ūnf', 'ũf')
			.replaceAll('ȳnf', 'ỹf')
			.replaceAll('lectiient', 'lectijent')
			.replaceAll('ōsuestr', 'ōsvestr')
			.replaceAll('reiciav', 'rejcjav')
			.replaceAll('k', 'c')
			.replaceAll(
				'eu',
				phoneticExceptions['Diphthong eu'].includes(f.Lemma1(word, lemmata, enclitic)) > 0
					? '€'
					: 'eu'
			)
			.replaceAll('_eu', '_€')
			.replaceAll('_€nd', 'eund')
			.replaceAll('_€nt', 'eunt')
			.replaceAll('eu_', '€')
			.replaceAll('_', '');
	},
	EncliticPhonetic: (word, lemmata, enclitic) => {
		return f.Enclitic(word, lemmata, enclitic).replace('qu', 'q');
	},
	Phonetic: (word, lemmata, enclitic) => {
		if (word === '') {
			return '_';
		}
		return (
			f.UncompoundedPhonetic(word, lemmata, enclitic) + f.EncliticPhonetic(word, lemmata, enclitic)
		);
	},
	Scansion: (word, lemmata, enclitic) => {
		const lemmaArray = f.LemmaArray(word, lemmata, enclitic)
		// Matches ‘abrogō’, ‘inobrutus’, ‘superabluō’, ‘abra’, etc, where the ‘mūta cum liquida’ consonant cluster
		// looks like it’s from a prefix and therefore would not make the preceding syllable short.
		// ‘abra’ does not in fact have a prefix, so is caught by `phoneticExceptions.lemmataWithMutaCumLiquidaNotPrefix`.
		const regexForMutaCumLiquidaPrefix = /(?<=^(ad|in|ex|super)?)(abl|abr|adr|obl|obr)/
		return (
			f
				.Phonetic(word, lemmata, enclitic)
				.replace(
					regexForMutaCumLiquidaPrefix,
					lemmaArray.some(l => 
						phoneticExceptions.lemmataWithMutaCumLiquidaNotPrefix.includes(l)
					) ? 'abr' : 'abb')
				.replace(/[eiouy]/g, 'a')
				.replace(/[ēīōūȳãẽĩõũỹàâ€èòùḗ]/g, 'ā')
				.replace(/bl|cl|cr|dr|fr|fl|gl|gr|pr|pl|tr|θl|θr|φl|φr|χl|χr/g, 'br')
				.replace(/br/g, 'b')
				.replace(/h/g, '')
				.replace(/c|d|f|g|j|k|l|m|n|p|q|r|s|t|v|φ|χ|θ/g, 'b')
				.replace(/z/g, 'bb')
				.replace(/abb/g, 'ā')
				.replace(/b/g, '')
				.replace(/a/g, SHORT)
				.replace(/ā/g, LONG) || EMPTY
		);
	},
	AllVowels: (word, lemmata, enclitic) => {
		const emptyIfNeeded =
			f.Scansion(word, lemmata, enclitic) === EMPTY || word.startsWith('-') ? EMPTY : '';
		return (
			emptyIfNeeded +
			f.Phonetic(word, lemmata, enclitic).replace(/[bcdfghjklmnpqrstvxzχφθ]/g, '')
		);
	},
	SyllableCount: (word, lemmata, enclitic) => {
		return f.AllVowels(word, lemmata, enclitic).replace(EMPTY, '').length;
	},
	// Returns the stress position: 3 for antepenult, 2 for penult, 1 for ultima, 0 for words of no syllables.
	// Note: if it’s possible for words of the same spelling and macronization to be stressed differently,
	// both this `Stress` function and the `replaceFormsOfAmbiguousStress` function in the Inflector may
	// need to be updated to reflect this.
	Stress: (word, lemmata, enclitic) => {
		// Eg ‘st’ has 0 syllables, so cannot have a stressed syllable.
		if (f.SyllableCount(word, lemmata, enclitic) === 0) {
			return 0;
		}
		// Eg ‘-que’ is an enclitic, with the stress on the penult (the syllable before the enclitic!).
		if (word.startsWith('-')) {
			return 2;
		}
		// Monosyllables have only one syllable that could be stressed.
		if (f.SyllableCount(word, lemmata, enclitic) === 1) {
			return 1;
		}
		// These other words are stressed on the ultima.
		if (
			[
				'abhinc',
				'adhūc',
				'Antiās',
				'Arpīnās',
				'Asprēnās',
				'Fīdēnās',
				'illāc',
				'illīc',
				'illinc',
				'illūc',
				'istīc',
				'Maecēnās',
				'nostrās',
				'posthāc',
				'potin',
				'Samnīs',
				'satin',
				'Suffēnās',
				'tantōn',
				'viden',
				'vidēn',
			].includes(word)
		) {
			return 1;
		}
		// Some irregular imperatives have ultima stress.
		if (
			f.Phonetic(word, lemmata, enclitic).endsWith('dīc') ||
			f.Phonetic(word, lemmata, enclitic).endsWith('dūc') ||
			f.Phonetic(word, lemmata, enclitic).endsWith('fac')
		) {
			return 1;
		}
		// Any other word of two syllables.
		if (f.SyllableCount(word, lemmata, enclitic) === 2) {
			return 2;
		}
		// “-inde” behaves as an enclitic, moving stress to the antepenult.
		if (['deïnde', 'exindē', 'perinde', 'proïndē', 'subinde'].includes(word)) {
			return 3;
		}
		// Words with long penult are stressed on it.
		if (
			f.Scansion(word, lemmata, enclitic)[f.SyllableCount(word, lemmata, enclitic) - 2] === LONG
		) {
			return 2;
		}
		// Encliticized words have stress on the syllable before the enclitic (ie the penult).
		if (word.length !== f.Uncompounded(word, lemmata, enclitic).length) {
			return 2;
		}
		// More encliticized words (not ending in the regular -que -ne -ve).
		if (
			[
				'agedum',
				'egomet',
				'ibidem',
				'meamet',
				'satine',
				'suamet',
				'ubinam',
			].includes(word)
		) {
			return 2;
		}
		// I use acutes to mark stress in words like ‘domínī’, to differentiate from homographs stressed on the antepenult.
		// This won’t match Rhódane, which *is* stressed on the antepenult.
		if (
			/[áéíóúý][^aeiouyāēīōūȳ]*[aeiouyāēīōūȳ]?[^aeiouyāēīōūȳ]*$/i.test(
				f.Uncompounded(word, lemmata, enclitic)
			)
		) {
			return 2;
		}
		// More contractions such as ‘imperī’ from ‘imperium’, where I haven’t used an acute.
		if (
			(f.Lemma1(word, lemmata, enclitic).endsWith('ius') ||
				f.Lemma1(word, lemmata, enclitic).endsWith('ïus') ||
				f.Lemma1(word, lemmata, enclitic).endsWith('ium') ||
				f.Lemma1(word, lemmata, enclitic).endsWith('ius[prn]') ||
				f.Lemma1(word, lemmata, enclitic).endsWith('ius[adj]') ||
				f.Lemma1(word, lemmata, enclitic).endsWith('ius[n]') ||
				f.Lemma1(word, lemmata, enclitic).endsWith('ium[prn]') ||
				f.Lemma1(word, lemmata, enclitic).endsWith('ium[n]')) &&
			word
				.replaceAll('á', 'a')
				.replaceAll('é', 'e')
				.replaceAll('í', 'i')
				.replaceAll('ó', 'o')
				.replaceAll('ú', 'u')
				.replaceAll('ý', 'y') ===
				f
					.Lemma1(word, lemmata, enclitic)
					.replace(/\[[^\]]+\]/, '')
					.replace(/...$/, 'ī')
		) {
			return 2;
		}
		// Words such as ‘audiī’ & ‘petiit’ are contractions of verbs (‘audīvī’, ‘petīvit’)
		// and are therefore stressed on the penult.
		// But if the verb is derived from ‘eō’ (eg ‘abiī’, ‘ambiī’, ‘interiit’, ‘nequiī’, ‘vēniit’)
		// the stress is on the antepenult, as normal.
		// In these words, the -īv- forms developed from the -i- forms, not vice versa.
		// But see https://latin.stackexchange.com/questions/9363/how-do-we-know-how-i%C4%AB-and-iit-perfects-were-stressed
		// In the regex, the lookbehinds stop forms of lemmata ending in ‘eō’ or ‘ambiō’ from being given penult stress.
		// The (\[.+\])? part is there because lemmata in velut can have bracketed information at the end.
		if (f.LemmaArray(word, lemmata, enclitic).some(lemma => /(?<!e)(?<!ambi)(?<!sili)ō(\[.+\])?$/.test(lemma))
			&& (word.endsWith('iī') || word.endsWith('iit'))
		) {
			return 2;
		}
		// All other words are stressed on the antepenult.
		return 3;
	},
	UltimaRhyme: (word, lemmata, enclitic) => {
		if (f.SyllableCount(word, lemmata, enclitic) === 0) {
			return f.Phonetic(word, lemmata, enclitic);
		}
		const ultimaVowel = f.AllVowels(word, lemmata, enclitic).at(-1);
		const lastIndex = `${f.Phonetic(word, lemmata, enclitic)}`.lastIndexOf(ultimaVowel);
		return `${f.Phonetic(word, lemmata, enclitic)}`.substring(lastIndex);
	},
	RhymeVowels: (word, lemmata, enclitic) => {
		if (f.Scansion(word, lemmata, enclitic) === EMPTY) {
			return EMPTY;
		}
		return f
			.AllVowels(word, lemmata, enclitic)
			.substring(f.SyllableCount(word, lemmata, enclitic) - f.Stress(word, lemmata, enclitic));
	},
	PerfectRhyme: (word, lemmata, enclitic) => {
		if (word.startsWith('-') || f.Stress(word, lemmata, enclitic) === 0) {
			return f.Phonetic(word, lemmata, enclitic);
		}
		const rhymeVowels = f.RhymeVowels(word, lemmata, enclitic).split('');
		// Subtract syllables from the end until the rhyme-vowels are used up.
		// Eg vocābulōrũ => vocābul
		let wordMinusRhyme = rhymeVowels.reduceRight((substring, vowel) => {
			return substring.substring(0, substring.lastIndexOf(vowel));
		}, f.Phonetic(word, lemmata, enclitic));
		// Remove this from the initial word to give the syllables that were subtracted in the `reduceRight`.
		// Eg vocābulōrũ - vocābul => ōrũ
		return f.Phonetic(word, lemmata, enclitic).replace(wordMinusRhyme, '');
	},
	RhymeConsonants: (word, lemmata, enclitic) => {
		return (f.PerfectRhyme(word, lemmata, enclitic) + '.')
			.replace(/[€āàâeēiīoōóòuūùyȳ]/g, 'a')
			.replace(/[ãẽĩõũỹ]f/g, 'anf')
			.replace(/[ãẽĩõũỹ]s/g, 'ans')
			.replace(/[ãẽĩõũỹ]/g, 'am')
			.replace('.', '');
	},
	Ultima: (word, lemmata, enclitic) => {
		if (f.Stress(word, lemmata, enclitic) === 2) {
			return '2 ' + f.UltimaRhyme(word, lemmata, enclitic);
		}
		return f.UltimaRhyme(word, lemmata, enclitic);
	},
	RhymeVowelsAndUltimaCoda: (word, lemmata, enclitic) => {
		if (f.Stress(word, lemmata, enclitic) === 0) {
			return f.UltimaRhyme(word, lemmata, enclitic);
		}

		return (
			f.RhymeVowels(word, lemmata, enclitic) + f.UltimaRhyme(word, lemmata, enclitic).substring(1)
		);
	},
	EcclesPhonetic: (word, lemmata, enclitic) => {
		return `${f.Phonetic(word, lemmata, enclitic)}.`
			.replace(/ā/g, 'a')
			.replace(/ē/g, 'e')
			.replace(/ī/g, 'i')
			.replace(/ō/g, 'o')
			.replace(/ū/g, 'u')
			.replace(/ȳ/g, 'y')
			.replaceAll('ihi', 'iki')
			.replaceAll('òè', 'ojej')
			.replaceAll('à', 'e')
			.replaceAll('è', 'ej')
			.replaceAll('ò', 'e')
			.replaceAll('ù', 'uj')
			.replaceAll('y', 'i')
			.replaceAll('ã.', 'am')
			.replaceAll('ẽ.', 'em')
			.replaceAll('ĩ.', 'im')
			.replaceAll('õ.', 'om')
			.replaceAll('ũ.', 'um')
			.replaceAll('ỹ.', 'ym')
			.replaceAll('ã', 'an')
			.replaceAll('ẽ', 'en')
			.replaceAll('ĩ', 'in')
			.replaceAll('õ', 'on')
			.replaceAll('ũ', 'un')
			.replaceAll('ỹ', 'yn')
			.replaceAll('χ', 'c')
			.replaceAll('φ', 'f')
			.replaceAll('θ', 't')
			.replaceAll('h', '')
			.replaceAll('.', '');
	},
	EcclesVowels: (word, lemmata, enclitic) => {
		const emptyIfNeeded =
			f.Scansion(word, lemmata, enclitic) === EMPTY || word.startsWith('-') ? EMPTY : '';
		return (
			emptyIfNeeded +
			f.EcclesPhonetic(word, lemmata, enclitic).replace(/[bcdfghjklmnpqrstvxz]/g, '')
		);
	},
	EcclesRhymeVowels: (word, lemmata, enclitic) => {
		if (f.Scansion(word, lemmata, enclitic) === EMPTY) {
			return EMPTY;
		}
		return f
			.EcclesVowels(word, lemmata, enclitic)
			.substring(f.SyllableCount(word, lemmata, enclitic) - f.Stress(word, lemmata, enclitic));
	},
	EcclesRhymeVowelsAndUltimaCoda: (word, lemmata, enclitic) => {
		if (f.Scansion(word, lemmata, enclitic) === EMPTY) {
			return EMPTY;
		}
		const phonetic = f.EcclesPhonetic(word, lemmata, enclitic);
		const rhymeVowels = f.EcclesRhymeVowels(word, lemmata, enclitic);
		const ultimaVowel = rhymeVowels.substring(rhymeVowels.length - 1);
		const ultimaVowelIndex = phonetic.lastIndexOf(ultimaVowel);
		return rhymeVowels + phonetic.substring(ultimaVowelIndex + 1);
	},
	EcclesPerfectRhyme: (word, lemmata, enclitic) => {
		if (word.startsWith('-') || f.Stress(word, lemmata, enclitic) === 0) {
			f.EcclesPhonetic(word, lemmata, enclitic);
		}
		const rhymeVowels = f.EcclesRhymeVowels(word, lemmata, enclitic).split('');
		// Subtract syllables from the end until the rhyme-vowels are used up.
		// Eg vocabulorum => vocabul
		let wordMinusRhyme = rhymeVowels.reduceRight((substring, vowel) => {
			return substring.substring(0, substring.lastIndexOf(vowel));
		}, f.EcclesPhonetic(word, lemmata, enclitic));
		// Remove this from the initial word to give the syllables that were subtracted in the `reduceRight`.
		// Eg vocabulorum - vocabul => orum
		return f.EcclesPhonetic(word, lemmata, enclitic).replace(wordMinusRhyme, '');
	},
	EcclesSort: (word, lemmata, enclitic) => {
		return (
			(
				(f.EcclesRhymeVowels(word, lemmata, enclitic) === EMPTY
					? ''
					: f.EcclesRhymeVowels(word, lemmata, enclitic)) +
				'-' +
				f
					.EcclesPerfectRhyme(word, lemmata, enclitic)
					.replace(/[eiouyàâè€òùãẽĩõũỹ]/g, 'a') +
				'-' +
				reverseString(
					f
						.EcclesVowels(word, lemmata, enclitic)
						.substring(
							0,
							f.EcclesVowels(word, lemmata, enclitic).length -
								f.EcclesRhymeVowels(word, lemmata, enclitic).length
						)
				) +
				'-' +
				reverseString(
					f
						.EcclesPhonetic(word, lemmata, enclitic)
						.substring(
							0,
							f.EcclesPhonetic(word, lemmata, enclitic).length -
								f.EcclesPerfectRhyme(word, lemmata, enclitic).length
						)
				).replace(/[eiouyàâè€òùãẽĩõũỹ]/g, 'a') +
				'-' +
				word.toLowerCase()
			)
				.replaceAll('ā', 'azz')
				.replaceAll('ē', 'ezz')
				.replaceAll('ḗ', 'ezz')
				.replaceAll('ī', 'izz')
				.replaceAll('ō', 'ozz')
				.replaceAll('ū', 'uzz')
				.replaceAll('ȳ', 'yzz')
				.replaceAll('ã', 'azzz')
				.replaceAll('ẽ', 'ezzz')
				.replaceAll('ĩ', 'izzz')
				.replaceAll('õ', 'ozzz')
				.replaceAll('ũ', 'uzzz')
				.replaceAll('ỹ', 'yzzz')
				.replaceAll('à', 'azzzz')
				.replaceAll('â', 'azzzzz')
				.replaceAll('è', 'ezzzz')
				.replaceAll('€', 'ezzzzz')
				.replaceAll('ò', 'ozzzz')
				.replaceAll('ù', 'uzzzz') + (word === word.toLowerCase() ? '/' : '')
		);
	},
	LemmaCount: (word, lemmata, enclitic) => {
		return f.LemmaArray(word, lemmata, enclitic).length;
	},
	Lemma1: (word, lemmata, enclitic) => {
		return f.LemmaArray(word, lemmata, enclitic)[0];
	},
	Lemma2: (word, lemmata, enclitic) => {
		return f.LemmaArray(word, lemmata, enclitic)[1] || null;
	},
	Lemma3: (word, lemmata, enclitic) => {
		return f.LemmaArray(word, lemmata, enclitic)[2] || null;
	},
	Lemma4: (word, lemmata, enclitic) => {
		return f.LemmaArray(word, lemmata, enclitic)[3] || null;
	},
	Lemma5: (word, lemmata, enclitic) => {
		return f.LemmaArray(word, lemmata, enclitic)[4] || null;
	},
	ScansionWithElision: (word, lemmata, enclitic) => {
		if (!'aeiouyāēīōūӯãẽĩõũỹàâé€òù'.includes(f.UltimaRhyme(word, lemmata, enclitic))) {
			return f.Scansion(word, lemmata, enclitic);
		}
		if (f.SyllableCount(word, lemmata, enclitic) === 1) {
			return EMPTY;
		}
		return f
			.Scansion(word, lemmata, enclitic)
			.substring(0, f.SyllableCount(word, lemmata, enclitic) - 1);
	},
	IsFitForDactyl: (word, lemmata, enclitic) => {
		const scansionWithElision = f.ScansionWithElision(word, lemmata, enclitic);
		if (scansionWithElision === EMPTY) {
			return 1;
		}
		const scansionWithoutElision = f.Scansion(word, lemmata, enclitic);
		const phonetic = f.Phonetic(word, lemmata, enclitic);
		const endsWithConsonant = scansionWithElision === scansionWithoutElision;
		const endsWithShortVowelConsonant =
			/[aeiouy].$/.test(phonetic) && endsWithConsonant;

		// return endsWithShortVowelConsonant;
		const scansionToFit = endsWithShortVowelConsonant
			? scansionWithElision.substring(0, f.SyllableCount(word, lemmata, enclitic) - 1)
			: scansionWithElision;

		if (
			allValidHexameters.some((hexameter) => {
				return hexameter.includes(scansionToFit);
			})
		) {
			// return `IFFD true endsWithShortVowelConsonant ${endsWithShortVowelConsonant} Phonetic ${phonetic} Scansion ${scansionWithoutElision}`;
			return 1;
		}
		// return `IFFD false endsWithShortVowelConsonant ${endsWithShortVowelConsonant} Phonetic ${phonetic} Scansion ${scansionWithoutElision}`;
		return 0;
	},
	LemmaArray: (word, lemmata, enclitic) => {
		return lemmata.split(' ');
	},
	IsLemma: (word, lemmata, enclitic) => {
		return f.LemmaArray(word, lemmata, enclitic).some((lemma) => {
			return lemma.replace(/\[[^\]]+\]/, '') === word;
		})
			? 1
			: 0;
	},
	IsNonLemma: (word, lemmata, enclitic) => {
		return f.LemmaArray(word, lemmata, enclitic).some((lemma) => {
			return lemma.replace(/\[[^\]]+\]/, '') !== word;
		})
			? 1
			: 0;
	},
	DuplicateWords: (word, lemmata, enclitic) => {
		const duplicateFound = existingWords.find((record) => record.word === word);
		if (duplicateFound) {
			if (JSON.stringify(duplicateFound.lemmata) === JSON.stringify(lemmata)) {
				console.error(
					`Duplicate found for ${word} with matching lemmata — please delete the duplicate`
				);
				return word;
			}
			if (
				lemmata.some(
					(lemmaInNewRecord) =>
						!duplicateFound.lemmata.includes(lemmaInNewRecord)
				)
			) {
				console.error(
					`Duplicate found for ${word} with new lemmata [${lemmata}] that are not in [${duplicateFound.lemmata}] — please merge two records`
				);
				return word;
			}
			console.error(
				`Duplicate found for ${word} with lemmata [${lemmata}] that match existing lemmata [${duplicateFound.lemmata}] — please delete the duplicate`
			);
			return word;
		}
		return null;
	},
	NewLemmata: (word, lemmata, enclitic) => {
		// I’m not going to write something useful for this.
		// In the Excel file, this column checks whether lemmata are missing from
		// a sheet called `lemmata` — but that sheet cannot be replicated here.
		return '';
	},
	NoMacra: (word, lemmata, enclitic) => {
		// Function from https://ricardometring.com/javascript-replace-special-characters
		return word
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/-/g, '');
	},
	NoMacraLowerCase: (word, lemmata, enclitic) => {
		return f.NoMacra(word).toLowerCase();
	},
	AlphOrderNoMacra: (word, lemmata, enclitic) => {
		return f.NoMacraLowerCase(word, lemmata, enclitic).split('').sort().join('');
	},
	Sort: (word, lemmata, enclitic) => {
		return (
			(
				(f.RhymeVowels(word, lemmata, enclitic) === EMPTY
					? ''
					: f.RhymeVowels(word, lemmata, enclitic)) +
				'-' +
				f
					.NoMacra(f.PerfectRhyme(word, lemmata, enclitic))
					.replaceAll('a', 'a')
					.replaceAll('e', 'a')
					.replaceAll('i', 'a')
					.replaceAll('o', 'a')
					.replaceAll('u', 'a')
					.replaceAll('y', 'a')
					.replaceAll('à', 'a')
					.replaceAll('â', 'a')
					.replaceAll('è', 'a')
					.replaceAll('€', 'a')
					.replaceAll('ò', 'a')
					.replaceAll('ù', 'a')
					.replaceAll('ã', 'a')
					.replaceAll('ẽ', 'a')
					.replaceAll('ĩ', 'a')
					.replaceAll('õ', 'a')
					.replaceAll('ũ', 'a')
					.replaceAll('ỹ', 'a') +
				'-' +
				reverseString(
					f
						.AllVowels(word, lemmata, enclitic)
						.substring(
							0,
							f.SyllableCount(word, lemmata, enclitic) - f.Stress(word, lemmata, enclitic)
						)
				) +
				'-' +
				reverseString(
					f
						.Phonetic(word, lemmata, enclitic)
						.substring(
							0,
							f.Phonetic(word, lemmata, enclitic).length -
								f.PerfectRhyme(word, lemmata, enclitic).length
						)
				)
					.replaceAll('a', 'a')
					.replaceAll('e', 'a')
					.replaceAll('i', 'a')
					.replaceAll('o', 'a')
					.replaceAll('u', 'a')
					.replaceAll('y', 'a')
					.replaceAll('à', 'a')
					.replaceAll('â', 'a')
					.replaceAll('è', 'a')
					.replaceAll('€', 'a')
					.replaceAll('ò', 'a')
					.replaceAll('ù', 'a')
					.replaceAll('ã', 'a')
					.replaceAll('ẽ', 'a')
					.replaceAll('ĩ', 'a')
					.replaceAll('õ', 'a')
					.replaceAll('ũ', 'a')
					.replaceAll('ỹ', 'a')
			)
				.replaceAll('ā', 'azz')
				.replaceAll('ē', 'ezz')
				.replaceAll('ī', 'izz')
				.replaceAll('ō', 'ozz')
				.replaceAll('ū', 'uzz')
				.replaceAll('ȳ', 'yzz')
				.replaceAll('ã', 'azzz')
				.replaceAll('ẽ', 'ezzz')
				.replaceAll('ĩ', 'izzz')
				.replaceAll('õ', 'ozzz')
				.replaceAll('ũ', 'uzzz')
				.replaceAll('ỹ', 'yzzz')
				.replaceAll('à', 'azzzz')
				.replaceAll('â', 'azzzzz')
				.replaceAll('è', 'ezzzz')
				.replaceAll('€', 'ezzzzz')
				.replaceAll('ò', 'ozzzz')
				.replaceAll('ù', 'uzzzz') +
			'-' +
			word.toLowerCase() +
			(word === word.toLowerCase() ? '/' : '')
		);
	},
	RepeatWord: (word, lemmata, enclitic) => {
		return word;
	},
};


////
//// Object with the same shape as `unmemoisedFuncs`, but all the functions are memoised:
////

const wordsformFunctionsMemoised = Object.entries(unmemoisedFuncs).reduce(
	(memoisedFuncs, [currentFuncName, currentFunc]) => {
		memoisedFuncs[currentFuncName] = (word, lemmata, enclitic) =>
			memoise(currentFunc, currentFuncName, word, lemmata, enclitic);
		return memoisedFuncs;
	},
	{}
);

// Aliases
const f = wordsformFunctionsMemoised;
const wordsformFunctions = wordsformFunctionsMemoised; // Used in tests.js.


////
//// Functions for building the output Json:
////

//// `outputAsArray` gets modified by `convertInputToOutputData` inside `generateJson`
//// and either gets displayed in the second text-area by `displayOutput` (in web.js)
//// or gets written to a file (in the Node-only section).
let outputAsArray = [];

function output(jsonObject) {
	function push(text) {
		outputAsArray.push(text);
	}
	push('{');
	//// Convert the object to an array of key–value pairs.
	const asEntries = Object.entries(jsonObject);
	let i = 0;
	//// Key–value pairs before the last pair is output as `"key": "value",` with a comma.
	for (; i < asEntries.length - 1; i++) {
		push(`"${asEntries[i][0]}": ${JSON.stringify(asEntries[i][1])},`);
	}
	//// The last key–value pair is output as `"key": "value"` without the trailing comma.
	for (; i < asEntries.length; i++) {
		push(`"${asEntries[i][0]}": ${JSON.stringify(asEntries[i][1])}`);
	}
	push('}');
}

const functionNames = Object.keys(wordsSchema);

function convertInputToOutputData(allInputRows) {
	outputAsArray.length = 0; // Clear the output in case there’s anything from previous runs.
	clearMemoisationCache(); // Clear the memoisation cache because we don’t have infinite memory.
	const countRows = allInputRows.length;

	//// For each line of values in the input...
	for (let i = 0; i < countRows; i++) {
		//// Skip empty lines.
		if (allInputRows[i] === '') {
			continue;
		}

		const inputRow = allInputRows[i].trim();
		//// The first appearance of whitespace in the row is where the split is between the word & lemmata.
		const positionOfWordLemmataSplit = /\s/.exec(inputRow)?.index;

		if (positionOfWordLemmataSplit) {
			const word = inputRow.substring(0, positionOfWordLemmataSplit).trim();
			const lemmataAndEnclitic = inputRow.substring(positionOfWordLemmataSplit).trim().split('\t');
			const lemmata = lemmataAndEnclitic[0]
			const enclitic = lemmataAndEnclitic[1]
			const resultsForLine = {};

			functionNames.forEach((functionName) => {
				resultsForLine[functionName] = f[functionName](word, lemmata, enclitic);
			});

			output(resultsForLine);
			addToWordsArray(word, lemmata, enclitic);
			clearMemoisationCache();
		} else {
			console.error(
				`Parsing error: Cannot pull a word and lemmata out of ${inputRow}`
			);
		}
	}
	return outputAsArray;
}


////
//// Code that only runs in Node:
//// (Divided into functions for easier commenting-out when debugging.)
////

if (typeof require !== 'undefined') {

	const fs = require('fs');

	function runAllWords() {

		//// Input data look like "vocābulōrum\tvocābulum\rexcellentium\texcellēns excellō\r"
		const inputFileUrl = 'C:/Users/Duncan Ritchie/Documents/Code/velut/velutSideAssets/Json/output-from-lemmata-collator.txt';
		//// Output data are generated in batches & each batch is written to a file.
		//// This allows me to track the output in Git without tracking a huge file.
		function getOutputFileUrlForBatch(batchNumber) {
			return `C:/Users/Duncan Ritchie/Documents/Code/velut/velutSideAssets/Json/words-from-generator_mongo_batch${batchNumber}.json`;
		}
		const batchSize = 50000;
		//// The output batches are concatenated into one file, for Git to ignore and me to import to MongoDB.
		const outputFileUrl = 'C:/Users/Duncan Ritchie/Documents/Code/velut/velutSideAssets/Json/words-from-generator_mongo.json';
		//// For regression testing, I have a file of expected output, that the actual output is compared against.
		const expectedOutputFileUrl = 'C:/Users/Duncan Ritchie/Documents/Code/velut/velutSideAssets/Json/expected-words_mongo.json';
		//// Basic statistics are appended to this file when the Word Data Generator runs.
		//// The Inflector has similar code.
		const logFolderUrl =
			'C:/Users/Duncan Ritchie/Documents/Code/velut/velutSideAssets/data-updater-log/';
		const logFileUrl = logFolderUrl + 'log.txt';

		try {
			// Overwritten in generateOutputAndSaveInBatches with the correct array length (batch count)
			let batchFilepaths = Array(42).fill(null).map((_, index) => getOutputFileUrlForBatch(index));

			function generateOutputAndSaveInBatches() {
				console.time('generatingOutput');

				const data = fs.readFileSync(inputFileUrl, 'utf8');
				const inputRows = data.split('\n');
				const batchCount = Math.ceil(inputRows.length / batchSize);

				//// This needs to be set before the data are generated, so encliticized words are handled correctly.
				allWordsOnlyWord = inputRows
					.map((row) => row.trim().replace(/\s.*/, ''));

				//// Eg [1,2,3,4,5,6,7], 2 => [[1,2],[3,4],[5,6],[7]]
				// from https://stackoverflow.com/a/54029307
				function splitArrayIntoBatches(array, size) {
					return array.length > size
						? [array.slice(0, size), ...splitArrayIntoBatches(array.slice(size), size)]
						: [array];
				}
				const inputRowsBatched = splitArrayIntoBatches(inputRows, batchSize);

				batchFilepaths = inputRowsBatched.map((batch, index, array) => {
					console.log('Generating batch', index, 'of', batchCount);
					const outputBatch = convertInputToOutputData(batch).join('\n');

					const filepath = getOutputFileUrlForBatch(index);
					fs.writeFileSync(filepath, outputBatch);
					return filepath;
				});

				console.log(`Data have been generated for all ${inputRows.length} words!`);

				console.timeEnd('generatingOutput');

				//// Record the word count in a log file, so it’s easy for me to see how velut has grown over time.
				console.time('loggingLemmaCount');
				if (!fs.existsSync(logFolderUrl)) {
					fs.mkdirSync(logFolderUrl);
				}
				if (!fs.existsSync(logFileUrl)) {
					fs.writeFileSync(logFileUrl, '');
				}
				fs.appendFileSync(
					logFileUrl,
					`Date: ${new Date()}, Words: ${inputRows.length}\n`,
				);
				console.timeEnd('loggingLemmaCount');
			}

			function concatenateBatches() {
				console.time('concatenatingOutput');
				fs.writeFileSync(outputFileUrl, '');

				batchFilepaths.forEach((filename, index) => {
					console.log('Concatenating batch', index);
					const newBatch = fs.readFileSync(filename, 'utf8') + '\n';
					fs.appendFileSync(outputFileUrl, newBatch);
				});

				console.timeEnd('concatenatingOutput');
			}

			function checkAgainstExpected() {
				console.time('checkingOutput');

				const outputRows = fs.readFileSync(outputFileUrl, 'utf8').split('\n');

				const expectedOutput = fs.readFileSync(expectedOutputFileUrl, 'utf8');
				const expectedOutputRows = expectedOutput.split('\n');

				let errorCount = 0;
				let lastWordSeen = '';
				for (let i = 0; i < outputRows.length && i < expectedOutputRows.length; i++) {
					if (outputRows[i].startsWith('"Word":')) {
						lastWordSeen = outputRows[i];
					}

					if (outputRows[i] === expectedOutputRows[i]) {
						// console.log('Yay!');
					} else {
						// if (
						// 	// !outputRows[i].startsWith('"Scansion"')
						// 	!lastWordSeen.startsWith('"Word": "coic') &&
						// 	!lastWordSeen.startsWith('"Word": "caelit') &&
						// 	!lastWordSeen.startsWith('"Word": "coiēns"') &&
						// 	!lastWordSeen.startsWith('"Word": "conlātaque"') &&
						// 	!lastWordSeen.startsWith('"Word": "deiēns"') &&
						// 	!lastWordSeen.startsWith('"Word": "dein"') &&
						// 	!lastWordSeen.startsWith('"Word": "deinde"') &&
						// 	!lastWordSeen.startsWith('"Word": "hymenaeus"') &&
						// 	!lastWordSeen.startsWith('"Word": "ignōrātiō') &&
						// 	!lastWordSeen.startsWith('"Word": "introiēns"') &&
						// 	!lastWordSeen.startsWith('"Word": "iūsiūrandum"') &&
						// 	!lastWordSeen.startsWith('"Word": "īnspectemque"') &&
						// 	!lastWordSeen.startsWith('"Word": "nūmin') &&
						// 	!lastWordSeen.includes('nf') &&
						// 	!lastWordSeen.includes('ifer') &&
						// 	!lastWordSeen.includes('iger') &&
						// 	!outputRows[i].startsWith('"LemmaCount"') &&
						// 	!outputRows[i].startsWith('"IsFitForDactyl"') &&
						// 	!outputRows[i].startsWith('"Uncompounded"')
						// 	// !outputRows[i].startsWith('"RhymeConsonants"')
						// ) {
						errorCount++;
						console.error({
							message: `Mismatch at line ${i}`,
							excelSays: expectedOutputRows[i],
							javascriptSays: outputRows[i],
							for: lastWordSeen,
						});
						// }
					}
				}
				console.warn(`There were ${errorCount} mismatches.`);

				console.timeEnd('checkingOutput');
			}

			generateOutputAndSaveInBatches();
			concatenateBatches();
			// checkAgainstExpected();
		} catch (err) {
			console.error(err);
		}
	}

	runAllWords();
}
