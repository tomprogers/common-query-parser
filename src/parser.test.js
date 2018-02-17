import test from 'ava'
import Parser from './parser.js'


test('bare terms', (t) => {
	
	t.is(
		Parser(`ulysses`),
		[
			{ value: 'ulysses' }
		]
	)
	
	t.is(
		Parser(`pax romana`),
		[
			{ value: 'pax' },
			{ value: 'romana' }
		]
	)
	
})


test('fielded terms', (t) => {
	
	t.is(
		Parser(`mission:impossible`),
		[
			{ field: 'mission', value: 'impossible' }
		]
	)
	
	t.is(
		Parser(`crouching:tiger hidden:dragon`),
		[
			{ field: 'crouching', value: 'tiger' },
			{ field: 'hidden', value: 'dragon' }
		]
	)
	
	t.is(
		Parser(`cold case:closed`),
		[
			{ value: 'cold' },
			{ field: 'case', value: 'closed' }
		]
	)
	
})


test('quoted terms', (t) => {
	
	t.is(
		Parser(`"new york"`),
		[
			{ value: 'new york' }
		]
	)
	
	t.is(
		Parser(`aka "chocolate jenga"`),
		[
			{ value: 'aka' },
			{ value: 'chocolate jenga' }
		]
	)
	
	t.is(
		Parser(`author:"stephen king"`),
		[
			{ field: 'author', value: 'stephen king' }
		]
	)
	
	t.is(
		Parser(`"jesus christ":superstar`),
		[
			{ field: 'jesus christ', value: 'superstar' }
		]
	)
	
	t.is(
		Parser(`"once bitten":"twice shy"`),
		[
			{ field: 'once bitten', value: 'twice shy' }
		]
	)
	
	t.is(
		Parser(`trump "known as":drumpf`),
		[
			{ value: 'trump' },
			{ field: 'known as', value: 'drumpf' }
		]
	)
	
	t.is(
		Parser(`"tara reid" scientist:"with glasses"`),
		[
			{ value: 'tara reid' },
			{ field: 'scientist', value: 'with glasses' }
		]
	)
	
})


test('negative terms', (t) => {
	
	t.is(
		Parser(`-temperature`),
		[
			{ value: 'temperature', negated: true }
		]
	)
	
	t.is(
		Parser(`-"blood suckers"`),
		[
			{ value: 'blood suckers', negated: true }
		]
	)
	
	t.is(
		Parser(`reality -bites`),
		[
			{ value: 'reality' },
			{ value: 'bites', negated: true }
		]
	)
	
	t.is(
		Parser(`interview -"closed session"`),
		[
			{ value: 'interview' },
			{ value: 'closed session', negated: true }
		]
	)
	
	t.is(
		Parser(`-lang:en_UK`),
		[
			{ field: 'lang', value: 'en_UK', negated: true }
		]
	)
	
	t.is(
		Parser(`-band:"pink floyd"`),
		[
			{ field: 'band', value: 'pink floyd', negated: true }
		]
	)
	
	t.is(
		Parser(`-"party affiliation":republican`),
		[
			{ field: 'party affiliation', value: 'republican', negated: true }
		]
	)
	
	t.is(
		Parser(`-"date modified":"last week"`),
		[
			{ field: 'date modified', value: 'last week', negated: true }
		]
	)
	
	t.is(
		Parser(`spiderman -"played by":maguire`),
		[
			{ value: 'spiderman' },
			{ field: 'played by', value: 'maguire', negated: true }
		]
	)
	
	t.is(
		Parser(`"the joker" -actor:"heath ledger"`),
		[
			{ value: 'the joker' },
			{ field: 'actor', value: 'heath ledger', negated: true }
		]
	)
	
	t.is(
		Parser(`donut:-filled`),
		[
			{ field: 'donut', value: '-filled' }
		}
	)
	
})
