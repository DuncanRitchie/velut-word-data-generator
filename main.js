const buttonClearInputs = document.getElementById('clear-inputs');
const buttonLoadSampleData = document.getElementById('load-sample-data');
const textareaInput = document.getElementById('textarea-input');
const textByGenerateJson = document.getElementById('text-by-generate-json');
const buttonGenerateJson = document.getElementById('generate-json');
const textareaOutput = document.getElementById('textarea-output');
const textByCopyToClipboard = document.getElementById('text-by-copy-to-clipboard');
const buttonCopyToClipboard = document.getElementById('copy-to-clipboard');
const buttonDownload = document.getElementById('download');

textareaOutput.value = '';


//// Schema. Commented-out properties will not be used.

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


//// Sample data the user can load if they don’t have my Excel file:

const sampleData =
`vocābulōrum	vocābulum
excellentium	excellēns excellō
Latīnōrum	Latīnus[prn] Latīnus[adj]
ūtilēs	ūtilis
tabulae	tabula
`


//// Functions used in `generateJson`:

const clearTextMessages = () => {
	textByGenerateJson.textContent = '';
	textByCopyToClipboard.textContent = '';
}

const clearInputs = () => {
	textareaInput.value = '';
	textareaOutput.value = '';
	clearTextMessages();
}

const warnOfEmptyInput = () => {
	clearTextMessages();
	textByGenerateJson.textContent = 'Nothing to generate Json from!';
}

const warnOfEmptyOutput = () => {
	clearTextMessages();
	textByCopyToClipboard.textContent = 'Nothing to copy or download!';
}

const functionNames = Object.keys(wordsSchema);

//// `outputArray` gets modified by `generateJson` and displayed in the second text-area by `displayOutput`.

let outputArray = [];

const output = (jsonObject) => {
	outputArray.push('{');
	//// Convert the object to an array of key–value pairs.
	const asEntries = Object.entries(jsonObject);
	let i = 0;
	//// Key–value pairs before the last pair is output as `"key": "value",` with a comma.
	for (; i < asEntries.length - 1; i++) {
		outputArray.push(`"${asEntries[i][0]}": ${JSON.stringify(asEntries[i][1])},`);
	}
	//// The last key–value pair is output as `"key": "value"` without the trailing comma.
	for (; i < asEntries.length; i++) {
		outputArray.push(`"${asEntries[i][0]}": ${JSON.stringify(asEntries[i][1])}`);
	}
	outputArray.push('}');
}


//// Functions called by buttons:

const generateJson = () => {
	clearTextMessages();
	clearWordsArray();
	textByGenerateJson.textContent = 'Generating Json, please wait...';
	outputArray.length = 0; // Clear the output in case there’s anything from previous runs.
	const allInputRows = textareaInput.value.split('\n');
	const countRows = allInputRows.length;

	//// For each line of values in the input...
	for (let i = 0; i < countRows; i++) {
		//// Skip empty lines.
		if (allInputRows[i] === '') { continue; }

		const rowOfValues = allInputRows[i].split('\t');
		const [word, lemmata, ...rest] = rowOfValues;
		const resultsForLine = {};

		functionNames.forEach(functionName => {
			resultsForLine[functionName] = wordsformFunctions[functionName](word, lemmata);
		})

		output(resultsForLine);
		addToWordsArray(word, lemmata);
		clearMemoisationCache();
	}
	displayOutput();
	textByGenerateJson.textContent = 'Json generated!';
}

const displayOutput = () => {
	textareaOutput.value = outputArray.join('\n');
}

const copyToClipboard = () => {
	clearTextMessages();
	textByCopyToClipboard.textContent = 'Copying to clipboard...';
	textareaOutput.select();
	document.execCommand('copy');
	textByCopyToClipboard.textContent = 'Copied!';
}

const download = () => {
	let a = document.createElement('a');
	a.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(textareaOutput.value.replace(/\n/g, '\r\n')));;
	a.setAttribute('download', 'words_mongo.json');
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	clearTextMessages();
}


//// Event listeners.

buttonClearInputs.addEventListener('click', ()=>{
	clearInputs();
});

buttonLoadSampleData.addEventListener('click', ()=>{
	textareaInput.value = sampleData;
	clearTextMessages();
});

buttonGenerateJson.addEventListener('click', ()=>{
	if (textareaInput.value === '') {
		warnOfEmptyInput();
	}
	else {
		generateJson();
	}
});

buttonCopyToClipboard.addEventListener('click', ()=>{
	if (textareaOutput.value === '') {
		warnOfEmptyOutput();
	}
	else {
		copyToClipboard();
	}
});

buttonDownload.addEventListener('click', ()=>{
	if (textareaOutput.value === '') {
		warnOfEmptyOutput();
	}
	else {
		download();
	}
});
