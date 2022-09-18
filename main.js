const buttonClearInputs = document.getElementById("clear-inputs");
const buttonLoadSampleData = document.getElementById("load-sample-data");
const textareaInput = document.getElementById("textarea-input");
const textByGenerateJson = document.getElementById("text-by-generate-json");
const buttonGenerateJson = document.getElementById("generate-json");
const textareaOutput = document.getElementById("textarea-output");
const textByCopyToClipboard = document.getElementById("text-by-copy-to-clipboard");
const buttonCopyToClipboard = document.getElementById("copy-to-clipboard");
const buttonDownload = document.getElementById("download");

textareaOutput.value = "";


//// Schema. Commented-out properties will not be used.

const wordsSchema = {
    Ord: "int",
    Word: "string",
    // Lemmata: "string",
    Length: "int",
    AllConsonants: "string",
    Uncompounded: "string",
    Phonetic: "string",
    Scansion: "string",
    ScansionWithElision: "string",
    IsFitForDactyl: "int",
    AllVowels: "string",
    SyllableCount: "int",
    Stress: "int",
    UltimaRhyme: "string",
    RhymeVowels: "string",
    PerfectRhyme: "string",
    RhymeConsonants: "string",
    // Ultima: "string",
    RhymeVowelsAndUltimaCoda: "string",
    EcclesPhonetic: "string",
    EcclesVowels: "string",
    EcclesRhymeVowels: "string",
    EcclesRhymeVowelsAndUltimaCoda: "string",
    EcclesPerfectRhyme: "string",
    EcclesSort: "string",
    LemmaCount: "int",
    // Lemma1: "string",
    // Lemma2: "string",
    // Lemma3: "string",
    // Lemma4: "string",
    // Lemma5: "string",
    LemmaArray: "array",
    IsLemma: "int",
    IsNonLemma: "int",
    // DuplicateWords: "string",
    // NewLemmata: "string",
    NoMacra: "string",
    NoMacraLowerCase: "string",
    AlphOrderNoMacra: "string",
    Sort: "string",
    // RepeatWord: "string",
};


//// Sample data the user can load if they don’t have my Excel file:

const sampleData =
`vocābulōrum	vocābulum
excellentium	excellēns excellō
Latīnōrum	Latīnus[prn] Latīnus[adj]
ūtilēs	ūtilis
tabulae	tabula
`

const expectedTabbedOutputFromSampleData =
`Ord	Word	Lemmata	Length	AllConsonants	Uncompounded	Phonetic	Scansion	AllVowels	SyllableCount	Stress	UltimaRhyme	RhymeVowels	PerfectRhyme	RhymeConsonants	Ultima	RhymeVowelsAndUltimaCoda	EcclesPhonetic	EcclesVowels	EcclesRhymeVowels	EcclesRhymeVowelsAndUltimaCoda	EcclesPerfectRhyme	EcclesSort	LemmaCount	Lemma1	Lemma2	Lemma3	Lemma4	Lemma5	ScansionWithElision	IsFitForDactyl	LemmaArray	IsLemma	IsNonLemma	DuplicateWords	NewLemmata	NoMacra	NoMacraLowerCase	AlphOrderNoMacra	Sort
89780	vocābulōrum	vocābulum	11	vcblrm	vocābulōrum	vocābulōrũ	⏑–⏑––	oāuōũ	5	2	ũ	ōũ	ōrũ	aram	'2 ũ	ōũ	vocabulorum	oauou	ou	oum	orum	ou-aram-uao-labacav-vocazzzzbulozzzzrum/	1	vocābulum					⏑–⏑–	0	["vocābulum"]	0	1			vocabulorum	vocabulorum	abclmooruuv	ozzzzuzzzzzz-ara-uazzzzo-labazzzzcav-vocābulōrum/
89781	excellentium	excellēns excellō	12	xcllntm	excellentium	ecscellentiũ	–––⏑–	eeeiũ	5	3	ũ	eiũ	entiũ	antaam	ũ	eiũ	ecscellentium	eeeiu	eiu	eium	entium	eiu-antaam-ee-llacsca-excellentium/	2	excellēns	excellō				–––⏑	1	["excellēns","excellō"]	0	1			excellentium	excellentium	ceeeillmntux	eiuzzzzzz-antaa-ee-llacsca-excellentium/
89782	Latīnōrum	Latīnus[prn] Latīnus[adj]	9	ltnrm	Latīnōrum	latīnōrũ	⏑–––	aīōũ	4	2	ũ	ōũ	ōrũ	aram	'2 ũ	ōũ	latinorum	aiou	ou	oum	orum	ou-aram-ia-natal-latizzzznozzzzrum	2	Latīnus[prn]	Latīnus[adj]				⏑––	1	["Latīnus[prn]","Latīnus[adj]"]	0	1			Latinorum	latinorum	ailmnortu	ozzzzuzzzzzz-ara-izzzza-nizzzztal-latīnōrum
`

