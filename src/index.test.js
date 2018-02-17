import test from 'ava'
import Tom from './index.js'

test('foo', t => {
	t.pass()
})

test('bar', async t => {
	const bar = Promise.resolve('bar')
	t.is(await bar, 'bar')
})


test('tom', t => {
	
	let out = Tom()
	
	t.is(out, 'tom')
	
	
})
