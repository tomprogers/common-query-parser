import parseQuery from '../parse-query.js'


describe(`parseQuery( input )`, () => {


	it(`handles a single term`, () => {
		expect(
			parseQuery('ulysses')
		).toEqual(
			[{ value: 'ulysses' }]
		)
	})


	it(`handles multiple terms`, () => {
		expect(
			parseQuery(`pax romana`)
		).toEqual([
			{ value: 'pax' },
			{ value: 'romana' }
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
			parseQuery(`mission:impossible`)
		).toEqual([
			{ field: 'mission', value: 'impossible' }
		])

		expect(
			parseQuery(`mission:impossible iii`)
		).toEqual([
			{ field: 'mission', value: 'impossible' },
			{ value: 'iii' }
		])

		expect(
			parseQuery(`cold case:closed`)
		).toEqual([
			{ value: 'cold' },
			{ field: 'case', value: 'closed' },
		])

		expect(
			parseQuery(`crouching:tiger hidden:dragon`)
		).toEqual([
			{ field: 'crouching', value: 'tiger' },
			{ field: 'hidden', value: 'dragon' }
		])
	})


	it(`handles negated terms`, () => {
		expect(
			parseQuery(`-one two three`)
		).toEqual([
			{ value: 'one', negated: true },
			{ value: 'two' },
			{ value: 'three' },
		])

		expect(
			parseQuery(`one -two three`)
		).toEqual([
			{ value: 'one' },
			{ value: 'two', negated: true },
			{ value: 'three' },
		])

		expect(
			parseQuery(`one two -three`)
		).toEqual([
			{ value: 'one' },
			{ value: 'two' },
			{ value: 'three', negated: true },
		])

		expect(
			parseQuery(`-color:red color:blue -orange green`)
		).toEqual([
			{ field: 'color', value: 'red', negated: true },
			{ field: 'color', value: 'blue' },
			{ value: 'orange', negated: true },
			{ value: 'green' }
		])

		expect(
			parseQuery(`donut:-filled`)
		).toEqual([
			{ field: 'donut', value: '-filled' }
		])
	})


	it(`understands quoted field names`, () => {
		expect(
			parseQuery(`one "field name":value two`)
		).toEqual([
			{ value: 'one' },
			{ field: 'field name', value: 'value' },
			{ value: 'two' }
		])
	})


	it(`permits escaping of special query characters`, () => {
		expect(
			parseQuery(`one\\ two`)
		).toEqual([
			{ value: 'one two' }
		])

		expect(
			parseQuery(`one\\:two`)
		).toEqual([
			{ value: 'one:two' }
		])

		expect(
			parseQuery(`one \\"two\\"`)
		).toEqual([
			{ value: 'one' },
			{ value: '"two"' }
		])
	})


	it(`always returns an array`, () => {
		expect(Array.isArray( parseQuery(`word`) )).toBe(true)
		expect(Array.isArray( parseQuery(``) )).toBe(true)
	})


	it(`throws if argument is not a string`, () => {
		expect( ()=> parseQuery() ).toThrow()
		expect( ()=> parseQuery(null) ).toThrow()
	})


})
