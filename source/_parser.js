
//
//
function parseTemplateString( templateString, name){

	var parsedLinesIndex;
	var parsedLines;
	var tokens = templateString.split( CLOSE_TAG );

	if( DEBUG ) {
		// normalize string to get line numbers
		var originalLineIndex = 0;
		var originalLines  = templateString.split(/\n/);
		var originalLinesCount = originalLines.length;
		_cacheOriginals[name] = originalLines;

		if(!_cacheParsingDebug[name]) {
			_cacheParsingDebug[name] = [];
		}
	}

	// @todo debug real unclosed tags
	// if ( DEBUG && tokens.length != templateString.split( OPEN_TAG ) ) {
	// 	console.error( "Somewhere over the rainbow" )
	// }

	var extended;
	var parentID;

	// If Zippr supports extend, it should be in the first line
	if( SUPPORT_EXTENDS && (parentID = regexEXTEND.test(tokens[0]) && _RegExp.$1)) {

		// In autocompile mode make sure that parentID is exist
		if(AUTOCOMPILE && !_cacheParsing[parentID]){
			// Try to compile parent from DOM useing ID selector
			Zippr( parentID );
			if(DEBUG && !_cacheParsing[parentID]) {
				console.error("Autocompilation for", parentID, "failed");
			}
		}

		// Also compile may fails if autocompile opt isnt active
		if( DEBUG ) {
			if( !_cacheParsing[parentID] ) {
				console.error("There is no compiled template named " + parentID);
				console.info("To prevent this error, please use autocompile flag or precompiled templates");
				return false;
			}
		}

		// Everything is fine
		_cacheParsing[name] = _cacheParsing[parentID];
		parsedLines = _cacheParsing[name];
		parsedLinesIndex = parsedLines.len;

		// Remove first line with extend call
		// and mark current template as extended
		tokens.shift();
		extended = 1;

		if( DEBUG ) {
			console.log("Extending: ", name, 'extends', parentID);
		}

	} else {

		// Zippr doesnt support extending, so we use default code
		parsedLinesIndex = 1;

		// if( DEBUG ) {
			
		// 	parsedLines = {
		// 		0 : {
		// 			operator: KEY_JS,
		// 			_code : CODE_FIRST 
		// 		}
		// 	}
		// } else {
			parsedLines = {
				0 : {
					operator: KEY_JS,
					_code : CODE_FIRST
				}
			}
		// }
	}

	// console.log( tokens )

	// Start parsing tokens
	for(var tokenIndex = 0, tokensLength = tokens.length; tokenIndex < tokensLength; tokenIndex++){



		// Make sure that code doesnt contains slashes
		var line = tokens[tokenIndex]
			//@todo Needs perf testing
			// May be problems with <pre />
			.replace(/\\/g,'\\\\')
			.replace(/\t+/g,'\t')
			.replace(/\n+/g,'\n')
			.replace(/\n\t/, "");

		if( DEBUG ) {
			var debugline = tokens[tokenIndex].split(/\n/);
			if( debugline.length > 1 ) {
				debugline.forEach(function(ln){
					// console.log({
					// 	ln : ln,
					// 	orig : getOriginalLine(ln, name), 
					// 	line : line,
					// 	parse :parsedLinesIndex
					// });
				
					_cacheParsingDebug[name].push({parsed :parsedLinesIndex, original:  getOriginalLine(ln, name)});
				});
			} else {
				_cacheParsingDebug[name].push({parsed :parsedLinesIndex, original:  getOriginalLine(debugline, name)});
				// _cacheParsingDebug[name].push(line);
			}
		}

		
		// Do not insert empty lines
		if( /^\s+$/.test(line)) continue;

		var l = line.split( OPEN_TAG );

		// Code may start with plain text
		if( l[0] !== ''){
			
			if( DEBUG ) {
				_cacheParsingDebug[name].push({parsed :parsedLinesIndex, original:  getOriginalLine(l[0], name)});
			}

			parsedLines[parsedLinesIndex++] = {
				operator: OPERATOR_ECHO,
				_code :'\''+l[0].replace(/'/g,'\\\'').replace(/\n/g,'\\n')+'\''
			};
		}

		var code = l[1];

		if( DEBUG ) {
			_cacheParsingDebug[name].push({parsed :parsedLinesIndex, original:  getOriginalLine(l[1], name)});
		}

		if( code ){

			// Check any custom operator (include / for / if  etc)
			var operator = regexPARSE.test(code) && _RegExp.$1;
			if( operator ) {

				// Execute it
				code = parsemap[operator]( code, name );

				// It was the first line with Block statement
				// So we need to compile sub-template from this block
				// @todo add multilevel blocks
				if( SUPPORT_EXTENDS && code && code.operator === KEY_BLOCK ) {

					// Ignore current line, because it contains only block definition
					// So we take the next
					var tempLine = tokens[++tokenIndex];
					var partial = [tempLine];

					// Current template + block cache key
					var key = code._code;

					// End of block state
					var endblock = 0;

					// block may contains only one line/word
					if(tempLine.indexOf("endblock") < 0) {

						// Push partial until block will end
						while( !endblock && (tempLine = tokens[++tokenIndex]) !== undefined ) {
							if(tempLine.indexOf("endblock") > -1) {
								endblock = 1;
								partial.push(tempLine.split(CLOSE_TAG)[0]);
							} else {
								partial.push(tempLine);
							}
						}
					}

					partial = partial.join( CLOSE_TAG ) // + CLOSE_TAG
					;

					// Compile block as subtemplate and store it
					var render = compileTemplateString(partial, key, true).replace(CODE_FIRST, "").replace(CODE_LAST,"");
					
					// if( DEBUG ) {
					// 	+ ",_t='" + name + "'"
					// }

					_cachePartials[key] = render;
					_cachePartialsIndex[key] = parsedLinesIndex;

					// If current template is extended from another
					// rewrite block cache
					if( extended ){

						parsedLines[_cachePartialsIndex[key.replace(name,parentID)]] = {
							operator : KEY_BLOCK,
							_code :  key
						}

					} else {

						// Otherwise
						parsedLines[parsedLinesIndex++] = {
							operator : KEY_BLOCK,
							_code :  key
						};
					}

				} else {
					parsedLines[parsedLinesIndex++] = code;
				}


			} else {

				var symbol = code.charAt(0);
				var operator;

				if(symbol === ' '){
					operator = KEY_JS;

				} else if(symbol === OPERATOR_COMMENT){ // comments

					continue;

				} else if( symbol === OPERATOR_ESCAPED_ECHO) {

					operator = OPERATOR_ECHO;
					code = ZIPPR_NAME + ".e" + "(" + code.substring(1) + ")";

				} else {

					if(symbol === OPERATOR_ECHO ) {
						code = code.substring(1);
					}

					if( SUPPORT_FILTERS && /\|(\w+)(?:\((.+)\))?\s*$/.test(code)){
						var f = _RegExp.$1, param = _RegExp.$2;
						if( Zippr['f'][f] ) {
							code = code.replace("|" + f + (param ? ("("+param+")") : ""), "");
							// var __code = code;
							code = ZIPPR_NAME + ".f." + f + "(" + code + (param && "," + param) + ")";
						}
					}

					operator = OPERATOR_ECHO;
				}

				operator && (parsedLines[parsedLinesIndex++] = {
					operator : operator,
					_code : code
				});
			}
		}

	}

	if( SUPPORT_EXTENDS ) {
		if( !extended ) {
			parsedLines[parsedLinesIndex++] = {
				operator : KEY_JS,
				_code : CODE_LAST
			}
			parsedLines.len = parsedLinesIndex;
		} else {
			parsedLines.len = parsedLinesIndex;
		}
	} else {
		parsedLines[parsedLinesIndex++] = {
			operator : KEY_JS,
			_code : CODE_LAST
		}
		parsedLines.len = parsedLinesIndex;
	}

	// if( DEBUG ) {
	// 	console.log("Parsed lines: ", parsedLines)
	// }

	return (_cacheParsing[name] = parsedLines);
}


