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
	Uncompounded: 'string',
	Phonetic: 'string',
	Scansion: 'string',
	ScansionWithElision: 'string',
	IsFitForDactyl: 'int',
	AllVowels: 'string',
	SyllableCount: 'int',
	Stress: 'int',
	UltimaRhyme: 'string',
	RhymeVowels: 'string',
	PerfectRhyme: 'string',
	RhymeConsonants: 'string',
	// Ultima: 'string',
	RhymeVowelsAndUltimaCoda: 'string',
	EcclesPhonetic: 'string',
	EcclesVowels: 'string',
	EcclesRhymeVowels: 'string',
	EcclesRhymeVowelsAndUltimaCoda: 'string',
	EcclesPerfectRhyme: 'string',
	EcclesSort: 'string',
	LemmaCount: 'int',
	// Lemma1: 'string',
	// Lemma2: 'string',
	// Lemma3: 'string',
	// Lemma4: 'string',
	// Lemma5: 'string',
	LemmaArray: 'array',
	IsLemma: 'int',
	IsNonLemma: 'int',
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

function addToWordsArray(word, lemmata) {
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

function memoise(func, functionName, word, lemmata) {
	if (memoisedData[word]?.[functionName] === undefined) {
		const wordObject = { ...memoisedData[word] };
		wordObject[functionName] = func(word, lemmata);
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
	Ord: (word, lemmata) => {
		return existingWords.length + 1;
	},
	Word: (word, lemmata) => {
		return word;
	},
	Lemmata: (word, lemmata) => {
		return lemmata;
	},
	Length: (word, lemmata) => {
		return word.length;
	},
	AllConsonants: (word, lemmata) => {
		const replaced = f.NoMacraLowerCase(word).replace(/[aeiouy]/gi, '');
		return replaced || '-';
	},
	Uncompounded: (word, lemmata) => {
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
		if (allWordsOnlyWord.includes(wordMinusPossibleEnclitic)) {
			return wordMinusPossibleEnclitic;
		}
		if (
			['á', 'é', 'í', 'ó', 'ú', 'ý', 'ḗ', 'ü'].some((acute) =>
				wordMinusPossibleEnclitic.includes(acute)
			)
		) {
			function removeAcutes(word) {
				return word
					.replace(/á(?=[^aeiouyāēīōūȳ]*)$/, 'a')
					.replace(/é(?=[^aeiouyāēīōūȳ]*)$/, 'e')
					.replace(/í(?=[^aeiouyāēīōūȳ]*)$/, 'i')
					.replace(/ó(?=[^aeiouyāēīōūȳ]*)$/, 'o')
					.replace(/ú(?=[^aeiouyāēīōūȳ]*)$/, 'u')
					.replace(/ý(?=[^aeiouyāēīōūȳ]*)$/, 'y')
					.replace(/ḗ(?=[^aeiouyāēīōūȳ]*)$/, 'ē');
			}

			const wordMinusPossibleEncliticWithoutAccents = removeAcutes(
				wordMinusPossibleEnclitic
			).replaceAll('ü', 'u');

			if (allWordsOnlyWord.includes(wordMinusPossibleEncliticWithoutAccents)) {
				return wordMinusPossibleEncliticWithoutAccents;
			}
		}
		return word;
	},
	Enclitic: (word, lemmata) => {
		if (word.length === f.Uncompounded(word, lemmata).length) {
			return '';
		}
		if (word.endsWith('que')) {
			return 'que';
		}
		if (word.endsWith('ne')) {
			return 'ne';
		}
		if (word.endsWith('ve')) {
			return 've';
		}
		console.error(
			'Uncompounded is different to Word but Word doesn’t end with an enclitic.'
		);
	},
	UncompoundedPhonetic: (word, lemmata) => {
		function getPhoneticBeforeGeneralSubstitutions() {
			const uncompounded = f.Uncompounded(word, lemmata);
			if (uncompounded === 'ai') {
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
			if (f.Lemma1(word, lemmata) === 'praeeō') {
				return uncompounded.replaceAll('praei', 'prài');
			}
			if (f.Lemma1(word, lemmata).startsWith('cui') ||
				f.Lemma1(word, lemmata).startsWith('quis') ||
				f.Lemma1(word, lemmata).startsWith('quī') ||
				f.Lemma1(word, lemmata) === 'aliquis' ||
				f.Lemma1(word, lemmata) === 'ecquis' ||
				f.Lemma1(word, lemmata) === 'nesciōquis' ||
				f.Lemma1(word, lemmata) === 'ūnusquisque') {
				return replaceIntervocalicI(uncompounded)
					.replaceAll('cuiā', 'cùjā')
					.replaceAll('cuiu', 'cùju')
					.replaceAll('cui', 'cù');
			}
			if (uncompounded.includes('huius')) {
				return replaceIntervocalicI(uncompounded).replaceAll('huius', 'hùjus');
			}
			if (f.NoMacra(word, lemmata).includes('ngua') ||
				f.NoMacra(word, lemmata).includes('ngue') ||
				f.NoMacra(word, lemmata).includes('ngui') ||
				f.NoMacra(word, lemmata).includes('nguo') ||
				f.NoMacra(word, lemmata).includes('nguu')) {
				return uncompounded.replace('ngu', 'ngv');
			}
			if (f.Lemma1(word, lemmata).includes('suād') ||
				f.Lemma1(word, lemmata).includes('suās') ||
				f.Lemma1(word, lemmata).includes('suāv')) {
				return uncompounded.replace('suā', 'svā');
			}
			if (word.startsWith('Eduard')) {
				return uncompounded.replace('Eduard', 'edvard');
			}
			if (f.Lemma1(word, lemmata).toLowerCase().includes('suē')) {
				return uncompounded
					.replace('suē', 'svē')
					.replace('Suē', 'Svē')
					.replace('sue', 'sve')
					.replace('sui', 'svi')
					.replace('suī', 'svī')
					.replace('suu', 'svu');
			}
			if (f.Lemma1(word, lemmata) === 'urgueō') {
				return uncompounded.replaceAll('urgu', 'urgv');
			}
			if (f.Lemma1(word, lemmata).endsWith('iaceō') ||
				f.Lemma1(word, lemmata).endsWith('iectō') ||
				f.Lemma1(word, lemmata).endsWith('iaciō') ||
				f.Lemma1(word, lemmata).endsWith('iectus') ||
				f.Lemma1(word, lemmata).endsWith('iectē') ||
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
				].includes(f.Lemma1(word, lemmata))) {
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
			if (f.Lemma1(word, lemmata) === 'iniugis' ||
				f.Lemma1(word, lemmata) === 'biiugis' ||
				f.Lemma1(word, lemmata) === 'biiugus' ||
				f.Lemma1(word, lemmata) === 'subiugō') {
				return uncompounded.replaceAll('iug', 'jug');
			}
			if (uncompounded.startsWith('adiu') || uncompounded.startsWith('adiū')) {
				return uncompounded.replace('adi', 'adj');
			}
			if (uncompounded.startsWith('iniūr')) {
				return uncompounded.replace('iniūr', 'injūr');
			}
			if (f.Lemma1(word, lemmata) === 'iūsiūrandum') {
				return uncompounded.replaceAll('iū', 'jū');
			}
			if (f.Lemma1(word, lemmata) === 'periūrus') {
				return uncompounded.replace('periūr', 'perjūr');
			}
			if (/^i[aeiouyāēīōūȳ]/i.test(word) &&
				!phoneticExceptions['Vocalic initial i'].includes(
					f.Lemma1(word, lemmata)
				) &&
				uncompounded !== 'iīs') {
				return uncompounded.replace(/^i/i, 'j');
			}
			if (['magnus', 'magis', 'maiestās', 'maiōrēs'].includes(
				f.Lemma1(word, lemmata)
			) ||
				(f.NoMacra(f.Lemma1(word, lemmata)) === 'aio' &&
					['a', 'e', 'i', 'o', 'u', 'y'].includes(
						f.NoMacra(word, lemmata).substring(2, 3)
					))) {
				return uncompounded.replaceAll('ai', 'ajj');
			}
			if (['malus', 'male'].includes(f.Lemma1(word, lemmata))) {
				return uncompounded.replaceAll('ei', 'èj');
			}
			if (uncompounded.includes('eius')
				// &&
				// uncompounded.replace('eius', 'is') === f.Lemma1(word, lemmata)
			) {
				return uncompounded.replace('eius', 'èjus');
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
				phoneticExceptions['Diphthong eu'].includes(f.Lemma1(word, lemmata)) > 0
					? '€'
					: 'eu'
			)
			.replaceAll('_eu', '_€')
			.replaceAll('_€nd', 'eund')
			.replaceAll('_€nt', 'eunt')
			.replaceAll('eu_', '€')
			.replaceAll('_', '');
	},
	EncliticPhonetic: (word, lemmata) => {
		return f.Enclitic(word, lemmata).replace('qu', 'q');
	},
	Phonetic: (word, lemmata) => {
		if (word === '') {
			return '_';
		}
		return (
			f.UncompoundedPhonetic(word, lemmata) + f.EncliticPhonetic(word, lemmata)
		);
	},
	Scansion: (word, lemmata) => {
		return (
			f
				.Phonetic(word, lemmata)
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
	AllVowels: (word, lemmata) => {
		const emptyIfNeeded =
			f.Scansion(word, lemmata) === EMPTY || word.startsWith('-') ? EMPTY : '';
		return (
			emptyIfNeeded +
			f.Phonetic(word, lemmata).replace(/[bcdfghjklmnpqrstvxzχφθ]/g, '')
		);
	},
	SyllableCount: (word, lemmata) => {
		return f.AllVowels(word, lemmata).replace(EMPTY, '').length;
	},
	// Returns the stress position: 3 for antepenult, 2 for penult, 1 for ultima, 0 for words of no syllables.
	Stress: (word, lemmata) => {
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
			f.Phonetic(word, lemmata).endsWith('dīc') ||
			f.Phonetic(word, lemmata).endsWith('dūc') ||
			f.Phonetic(word, lemmata).endsWith('fac')
		) {
			return 1;
		}
		// Any other word of two syllables.
		if (f.SyllableCount(word, lemmata) === 2) {
			return 2;
		}
		// “-inde” behaves as an enclitic, moving stress to the antepenult.
		if (['deïnde', 'exindē', 'perinde', 'proïndē', 'subinde'].includes(word)) {
			return 3;
		}
		// Words with long penult are stressed on it.
		if (
			f.Scansion(word, lemmata)[f.SyllableCount(word, lemmata) - 2] === LONG
		) {
			return 2;
		}
		// Encliticized words have stress on the syllable before the enclitic (ie the penult).
		if (word.length !== f.Uncompounded(word, lemmata).length) {
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
				f.Uncompounded(word, lemmata)
			)
		) {
			return 2;
		}
		// More contractions such as ‘imperī’ from ‘imperium’, where I haven’t used an acute.
		if (
			(f.Lemma1(word, lemmata).endsWith('ius') ||
				f.Lemma1(word, lemmata).endsWith('ïus') ||
				f.Lemma1(word, lemmata).endsWith('ium') ||
				f.Lemma1(word, lemmata).endsWith('ius[prn]') ||
				f.Lemma1(word, lemmata).endsWith('ius[adj]') ||
				f.Lemma1(word, lemmata).endsWith('ius[n]') ||
				f.Lemma1(word, lemmata).endsWith('ium[prn]') ||
				f.Lemma1(word, lemmata).endsWith('ium[n]')) &&
			word
				.replaceAll('á', 'a')
				.replaceAll('é', 'e')
				.replaceAll('í', 'i')
				.replaceAll('ó', 'o')
				.replaceAll('ú', 'u')
				.replaceAll('ý', 'y') ===
				f
					.Lemma1(word, lemmata)
					.replace(/\[[^\]]+\]/, '')
					.replace(/...$/, 'ī')
		) {
			return 2;
		}
		// All other words are stressed on the antepenult.
		return 3;
	},
	UltimaRhyme: (word, lemmata) => {
		if (f.SyllableCount(word, lemmata) === 0) {
			return f.Phonetic(word, lemmata);
		}
		const ultimaVowel = f.AllVowels(word, lemmata).at(-1);
		const lastIndex = `${f.Phonetic(word, lemmata)}`.lastIndexOf(ultimaVowel);
		return `${f.Phonetic(word, lemmata)}`.substring(lastIndex);
	},
	RhymeVowels: (word, lemmata) => {
		if (f.Scansion(word, lemmata) === EMPTY) {
			return EMPTY;
		}
		return f
			.AllVowels(word, lemmata)
			.substring(f.SyllableCount(word, lemmata) - f.Stress(word, lemmata));
	},
	PerfectRhyme: (word, lemmata) => {
		if (word.startsWith('-') || f.Stress(word, lemmata) === 0) {
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
	RhymeConsonants: (word, lemmata) => {
		return (f.PerfectRhyme(word, lemmata) + '.')
			.replace(/[€āàâeēiīoōóòuūùyȳ]/g, 'a')
			.replace(/[ãẽĩõũỹ]f/g, 'anf')
			.replace(/[ãẽĩõũỹ]s/g, 'ans')
			.replace(/[ãẽĩõũỹ]/g, 'am')
			.replace('.', '');
	},
	Ultima: (word, lemmata) => {
		if (f.Stress(word, lemmata) === 2) {
			return '2 ' + f.UltimaRhyme(word, lemmata);
		}
		return f.UltimaRhyme(word, lemmata);
	},
	RhymeVowelsAndUltimaCoda: (word, lemmata) => {
		if (f.Stress(word, lemmata) === 0) {
			return f.UltimaRhyme(word, lemmata);
		}

		return (
			f.RhymeVowels(word, lemmata) + f.UltimaRhyme(word, lemmata).substring(1)
		);
	},
	EcclesPhonetic: (word, lemmata) => {
		return `${f.Phonetic(word, lemmata)}.`
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
	EcclesVowels: (word, lemmata) => {
		const emptyIfNeeded =
			f.Scansion(word, lemmata) === EMPTY || word.startsWith('-') ? EMPTY : '';
		return (
			emptyIfNeeded +
			f.EcclesPhonetic(word, lemmata).replace(/[bcdfghjklmnpqrstvxz]/g, '')
		);
	},
	EcclesRhymeVowels: (word, lemmata) => {
		if (f.Scansion(word, lemmata) === EMPTY) {
			return EMPTY;
		}
		return f
			.EcclesVowels(word, lemmata)
			.substring(f.SyllableCount(word, lemmata) - f.Stress(word, lemmata));
	},
	EcclesRhymeVowelsAndUltimaCoda: (word, lemmata) => {
		if (f.Scansion(word, lemmata) === EMPTY) {
			return EMPTY;
		}
		const phonetic = f.EcclesPhonetic(word, lemmata);
		const rhymeVowels = f.EcclesRhymeVowels(word, lemmata);
		const ultimaVowel = rhymeVowels.substring(rhymeVowels.length - 1);
		const ultimaVowelIndex = phonetic.lastIndexOf(ultimaVowel);
		return rhymeVowels + phonetic.substring(ultimaVowelIndex + 1);
	},
	EcclesPerfectRhyme: (word, lemmata) => {
		if (word.startsWith('-') || f.Stress(word, lemmata) === 0) {
			f.EcclesPhonetic(word, lemmata);
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
	EcclesSort: (word, lemmata) => {
		return (
			(
				(f.EcclesRhymeVowels(word, lemmata) === EMPTY
					? ''
					: f.EcclesRhymeVowels(word, lemmata)) +
				'-' +
				f
					.EcclesPerfectRhyme(word, lemmata)
					.replace(/[eiouyàâè€òùãẽĩõũỹ]/g, 'a') +
				'-' +
				reverseString(
					f
						.EcclesVowels(word, lemmata)
						.substring(
							0,
							f.EcclesVowels(word, lemmata).length -
								f.EcclesRhymeVowels(word, lemmata).length
						)
				) +
				'-' +
				reverseString(
					f
						.EcclesPhonetic(word, lemmata)
						.substring(
							0,
							f.EcclesPhonetic(word, lemmata).length -
								f.EcclesPerfectRhyme(word, lemmata).length
						)
				).replace(/[eiouyàâè€òùãẽĩõũỹ]/g, 'a') +
				'-' +
				word.toLowerCase()
			)
				.replaceAll('ā', 'azzzz')
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
				.replaceAll('ù', 'uzzzzzzzz') + (word === word.toLowerCase() ? '/' : '')
		);
	},
	LemmaCount: (word, lemmata) => {
		return f.LemmaArray(word, lemmata).length;
	},
	Lemma1: (word, lemmata) => {
		return f.LemmaArray(word, lemmata)[0];
	},
	Lemma2: (word, lemmata) => {
		return f.LemmaArray(word, lemmata)[1] || null;
	},
	Lemma3: (word, lemmata) => {
		return f.LemmaArray(word, lemmata)[2] || null;
	},
	Lemma4: (word, lemmata) => {
		return f.LemmaArray(word, lemmata)[3] || null;
	},
	Lemma5: (word, lemmata) => {
		return f.LemmaArray(word, lemmata)[4] || null;
	},
	ScansionWithElision: (word, lemmata) => {
		if (!'aeiouyāēīōūӯãẽĩõũỹàâé€òù'.includes(f.UltimaRhyme(word, lemmata))) {
			return f.Scansion(word, lemmata);
		}
		if (f.SyllableCount(word, lemmata) === 1) {
			return EMPTY;
		}
		return f
			.Scansion(word, lemmata)
			.substring(0, f.SyllableCount(word, lemmata) - 1);
	},
	IsFitForDactyl: (word, lemmata) => {
		const scansionWithElision = f.ScansionWithElision(word, lemmata);
		if (scansionWithElision === EMPTY) {
			return 1;
		}
		const scansionWithoutElision = f.Scansion(word, lemmata);
		const phonetic = f.Phonetic(word, lemmata);
		const endsWithConsonant = scansionWithElision === scansionWithoutElision;
		const endsWithShortVowelConsonant =
			/[aeiouy].$/.test(phonetic) && endsWithConsonant;

		// return endsWithShortVowelConsonant;
		const scansionToFit = endsWithShortVowelConsonant
			? scansionWithElision.substring(0, f.SyllableCount(word, lemmata) - 1)
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
	LemmaArray: (word, lemmata) => {
		return lemmata.split(' ');
	},
	IsLemma: (word, lemmata) => {
		return f.LemmaArray(word, lemmata).some((lemma) => {
			return lemma.replace(/\[[^\]]+\]/, '') === word;
		})
			? 1
			: 0;
	},
	IsNonLemma: (word, lemmata) => {
		return f.LemmaArray(word, lemmata).some((lemma) => {
			return lemma.replace(/\[[^\]]+\]/, '') !== word;
		})
			? 1
			: 0;
	},
	DuplicateWords: (word, lemmata) => {
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
	NewLemmata: (word, lemmata) => {
		// I’m not going to write something useful for this.
		// In the Excel file, this column checks whether lemmata are missing from
		// a sheet called `lemmata` — but that sheet cannot be replicated here.
		return '';
	},
	NoMacra: (word, lemmata) => {
		// Function from https://ricardometring.com/javascript-replace-special-characters
		return word
			.normalize('NFD')
			.replace(/[\u0300-\u036f]/g, '')
			.replace(/-/g, '');
	},
	NoMacraLowerCase: (word, lemmata) => {
		return f.NoMacra(word).toLowerCase();
	},
	AlphOrderNoMacra: (word, lemmata) => {
		return f.NoMacraLowerCase(word, lemmata).split('').sort().join('');
	},
	Sort: (word, lemmata) => {
		return (
			(
				(f.RhymeVowels(word, lemmata) === EMPTY
					? ''
					: f.RhymeVowels(word, lemmata)) +
				'-' +
				f
					.NoMacra(f.PerfectRhyme(word, lemmata))
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
						.AllVowels(word, lemmata)
						.substring(
							0,
							f.SyllableCount(word, lemmata) - f.Stress(word, lemmata)
						)
				) +
				'-' +
				reverseString(
					f
						.Phonetic(word, lemmata)
						.substring(
							0,
							f.Phonetic(word, lemmata).length -
								f.PerfectRhyme(word, lemmata).length
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
				.replaceAll('ā', 'azzzz')
				.replaceAll('ē', 'ezzzz')
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
				.replaceAll('ù', 'uzzzzzzzz') +
			'-' +
			word.toLowerCase() +
			(word === word.toLowerCase() ? '/' : '')
		);
	},
	RepeatWord: (word, lemmata) => {
		return word;
	},
};


////
//// Object with the same shape as `unmemoisedFuncs`, but all the functions are memoised:
////

const wordsformFunctionsMemoised = Object.entries(unmemoisedFuncs).reduce(
	(memoisedFuncs, [currentFuncName, currentFunc]) => {
		memoisedFuncs[currentFuncName] = (word, lemmata) =>
			memoise(currentFunc, currentFuncName, word, lemmata);
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
			const lemmata = inputRow.substring(positionOfWordLemmataSplit).trim();
			const resultsForLine = {};

			functionNames.forEach((functionName) => {
				resultsForLine[functionName] = f[functionName](word, lemmata);
			});

			output(resultsForLine);
			addToWordsArray(word, lemmata);
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

				console.log('Output all data! See your file at ' + outputFileUrl + ' or ' + batchFilepaths);

				console.timeEnd('generatingOutput');
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
