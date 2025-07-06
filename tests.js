const buttonTest = document.getElementById('test');

//// Data to use in tests:

const expectedOutputCoveringAllFunctions = [
	{
		Ord: 1,
		Word: 'vocābulōrum',
		Lemmata: 'vocābulum',
		Enclitic: 'unencliticized',
		Length: 11,
		AllConsonants: 'vcblrm',
		Uncompounded: 'vocābulōrum',
		Phonetic: 'vocābulōrũ',
		Scansion: '⏑–⏑––',
		ScansionWithElision: '⏑–⏑–',
		IsFitForDactyl: 0,
		AllVowels: 'oāuōũ',
		SyllableCount: 5,
		Stress: 2,
		UltimaRhyme: 'ũ',
		RhymeVowels: 'ōũ',
		PerfectRhyme: 'ōrũ',
		RhymeConsonants: 'aram',
		Ultima: '2 ũ',
		RhymeVowelsAndUltimaCoda: 'ōũ',
		EcclesPhonetic: 'vocabulorum',
		EcclesVowels: 'oauou',
		EcclesRhymeVowels: 'ou',
		EcclesRhymeVowelsAndUltimaCoda: 'oum',
		EcclesPerfectRhyme: 'orum',
		EcclesSort: 'ou-aram-uao-labacav-vocazzbulozzrum/',
		LemmaCount: 1,
		Lemma1: 'vocābulum',
		Lemma2: null,
		Lemma3: null,
		Lemma4: null,
		Lemma5: null,
		LemmaArray: ['vocābulum'],
		IsLemma: 0,
		IsNonLemma: 1,
		DuplicateWords: null,
		NewLemmata: '',
		NoMacra: 'vocabulorum',
		NoMacraLowerCase: 'vocabulorum',
		AlphOrderNoMacra: 'abclmooruuv',
		Sort: 'ozzuzzz-ara-uazzo-labazzcav-vocābulōrum/',
		RepeatWord: 'vocābulōrum',
	},
	{
		Ord: 2,
		Word: 'excellentium',
		Lemmata: 'excellēns excellō',
		Enclitic: 'unencliticized',
		Length: 12,
		AllConsonants: 'xcllntm',
		Uncompounded: 'excellentium',
		Phonetic: 'ecscellentiũ',
		Scansion: '–––⏑–',
		ScansionWithElision: '–––⏑',
		IsFitForDactyl: 1,
		AllVowels: 'eeeiũ',
		SyllableCount: 5,
		Stress: 3,
		UltimaRhyme: 'ũ',
		RhymeVowels: 'eiũ',
		PerfectRhyme: 'entiũ',
		RhymeConsonants: 'antaam',
		Ultima: 'ũ',
		RhymeVowelsAndUltimaCoda: 'eiũ',
		EcclesPhonetic: 'ecscellentium',
		EcclesVowels: 'eeeiu',
		EcclesRhymeVowels: 'eiu',
		EcclesRhymeVowelsAndUltimaCoda: 'eium',
		EcclesPerfectRhyme: 'entium',
		EcclesSort: 'eiu-antaam-ee-llacsca-excellentium/',
		LemmaCount: 2,
		Lemma1: 'excellēns',
		Lemma2: 'excellō',
		Lemma3: null,
		Lemma4: null,
		Lemma5: null,
		LemmaArray: ['excellēns', 'excellō'],
		IsLemma: 0,
		IsNonLemma: 1,
		DuplicateWords: null,
		NewLemmata: '',
		NoMacra: 'excellentium',
		NoMacraLowerCase: 'excellentium',
		AlphOrderNoMacra: 'ceeeillmntux',
		Sort: 'eiuzzz-antaa-ee-llacsca-excellentium/',
		RepeatWord: 'excellentium',
	},
	{
		Ord: 3,
		Word: 'Latīnōrum',
		Lemmata: 'Latīnus[prn] Latīnus[adj]',
		Enclitic: 'unencliticized',
		Length: 9,
		AllConsonants: 'ltnrm',
		Uncompounded: 'Latīnōrum',
		Phonetic: 'latīnōrũ',
		Scansion: '⏑–––',
		ScansionWithElision: '⏑––',
		IsFitForDactyl: 1,
		AllVowels: 'aīōũ',
		SyllableCount: 4,
		Stress: 2,
		UltimaRhyme: 'ũ',
		RhymeVowels: 'ōũ',
		PerfectRhyme: 'ōrũ',
		RhymeConsonants: 'aram',
		Ultima: '2 ũ',
		RhymeVowelsAndUltimaCoda: 'ōũ',
		EcclesPhonetic: 'latinorum',
		EcclesVowels: 'aiou',
		EcclesRhymeVowels: 'ou',
		EcclesRhymeVowelsAndUltimaCoda: 'oum',
		EcclesPerfectRhyme: 'orum',
		EcclesSort: 'ou-aram-ia-natal-latizznozzrum',
		LemmaCount: 2,
		Lemma1: 'Latīnus[prn]',
		Lemma2: 'Latīnus[adj]',
		Lemma3: null,
		Lemma4: null,
		Lemma5: null,
		LemmaArray: ['Latīnus[prn]', 'Latīnus[adj]'],
		IsLemma: 0,
		IsNonLemma: 1,
		DuplicateWords: null,
		NewLemmata: '',
		NoMacra: 'Latinorum',
		NoMacraLowerCase: 'latinorum',
		AlphOrderNoMacra: 'ailmnortu',
		Sort: 'ozzuzzz-ara-izza-nizztal-latīnōrum',
		RepeatWord: 'Latīnōrum',
	},
	{
		Ord: 4,
		Word: 'ūtilēs',
		Lemmata: 'ūtilis',
		Enclitic: 'unencliticized',
		Length: 6,
		AllConsonants: 'tls',
		Uncompounded: 'ūtilēs',
		Phonetic: 'ūtilēs',
		Scansion: '–⏑–',
		ScansionWithElision: '–⏑–',
		IsFitForDactyl: 0,
		AllVowels: 'ūiē',
		SyllableCount: 3,
		Stress: 3,
		UltimaRhyme: 'ēs',
		RhymeVowels: 'ūiē',
		PerfectRhyme: 'ūtilēs',
		RhymeConsonants: 'atalas',
		Ultima: 'ēs',
		RhymeVowelsAndUltimaCoda: 'ūiēs',
		EcclesPhonetic: 'utiles',
		EcclesVowels: 'uie',
		EcclesRhymeVowels: 'uie',
		EcclesRhymeVowelsAndUltimaCoda: 'uies',
		EcclesPerfectRhyme: 'utiles',
		EcclesSort: 'uie-atalas---uzztilezzs/',
		LemmaCount: 1,
		Lemma1: 'ūtilis',
		Lemma2: null,
		Lemma3: null,
		Lemma4: null,
		Lemma5: null,
		LemmaArray: ['ūtilis'],
		IsLemma: 0,
		IsNonLemma: 1,
		DuplicateWords: null,
		NewLemmata: '',
		NoMacra: 'utiles',
		NoMacraLowerCase: 'utiles',
		AlphOrderNoMacra: 'eilstu',
		Sort: 'uzziezz-atalas---ūtilēs/',
		RepeatWord: 'ūtilēs',
	},
	{
		Ord: 5,
		Word: 'tabulae',
		Lemmata: 'tabula',
		Enclitic: 'unencliticized',
		Length: 7,
		AllConsonants: 'tbl',
		Uncompounded: 'tabulae',
		Phonetic: 'tabulà',
		Scansion: '⏑⏑–',
		ScansionWithElision: '⏑⏑',
		IsFitForDactyl: 1,
		AllVowels: 'auà',
		SyllableCount: 3,
		Stress: 3,
		UltimaRhyme: 'à',
		RhymeVowels: 'auà',
		PerfectRhyme: 'abulà',
		RhymeConsonants: 'abala',
		Ultima: 'à',
		RhymeVowelsAndUltimaCoda: 'auà',
		EcclesPhonetic: 'tabule',
		EcclesVowels: 'aue',
		EcclesRhymeVowels: 'aue',
		EcclesRhymeVowelsAndUltimaCoda: 'aue',
		EcclesPerfectRhyme: 'abule',
		EcclesSort: 'aue-abala--t-tabulae/',
		LemmaCount: 1,
		Lemma1: 'tabula',
		Lemma2: null,
		Lemma3: null,
		Lemma4: null,
		Lemma5: null,
		LemmaArray: ['tabula'],
		IsLemma: 0,
		IsNonLemma: 1,
		DuplicateWords: null,
		NewLemmata: '',
		NoMacra: 'tabulae',
		NoMacraLowerCase: 'tabulae',
		AlphOrderNoMacra: 'aabeltu',
		Sort: 'auazzzz-abala--t-tabulae/',
		RepeatWord: 'tabulae',
	},
	{
		Ord: 6,
		Word: 'Iūlia',
		Lemmata: 'Iūlia Iūlius[adj]',
		Enclitic: 'unencliticized',
		Length: 5,
		AllConsonants: 'l',
		Uncompounded: 'Iūlia',
		Phonetic: 'jūlia',
		Scansion: '–⏑⏑',
		ScansionWithElision: '–⏑',
		IsFitForDactyl: 1,
		AllVowels: 'ūia',
		SyllableCount: 3,
		Stress: 3,
		UltimaRhyme: 'a',
		RhymeVowels: 'ūia',
		PerfectRhyme: 'ūlia',
		RhymeConsonants: 'alaa',
		RhymeVowelsAndUltimaCoda: 'ūia',
		EcclesPhonetic: 'julia',
		EcclesVowels: 'uia',
		EcclesRhymeVowels: 'uia',
		EcclesRhymeVowelsAndUltimaCoda: 'uia',
		EcclesPerfectRhyme: 'ulia',
		EcclesSort: 'uia-alaa--j-iuzzlia',
		LemmaCount: 2,
		Lemma1: 'Iūlia',
		Lemma2: 'Iūlius[adj]',
		Lemma3: null,
		Lemma4: null,
		Lemma5: null,
		LemmaArray: ['Iūlia', 'Iūlius[adj]'],
		IsLemma: 1,
		IsNonLemma: 1,
		NoMacra: 'Iulia',
		NoMacraLowerCase: 'iulia',
		AlphOrderNoMacra: 'aiilu',
		Sort: 'uzzia-alaa--j-iūlia',
		RepeatWord: 'Iūlia',
	},
	{
		Ord: 7,
		Word: '-que',
		Lemmata: '-que',
		Enclitic: 'que',
		Length: 4,
		AllConsonants: 'q',
		Uncompounded: '∅',
		Phonetic: 'qe',
		Scansion: '⏑',
		ScansionWithElision: '∅',
		IsFitForDactyl: 1,
		AllVowels: '∅e',
		SyllableCount: 1,
		Stress: 2,
		UltimaRhyme: 'e',
		RhymeVowels: '∅e',
		PerfectRhyme: 'qe',
		RhymeConsonants: 'qa',
		RhymeVowelsAndUltimaCoda: '∅e',
		EcclesPhonetic: 'qe',
		EcclesVowels: '∅e',
		EcclesRhymeVowels: '∅e',
		EcclesRhymeVowelsAndUltimaCoda: '∅e',
		EcclesPerfectRhyme: 'qe',
		EcclesSort: '∅e-qa----que/',
		LemmaCount: 1,
		Lemma1: '-que',
		Lemma2: null,
		Lemma3: null,
		Lemma4: null,
		Lemma5: null,
		LemmaArray: ['-que'],
		IsLemma: 1,
		IsNonLemma: 0,
		NoMacra: 'que',
		NoMacraLowerCase: 'que',
		AlphOrderNoMacra: 'equ',
		Sort: '∅e-qa----que/',
		RepeatWord: '-que',
	}
]

