var assert = require("assert");
var fs = require('fs');
var path = require('path');
var _files = path.join(__dirname, 'spec');

js_beautify = require("../vendor/jsbeautifer");
Wzhik = require("../dist/wzhik.dev");
WzhikFilters = require("../dist/wzhik.filters");



function testTPL(){
	var args = Array.prototype.slice.call(arguments);
	var name = args[0];
	args.shift();
	return Wzhik(args.join(""), name);
}


function getContents(testName, ext, testDir) {
	var p = path.join(_files, (testDir ? (testDir + "/") : "") + testName + '.' + ext);
	return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : "";
}

function getTest(testName, testDir ) {
	var test = {};
	test.template = getContents(testName, 'wzhik', testDir);
	test.expect = getContents(testName, 'html', testDir);
	test.data = eval(getContents(testName, 'js', testDir));
	return test;
}


function runTestDirectory( testHeader, testType ) {

	var testsDir = path.join(_files, testType);

	var testNames = fs.readdirSync(testsDir).filter(function (file) {
		return (/\.html$/).test(file);
	}).map(function (file) {
		return path.basename(file).replace(/\.html$/, '');
	});


	describe(testHeader + ': ' + testType , function () {

		testNames.forEach(function (testName) {
			var test = getTest(testName, testType);

			it('knows how to render ' + testName, function () {
				var tpl = Wzhik(test.template);
				var output = tpl( test.data );
				assert.equal(output, test.expect);
			});
			
		});
	});
}


function runTest( name ) {
	eval(getContents("test-" + name, 'js'));
}


module.exports = {

	runTestDirectory : runTestDirectory,
	runTest : runTest
	
}

