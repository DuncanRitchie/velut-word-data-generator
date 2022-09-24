const buttonTest = document.getElementById("test");

//// Data to use in tests:

const expectedOutputCoveringAllFunctions = [
	{
		"Ord": 1,
		"Word": "vocābulōrum",
		"Lemmata": "vocābulum",
		"Length": 11,
		"AllConsonants": "vcblrm",
		"Uncompounded": "vocābulōrum",
		"Phonetic": "vocābulōrũ",
		"Scansion": "⏑–⏑––",
		"ScansionWithElision": "⏑–⏑–",
		"IsFitForDactyl": 0,
		"AllVowels": "oāuōũ",
		"SyllableCount": 5,
		"Stress": 2,
		"UltimaRhyme": "ũ",
		"RhymeVowels": "ōũ",
		"PerfectRhyme": "ōrũ",
		"RhymeConsonants": "aram",
		"Ultima": "2 ũ",
		"RhymeVowelsAndUltimaCoda": "ōũ",
		"EcclesPhonetic": "vocabulorum",
		"EcclesVowels": "oauou",
		"EcclesRhymeVowels": "ou",
		"EcclesRhymeVowelsAndUltimaCoda": "oum",
		"EcclesPerfectRhyme": "orum",
		"EcclesSort": "ou-aram-uao-labacav-vocazzzzbulozzzzrum/",
		"LemmaCount": 1,
		"Lemma1": "vocābulum",
		"Lemma2": null,
		"Lemma3": null,
		"Lemma4": null,
		"Lemma5": null,
		"LemmaArray": ["vocābulum"],
		"IsLemma": 0,
		"IsNonLemma": 1,
		"DuplicateWords": null,
		"NewLemmata": "",
		"NoMacra": "vocabulorum",
		"NoMacraLowerCase": "vocabulorum",
		"AlphOrderNoMacra": "abclmooruuv",
		"Sort": "ozzzzuzzzzzz-ara-uazzzzo-labazzzzcav-vocābulōrum/",
		"RepeatWord": "vocābulōrum",
	},
	{
		"Ord": 2,
		"Word": "excellentium",
		"Lemmata": "excellēns excellō",
		"Length": 12,
		"AllConsonants": "xcllntm",
		"Uncompounded": "excellentium",
		"Phonetic": "ecscellentiũ",
		"Scansion": "–––⏑–",
		"ScansionWithElision": "–––⏑",
		"IsFitForDactyl": 1,
		"AllVowels": "eeeiũ",
		"SyllableCount": 5,
		"Stress": 3,
		"UltimaRhyme": "ũ",
		"RhymeVowels": "eiũ",
		"PerfectRhyme": "entiũ",
		"RhymeConsonants": "antaam",
		"Ultima": "ũ",
		"RhymeVowelsAndUltimaCoda": "eiũ",
		"EcclesPhonetic": "ecscellentium",
		"EcclesVowels": "eeeiu",
		"EcclesRhymeVowels": "eiu",
		"EcclesRhymeVowelsAndUltimaCoda": "eium",
		"EcclesPerfectRhyme": "entium",
		"EcclesSort": "eiu-antaam-ee-llacsca-excellentium/",
		"LemmaCount": 2,
		"Lemma1": "excellēns",
		"Lemma2": "excellō",
		"Lemma3": null,
		"Lemma4": null,
		"Lemma5": null,
		"LemmaArray": ["excellēns", "excellō"],
		"IsLemma": 0,
		"IsNonLemma": 1,
		"DuplicateWords": null,
		"NewLemmata": "",
		"NoMacra": "excellentium",
		"NoMacraLowerCase": "excellentium",
		"AlphOrderNoMacra": "ceeeillmntux",
		"Sort": "eiuzzzzzz-antaa-ee-llacsca-excellentium/",
		"RepeatWord": "excellentium",
	},
	{
		"Ord": 3,
		"Word": "Latīnōrum",
		"Lemmata": "Latīnus[prn] Latīnus[adj]",
		"Length": 9,
		"AllConsonants": "ltnrm",
		"Uncompounded": "Latīnōrum",
		"Phonetic": "latīnōrũ",
		"Scansion": "⏑–––",
		"ScansionWithElision": "⏑––",
		"IsFitForDactyl": 1,
		"AllVowels": "aīōũ",
		"SyllableCount": 4,
		"Stress": 2,
		"UltimaRhyme": "ũ",
		"RhymeVowels": "ōũ",
		"PerfectRhyme": "ōrũ",
		"RhymeConsonants": "aram",
		"Ultima": "2 ũ",
		"RhymeVowelsAndUltimaCoda": "ōũ",
		"EcclesPhonetic": "latinorum",
		"EcclesVowels": "aiou",
		"EcclesRhymeVowels": "ou",
		"EcclesRhymeVowelsAndUltimaCoda": "oum",
		"EcclesPerfectRhyme": "orum",
		"EcclesSort": "ou-aram-ia-natal-latizzzznozzzzrum",
		"LemmaCount": 2,
		"Lemma1": "Latīnus[prn]",
		"Lemma2": "Latīnus[adj]",
		"Lemma3": null,
		"Lemma4": null,
		"Lemma5": null,
		"LemmaArray": ["Latīnus[prn]", "Latīnus[adj]"],
		"IsLemma": 0,
		"IsNonLemma": 1,
		"DuplicateWords": null,
		"NewLemmata": "",
		"NoMacra": "Latinorum",
		"NoMacraLowerCase": "latinorum",
		"AlphOrderNoMacra": "ailmnortu",
		"Sort": "ozzzzuzzzzzz-ara-izzzza-nizzzztal-latīnōrum",
		"RepeatWord": "Latīnōrum",
	},
	{
		"Ord": 4,
		"Word": "ūtilēs",
		"Lemmata": "ūtilis",
		"Length": 6,
		"AllConsonants": "tls",
		"Uncompounded": "ūtilēs",
		"Phonetic": "ūtilēs",
		"Scansion": "–⏑–",
		"ScansionWithElision": "–⏑–",
		"IsFitForDactyl": 0,
		"AllVowels": "ūiē",
		"SyllableCount": 3,
		"Stress": 3,
		"UltimaRhyme": "ēs",
		"RhymeVowels": "ūiē",
		"PerfectRhyme": "ūtilēs",
		"RhymeConsonants": "atalas",
		"Ultima": "ēs",
		"RhymeVowelsAndUltimaCoda": "ūiēs",
		"EcclesPhonetic": "utiles",
		"EcclesVowels": "uie",
		"EcclesRhymeVowels": "uie",
		"EcclesRhymeVowelsAndUltimaCoda": "uies",
		"EcclesPerfectRhyme": "utiles",
		"EcclesSort": "uie-atalas---uzzzztilezzzzs/",
		"LemmaCount": 1,
		"Lemma1": "ūtilis",
		"Lemma2": null,
		"Lemma3": null,
		"Lemma4": null,
		"Lemma5": null,
		"LemmaArray": ["ūtilis"],
		"IsLemma": 0,
		"IsNonLemma": 1,
		"DuplicateWords": null,
		"NewLemmata": "",
		"NoMacra": "utiles",
		"NoMacraLowerCase": "utiles",
		"AlphOrderNoMacra": "eilstu",
		"Sort": "uzzzziezzzz-atalas---ūtilēs/",
		"RepeatWord": "ūtilēs",
	},
	{
		"Ord": 5,
		"Word": "tabulae",
		"Lemmata": "tabula",
		"Length": 7,
		"AllConsonants": "tbl",
		"Uncompounded": "tabulae",
		"Phonetic": "tabulà",
		"Scansion": "⏑⏑–",
		"ScansionWithElision": "⏑⏑",
		"IsFitForDactyl": 1,
		"AllVowels": "auà",
		"SyllableCount": 3,
		"Stress": 3,
		"UltimaRhyme": "à",
		"RhymeVowels": "auà",
		"PerfectRhyme": "abulà",
		"RhymeConsonants": "abala",
		"Ultima": "à",
		"RhymeVowelsAndUltimaCoda": "auà",
		"EcclesPhonetic": "tabule",
		"EcclesVowels": "aue",
		"EcclesRhymeVowels": "aue",
		"EcclesRhymeVowelsAndUltimaCoda": "aue",
		"EcclesPerfectRhyme": "abule",
		"EcclesSort": "aue-abala--t-tabulae/",
		"LemmaCount": 1,
		"Lemma1": "tabula",
		"Lemma2": null,
		"Lemma3": null,
		"Lemma4": null,
		"Lemma5": null,
		"LemmaArray": ["tabula"],
		"IsLemma": 0,
		"IsNonLemma": 1,
		"DuplicateWords": null,
		"NewLemmata": "",
		"NoMacra": "tabulae",
		"NoMacraLowerCase": "tabulae",
		"AlphOrderNoMacra": "aabeltu",
		"Sort": "auazzzzzzzz-abala--t-tabulae/",
		"RepeatWord": "tabulae",
	},
	{
		"Ord": 6,
		"Word": "Iūlia",
		"Lemmata": "Iūlia Iūlius[adj]",
		"Length": 5,
		"AllConsonants": "l",
		"Uncompounded": "Iūlia",
		"Phonetic": "jūlia",
		"Scansion": "–⏑⏑",
		"ScansionWithElision": "–⏑",
		"IsFitForDactyl": 1,
		"AllVowels": "ūia",
		"SyllableCount": 3,
		"Stress": 3,
		"UltimaRhyme": "a",
		"RhymeVowels": "ūia",
		"PerfectRhyme": "ūlia",
		"RhymeConsonants": "alaa",
		"RhymeVowelsAndUltimaCoda": "ūia",
		"EcclesPhonetic": "julia",
		"EcclesVowels": "uia",
		"EcclesRhymeVowels": "uia",
		"EcclesRhymeVowelsAndUltimaCoda": "uia",
		"EcclesPerfectRhyme": "ulia",
		"EcclesSort": "uia-alaa--j-iuzzzzlia",
		"LemmaCount": 2,
		"Lemma1": "Iūlia",
		"Lemma2": "Iūlius[adj]",
		"Lemma3": null,
		"Lemma4": null,
		"Lemma5": null,
		"LemmaArray": ["Iūlia", "Iūlius[adj]"],
		"IsLemma": 1,
		"IsNonLemma": 1,
		"NoMacra": "Iulia",
		"NoMacraLowerCase": "iulia",
		"AlphOrderNoMacra": "aiilu",
		"Sort": "uzzzzia-alaa--j-iūlia"
	},
	{
		"Ord": 7,
		"Word": "-que",
		"Lemmata": "-que",
		"Length": 4,
		"AllConsonants": "q",
		"Uncompounded": "∅",
		"Phonetic": "qe",
		"Scansion": "⏑",
		"ScansionWithElision": "∅",
		"IsFitForDactyl": 1,
		"AllVowels": "∅e",
		"SyllableCount": 1,
		"Stress": 2,
		"UltimaRhyme": "e",
		"RhymeVowels": "∅e",
		"PerfectRhyme": "qe",
		"RhymeConsonants": "qa",
		"RhymeVowelsAndUltimaCoda": "∅e",
		"EcclesPhonetic": "qe",
		"EcclesVowels": "∅e",
		"EcclesRhymeVowels": "∅e",
		"EcclesRhymeVowelsAndUltimaCoda": "∅e",
		"EcclesPerfectRhyme": "qe",
		"EcclesSort": "∅e-qa----que/",
		"LemmaCount": 1,
		"Lemma1": "-que",
		"Lemma2": null,
		"Lemma3": null,
		"Lemma4": null,
		"Lemma5": null,
		"LemmaArray": ["-que"],
		"IsLemma": 1,
		"IsNonLemma": 0,
		"NoMacra": "que",
		"NoMacraLowerCase": "que",
		"AlphOrderNoMacra": "equ",
		"Sort": "∅e-qa----que/"
	}
]