const phoneticTests = [
	{Word: 'ai', Lemmata: 'ai', Enclitic: 'unencliticized', Phonetic: 'à'},
	{Word: 'ei', Lemmata: 'ei', Enclitic: 'unencliticized', Phonetic: 'è'},
	{Word: 'eia', Lemmata: 'eia', Enclitic: 'unencliticized', Phonetic: 'èa'},
	{Word: 'hei', Lemmata: 'hei', Enclitic: 'unencliticized', Phonetic: 'hè'},
	{Word: 'heia', Lemmata: 'heia', Enclitic: 'unencliticized', Phonetic: 'hèa'},
	{Word: 'hoc', Lemmata: 'hic', Enclitic: 'unencliticized', Phonetic: 'hocc'},
	{Word: 'oi', Lemmata: 'oi', Enclitic: 'unencliticized', Phonetic: 'ò'},
	{Word: 'oiei', Lemmata: 'oiei', Enclitic: 'unencliticized', Phonetic: 'òè'},
	{Word: 'dehinc', Lemmata: 'dehinc', Enclitic: 'unencliticized', Phonetic: 'dènc'},
	{Word: 'dein', Lemmata: 'dein', Enclitic: 'unencliticized', Phonetic: 'dèn'},
	{Word: 'deinde', Lemmata: 'deinde', Enclitic: 'unencliticized', Phonetic: 'dènde'},
	{Word: 'proin', Lemmata: 'proin', Enclitic: 'unencliticized', Phonetic: 'pròn'},
	{Word: 'proindē', Lemmata: 'proindē', Enclitic: 'unencliticized', Phonetic: 'pròndē'},
	{Word: 'praeeō', Lemmata: 'praeeō', Enclitic: 'unencliticized', Phonetic: 'pràeō'},
	{Word: 'praeit', Lemmata: 'praeeō', Enclitic: 'unencliticized', Phonetic: 'pràit'},
	{Word: 'cui', Lemmata: 'quī quis', Enclitic: 'unencliticized', Phonetic: 'cù'},
	{Word: 'alicuius', Lemmata: 'aliquis', Enclitic: 'unencliticized', Phonetic: 'alicùjus'},
	{Word: 'eccui', Lemmata: 'ecquis', Enclitic: 'unencliticized', Phonetic: 'eccù'},
	{Word: 'nesciōcuius', Lemmata: 'nesciōquis', Enclitic: 'unencliticized', Phonetic: 'nesciōcùjus'},
	{Word: 'ūnīcuique', Lemmata: 'ūnusquisque', Enclitic: 'unencliticized', Phonetic: 'ūnīcùqe'},
	{Word: 'anguis', Lemmata: 'anguis', Enclitic: 'unencliticized', Phonetic: 'angvis'},
	{Word: 'lingua', Lemmata: 'lingua', Enclitic: 'unencliticized', Phonetic: 'lingva'},
	{Word: 'suādeō', Lemmata: 'suādeō', Enclitic: 'unencliticized', Phonetic: 'svādeō'},
	{Word: 'persuāvī', Lemmata: 'persuādeō', Enclitic: 'unencliticized', Phonetic: 'persvāvī'},
	{Word: 'persuāsiō', Lemmata: 'persuāsiō', Enclitic: 'unencliticized', Phonetic: 'persvāsiō'},
	{Word: 'Eduardō', Lemmata: 'Eduardus', Enclitic: 'unencliticized', Phonetic: 'edvardō'},
	{Word: 'suēscō', Lemmata: 'suēscō', Enclitic: 'unencliticized', Phonetic: 'svēscō'},
	{Word: 'cōnsuētūdō', Lemmata: 'cōnsuētūdō', Enclitic: 'unencliticized', Phonetic: 'cõsvētūdō'},
	{Word: 'urguet', Lemmata: 'urgueō', Enclitic: 'unencliticized', Phonetic: 'urgvet'},
	{Word: 'iacent', Lemmata: 'iaceō', Enclitic: 'unencliticized', Phonetic: 'jacent'},
	{Word: 'coniectant', Lemmata: 'coniectō', Enclitic: 'unencliticized', Phonetic: 'conjectant'},
	{Word: 'subicit', Lemmata: 'subiciō', Enclitic: 'unencliticized', Phonetic: 'subjicit'},
	{Word: 'coniūnctiō', Lemmata: 'coniūnctiō', Enclitic: 'unencliticized', Phonetic: 'conjūnctiō'},
	{Word: 'coniūnx', Lemmata: 'coniūnx', Enclitic: 'unencliticized', Phonetic: 'conjūncs'},
	{Word: 'coniugor', Lemmata: 'coniugō', Enclitic: 'unencliticized', Phonetic: 'conjugor'},
	{Word: 'disiungimus', Lemmata: 'disiungō', Enclitic: 'unencliticized', Phonetic: 'disjungimus'},
	{Word: 'iniugem', Lemmata: 'iniugis', Enclitic: 'unencliticized', Phonetic: 'injugẽ'},
	{Word: 'biiugem', Lemmata: 'biiugis', Enclitic: 'unencliticized', Phonetic: 'bijugẽ'},
	{Word: 'biiugum', Lemmata: 'biiugis', Enclitic: 'unencliticized', Phonetic: 'bijugũ'},
	{Word: 'subiugat', Lemmata: 'subiugō', Enclitic: 'unencliticized', Phonetic: 'subjugat'},
	{Word: 'adiūdicārī', Lemmata: 'adiūdicō', Enclitic: 'unencliticized', Phonetic: 'adjūdicārī'},
	{Word: 'adiuvāns', Lemmata: 'adiuvō', Enclitic: 'unencliticized', Phonetic: 'adjuvãs'},
	{Word: 'iniūriae', Lemmata: 'iniūria', Enclitic: 'unencliticized', Phonetic: 'injūrià'},
	{Word: 'iūsiūrandum', Lemmata: 'iūsiūrandum', Enclitic: 'unencliticized', Phonetic: 'jūsjūrandũ'},
	{Word: 'iūrisiūrandī', Lemmata: 'iūsiūrandum', Enclitic: 'unencliticized', Phonetic: 'jūrisjūrandī'},
	{Word: 'periūrae', Lemmata: 'periūrus', Enclitic: 'unencliticized', Phonetic: 'perjūrà'},
	{Word: 'Iūliam', Lemmata: 'Iūlia Iūlius[adj]', Enclitic: 'unencliticized', Phonetic: 'jūliã'},
	{Word: 'iocant', Lemmata: 'iocō', Enclitic: 'unencliticized', Phonetic: 'jocant'},
	{Word: 'iambe', Lemmata: 'iambus', Enclitic: 'unencliticized', Phonetic: 'iambe'},
	{Word: 'Iāsoniī', Lemmata: 'Iāsonius', Enclitic: 'unencliticized', Phonetic: 'iāsoniī'},
	{Word: 'iīs', Lemmata: 'is', Enclitic: 'unencliticized', Phonetic: 'iīs'},
	{Word: 'magne', Lemmata: 'magnus', Enclitic: 'unencliticized', Phonetic: 'magne'},
	{Word: 'magis', Lemmata: 'magis', Enclitic: 'unencliticized', Phonetic: 'magis'},
	{Word: 'maiestātis', Lemmata: 'maiestās', Enclitic: 'unencliticized', Phonetic: 'majjestātis'},
	{Word: 'maiōrum', Lemmata: 'maiōrēs', Enclitic: 'unencliticized', Phonetic: 'majjōrũ'},
	{Word: 'malō', Lemmata: 'malus', Enclitic: 'unencliticized', Phonetic: 'malō'},
	{Word: 'male', Lemmata: 'male', Enclitic: 'unencliticized', Phonetic: 'male'},
	{Word: 'aiō', Lemmata: 'aiō', Enclitic: 'unencliticized', Phonetic: 'ajjō'},
	{Word: 'aiunt', Lemmata: 'aiō', Enclitic: 'unencliticized', Phonetic: 'ajjunt'},
	{Word: 'ait', Lemmata: 'aiō', Enclitic: 'unencliticized', Phonetic: 'ait'},
	{Word: '-que', Lemmata: '-que', Enclitic: 'que', Phonetic: 'qe'},
	{Word: 'lectiientāculāris', Lemmata: 'lectiientāculāris', Enclitic: 'unencliticized', Phonetic: 'lectijentāculāris'},
	{Word: 'Ōsuestriā', Lemmata: 'Ōsuestria', Enclitic: 'unencliticized', Phonetic: 'ōsvestriā'},
	{Word: 'Reiciavīcum', Lemmata: 'Reiciavīcum', Enclitic: 'unencliticized', Phonetic: 'rejcjavīcũ'},
	{Word: 'kalendae', Lemmata: 'kalendae', Enclitic: 'unencliticized', Phonetic: 'calendà'},
	{Word: 'ēheu', Lemmata: 'ēheu', Enclitic: 'unencliticized', Phonetic: 'ēh€'},
	{Word: 'meus', Lemmata: 'meus', Enclitic: 'unencliticized', Phonetic: 'meus'},
	{Word: 'Orpheus', Lemmata: 'Orpheus', Enclitic: 'unencliticized', Phonetic: 'orφ€s'},
	{Word: 'eunt', Lemmata: 'eō', Enclitic: 'unencliticized', Phonetic: 'eunt'},
	{Word: 'eundum', Lemmata: 'eō', Enclitic: 'unencliticized', Phonetic: 'eundũ'},
	{Word: 'eius', Lemmata: 'is', Enclitic: 'unencliticized', Phonetic: 'èjus'},
	{Word: 'maius', Lemmata: 'magnus magis', Enclitic: 'unencliticized', Phonetic: 'majjus'},
	{Word: 'peior', Lemmata: 'malus male', Enclitic: 'unencliticized', Phonetic: 'pèjor'},
	{Word: 'peiōribus', Lemmata: 'malus male', Enclitic: 'unencliticized', Phonetic: 'pèjōribus'},
	{Word: 'peius', Lemmata: 'malus male', Enclitic: 'unencliticized', Phonetic: 'pèjus'},
	{Word: 'dees', Lemmata: 'dēsum', Enclitic: 'unencliticized', Phonetic: 'dēs'},
	{Word: 'deestis', Lemmata: 'dēsum', Enclitic: 'unencliticized', Phonetic: 'dēstis'},
	{Word: 'deesve', Lemmata: 'dēsum', Enclitic: 've', Phonetic: 'dēsve'},
]

