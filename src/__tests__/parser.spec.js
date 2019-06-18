import parseQuery from '../parser.js'


describe(`parser`, () => {


	it(`handles a single term`, () => {
		expect(
			parseQuery('fiend')
		).toEqual(
			[{ value: 'fiend' }]
		)
	})


	it(`handles multiple terms`, () => {
		expect(
			parseQuery(`one two three`)
		).toEqual([
			{ value: 'one' },
			{ value: 'two' },
			{ value: 'three' }
		])
	})


	it(`handles quoted terms`, () => {
		expect(
			parseQuery(`"one" two three`)
		).toEqual([
			{ value: 'one' },
			{ value: 'two' },
			{ value: 'three' }
		])

		expect(
			parseQuery(`"one two" three`)
		).toEqual([
			{ value: 'one two' },
			{ value: 'three' }
		])

		expect(
			parseQuery(`"one two three"`)
		).toEqual([
			{ value: 'one two three' }
		])
	})


	it(`handles fielded terms`, () => {
		expect(
			parseQuery(`breed:lab`)
		).toEqual([
			{ field: 'breed', value: 'lab' }
		])

		expect(
			parseQuery(`breed:black lab`)
		).toEqual([
			{ field: 'breed', value: 'black' },
			{ value: 'lab' }
		])

	})



	xit(`handles negated terms`, () => {})
	xit(`understands quoted field names`, () => {})
	xit(`permits escaping of special query characters`, () => {})
	xit(`always returns an array`, () => {})


})

/*
test('bare terms', (t) => {

	t.deepEqual(
		Parser(`ulysses`),
		[
			{ value: 'ulysses' }
		]
	)

	t.deepEqual(
		Parser(`pax romana`),
		[
			{ value: 'pax' },
			{ value: 'romana' }
		]
	)

})


test('fielded terms', (t) => {

	t.deepEqual(
		Parser(`mission:impossible`),
		[
			{ field: 'mission', value: 'impossible' }
		]
	)

	t.deepEqual(
		Parser(`crouching:tiger hidden:dragon`),
		[
			{ field: 'crouching', value: 'tiger' },
			{ field: 'hidden', value: 'dragon' }
		]
	)

	t.deepEqual(
		Parser(`cold case:closed`),
		[
			{ value: 'cold' },
			{ field: 'case', value: 'closed' }
		]
	)

})


test('quoted terms', (t) => {

	t.deepEqual(
		Parser(`"new york"`),
		[
			{ value: 'new york' }
		]
	)

	t.deepEqual(
		Parser(`aka "chocolate jenga"`),
		[
			{ value: 'aka' },
			{ value: 'chocolate jenga' }
		]
	)

	t.deepEqual(
		Parser(`author:"stephen king"`),
		[
			{ field: 'author', value: 'stephen king' }
		]
	)

	t.deepEqual(
		Parser(`"jesus christ":superstar`),
		[
			{ field: 'jesus christ', value: 'superstar' }
		]
	)

	t.deepEqual(
		Parser(`"once bitten":"twice shy"`),
		[
			{ field: 'once bitten', value: 'twice shy' }
		]
	)

	t.deepEqual(
		Parser(`trump "known as":drumpf`),
		[
			{ value: 'trump' },
			{ field: 'known as', value: 'drumpf' }
		]
	)

	t.deepEqual(
		Parser(`"tara reid" scientist:"with glasses"`),
		[
			{ value: 'tara reid' },
			{ field: 'scientist', value: 'with glasses' }
		]
	)

})


test('negative terms', (t) => {

	t.deepEqual(
		Parser(`-temperature`),
		[
			{ value: 'temperature', negated: true }
		]
	)

	t.deepEqual(
		Parser(`-"blood suckers"`),
		[
			{ value: 'blood suckers', negated: true }
		]
	)

	t.deepEqual(
		Parser(`reality -bites`),
		[
			{ value: 'reality' },
			{ value: 'bites', negated: true }
		]
	)

	t.deepEqual(
		Parser(`-"closed session" interview`),
		[
			{ value: 'closed session', negated: true },
			{ value: 'interview' }
		]
	)

	t.deepEqual(
		Parser(`-lang:en_UK`),
		[
			{ field: 'lang', value: 'en_UK', negated: true }
		]
	)

	t.deepEqual(
		Parser(`-band:"pink floyd"`),
		[
			{ field: 'band', value: 'pink floyd', negated: true }
		]
	)

	t.deepEqual(
		Parser(`-"party affiliation":republican`),
		[
			{ field: 'party affiliation', value: 'republican', negated: true }
		]
	)

	t.deepEqual(
		Parser(`-"date modified":"last week"`),
		[
			{ field: 'date modified', value: 'last week', negated: true }
		]
	)

	t.deepEqual(
		Parser(`spiderman -"played by":maguire`),
		[
			{ value: 'spiderman' },
			{ field: 'played by', value: 'maguire', negated: true }
		]
	)

	t.deepEqual(
		Parser(`"the joker" -actor:"heath ledger"`),
		[
			{ value: 'the joker' },
			{ field: 'actor', value: 'heath ledger', negated: true }
		]
	)

	t.deepEqual(
		Parser(`donut:-filled`),
		[
			{ field: 'donut', value: '-filled' }
		]
	)

})
*/
