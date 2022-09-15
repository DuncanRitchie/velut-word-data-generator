# velut Word Data Generator

This will be a webpage that generates data for the “words” MongoDB collection in [velut](https://github.com/DuncanRitchie/velut). For each word and corresponding list of lemmata, this will generate fields such as the phonetic representation, the number of syllables, the rhyming-part, and strings that words are sorted on. 

- [Full list of fields](https://github.com/DuncanRitchie/velut-word-data-generator/blob/main/velut-wordsform-formulae.js)
- [Exceptions to phonetic rules](https://github.com/DuncanRitchie/velut-word-data-generator/blob/main/velut-phonetic-exceptions.js)

It will replace the “wordsform” sheet in the velut Excel file. It doesn’t need database access.