const stressTests = [
	{Word: '-que', Lemmata: '-que', Enclitic: 'que', Stress: 2},
	{Word: 'abdōmine', Lemmata: 'abdōmen', Enclitic: 'unencliticized', Stress: 3},
	{Word: 'addūc', Lemmata: 'addūcō', Enclitic: 'unencliticized', Stress: 1},
	{Word: 'ai', Lemmata: 'ai', Enclitic: 'unencliticized', Stress: 1},
	{Word: 'dominī', Lemmata: 'dominus', Enclitic: 'unencliticized', Stress: 3},
	{Word: 'domínī', Lemmata: 'dominium', Enclitic: 'unencliticized', Stress: 2},
	{Word: 'illīc', Lemmata: 'illīc', Enclitic: 'unencliticized', Stress: 1},
	{Word: 'imperī', Lemmata: 'imperium', Enclitic: 'unencliticized', Stress: 2},
	{Word: 'Latīnitās', Lemmata: 'Latīnitās', Enclitic: 'unencliticized', Stress: 3},
	{Word: 'Latīnus', Lemmata: 'Latīnus[prn] Latīnus[adj]', Enclitic: 'unencliticized', Stress: 2},
	{Word: 'Latīnusque', Lemmata: 'Latīnus[prn] Latīnus[adj]', Enclitic: 'que', Stress: 2},
	{Word: 'lingua', Lemmata: 'lingua', Enclitic: 'unencliticized', Stress: 2},
	{Word: 'linguaque', Lemmata: 'lingua', Enclitic: 'que', Stress: 2},
	{Word: 'mōns', Lemmata: 'mōns', Enclitic: 'unencliticized', Stress: 1},
	{Word: 'proïndē', Lemmata: 'proïndē', Enclitic: 'unencliticized', Stress: 3},
	{Word: 'Quīntilī', Lemmata: 'Quīntilius[prn]', Enclitic: 'unencliticized', Stress: 2},
	{Word: 'Rhoda', Lemmata: 'Rhoda', Enclitic: 'unencliticized', Stress: 2},
	{Word: 'Rhodane', Lemmata: 'Rhoda', Enclitic: 'ne', Stress: 2},
	{Word: 'Rhódane', Lemmata: 'Rhodanus', Enclitic: 'unencliticized', Stress: 3},
	{Word: 'satin', Lemmata: 'satis', Enclitic: 'ne', Stress: 1},
	{Word: 'st', Lemmata: 'st sum', Enclitic: 'unencliticized', Stress: 0},
	{Word: 'suamet', Lemmata: 'suamet', Enclitic: 'unencliticized', Stress: 2},
	{Word: 'tandem', Lemmata: 'tandem', Enclitic: 'unencliticized', Stress: 2},
	{Word: 'ūndēcentēsimus', Lemmata: 'ūndēcentēsimus', Enclitic: 'unencliticized', Stress: 3},
	{Word: 'dees', Lemmata: 'dēsum', Enclitic: 'unencliticized', Stress: 1},
	{Word: 'deestis', Lemmata: 'dēsum', Enclitic: 'unencliticized', Stress: 2},
	{Word: 'deesve', Lemmata: 'dēsum', Enclitic: 've', Stress: 2},
]

