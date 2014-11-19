

function compileTemplateString(str, name, isPartial ){

	var parsedLines = parseTemplateString(str, name);
	var parsedLinesIndex = parsedLines.len;
	var compiledLines = Array(parsedLinesIndex);
	var compiledLinesIndex = 0;
	var lastOperator,line, operator;

	// console.log(_cacheParsingDebug[name], parsedLinesIndex )

	for(var i = -1, l = parsedLinesIndex; ++i < l;){

		line = parsedLines[i];
		operator = line.operator;

		if( lastOperator !== operator || operator === KEY_JS)
			compiledLines[compiledLinesIndex++] = ';';

		var v = line._code;

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
				"var " + arr + "=" + v[0] +
				";Zippr.each(" + arr + ",function(" + item + "," + iter + "," + item + "_isFirst," + item + "_isLast," + item + "_isEven" + "){"
				// var a1 = data.array,
				// "var " + arr + "=" + v[0] + 
				// ";for(var " + iter + "=0," + item + "," + len + "=" + arr + ".length;" +
				// 	iter + "<" + len + ";" + iter + "++){" + item + "=" + arr + "[" + iter + "];" + 
				// 	"var " + item + "_isFirst=(" + iter + "==0)," + 
				// 			 item + "_isLast=(" + iter + "=="+len+"-1)," + 
				// 			 item + "_isEven=(" + iter + "%2)"
			);

		// Block operator
		} else if( SUPPORT_EXTENDS && operator === KEY_BLOCK ){

			compiledLines[compiledLinesIndex++] = _cachePartials[v];

		} else {

			if( DEBUG ) {
				var origline = getOriginalLineFromParsedIndex(i, name);
				if( origline ) {
					compiledLines[compiledLinesIndex++] = "try{";
				}
			}

			if( IGNORE_NULLS ) {

				if ( DEBUG ) {
					var variable = v;

					if( SUPPORT_EXPERIMENTAL && v.charAt(0) !== "'" ) {
						// @todo ?
						v = v.trim();
						var variableComment = '"<!--' + v + '-->"';
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
						compiledLines[compiledLinesIndex++] = (OUTPUT_VAR + '+=') + v;
					} else {
						compiledLines[compiledLinesIndex++] = (OUTPUT_VAR + '+=') + '(' + v + ')';
					}
				} else {
					if( IGNORE_NULLS ) {
						compiledLines[compiledLinesIndex++] = '+' + v;
					} else {
						compiledLines[compiledLinesIndex++] = '+(' + v + ')';
					}
					
				}
			}
		}

		lastOperator = operator;

	}


	if( DEBUG ) {
		compiledLines.unshift("var _t"+(TUID++)+"='"+name+"';");

		var compiled = compiledLines.join('\n');

		try {
			console.log("Compiled function: ", js_beautify(compiled));
		} catch(e) {
			console.log("Compiled function: ", compiled);
		}

		return compiled;

	} else {
		return compiledLines.join('');
	}
}
