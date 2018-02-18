/*
	{
		field: String | undefined
		value: String
		negated: Boolean | undefined
	}
 */

const trace = true // enable very granular debugging

const CHAR_QUOTE = '"'
const CHAR_BACKSLASH = '\\'
const CHAR_SPACE = ' '
const CHAR_COLON = ':'

const QUOTE              = 'QUOTE' //0x0001
const QUOTED_QUOTE       = 'QUOTED_QUOTE' //0x0010
const ESCAPED_QUOTE      = 'ESCAPED_QUOTE' //0x0100
const BACKSLASH          = 'BACKSLASH' //0x1000
const QUOTED_BACKSLASH   = 'QUOTED_BACKSLASH' //0x0011
const ESCAPED_BACKSLASH  = 'ESCAPED_BACKSLASH' //0x0101
const SPACE              = 'SPACE' //0x1001
const QUOTED_SPACE       = 'QUOTED_SPACE' //0x0110
const ESCAPED_SPACE      = 'ESCAPED_SPACE' //0x1010
const COLON              = 'COLON'
const QUOTED_COLON       = 'QUOTED_COLON'
const ESCAPED_COLON      = 'ESCAPED_COLON'


/**
 * given a single string that (presumably), separate it into /(field:)?"?value"?/ pairs
 * @param  {string} input - an input string of arbitrary length
 * @return {array} of { field: string , value: string }
 */
export default (input) => {
	trace && console.log(new Date().getTime() + ': Parser ', input)
	
	let terms = []
	
	/*
	algorithm:
	examine each character of the input string in order, copying each into a temporary
	buffer until and unless a "special character" is encountered
	
	special characters are:
		space - search terms are separated by spaces (unless those spaces are escaped or occur in a quoted phrase)
		quote - begins or ends a quoted phrase; within a quoted phrase, spaces are not treated as delimiters
		backslash - used to escape special characters so they are treated as literal values
		colon - the first unescaped colon signals that the term is a "key:value" construction instead of merely "value" (this is done via regex once basic separation is complete)
	 */
	
	let currentTermParts = [] // there will be 1 or 2 term parts; this is how we tell diff between field name and term value
	let currentAtomString = '' // we build this up character by character until we find a character that ends an atom (a space, a colon, a quote)
	let insideQuotes = false // will be true when we detect the beginning of a quoted phrase
	let nextCharIsEscaped = false // will be true for the one character immediately after any '\'
	
	for(let i = 0, iMax = input.length; i < iMax; i++) {
		let thisChar = input.charAt(i)
		let TYPE = 'OTHER'
		
		// detection of quotes
		if(thisChar === CHAR_QUOTE && !insideQuotes && !nextCharIsEscaped) {
			TYPE = QUOTE
		} else if(thisChar === CHAR_QUOTE && insideQuotes && !nextCharIsEscaped) {
			TYPE = QUOTED_QUOTE
		} else if(thisChar === CHAR_QUOTE && nextCharIsEscaped) {
			TYPE = ESCAPED_QUOTE
		}
		
		// detection of backslashes
		else if(thisChar === CHAR_BACKSLASH && !insideQuotes && !nextCharIsEscaped) {
			TYPE = BACKSLASH
		} else if (thisChar === CHAR_BACKSLASH && insideQuotes && !nextCharIsEscaped) {
			TYPE = QUOTED_BACKSLASH
		} else if (thisChar === CHAR_BACKSLASH && nextCharIsEscaped) {
			TYPE = ESCAPED_BACKSLASH
		}
		
		// detection of spaces
		else if(thisChar === CHAR_SPACE && !insideQuotes && !nextCharIsEscaped) {
			TYPE = SPACE
		} else if(thisChar === CHAR_SPACE && insideQuotes && !nextCharIsEscaped) {
			TYPE = QUOTED_SPACE
		} else if(thisChar === CHAR_SPACE && nextCharIsEscaped) {
			TYPE = ESCAPED_SPACE
		}
		
		// detection of colons
		else if(thisChar === CHAR_COLON && !insideQuotes && !nextCharIsEscaped) {
			TYPE = COLON
		} else if(thisChar === CHAR_COLON && insideQuotes && !nextCharIsEscaped) {
			TYPE = QUOTED_COLON
		} else if(thisChar === CHAR_COLON && nextCharIsEscaped) {
			TYPE = ESCAPED_COLON
		}
		
		trace && console.log(`  >${thisChar}< ${TYPE}`)
		
		// at this point it's safe to reset the escape-tracker, because we've just finished honoring it (if true)
		nextCharIsEscaped = false
		
		switch(TYPE) {
			
			case QUOTE: // begin phrase
				trace && console.log('  begin phrase')
				insideQuotes = true
				break
			
			case QUOTED_QUOTE: // end phrase
				trace && console.log('  end phrase')
				insideQuotes = false
				break
			
			case ESCAPED_QUOTE: // copy char
				currentAtomString += thisChar
				break
			
			case BACKSLASH: // begin escape
				trace && console.log('  begin escape sequence')
				nextCharIsEscaped = true
				break
			
			case QUOTED_BACKSLASH: // begin escape
				trace && console.log('  begin escape sequence')
				nextCharIsEscaped = true
				break
			
			case ESCAPED_BACKSLASH: // copy char
				currentAtomString += thisChar
				break
			
			case SPACE: // end atom & term
				trace && console.log('  end atom & term')
				currentTermParts.push(currentAtomString)
				terms.push(currentTermParts)
				currentTermParts = []
				currentAtomString = ''
				break
			
			case QUOTED_SPACE: // copy char
				currentAtomString += thisChar
				break
			
			case ESCAPED_SPACE: // copy char
				currentAtomString += thisChar
				break
			
			case COLON: // end first atom, or copy
				trace && console.log('  end first atom or copy')
				if(currentTermParts.length === 0) {
					currentTermParts.push(currentAtomString)
					currentAtomString = ''
				} else {
					currentAtomString += thisChar
				}
				break
			
			case QUOTED_COLON:
				currentAtomString += thisChar
				break
			
			case ESCAPED_COLON:
				currentAtomString += thisChar
				break
			
			
			default: //copy char
				currentAtomString += thisChar
				break
		}
	}
	
	currentTermParts.push(currentAtomString)
	terms.push(currentTermParts)
	
	trace && console.log(`terms`, terms)
	
	// remove any empty terms from the list (this is common after quoted terms)
	let realTerms = []
	terms.forEach(function skipEmpty(term) {
		if(term.trim() !== '') {
			realTerms.push(term)
		}
	})
	
	// now that terms are separated from each other, split each into {field/value}
	let hash = realTerms.map(function identifyFields(term) {
		let parts = term.match(/^(([^: "]+):)?(.*?)$/)
		
		let parsedTerm = { value: parts[3] }
		if(parts[2]) parsedTerm.field = parts[2]
		return parsedTerm
	})
	
	return hash
}