const extraTests = [
	{word: 'st',           lemmata: 'st sum',   enclitic: 'unencliticized',  func: 'EcclesVowels',                   expected: '∅'          },
	{word: 'st',           lemmata: 'st sum',   enclitic: 'unencliticized',  func: 'EcclesSort',                     expected: '-st---st/'  },
	{word: 'st',           lemmata: 'st sum',   enclitic: 'unencliticized',  func: 'Sort',                           expected: '-st---st/'  },
	{word: 'dehinc',       lemmata: 'dehinc',   enclitic: 'unencliticized',  func: 'EcclesRhymeVowelsAndUltimaCoda', expected: 'ejnc'       },
	{word: 'dehinc',       lemmata: 'dehinc',   enclitic: 'unencliticized',  func: 'EcclesPhonetic',                 expected: 'dejnc'      },
	{word: 'dein',         lemmata: 'deinde',   enclitic: 'unencliticized',  func: 'EcclesPhonetic',                 expected: 'dejn'       },
	{word: 'deinde',       lemmata: 'deinde',   enclitic: 'unencliticized',  func: 'EcclesPhonetic',                 expected: 'dejnde'     },
	{word: 'dehïnc',       lemmata: 'dehinc',   enclitic: 'unencliticized',  func: 'EcclesPhonetic',                 expected: 'deinc'      },
	{word: 'deïn',         lemmata: 'deinde',   enclitic: 'unencliticized',  func: 'EcclesPhonetic',                 expected: 'dein'       },
	{word: 'deïnde',       lemmata: 'deinde',   enclitic: 'unencliticized',  func: 'EcclesPhonetic',                 expected: 'deinde'     },
	// I’m not actually sure how a nasalised ending should be pronounced before an enclitic.
	// Nasal in classical & non-nasal vowel + n in ecclesiastical is how I did it in Excel.
	{word: 'īnspectemque', lemmata: 'īnspectō', enclitic: 'que',             func: 'Phonetic',                       expected: 'ĩspectẽqe'  },
	{word: 'īnspectemque', lemmata: 'īnspectō', enclitic: 'que',             func: 'EcclesPhonetic',                 expected: 'inspectenqe'},
]


