/*
	{
		field: String | undefined
		value: String
		negated: Boolean | undefined
	}
 */

const trace = false // enable very granular debugging

const CHAR_QUOTE = '"'
const CHAR_BACKSLASH = '\\'
const CHAR_SPACE = ' '
const CHAR_COLON = ':'

const QUOTE              = 0x0001
const QUOTED_QUOTE       = 0x0010
const ESCAPED_QUOTE      = 0x0100
const BACKSLASH          = 0x1000
const QUOTED_BACKSLASH   = 0x0011
const ESCAPED_BACKSLASH  = 0x0101
const SPACE              = 0x1001
const QUOTED_SPACE       = 0x0110
const ESCAPED_SPACE      = 0x1010

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
		space - search terms are separated by spaces (unless those spaces are escaped or occur in a quoted phrase
		quote - begins or ends a quoted phrase; within a quoted phrase, spaces are not treated as delimiters
		backslash - used to escape special characters so they are treated as literal values
		colon - the first unescaped colon signals that the term is a "key:value" construction instead of merely "value" (this is done via regex once basic separation is complete)
	 */
	
	let currentTermString = '' // we build this up a char at a time, until we detect a literal, unquoted term separator
	let insideQuotes = false // will be true when we detect the beginning of a quoted phrase
	let nextCharIsEscaped = false // will be true for the one character immediately after any '\'

	for(let i = 0, iMax = input.length; i < iMax; i++) {
		let thisChar = input.charAt(i)
		let TYPE = 'OTHER'
		
		trace && console.log(`  >${thisChar}<`)
		
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
		
		// at this point it's safe to reset the escape-tracker, because we've just finished honoring it (if true)
		nextCharIsEscaped = false
		
		switch(TYPE) {
			
			case QUOTE: // begin phrase
				trace && console.log('  begin phrase')
				insideQuotes = true
				break
			
			case QUOTED_QUOTE: // end phrase & term
				trace && console.log('  end phrase and term')
				insideQuotes = false
				terms.push(currentTermString)
				currentTermString = ''
				break
			
			case ESCAPED_QUOTE: // copy char
				currentTermString += thisChar
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
				currentTermString += thisChar
				break
			
			case SPACE: // end term
				trace && console.log('  end term')
				terms.push(currentTermString)
				currentTermString = ''
				break
			
			case QUOTED_SPACE: // copy char
				currentTermString += thisChar
				break
			
			case ESCAPED_SPACE: // copy char
				currentTermString += thisChar
				break
			
			default: //copy char
				currentTermString += thisChar
				break
		}
	}
	
	terms.push(currentTermString)
	
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
