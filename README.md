# Word Data Generator for velut

https://www.duncanritchie.co.uk/velut-word-data-generator/

This generates data for my Latin rhyming dictionary, [velut](https://github.com/DuncanRitchie/velut); specifically it generates the “words” data. For each word and corresponding list of lemmata, this generates fields such as the phonetic representation, the number of syllables, the rhyming-part, and strings that words are sorted on. The resultant Json can be downloaded or copied to the clipboard.

It has a webpage for a user-interface for demo purposes. When I refresh all the “words” data in velut, I run generator.js in Node. This contains hardcoded filepaths to read input data from and write output data to. I have a script (in a private repo) to upload the output data to the “words” collection in the MongoDB database that the velut website uses.

_If you’re not me, you’re unlikely to have much use for the Word Data Generator._

## Input

Each line of input must be a word, whitespace, and the space-separated list of lemmata. For example:

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
  // Several more fields
 }
 {
  "Ord": 2,
  "Word": "excellentium",
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
  // Etc
 }
```

## Context

Although the velut website uses a MongoDB database, and the Word Data Generator produces Json data for the MongoDB database, I privately have a large Excel file for generating and storing the data in velut. Excel was what I knew when I first got interested in coding, but it’s far from ideal for this sort of thing. I have a long-term project of converting my Excel file into websites and webpages that are easier to share and maintain. I’m very much in a transition period of using the Excel file for some things and my newer websites/webpages for others. But the Word Data Generator is another step in the process.

For more information, see the [About section](https://www.duncanritchie.co.uk/velut-word-data-generator/#about) of the webpage.

## Quick links

- [My Excel formulae that the generator replaces](https://github.com/DuncanRitchie/velut-word-data-generator/blob/main/velut-wordsform-formulae.js)
- [All the important code](https://github.com/DuncanRitchie/velut-word-data-generator/blob/main/generator.js)
- [Tests](https://github.com/DuncanRitchie/velut-word-data-generator/blob/main/tests.js) which can be run from the [webpage](https://www.duncanritchie.co.uk/velut-word-data-generator/)
- [velut website](https://www.velut.co.uk)
- [My personal website](https://www.duncanritchie.co.uk)