//// Tests looping over the above arrays:

const testPhonetic = () => {
	phoneticTests.forEach(test => {
		const actual = f.Phonetic(test.Word, test.Lemmata, test.Enclitic)
		if (actual === test.Phonetic) {
			console.log(`Yay! Phonetic(${test.Word}) => ${actual}`)
		}
		else {
			console.error(`Phonetic(${test.Word}) should give ${test.Phonetic} but actually gives ${actual}`)
		}
	})
}

const testStress = () => {
	//// Encliticized words will be recognised as such if the unencliticized words are in `allWordsOnlyWord`.
	allWordsOnlyWord.push('Latīnus', 'lingua', 'Rhoda');
	stressTests.forEach(test => {
		const actual = f.Stress(test.Word, test.Lemmata, test.Enclitic)
		if (actual === test.Stress) {
			console.log(`Yay! Stress(${test.Word}) => ${actual}`)
		}
		else {
			console.error(`Stress(${test.Word}) should give ${test.Stress} but actually gives ${actual}`)
		}
	})
}

const doExtraTests = () => {
	//// Encliticized words will be recognised as such if the unencliticized words are in `allWordsOnlyWord`.
	allWordsOnlyWord.push('īnspectem');
	extraTests.forEach(test => {
		const actual = f[test.func](test.word, test.lemmata, test.enclitic)
		if (actual === test.expected) {
			console.log(`Yay! ${test.func}(${test.word}) => ${actual}`)
		}
		else {
			console.error(`${test.func}(${test.word}) should give ${test.expected} but actually gives ${actual}`)
		}
	})
}

