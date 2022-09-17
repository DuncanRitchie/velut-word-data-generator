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
			return '';
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
