// http://jsperf.com/string-concat-vs-array-join-10000/8
// http://jsperf.com/advance-templates-benchmark/3
// http://jsperf.com/js-template-engines-performance/26


// COMPILATION FLAGS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var DEBUG = true;
/** @define {string} */		var WHACK_NAME = "Whack";

// SYNTAX OPTS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var USE_WITH = false;
/** @define {string} */		var OPEN_TAG = "{{";
/** @define {string} */		var CLOSE_TAG = "}}";
/** @define {string} */		var OPERATOR_ECHO = "=";
/** @define {string} */		var OPERATOR_ECHO_ESCAPE = "~";
/** @define {string} */		var OPERATOR_COMMENT = "!";
/** @define {string} */		var OUTPUT_VAR = "_o";

// SUPPORT OPTS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var SUPPORT_OLD_BROWSERS = false;
/** @define {boolean} */	var SUPPORT_SHORTCODES = true;
/** @define {boolean} */	var SUPPORT_EXTENDS = true;
/** @define {boolean} */	var SUPPORT_PARTIALS = true;
/** @define {boolean} */	var SUPPORT_FILTERS = true;

+function(_window){

	var tplHash = 0;

	// regexp.test is the fastest way
	// E.g. var x = /(\w+)/.test( string ) && RegExp.$1
	// http://jsperf.com/js-exec-vs-match/2
	var _RegExp = _window['RegExp'];

	// Operators codes
	var KEY_JS = 1,
		KEY_FOR = 2,
		KEY_BLOCK = 3;

	// Cache indexes
	var _cacheCompiled = {},
		_cacheCompiledByTpl = {},
		_cachePartials = {},
		_cacheParsing = {};

	// Code defaults
	var CODE_FIRST, CODE_LAST;


	// It is possible to use Whack in underscore's style
	// E.g.  {a: 2} => a
	if( USE_WITH ) {
		CODE_FIRST = "var "+OUTPUT_VAR+"='';with(data){",
		CODE_LAST  = "}return " + OUTPUT_VAR;
	} else {
		CODE_FIRST = "var "+OUTPUT_VAR+"='';",
		CODE_LAST  = "return " + OUTPUT_VAR;
	}

	// Code parse shortcuts
	var parsemap;



	if( SUPPORT_SHORTCODES ) {
		parsemap = {
			"end" : function(){return {operator: KEY_JS, _code: '}'}},
			"else" : function(){return {operator: KEY_JS, _code: '} else {'}},
			"if" : function(code){
				var p = code.lastIndexOf(':');
				var notTernearyExp = code.split(':').slice(-1)[0].trim()==='';
				if( p >-1 && notTernearyExp){
					code = code.substr(0, p) + '{';
				} else if( p === -1 ){
					if(code.split(')').slice(-1)[0].trim()==='') code+= '{';
				}
				return {
					operator : KEY_JS,
					_code : code
				};
			},
			"each" : function(code){
				var vals = regexFOR.test(code) && _RegExp;
				if( DEBUG ) {
					console.log("Parsing <for>: ", code, vals);
				}
				return {
					operator : KEY_FOR,
					_code : [vals.$1, vals.$2]
				}
			}
		}
	} else {
		parsemap = {};
	}


	if( SUPPORT_PARTIALS ) {
		parsemap["include"] = function(code) {
			var r = regexOP.test(code) && _RegExp.$1;
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

			if( DEBUG ) {
				console.log("Parsing <block>", key, code);
			}

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



	if(SUPPORT_OLD_BROWSERS && !Object.keys) {
		Object.keys = function( obj ){
			var keys = [];
			for(var k in obj) obj.hasOwnProperty(k) && keys.push(k);
			return keys;
		}
	}


	if(SUPPORT_FILTERS) {

		var _filters = {},
			isChrome = _window['chrome'],
			doc = _window.document;

		if( isChrome ) {
			var DOMtext 	= doc.createTextNode(""),
				DOMelement 	= doc.createElement("span");
			DOMelement.appendChild( DOMtext );
		}

		// http://jsperf.com/htmlencoderegex/40
		_filters["escapeHTML"] = function( code, name ) {
			return isChrome
				? code
					.replace('&', '&amp;', "g")
					.replace('"', '&quot;', "g")
					.replace("'", '&#39;', "g")
					.replace('<', '&lt;', "g")
					.replace('>', '&gt;', "g")
				: (DOMtext.nodeValue = code) && DOMelement.innerHTML;
		}
	}
	
	
	// Precompiled regex
	// http://jsperf.com/regexp-test-search-vs-indexof/27
	var regexFOR	= /\(([\w\.]+),?\s*(\w+)?\)/,
		regexOP		= /(\w+)\s*$/,
		regexEXTEND	= /extends\s+(\w+)/,
		regexPARSE 	= new _RegExp("^\\s*(" + Object.keys(parsemap).join("|") + ")\\b");


	// 
	// 
	// 
	function parse( templateString, name){

		var parsedLinesIndex;
		var parsedLines;
		var tokens =  templateString.split( CLOSE_TAG );
		
		var extended;
		var parentID;


		if( SUPPORT_EXTENDS && (parentID = regexEXTEND.test(tokens[0]) && _RegExp.$1)) {
			console.warn( _cacheParsing[parentID] );
			_cacheParsing[name] = _cacheParsing[parentID];
			parsedLines = _cacheParsing[name];
			parsedLinesIndex = parsedLines.len;
			tokens.shift();
			extended = 1;
			if( DEBUG ) {
				console.log("Extending: ", name, 'extends', parentID);
			}
		} else {
			parsedLinesIndex = 1;
			parsedLines = {
				0 : {
					operator: KEY_JS,
					_code : CODE_FIRST
				}
			}
		}

		
		// parse string tpl
		for(var tokenIndex = 0, tokensLength = tokens.length; tokenIndex < tokensLength; tokenIndex++){

			var line = tokens[tokenIndex].replace(/\\/g,'\\\\');
			var l = line.split( OPEN_TAG );
			
			if( l[0] !== ''){
				parsedLines[parsedLinesIndex++] = {
					operator: OPERATOR_ECHO,
					_code :'\''+l[0].replace(/'/g,'\\\'').replace(/\n/g,'\\n')+'\''
				};
			}
			
			var code = l[1];

			if( code ){
				
				var operator = regexPARSE.test(code) && _RegExp.$1;

				if( operator ) {
					
					code = parsemap[operator]( code, name );

					if( SUPPORT_EXTENDS && code && code.operator === KEY_BLOCK ) {

						var key = code._code;
						var tempLine = tokens[++tokenIndex];
						var partial = [tempLine];

						while((tempLine = tokens[++tokenIndex]) !== undefined && tempLine.indexOf("endblock") < 0 ) {
							// console.warn( tempLine )
							partial.push(tempLine);
						}

						// partial.pop();
						// --tokenIndex;

						partial = partial.join( CLOSE_TAG ) // + CLOSE_TAG
						;

						var render = compileTemplateString(partial, key, true).replace(CODE_FIRST, "").replace(CODE_LAST,"");
						_cachePartials[key] = render;
						console.log(">>>>>>", partial, " >>>>> ", render, " >>>>> ", key );


						if( extended ){

							for(var j = -1, l2 = parsedLinesIndex; ++j < l2;) {
								if(parsedLines[j].operator === KEY_BLOCK){
									console.warn(parsedLines[j], _cacheParsing[parentID][j], parentID, name)
									var testkey = key.replace(parentID, name);
									if( testkey === key ) {
										parsedLines[j]  = {
											operator : KEY_BLOCK,
											_code :  key
										}
									}
								}
							}

						} else {
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

					if(symbol ==' '){
						operator = KEY_JS;

					} else if(symbol=='!'){ // comments

						continue;

					} else if(symbol=='~'){ //OPERATOR_ECHO var escaped
						operator = "-";
						code = '('+code.substring(1)+'.replace(/&/g, "&amp;").replace(/\'/g,"&#39;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/\\//g,"&#x2F;"))';
					} else {
						
						if(symbol === OPERATOR_ECHO ) {
							code = code.substring(1);
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

		if( SUPPORT_EXTENDS && !extended ) {
			parsedLines[parsedLinesIndex++] = {
				operator : KEY_JS,
				_code : CODE_LAST
			}
			parsedLines.len = parsedLinesIndex;
		}

		if( DEBUG ) {
			console.log("Parsed lines: ", parsedLines)
		}

		return (_cacheParsing[name] = parsedLines);
	}



	function compileTemplateString(str, name ){

		var parsedLines = parse(str, name);
		var parsedLinesIndex = parsedLines.len;
		var compiledLines = Array(parsedLinesIndex);
		var compiledLinesIndex = 0;
		var lastOperator,line, operator;

		for(var i=0,l=parsedLinesIndex;i<l;i++){
			
			line = parsedLines[i];
			operator = line.operator;
			
			if( lastOperator !== operator || operator === KEY_JS)
				compiledLines[compiledLinesIndex++] = ';';

			var v = line._code;

			if(operator === KEY_JS){
				
				compiledLines[compiledLinesIndex++] = v;

			} else if(operator === KEY_FOR){
				
				var iterator = v[2] || "_i",
					item = v[1] || "item";
				
				compiledLines[compiledLinesIndex++] = (
					'for(var ' + iterator + '=0,' + item + ',_l=' + v[0] + ',_c=_l.length;' + 
						iterator + '<_c;' + iterator + '++){' + 
							item + '=_l[' + iterator + ']'
				);

			} else if( SUPPORT_EXTENDS && operator === KEY_BLOCK ){

				compiledLines[compiledLinesIndex++] = _cachePartials[v];

			} else {
				if(lastOperator !== OPERATOR_ECHO){
					compiledLines[compiledLinesIndex++] = (OUTPUT_VAR + '+=') + v;
				} else {
					compiledLines[compiledLinesIndex++] = '+' + v
				}
			}
			lastOperator = operator;
		}
		
		return compiledLines.join('');
	}




	// 
	// 
	// 	
	function buildTemplate(templateString, templateID){

		templateID = templateID || ++tplHash;

		if( DEBUG ) {
			console.group( "tpl: " + templateID );
		}
		
		// if(templateID && _cacheCompiled[templateID])
		// 	return _cacheCompiled[templateID];
		
		if(_cacheCompiledByTpl[templateString])
			return _cacheCompiledByTpl[templateString];

		var compiled = compileTemplateString(templateString, templateID);

		if( DEBUG ) {
			console.log("Compiled function: ", compiled);
			console.groupEnd("tpl: " + templateID)
		}

		var fn = new Function('data', compiled);

		_cacheCompiledByTpl[templateString] = fn;

		if(templateID && !_cacheCompiled[templateID]){
			// _cacheCompiled[templateID] = fn;
			_cacheCompiled[templateID] = compiled;
		}
		
		return fn;
    }


    

    _window[WHACK_NAME] = buildTemplate;

}( this );