const phoneticTests = [
	{Word: "ai", Lemmata: "ai", Phonetic: "à"},
	{Word: "ei", Lemmata: "ei", Phonetic: "è"},
	{Word: "eia", Lemmata: "eia", Phonetic: "èa"},
	{Word: "hei", Lemmata: "hei", Phonetic: "hè"},
	{Word: "heia", Lemmata: "heia", Phonetic: "hèa"},
	{Word: "hoc", Lemmata: "hic", Phonetic: "hocc"},
	{Word: "oi", Lemmata: "oi", Phonetic: "ò"},
	{Word: "oiei", Lemmata: "oiei", Phonetic: "òè"},
	{Word: "dehinc", Lemmata: "dehinc", Phonetic: "dènc"},
	{Word: "dein", Lemmata: "dein", Phonetic: "dèn"},
	{Word: "deinde", Lemmata: "deinde", Phonetic: "dènde"},
	{Word: "proin", Lemmata: "proin", Phonetic: "pròn"},
	{Word: "proindē", Lemmata: "proindē", Phonetic: "pròndē"},
	{Word: "praeeō", Lemmata: "praeeō", Phonetic: "pràeō"},
	{Word: "praeit", Lemmata: "praeeō", Phonetic: "pràit"},
	{Word: "cui", Lemmata: "quī quis", Phonetic: "cù"},
	{Word: "alicuius", Lemmata: "aliquis", Phonetic: "alicùus"},
	{Word: "eccui", Lemmata: "ecquis", Phonetic: "eccù"},
	{Word: "nesciōcuius", Lemmata: "nesciōquis", Phonetic: "nesciōcùus"},
	{Word: "ūnīcuique", Lemmata: "ūnusquisque", Phonetic: "ūnīcùqe"},
	{Word: "anguis", Lemmata: "anguis", Phonetic: "angvis"},
	{Word: "lingua", Lemmata: "lingua", Phonetic: "lingva"},
	{Word: "suādeō", Lemmata: "suādeō", Phonetic: "svādeō"},
	{Word: "persuāvī", Lemmata: "persuādeō", Phonetic: "persvāvī"},
	{Word: "persuāsiō", Lemmata: "persuāsiō", Phonetic: "persvāsiō"},
	{Word: "Eduardō", Lemmata: "Eduardus", Phonetic: "edvardō"},
	{Word: "suēscō", Lemmata: "suēscō", Phonetic: "svēscō"},
	{Word: "cōnsuētūdō", Lemmata: "cōnsuētūdō", Phonetic: "cõsvētūdō"},
	{Word: "urguet", Lemmata: "urgueō", Phonetic: "urgvet"},
	{Word: "iacent", Lemmata: "iaceō", Phonetic: "jacent"},
	{Word: "coniectant", Lemmata: "coniectō", Phonetic: "conjectant"},
	{Word: "subicit", Lemmata: "subiciō", Phonetic: "subjicit"},
	{Word: "coniūnctiō", Lemmata: "coniūnctiō", Phonetic: "conjūnctiō"},
	{Word: "coniūnx", Lemmata: "coniūnx", Phonetic: "conjūncs"},
	{Word: "coniugor", Lemmata: "coniugō", Phonetic: "conjugor"},
	{Word: "disiungimus", Lemmata: "disiungō", Phonetic: "disjungimus"},
	{Word: "iniugem", Lemmata: "iniugis", Phonetic: "injugẽ"},
	{Word: "biiugem", Lemmata: "biiugis", Phonetic: "bijugẽ"},
	{Word: "biiugum", Lemmata: "biiugis", Phonetic: "bijugũ"},
	{Word: "subiugat", Lemmata: "subiugō", Phonetic: "subjugat"},
	{Word: "adiūdicārī", Lemmata: "adiūdicō", Phonetic: "adjūdicārī"},
	{Word: "adiuvāns", Lemmata: "adiuvō", Phonetic: "adjuvãs"},
	{Word: "iniūriae", Lemmata: "iniūria", Phonetic: "injūrià"},
	{Word: "iūsiūrandum", Lemmata: "iūsiūrandum", Phonetic: "jūsjūrandũ"},
	{Word: "iūrisiūrandī", Lemmata: "iūsiūrandum", Phonetic: "jūrisjūrandī"},
	{Word: "periūrae", Lemmata: "periūrus", Phonetic: "perjūrà"},
	{Word: "Iūliam", Lemmata: "Iūlia Iūlius[adj]", Phonetic: "jūliã"},
	{Word: "iocant", Lemmata: "iocō", Phonetic: "jocant"},
	{Word: "iambe", Lemmata: "iambus", Phonetic: "iambe"},
	{Word: "Iāsoniī", Lemmata: "Iāsonius", Phonetic: "iāsoniī"},
	{Word: "iīs", Lemmata: "is", Phonetic: "iīs"},
	{Word: "magne", Lemmata: "magnus", Phonetic: "magne"},
	{Word: "magis", Lemmata: "magis", Phonetic: "magis"},
	{Word: "maiestātis", Lemmata: "maiestās", Phonetic: "majjestātis"},
	{Word: "maiōrum", Lemmata: "maiōrēs", Phonetic: "majjōrũ"},
	{Word: "malō", Lemmata: "malus", Phonetic: "malō"},
	{Word: "male", Lemmata: "male", Phonetic: "male"},
	{Word: "aiō", Lemmata: "aiō", Phonetic: "ajjō"},
	{Word: "aiunt", Lemmata: "aiō", Phonetic: "ajjunt"},
	{Word: "ait", Lemmata: "aiō", Phonetic: "ait"},
	{Word: "-que", Lemmata: "-que", Phonetic: "qe"},
	{Word: "lectiientāculāris", Lemmata: "lectiientāculāris", Phonetic: "lectijentāculāris"},
	{Word: "Ōsuestriā", Lemmata: "Ōsuestria", Phonetic: "ōsvestriā"},
	{Word: "Reiciavīcum", Lemmata: "Reiciavīcum", Phonetic: "rejcjavīcũ"},
	{Word: "kalendae", Lemmata: "kalendae", Phonetic: "calendà"},
	{Word: "ēheu", Lemmata: "ēheu", Phonetic: "ēh€"},
	{Word: "meus", Lemmata: "meus", Phonetic: "meus"},
	{Word: "Orpheus", Lemmata: "Orpheus", Phonetic: "orφ€s"},
	{Word: "eunt", Lemmata: "eō", Phonetic: "eunt"},
	{Word: "eundum", Lemmata: "eō", Phonetic: "eundũ"},
	{Word: "eius", Lemmata: "is", Phonetic: "ejjus"},
	{Word: "maius", Lemmata: "magnus magis", Phonetic: "majjus"},
	{Word: "peior", Lemmata: "malus male", Phonetic: "pejjor"},
	{Word: "peiōribus", Lemmata: "malus male", Phonetic: "pejjōribus"},
	{Word: "peius", Lemmata: "malus male", Phonetic: "pejjus"},
]