if( DEBUG ) {
	Zippr.parseTemplateString = parseTemplateString;
}



var parsemap = {};

if( SUPPORT_SHORTCODES ) {

	parsemap = {

		"end" : function(){
			return {operator: KEY_JS, _code: '}'}
		},

		"endeach" : function(){
			return {operator: KEY_JS, _code: '})'}
		},

		"else" : function(){
			return {operator: KEY_JS, _code: '}else{'}
		},

		"elseif" : function( code ){
			return parsemap["if"]("}else " + code.replace("else", ""))
		},

		"if" : function(code){

			if( code.indexOf("{") < 0 ) {
				code += "{";
			}
			return {
				operator : KEY_JS,
				_code : code
			};
		},

		"each" : function(code){
			// var vals = regexFOR.test(code) && _RegExp;
			// console.info(regexFOR.test(code), code , [vals.$1, vals.$2]);
			return {
				operator : KEY_FOR,
				_code : regexFOR.test(code) && _RegExp.$1.split(",")
				// vals.$1
			}
		}
	}

	// alias
	parsemap["forEach"] = parsemap["each"];
}



if( SUPPORT_PARTIALS ) {

	// function wrapCode( code ) {
	// 	return CODE_FIRST + code + CODE_LAST
	// }

	parsemap["include"] = function(code) {

		var r = regexOP.test(code) && _RegExp.$1;

		if(AUTOCOMPILE && !_cacheCompiled[r]){

			Zippr(r);

			_cachePartials[r] = _cacheCompiled[r].replace(CODE_FIRST, "").replace(CODE_LAST, "");

			if(DEBUG && !_cachePartials[r]) {
				console.error("Autocompilation for", r, "failed");
			}
		}
		

		if( DEBUG && !_cacheCompiled[r]  ) {
			console.error("There is no compiled template named " + r);
			return {
				operator : KEY_JS,
				_code : ";"
			};
		} 


		return {
			operator : KEY_JS,
			_code : _cachePartials[r] || (_cachePartials[r] = _cacheCompiled[r].replace(CODE_FIRST, "").replace(CODE_LAST, ""))
		}
	}
}


if( SUPPORT_EXTENDS ) {

	parsemap["block"] = function( code, name )  {
		
		var blockname = regexOP.test(code) && _RegExp.$1,
			key = name + ":" + blockname

		// if( DEBUG ) {
		// 	console.log("Parsing <block>", key, code);
		// }

		return {
			operator : KEY_BLOCK,
			_code : key
		}
	}


	parsemap["endblock"] = function( code, name, blockname ) {
		return {
			operator : OPERATOR_ECHO,
			_code: "''"
		}
	}

}





// Precompiled regex
// http://jsperf.com/regexp-test-search-vs-indexof/27
var regexFOR	= /\(\s?([\w\.\_\,\s]+)\)/,
	regexOP		= /([\w\-#_]+)\s?$/,
	regexEXTEND	= /extends\s+([\w\-_#]+)/,
	regexPARSE 	= new _RegExp("^\\s*(" + Object.keys(parsemap).join("|") + ")\\b");