const expectedOutputFromSampleData = {
"vocābulōrum": {
  "Ord": 123,
  "Word": "vocābulōrum",
  "Lemmata": "vocābulum",
  "Length": 11,
  "AllConsonants": "vcblrm",
  "Uncompounded": "vocābulōrum",
  "Phonetic": "vocābulōrũ",
  "Scansion": "⏑–⏑––",
  "ScansionWithElision": "⏑–⏑–",
  "IsFitForDactylic": 0,
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
  "DuplicateWords": "",
  "NewLemmata": "",
  "NoMacra": "vocabulorum",
  "NoMacraLowerCase": "vocabulorum",
  "AlphOrderNoMacra": "abclmooruuv",
  "Sort": "ozzzzuzzzzzz-ara-uazzzzo-labazzzzcav-vocābulōrum/",
  "RepeatWord": "vocābulōrum",
},
"excellentium": {
  "Ord": 123,
  "Word": "excellentium",
  "Lemmata": "excellēns excellō",
  "Length": 12,
  "AllConsonants": "xcllntm",
  "Uncompounded": "excellentium",
  "Phonetic": "ecscellentiũ",
  "Scansion": "–––⏑–",
  "ScansionWithElision": "–––⏑",
  "IsFitForDactylic": 1,
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
  "LemmaArray": ["excellēns","excellō"],
  "IsLemma": 0,
  "IsNonLemma": 1,
  "DuplicateWords": "",
  "NewLemmata": "",
  "NoMacra": "excellentium",
  "NoMacraLowerCase": "excellentium",
  "AlphOrderNoMacra": "ceeeillmntux",
  "Sort": "eiuzzzzzz-antaa-ee-llacsca-excellentium/",
  "RepeatWord": "excellentium",
},
"Latīnōrum": {
  "Ord": 123,
  "Word": "Latīnōrum",
  "Lemmata": "Latīnus[prn] Latīnus[adj]",
  "Length": 9,
  "AllConsonants": "ltnrm",
  "Uncompounded": "Latīnōrum",
  "Phonetic": "latīnōrũ",
  "Scansion": "⏑–––",
  "ScansionWithElision": "⏑––",
  "IsFitForDactylic": 1,
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
  "LemmaArray": ["Latīnus[prn]","Latīnus[adj]"],
  "IsLemma": 0,
  "IsNonLemma": 1,
  "DuplicateWords": "",
  "NewLemmata": "",
  "NoMacra": "Latinorum",
  "NoMacraLowerCase": "latinorum",
  "AlphOrderNoMacra": "ailmnortu",
  "Sort": "ozzzzuzzzzzz-ara-izzzza-nizzzztal-latīnōrum",
  "RepeatWord": "Latīnōrum",
},
"ūtilēs": {
  "Ord": 123,
  "Word": "ūtilēs",
  "Lemmata": "ūtilis",
  "Length": 6,
  "AllConsonants": "tls",
  "Uncompounded": "ūtilēs",
  "Phonetic": "ūtilēs",
  "Scansion": "–⏑–",
  "ScansionWithElision": "–⏑–",
  "IsFitForDactylic": 0,
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
  "EcclesSort": "uie-atalas---uzzzztilezzzzs",
  "LemmaCount": 1,
  "Lemma1": "ūtilis",
  "Lemma2": null,
  "Lemma3": null,
  "Lemma4": null,
  "Lemma5": null,
  "LemmaArray": ["ūtilis"],
  "IsLemma": 0,
  "IsNonLemma": 1,
  "DuplicateWords": "",
  "NewLemmata": "",
  "NoMacra": "utiles",
  "NoMacraLowerCase": "utiles",
  "AlphOrderNoMacra": "eilstu",
  "Sort": "uzzzziezzzzzz-atalas---ūtilēs",
  "RepeatWord": "ūtilēs",
},
"tabulae": {
  "Ord": 123,
  "Word": "tabulae",
  "Lemmata": "tabula",
  "Length": 7,
  "AllConsonants": "tbl",
  "Uncompounded": "tabulae",
  "Phonetic": "tabulà",
  "Scansion": "⏑⏑–",
  "ScansionWithElision": "⏑⏑",
  "IsFitForDactylic": 1,
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
  "EcclesSort": "aue-abala---abulazzzzzzzzz",
  "LemmaCount": 1,
  "Lemma1": "tabula",
  "Lemma2": null,
  "Lemma3": null,
  "Lemma4": null,
  "Lemma5": null,
  "LemmaArray": ["tabula"],
  "IsLemma": 0,
  "IsNonLemma": 1,
  "DuplicateWords": "",
  "NewLemmata": "",
  "NoMacra": "tabulae",
  "NoMacraLowerCase": "tabulae",
  "AlphOrderNoMacra": "aabeltu",
  "Sort": "auazzzzzzzz-abala--t-tabulae",
  "RepeatWord": "tabulae",
}
}