const stressTests = [
	{Word: "-que", Lemmata: "-que", Stress: 2},
	{Word: "abdōmine", Lemmata: "abdōmen", Stress: 3},
	{Word: "addūc", Lemmata: "addūcō", Stress: 1},
	{Word: "ai", Lemmata: "ai", Stress: 1},
	{Word: "dominī", Lemmata: "dominus", Stress: 3},
	{Word: "domínī", Lemmata: "dominium", Stress: 2},
	{Word: "illīc", Lemmata: "illīc", Stress: 1},
	{Word: "imperī", Lemmata: "imperium", Stress: 2},
	{Word: "Latīnitās", Lemmata: "Latīnitās", Stress: 3},
	{Word: "Latīnus", Lemmata: "Latīnus[prn] Latīnus[adj]", Stress: 2},
	{Word: "Latīnusque", Lemmata: "Latīnus[prn] Latīnus[adj]", Stress: 2},
	{Word: "lingua", Lemmata: "lingua", Stress: 2},
	{Word: "linguaque", Lemmata: "lingua", Stress: 2},
	{Word: "mōns", Lemmata: "mōns", Stress: 1},
	{Word: "proïndē", Lemmata: "proïndē", Stress: 3},
	{Word: "Quīntilī", Lemmata: "Quīntilius[prn]", Stress: 2},
	{Word: "satin", Lemmata: "satis", Stress: 1},
	{Word: "st", Lemmata: "st sum", Stress: 0},
	{Word: "suamet", Lemmata: "suamet", Stress: 2},
	{Word: "tandem", Lemmata: "tandem", Stress: 2},
	{Word: "ūndēcentēsimus", Lemmata: "ūndēcentēsimus", Stress: 3},
]

