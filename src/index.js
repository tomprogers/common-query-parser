const Parser = require('./parse-query')


if( typeof define === 'function' && define.amd ) {
	define([], () => Parser)

} else if( typeof module === 'object' && module.exports ) {
	module.exports = Parser

}
