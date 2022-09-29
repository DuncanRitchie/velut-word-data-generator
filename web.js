//// DOM elements

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


//// Functions called by buttons:

const generateJson = () => {
	clearTextMessages();
	clearWordsArray();
	textByGenerateJson.textContent = 'Generating Json, please wait...';
	const allInputRows = textareaInput.value.split('\n');

	convertInputToOutputData(allInputRows);

	displayOutput();
	textByGenerateJson.textContent = 'Json generated!';
}

const displayOutput = () => {
	textareaOutput.value = outputAsArray.join('\n');
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