//// Tests looping over the above arrays:

const testPhonetic = () => {
	phoneticTests.forEach(test => {
		const actual = f.Phonetic(test.Word, test.Lemmata)
		if (actual === test.Phonetic) {
			console.log(`Yay! Phonetic(${test.Word}) => ${actual}`)
		}
		else {
			console.error(`Phonetic(${test.Word}) should give ${test.Phonetic} but actually gives ${actual}`)
		}
	})
}

const testStress = () => {
	//// Encliticized words will be recognised as such if the unencliticized words are in `existingWords`.
	existingWords.push(
		{word: 'Latīnus', lemmata: 'Latīnus'},
		{word: 'lingua', lemmata: 'lingua'},
	);
	stressTests.forEach(test => {
		const actual = f.Stress(test.Word, test.Lemmata)
		if (actual === test.Stress) {
			console.log(`Yay! Stress(${test.Word}) => ${actual}`)
		}
		else {
			console.error(`Stress(${test.Word}) should give ${test.Stress} but actually gives ${actual}`)
		}
	})
}

const testAllFunctions = () => {
	for (const wordObject of expectedOutputCoveringAllFunctions) {
		const word = wordObject.Word;
		const lemmata = wordObject.Lemmata;

		functionNames.forEach(functionName => {
			const expectedOutput = wordObject[functionName];
			const actualOutput = wordsformFunctions[functionName](word, lemmata);

			if (expectedOutput === undefined && actualOutput === "") {
				console.warn(`Neither the function nor the expected value has been defined for ${functionName}(${word}, ${lemmata})`);
			}
			else if (expectedOutput === undefined) {
				console.warn(`${functionName}(${word}, ${lemmata}) gives ${actualOutput} but the expected value hasn’t been defined`);
			}
			else if (actualOutput === "") {
				console.log(`${functionName}(${word}, ${lemmata}) should give ${expectedOutput} but the function hasn’t been written`);
			}
			else if (JSON.stringify(actualOutput) === JSON.stringify(expectedOutput)) {
				console.log(`Yay! ${functionName}(${word}, ${lemmata}) => ${expectedOutput}`);
			}
			else {
				console.error({for: `${functionName}(${word}, ${lemmata})`, expected: expectedOutput, actual: actualOutput});
			}
		});

		addToWordsArray(word, lemmata);
		clearMemoisationCache();
	}
}