//// Functions used in `generateJson`:

const checkResult = (word, lemmata, functionName) => {
    if (expectedOutputFromSampleData[word]) {
        const expectedOutput = expectedOutputFromSampleData[word][functionName];
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
            console.log(`Yay for ${functionName}(${word}, ${lemmata})!`);
        }
        else {
            console.error({for: `${functionName}(${word}, ${lemmata})`, expected: expectedOutput, actual: actualOutput});
        }
    }
}

const getSchemaFromHeaderRow = (headerRow) => {
    switch (headerRow[1]) {
        case "Word":
            tableName = "words";
            return wordsSchema;
        case "Lemma":
            tableName = "lemmata";
            return lemmataSchema;
        default:
            tableName = "custom";
            return generateSchemaFromCustomHeaderRow(headerRow);
    }
}

const generateSchemaFromCustomHeaderRow = (headerRow) => {
    let newSchema = {};
    for (let i = 0; i < headerRow.length; i++) {
        newSchema[headerRow[i]] = "string";
    }
    return newSchema;
}

const getEmptyTextRepresentation = (headerRow) => {
    switch (headerRow[1]) {
        case "Word":
            return "0";
        default:
            return "null";
    }
}

const getLastKey = (schema) => {
    const keys = Object.keys(schema);
    return keys[keys.length - 1];
}

const clearTextMessages = () => {
    textByGenerateJson.textContent = "";
    textByCopyToClipboard.textContent = "";
}

const clearInputs = () => {
    textareaInput.value = "";
    textareaOutput.value = "";
    clearTextMessages();
}

const warnOfEmptyInput = () => {
    clearTextMessages();
    textByGenerateJson.textContent = "Nothing to generate Json from!";
}

const warnOfEmptyOutput = () => {
    clearTextMessages();
    textByCopyToClipboard.textContent = "Nothing to copy or download!";
}

let tableName = "custom"; //// "custom", "lemmata", "words".

const functionNames = Object.keys(wordsformFunctions);

//// `outputArray` gets modified by `generateJson` and displayed in the second text-area by `displayOutput`.

let outputArray = [];

const output = (jsonObject) => {
    outputArray.push(JSON.stringify(jsonObject, undefined, 2));
}


//// Functions called by buttons:

