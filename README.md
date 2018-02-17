# common query parser

A dumb parser for generic query syntax.

**> snake plissken -title:"L.A."**

*I want to find movies with or about Snake Plissken, but not the 1996 sequel* Escape from L.A.


## Installation & use

1. Install:

```
npm install common-query-parser
```

or, with yarn:

```
yarn add common-query-parser
```

2. Import & feed it strings:

```
import Parser from 'common-query-parser'

let queryTerms = Parser(`house of the rising sun -band:"the animals"`)
//=> [
    { value: 'house' },
    { value: 'of' },
    { value: 'the' },
    { value: 'rising' },
    { value: 'sun' },
    { field: 'band', value: 'the animals', negated: true }
]
```


## Query grammar

CQP groks a fairly common query syntax that supports words and phrases, optionally scoped to named fields, and simple negation.

- terms are separated by spaces, and can contain any other characters
- surround a phrase with quotes to treat it as a single term
- prefix any term with a colon to specify a named field for the term
- as with terms, field names may only contain spaces if the field name is wrapped with quotes
- prefix a term with minus to indicate it is unwanted
- literal spaces, quotes, colons, and minus signs may be escaped with a backslash (`\`)


## Return value

CQP always returns an array, with one element per term recovered from the input string, in source order. Letter case is preserved. Elements are shaped like so:

```
{
    field: String // only present if term was prefixed with name & colon
    value: String // the text of the term, excluding any outer quotation marks
    negated: true // only present if term was prefixed with minus
}
```

If no terms could be recovered, an empty array will be returned.


## Limitations

CQP does not support boolean operators or logical grouping of any kind. All terms are interpreted as being jointly required.

It doesn't doesn't know anything about your data set, and it doesn't provide any logic for filtering a data set.

It has not been tested with multi-byte character encodings.


# Development

Pull requests welcome, as are tickets and good edge cases.

The parser algorithm inspects every character in order in a mode-based way, instead of being built with Regular Expressions or other, more sugary strategies.


## Roadmap

The only feature I know I want to add is a second parsing tool that uses [boolean-parser-js](https://github.com/riichard/boolean-parser-js) to parse and recover sets of independently satisfactory criteria from enhanced syntax including boolean operators and grouping with parentheses.

I'm open to other ideas, like better UTF-16 support.


## Setup & run

Clone and install dependencies with yarn or npm.


## Use TDD

I find TDD uniquely helpful for libraries like this. I recommend you begin by creating new test cases in `parser.test.js` for whatever syntax you desire, then editing until all tests pass.

You can run tests with:

```
npm test
```

or, with yarn

```
yarn test
```


## Stylistic stuff

I hate linters. If you intend to submit a PR, make your code look like mine, but above all, format code for clarity.


# Acknowledgments

This repo is based on Dan Couper's [es6-module-starter](https://github.com/DanCouper/es6-module-starter), although it was broken when I forked, and I was forced to rip out a lot of optional stuff I couldn't set up again.


# License

UNLICENSED (for now)
