


	var parsemap = {};

	if( SUPPORT_SHORTCODES ) {

		parsemap = {

			"end" : function(){
				return {operator: KEY_JS, _code: '}'}
			},

			"else" : function(){
				return {operator: KEY_JS, _code: '}else{'}
			},

			"elseif" : function( code ){
				return parsemap["if"]("}else " + code.replace("else", ""))
			},

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
				return {
					operator : KEY_FOR,
					_code : [vals.$1, vals.$2]
				}
			}
		}

		// alias
		parsemap["forEach"] = parsemap["each"];
	}


	if( SUPPORT_PARTIALS ) {
		parsemap["include"] = function(code) {

			var r = regexOP.test(code) && _RegExp.$1;

			if(AUTOCOMPILE && !_cacheCompiled[r]){

				Whack(r);

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

	



	if( SUPPORT_FILTERS ) {

		var isChrome = root['chrome'];

		var _filters = {},
			doc = root.document;

		if( !isChrome && !server ) {
			var DOMtext 	= doc.createTextNode(""),
				DOMelement 	= doc.createElement("span");
			DOMelement.appendChild( DOMtext );
		}

		var
			amp = /&/g,
			q1 	= /"/g,
			q2	= /'/g,
			t1	= />/g,
			t2	= /</g,
			sl 	= /\//g;

		Whack['e'] = _filters["escapeHTML"] = function( code ) {
			return isChrome
				? code
					.replace(amp, '&amp;')
					.replace(t2, '&lt;')
					.replace(t1, '&gt;')
					.replace(q1, '&quot;')
					.replace(q2, '&#x27;')
					.replace(sl,'&#x2F;')
				: (DOMtext.nodeValue = code) && DOMelement.innerHTML;
		}


		Whack['f'] = _filters;
    	
    	Whack['addFilter'] = function(name, fn){
    		_filters[name] = fn;
    		return Whack
    	}


	}




	if( IGNORE_NULLS ) {
    	Whack['v'] = function( o, variable, templateID, lineNumber ){
    		if( DEBUG ) {
    			if( o === undefined ) {
    				console.warn("Undefined value: ", variable, '===', o, "in template", "#" +templateID, "at line", lineNumber);
    			}

    			return (typeof o === "number" || o) ? o : "";
    		} else {
    			return (typeof o === "number" || o) ? o : "";
    		}
    	}
    }



    