const generateJson = () => {
    clearTextMessages();
    textByGenerateJson.textContent = "Generating Json, please wait...";
    outputArray.length = 0; // Clear the output in case there’s anything from previous runs.
    const allInputRows = textareaInput.value.split("\n");

    // const headerRow = allInputRows[0].split("\t");
    // const schema = getSchemaFromHeaderRow(headerRow);
    // const emptyTextReplacement = getEmptyTextRepresentation(headerRow); // Empty string fields are represented differently in “words” than in “lemmata”.
    // const lastKeyInSchema = getLastKey(schema); // This is used to prevent trailing commas.
    // const countColumnsInInput = headerRow.length;
    const countRows = allInputRows.length;

    //// For each line of values in the input...
    // //// (We skip i==0 because that’s the header row.)
    for (let i = 0; i < countRows; i++) {
        //// Skip empty lines.
        if (allInputRows[i] == "") { continue; }

        const rowOfValues = allInputRows[i].split("\t");
        const [word, lemmata, ...rest] = rowOfValues;
        const resultsForLine = {};

        functionNames.forEach(functionName => {
            resultsForLine[functionName] = wordsformFunctions[functionName](word, lemmata);
            checkResult(word, lemmata, functionName);
        })
        // output ({word, lemmata});
    //     output("{");

    //     //// Create an object that maps each key in `headerRow` to the value in the current row.
    //     let valuesAsObject = {};
    //     for (let j = 0; j < countColumnsInInput; j++) {
    //         const currentKey = headerRow[j];
    //         const currentValue = rowOfValues[j];
    //         valuesAsObject[currentKey] = currentValue;
    //     }

    //     //// Fields will be added to the output in the order they appear in the schema.
    //     for (let currentKey in schema) {
    //         const currentValue = valuesAsObject[currentKey];
    //         //// Decide whether there should be a comma after the key–value pair.
    //         const lineTerminator = currentKey == lastKeyInSchema ? "" : ",";
    //         //// Use the types defined in the schema to determine the format.
    //         //// Strings need to be quoted, but other values do not.
    //         switch (schema[currentKey]) {
    //             case "int":
    //                 output(`"${currentKey}": ${currentValue ? currentValue : "null"}${lineTerminator}`);
    //                 break;
    //             case "string":
    //                 output(`"${currentKey}": ${currentValue ? `"${currentValue}"` : emptyTextReplacement}${lineTerminator}`);
    //                 break;
    //             case "array":
    //                 //// My value from Excel is always valid Json for an array of strings.
    //                 output(`"${currentKey}": ${currentValue}${lineTerminator}`);
    //                 break;
    //             default:
    //                 break;
    //         }
    //     }

        output(resultsForLine);
    }
    displayOutput();
    textByGenerateJson.textContent = "Json generated!";
}

const displayOutput = () => {
    textareaOutput.value = outputArray.join("\n");
}

const copyToClipboard = () => {
    clearTextMessages();
    textByCopyToClipboard.textContent = "Copying to clipboard...";
    textareaOutput.select();
    document.execCommand("copy");
    textByCopyToClipboard.textContent = "Copied!";
}

const download = () => {    
    let a = document.createElement('a');
    a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textareaOutput.value.replace(/\n/g, "\r\n")));;
    a.setAttribute('download', tableName + "_mongo.json");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    clearTextMessages();
}


//// Event listeners.

buttonClearInputs.addEventListener("click", ()=>{
    clearInputs();
});

buttonLoadSampleData.addEventListener("click", ()=>{
    textareaInput.value = sampleData;
    clearTextMessages();
});

buttonGenerateJson.addEventListener("click", ()=>{
    if (textareaInput.value === "") {
        warnOfEmptyInput();
    }
    else {
        generateJson();
    }
});

buttonCopyToClipboard.addEventListener("click", ()=>{
    if (textareaOutput.value === "") {
        warnOfEmptyOutput();
    }
    else {
        copyToClipboard();
    }
});

buttonDownload.addEventListener("click", ()=>{
    if (textareaOutput.value === "") {
        warnOfEmptyOutput();
    }
    else {    
        download();
    }
});
