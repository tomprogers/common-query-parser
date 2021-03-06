# common query parser

A dumb parser for generic query syntax.

```
snake plissken -title:"L. A."
```

*I want to find movies with or about Snake Plissken, but not the 1996 movie* Escape from L. A.


## Query grammar

CQP groks a straightforward query syntax that supports words and phrases, optionally scoped to named fields, with simple negation and escaping.

- terms are separated by spaces, and can contain any other characters

```
it's pat!
```

- surround a set of words with quotes to treat it as a single term

```
the searchers
//> 2 terms: "the" & "searchers"

"the searchers"
//> 1 term: "the searchers"
```

- prefix any term with a word and a colon to specify a named field for that term

```
author:niven

title:"The Long ARM of Gil Hamilton"
```

- as with terms, surround a field name with quotes to treat several words as a single field name

```
"date modified":2018-02-17
```

- prefix a term with minus to indicate it is unwanted

```
-twilight

-"breaking dawn"

-author:"Stephenie Meyer"
```

- spaces, quotes, colons, and minus signs may be escaped with a backslash (`\`), which causes them to be treated as normal characters

```
mission\:impossible
\-273.15°C
```


## Return value

CQP always returns an array, with one element per term recovered from the input string, in source order. Letter case is preserved. Elements are shaped like so:

```
{
    // only present if term was prefixed with field name & colon
    field: String | undefined

    // the text of the term, excluding any outer quotation marks
    value: String

    // only present if term was prefixed with minus
    negated: true | undefined
}
```

An example:

```
import parseQuery from 'common-query-parser'
parseQuery('house of the rising sun -band:"the animals"')
```

yields:

```
[
    { value: 'house' },
    { value: 'of' },
    { value: 'the' },
    { value: 'rising' },
    { value: 'sun' },
    { field: 'band', value: 'the animals', negated: true }
]
```

If no terms could be recovered, an empty array will be returned.


## Limitations

CQP does not support boolean operators or logical grouping of any kind.

CQP doesn't doesn't know anything about your data set, and it doesn't provide any logic for filtering a data set.

CQP has not been tested with multi-byte character encodings.


## Installation & use

1. Install:

```bash
$ yarn add common-query-parser
```

2. Import & feed it strings:

```js
import parseQuery from 'common-query-parser'

let queryTerms = parseQuery(`house of the rising sun -band:"the animals"`)
```


# Development

Pull requests welcome, as are tickets and good edge cases.


The parser algorithm inspects every character in order in a mode-based way, instead of being built with Regular Expressions or other, more sugary strategies.


## Roadmap

The only feature I know I want to add is a second parsing tool that uses [boolean-parser-js](https://github.com/riichard/boolean-parser-js) to parse and recover sets of independently satisfactory criteria from enhanced syntax including boolean operators and grouping with parentheses.

I'm open to other ideas, like better UTF-16 support.


## Setup & run

Clone and install dependencies with yarn or npm.


## Stylistic stuff

I hate linters. If you intend to submit a PR, make your code look like mine, but above all, format code for clarity.


# License

MIT. See the LICENSE file for the legalese.
