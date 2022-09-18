# Word Data Generator for velut

https://www.duncanritchie.co.uk/velut-word-data-generator/

This is a webpage that generates data for my Latin rhyming dictionary, [velut](https://github.com/DuncanRitchie/velut); specifically it generates the “words” data. For each word and corresponding list of lemmata, this generates fields such as the phonetic representation, the number of syllables, the rhyming-part, and strings that words are sorted on. The resultant Json can be downloaded (or copied to the clipboard). Once it’s on my hard drive, I have a script to upload it to the “words” collection in the MongoDB database that the velut website uses.

## Input

Each line of input must be a word, a tab, and the space-separated list of lemmata. For example:

```txt
vocābulōrum	vocābulum
excellentium	excellēns excellō
```

There is a “Load sample” button to give you more examples.

## Output

The Json generated does not have commas separating the objects, or square brackets around the entire array. This is not the standard Json format, but is the format required by mongoimport (which is the tool my script uses to import into the database).

The example above gives this output:

```json
{
  "Ord": 1,
  "Word": "vocābulōrum",
  "Lemmata": "vocābulum",
  "Length": 11,
  "AllConsonants": "vcblrm",
  "Uncompounded": "vocābulōrum",
  "Phonetic": "vocābulōrũ",
  "Scansion": "⏑–⏑––",
  "AllVowels": "oāuōũ",
  "SyllableCount": 5,
  "Stress": 2,
  // Several more fields
 }
 {
  "Ord": 2,
  "Word": "excellentium",
  "Lemmata": "excellēns excellō",
  "Length": 12,
  "AllConsonants": "xcllntm",
  "Uncompounded": "excellentium",
  "Phonetic": "ecscellentiũ",
  "Scansion": "–––⏑–",
  "AllVowels": "eeeiũ",
  "SyllableCount": 5,
  "Stress": 3,
  // Etc
 }
```

## Context: the velut Excel file

Although the velut website uses a MongoDB database, and this page produces Json data for the MongoDB database, I privately have a large Excel file for generating and storing the data in velut. This webpage is intended to replace a sheet called “wordsform” in that Excel file. The sheet can generate all the data from words and lemmata entered into the second and third columns — which is why the second and third fields of the output are Word and Lemmata, the two columns that don’t have Excel formulae.

One of the differences between the “wordsform” sheet and this Word Data Generator is that in the sheet the output data are in Excel cells, but in the generator they’re in Json format. Copying data from Excel makes them tab-delimited. To convert the tab-delimited data to Json, I use my <a href="https://www.duncanritchie.co.uk/velut-json-generator">Json Generator</a>, which is a separate webpage. But I’ll hopefully have less need of that in the future, because the data from the Word Data Generator are already in Json format.

I haven’t yet checked the output of the Word Data Generator against the data I already have from Excel, apart from the sample data. So I expect some bugs will have been introduced in my attempts to re-write my Excel formulae in JavaScript. When I’m confident that this page gives the same output as my Excel formulae, for all the Latin words I have, I will then stop using the “wordsform” sheet.

It’s all part of my long-term project of converting my Excel file into websites and webpages that are easier to share and maintain. I’m very much in a transition period of using the Excel file for some things and my newer websites/webpages for others. But the Word Data Generator is another step in the process. At the moment, the whole velut project is very convoluted; in the future, it won’t be as bad.

_If you’re not me, you’re unlikely to have much use for the Word Data Generator, but kudos to you for reading so far!_

## Quick links

- [Full list of fields and their Excel formulae](https://github.com/DuncanRitchie/velut-word-data-generator/blob/main/velut-wordsform-formulae.js)
- [The same formulae but ported to JavaScript](https://github.com/DuncanRitchie/velut-word-data-generator/blob/main/velut-wordsform-functions.js)
- [List of exemptions to phonetic rules](https://github.com/DuncanRitchie/velut-word-data-generator/blob/main/velut-phonetic-exceptions.js)
- [velut website](https://www.velut.co.uk)
- [My personal website](https://www.duncanritchie.co.uk)