const testAllFunctions = () => {
	for (const wordObject of expectedOutputCoveringAllFunctions) {
		const word = wordObject.Word;
		const lemmata = wordObject.Lemmata;
		const enclitic = wordObject.Enclitic;

		functionNames.forEach(functionName => {
			const expectedOutput = wordObject[functionName];
			const actualOutput = wordsformFunctions[functionName](word, lemmata, enclitic);

			if (expectedOutput === undefined && actualOutput === '') {
				console.warn(`Neither the function nor the expected value has been defined for ${functionName}(${word}, ${lemmata}, ${enclitic})`);
			}
			else if (expectedOutput === undefined) {
				console.warn(`${functionName}(${word}, ${lemmata}, ${enclitic}) gives ${actualOutput} but the expected value hasn’t been defined`);
			}
			else if (actualOutput === '') {
				console.log(`${functionName}(${word}, ${lemmata}, ${enclitic}) should give ${expectedOutput} but the function hasn’t been written`);
			}
			else if (JSON.stringify(actualOutput) === JSON.stringify(expectedOutput)) {
				console.log(`Yay! ${functionName}(${word}, ${lemmata}, ${enclitic}) => ${expectedOutput}`);
			}
			else {
				console.error({for: `${functionName}(${word}, ${lemmata}, ${enclitic})`, expected: expectedOutput, actual: actualOutput});
			}
		});

		addToWordsArray(word, lemmata);
		clearMemoisationCache();
	}
}

