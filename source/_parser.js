
	// Precompiled regex
	// http://jsperf.com/regexp-test-search-vs-indexof/27
	var regexFOR	= /\(([\w\.\_]+),?\s*(\w+)?\)/,
		regexOP		= /([\w\-#_]+)\s?$/,
		regexEXTEND	= /extends\s+([\w\-_#]+)/,
		regexPARSE 	= new _RegExp("^\\s*(" + Object.keys(parsemap).join("|") + ")\\b");


	//
	//
	//
	function parseTemplateString( templateString, name){

		var parsedLinesIndex;
		var parsedLines;
		var tokens = templateString.split( CLOSE_TAG );

		// @todo debug real unclosed tags
		// if ( DEBUG && tokens.length != templateString.split( OPEN_TAG ) ) {
		// 	console.error( "Somewhere over the rainbow" )
		// }

		var extended;
		var parentID;

		// If Whack supports extend, it should be in the first line
		if( SUPPORT_EXTENDS && (parentID = regexEXTEND.test(tokens[0]) && _RegExp.$1)) {

			// In autocompile mode make sure that parentID is exist
			if(AUTOCOMPILE && !_cacheParsing[parentID]){
				// Try to compile parent from DOM useing ID selector
				Whack( parentID );
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

			// Whack doesnt support extending, so we use default code
			parsedLinesIndex = 1;
			parsedLines = {
				0 : {
					operator: KEY_JS,
					_code : CODE_FIRST
				}
			}
		}

		// Start parsing tokens
		for(var tokenIndex = 0, tokensLength = tokens.length; tokenIndex < tokensLength; tokenIndex++){

			// Make sure that code doesnt contains slashes
			var line = tokens[tokenIndex]
				//@todo Needs perf testing
				// May be problems with <pre />
				.replace(/\\/g,'\\\\')
				.replace(/\t+/g,'\t')
				.replace(/\n+/g,'\n')
				// .replace(/^\s{2,}/, '')
				.replace(/\n\t/, "")

			// Do not insert empty lines
			if( /^\s+$/.test(line)) continue;

			var l = line.split( OPEN_TAG );

			// Code may start with plain text
			if( l[0] !== ''){
				parsedLines[parsedLinesIndex++] = {
					operator: OPERATOR_ECHO,
					_code :'\''+l[0].replace(/'/g,'\\\'').replace(/\n/g,'\\n')+'\''
				};
			}

			var code = l[1];

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
						code = WHACK_NAME + ".e" + "(" + code.substring(1) + ")";

					} else {

						if(symbol === OPERATOR_ECHO ) {
							code = code.substring(1);
						}

						if( SUPPORT_FILTERS && /\|(\w+)(?:\((.+)\))?\s*$/.test(code)){
							var f = _RegExp.$1, param = _RegExp.$2;
							if( Whack['f'][f] ) {
								code = code.replace("|" + f + (param ? ("("+param+")") : ""), "");
								// var __code = code;
								code = WHACK_NAME + ".f." + f + "(" + code + (param && "," + param) + ")";
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
		Whack.parseTemplateString = parseTemplateString;
	}
