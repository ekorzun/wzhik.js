

function compileTemplateString(str, name, isPartial ){

	var parsedLines = parseTemplateString(str, name);
	var parsedLinesLength = parsedLines.len;
	var compiledLines = Array(parsedLinesLength);
	var compiledLinesIndex = 0;
	var lastOperator,line, operator;

	// console.log(_cacheParsingDebug[name], parsedLinesLength )

	for(var parsedLineIndex = -1; ++parsedLineIndex < parsedLinesLength;){

		line = parsedLines[parsedLineIndex];
		operator = line.operator;

		if( lastOperator !== operator || operator === KEY_JS)
			compiledLines[compiledLinesIndex++] = ';';

		var v = line._code;

		// @todo
		// compiledLines[compiledLinesIndex++] = operatorList[ operator ]( line._code );

		// Plain javascript
		if(operator === KEY_JS){

			compiledLines[compiledLinesIndex++] = v;

		// Each / forfor
		} else if(operator === KEY_FOR){

			var item = v[1] || "item",
				iter = v[2] || "i" + UID,
				len  = "l" + UID,
				arr  = "a" + UID;

			UID++;

			// 
			// compiledLines[compiledLinesIndex++] = OUTPUT_VAR + '.push(' + '"<!--' + v[0] + '-->");';
			compiledLines[compiledLinesIndex++] = (
				OUTPUT_OPETATOR_VAR + " " + arr + "=" + v[0] + ";"
				+ WZHIK_NAME+ ".each(" + arr + ",function(" + item + "," + iter + "," + item + "_isFirst," + item + "_isLast," + item + "_isEven" + "){"
			);

		// Block operator
		} else if( SUPPORT_EXTENDS && operator === KEY_BLOCK ){

			compiledLines[compiledLinesIndex++] = _cachePartials[v];

		} else {

			if( DEBUG ) {
				var origline = getOriginalLineFromParsedIndex(parsedLineIndex, name);
				if( origline ) {
					compiledLines[compiledLinesIndex++] = "try{";
				}
			}

			if( IGNORE_NULLS ) {

				if ( DEBUG ) {
					var variable = v;

					if( false && SUPPORT_EXPERIMENTAL && v.charAt(0) !== "'" ) {
						// @todo ?
						v = v.trim();
						// var variableComment = '"<!--' + v + '-->"';
						var variableComment = "'&#8203;'";
						variable = variableComment + "+" + v;
					}

					var variableString = (line._code || "");

					if(variableString.charAt(0) !== "'") {
						variableString = "'" + variableString.replace(/'/g,'\\\'').replace(/\n/g,'\\n').trim() + "'"
					}

					v = "_v(" + [variable, "_t" + TUID] + (origline ? "," + origline : "") + ")";

				} else {
					v = v.charAt(0) === "'" ? v : ("_v(" + v + ")");
				}

			}


			// http://jsperf.com/string-concat-vs-array-join-10000
			// In debug mode we are using [].push instead of concat
			// It's for easier debugging on dev enviroment because of formatted source
			if( DEBUG ) {

				// console.log({
				// 	parsed: i,
				// 	orig : getOriginalLineFromParsedIndex(i, name), 
				// 	v : v
				// });
				
				compiledLines[compiledLinesIndex++] = OUTPUT_VAR + '.push(' + v + ');';
				if( origline ) {
					compiledLines[compiledLinesIndex++] = [
						"}catch(e){",
							origline ? ("_d(_t"+TUID+"," + origline + ",e);") : "",
						"}"
					].join("");
				}

			} else {

				if(lastOperator !== OPERATOR_ECHO){
					if( IGNORE_NULLS ) {
						compiledLines[compiledLinesIndex++] = (OUTPUT_VAR + OUTPUT_OPETATOR_EXT_CONCAT) + v;
					} else {
						compiledLines[compiledLinesIndex++] = (OUTPUT_VAR + OUTPUT_OPETATOR_EXT_CONCAT) + '(' + v + ')';
					}
				} else {
					if( IGNORE_NULLS ) {
						compiledLines[compiledLinesIndex++] = OUTPUT_OPETATOR_CONCAT + v;
					} else {
						compiledLines[compiledLinesIndex++] = OUTPUT_OPETATOR_CONCAT + '(' + v + ')';
					}
					
				}
			}
		}

		lastOperator = operator;

	}


	if( DEBUG ) {
		// debugger template ID
		compiledLines.unshift("var _t"+(TUID++)+"='"+name+"';");

		var compiled = compiledLines.join('\n');

		if( DEBUG_PRINT_COMPILED ) {
			try {
				console.log("Compiled function: ", js_beautify(compiled));
			} catch(e) {
				console.log("Compiled function: ", compiled);
			}
		}

		return compiled;

	} else {
		return compiledLines.join('');
	}
}