//// Event-listener:

buttonTest.addEventListener('click', ()=>{
	clearWordsArray();

	testAllFunctions(),
	clearWordsArray();

	testPhonetic(),
	clearWordsArray();

	testStress()
	clearWordsArray();

	doExtraTests()
	clearWordsArray();
});


//// This isn’t used because the Generator produces Json, not tab-delimited data.
const expectedTabbedOutputFromSampleData =
`Ord	Word	Lemmata	Length	AllConsonants	Uncompounded	Phonetic	Scansion	AllVowels	SyllableCount	Stress	UltimaRhyme	RhymeVowels	PerfectRhyme	RhymeConsonants	Ultima	RhymeVowelsAndUltimaCoda	EcclesPhonetic	EcclesVowels	EcclesRhymeVowels	EcclesRhymeVowelsAndUltimaCoda	EcclesPerfectRhyme	EcclesSort	LemmaCount	Lemma1	Lemma2	Lemma3	Lemma4	Lemma5	ScansionWithElision	IsFitForDactyl	LemmaArray	IsLemma	IsNonLemma	DuplicateWords	NewLemmata	NoMacra	NoMacraLowerCase	AlphOrderNoMacra	Sort
89780	vocābulōrum	vocābulum	11	vcblrm	vocābulōrum	vocābulōrũ	⏑–⏑––	oāuōũ	5	2	ũ	ōũ	ōrũ	aram	'2 ũ	ōũ	vocabulorum	oauou	ou	oum	orum	ou-aram-uao-labacav-vocazzzzbulozzzzrum/	1	vocābulum					⏑–⏑–	0	["vocābulum"]	0	1			vocabulorum	vocabulorum	abclmooruuv	ozzzzuzzzzzz-ara-uazzzzo-labazzzzcav-vocābulōrum/
89781	excellentium	excellēns excellō	12	xcllntm	excellentium	ecscellentiũ	–––⏑–	eeeiũ	5	3	ũ	eiũ	entiũ	antaam	ũ	eiũ	ecscellentium	eeeiu	eiu	eium	entium	eiu-antaam-ee-llacsca-excellentium/	2	excellēns	excellō				–––⏑	1	["excellēns","excellō"]	0	1			excellentium	excellentium	ceeeillmntux	eiuzzzzzz-antaa-ee-llacsca-excellentium/
89782	Latīnōrum	Latīnus[prn] Latīnus[adj]	9	ltnrm	Latīnōrum	latīnōrũ	⏑–––	aīōũ	4	2	ũ	ōũ	ōrũ	aram	'2 ũ	ōũ	latinorum	aiou	ou	oum	orum	ou-aram-ia-natal-latizzzznozzzzrum	2	Latīnus[prn]	Latīnus[adj]				⏑––	1	["Latīnus[prn]","Latīnus[adj]"]	0	1			Latinorum	latinorum	ailmnortu	ozzzzuzzzzzz-ara-izzzza-nizzzztal-latīnōrum
`
