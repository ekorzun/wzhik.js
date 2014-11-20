
var _cacheParsingDebug = {};
var _cacheOriginals = {};

function getOriginalLine( code, name, start ) {
	var arr = _cacheOriginals[name], result;
	arr.forEach(function(line, i){
		if( !start || (i >= start )) {
			if( line.indexOf(code) > -1 ) {
				result = i;
				return false;
			}
		}
	});
	return result;
}

function getOriginalLineFromParsedIndex( parsed, name ) {
	var result, mark = false;
	_cacheParsingDebug[name].forEach(function(ln){
		if(ln.parsed === parsed ) {
			mark = 1;
			result = ln.original;
		} else if(mark) {
			return false;
		}
	});
	return result;
}

Wzhik["debug"] = function( templateID, originalLineNumber, err){
	console.error([
			"Error in template: " + templateID,
			"Line number: " + originalLineNumber,
			"Line content: "+ (_cacheOriginals[templateID][originalLineNumber] || "").trim(),
			// "Token ID: " + (compiledLinesIndex-2),
			"Reference: " + err.message
	].join("\n"));
}


function createLinesMap( templateString, name ) {
	if(_cacheParsingDebug[name]) {
		return _cacheParsingDebug[name];
	}
	var originalLines  = templateString.split(/\n/);
	var originalLinesCount = originalLines.length;
	_cacheOriginals[name] = originalLines;

	var tokens = templateString.split( CLOSE_TAG );

	// for(var tokenIndex = 0, tokensLength = tokens.length; tokenIndex < tokensLength; tokenIndex++){
}


function getlines(){}


function wrapWithTryCatch(){}


function log(){}


function getInfo( templateID ){}


function UID(){}


Wzhik["displayError"] = function displayError(){}

Wzhik["displayWarning"] = function displayWarning(){}

Wzhik["displayInfo"] = function displayInfo(){}


if(!root['console']) {
	console = root['console'] = {};
}

(["log", "group", "groupCollapsed", "groupEnd", "warn", "error", "info"]).forEach(function( fn ){
	!console[fn] && (console[fn] = function(){});
});