//// Event-listener:

buttonTest.addEventListener("click", ()=>{
	clearWordsArray();

	testAllFunctions(),
	clearWordsArray();

	testPhonetic(),
	clearWordsArray();

	testStress()
	clearWordsArray();
});


//// This isn’t used because the Generator produces Json, not tab-delimited data.
const expectedTabbedOutputFromSampleData =
`Ord	Word	Lemmata	Length	AllConsonants	Uncompounded	Phonetic	Scansion	AllVowels	SyllableCount	Stress	UltimaRhyme	RhymeVowels	PerfectRhyme	RhymeConsonants	Ultima	RhymeVowelsAndUltimaCoda	EcclesPhonetic	EcclesVowels	EcclesRhymeVowels	EcclesRhymeVowelsAndUltimaCoda	EcclesPerfectRhyme	EcclesSort	LemmaCount	Lemma1	Lemma2	Lemma3	Lemma4	Lemma5	ScansionWithElision	IsFitForDactyl	LemmaArray	IsLemma	IsNonLemma	DuplicateWords	NewLemmata	NoMacra	NoMacraLowerCase	AlphOrderNoMacra	Sort
89780	vocābulōrum	vocābulum	11	vcblrm	vocābulōrum	vocābulōrũ	⏑–⏑––	oāuōũ	5	2	ũ	ōũ	ōrũ	aram	'2 ũ	ōũ	vocabulorum	oauou	ou	oum	orum	ou-aram-uao-labacav-vocazzzzbulozzzzrum/	1	vocābulum					⏑–⏑–	0	["vocābulum"]	0	1			vocabulorum	vocabulorum	abclmooruuv	ozzzzuzzzzzz-ara-uazzzzo-labazzzzcav-vocābulōrum/
89781	excellentium	excellēns excellō	12	xcllntm	excellentium	ecscellentiũ	–––⏑–	eeeiũ	5	3	ũ	eiũ	entiũ	antaam	ũ	eiũ	ecscellentium	eeeiu	eiu	eium	entium	eiu-antaam-ee-llacsca-excellentium/	2	excellēns	excellō				–––⏑	1	["excellēns","excellō"]	0	1			excellentium	excellentium	ceeeillmntux	eiuzzzzzz-antaa-ee-llacsca-excellentium/
89782	Latīnōrum	Latīnus[prn] Latīnus[adj]	9	ltnrm	Latīnōrum	latīnōrũ	⏑–––	aīōũ	4	2	ũ	ōũ	ōrũ	aram	'2 ũ	ōũ	latinorum	aiou	ou	oum	orum	ou-aram-ia-natal-latizzzznozzzzrum	2	Latīnus[prn]	Latīnus[adj]				⏑––	1	["Latīnus[prn]","Latīnus[adj]"]	0	1			Latinorum	latinorum	ailmnortu	ozzzzuzzzzzz-ara-izzzza-nizzzztal-latīnōrum
`
