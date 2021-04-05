module.exports = {
	"testEnvironment": "node",
	"testPathIgnorePatterns": [
		"/node_modules/"
	],
	"collectCoverageFrom": [
		"src/**/*.js",
		"!src/**/*.spec.js",
		"!**/node_modules/**"
	]
}
