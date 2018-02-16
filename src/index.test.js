import test from 'ava'
// import Tom from 'index.es6'

test('foo', t => {
	t.pass()
})

test('bar', async t => {
	const bar = Promise.resolve('bar')
	t.is(await bar, 'bar')
})
