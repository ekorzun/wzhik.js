


// COMPILATION FLAGS
// ------------------------------------------------------------------------------------------------

// Browser enviroment = true
// server enviroment = false
// For TEST ONLY. It doesnt work in server
/** @define {boolean} */	var WZHIK_BROWSER_ENV = true;

// Debug information
// error detection
// formatted template sources etc.
/** @define {boolean} */	var DEBUG = false;

// 
/** @define {boolean} */	var DEBUG_PRINT_COMPILED = false;

// Global variable name
/** @define {string} */		var WZHIK_NAME = "wzhik";

// 
/** @define {boolean} */	var AUTOCOMPILE = true;

// 
/** @define {boolean} */	var IGNORE_NULLS = true;



// ------------------------------------------------------------------------------------------------
// ****************************************** NERD MODE *******************************************
// ------------------------------------------------------------------------------------------------


// SYNTAX OPTS
// ------------------------------------------------------------------------------------------------

// It is not recommended to use this setting
/** @define {boolean} */	var USE_WITH = false;

/** @define {string} */		var OPEN_TAG = "{{";
/** @define {string} */		var CLOSE_TAG = "}}";
/** @define {string} */		var OPERATOR_ECHO = "=";
/** @define {string} */		var OPERATOR_ESCAPED_ECHO = "-";
/** @define {string} */		var OPERATOR_COMMENT = "#";
/** @define {string} */		var OPERATOR_FILTER = "|";
/** @define {string} */		var OUTPUT_VAR = "_o";
/** @define {string} */		var INPUT_VAR = "data";

// SUPPORT OPTS
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var SUPPORT_OLD_BROWSERS = false;
/** @define {boolean} */	var SUPPORT_SHORTCODES = true;
/** @define {boolean} */	var SUPPORT_EXTENDS = true;
/** @define {boolean} */	var SUPPORT_PARTIALS = true;
/** @define {boolean} */	var SUPPORT_FILTERS = true;

// 
// ------------------------------------------------------------------------------------------------
/** @define {boolean} */	var SUPPORT_EXPERIMENTAL = true;


// 
// MULTI LANGUAGE/TEMPLATE SUPPORT
// These options are configured for using with javascript
// NOTE: You have to turn DEBUG off for making changes
// ------------------------------------------------------------------------------------------------
/** @define {string} */		var OUTPUT_OPETATOR_CONCAT = "+";
/** @define {string} */		var OUTPUT_OPETATOR_EXT_CONCAT = "+=";
/** @define {string} */		var OUTPUT_OPETATOR_VAR = "var";
/** @define {string} */		var OUTPUT_OPETATOR_ASSIGN = "=";
/** @define {string} */		var OUTPUT_VAR_PREFIX = ""; // ex. $



+function(root, server, $){

	if( !$ ) {
		$ = document.querySelector;
	}

	// 
	// 
	// Simple increment ID for for tpl/patrial etc.
	var UID = 0;

	// 
	// 
	// 
	if( DEBUG ) {
		var TUID = 0;
	}

	// regexp.test is the fastest way
	// E.g. var x = /(\w+)/.test( string ) && RegExp.$1
	// http://jsperf.com/js-exec-vs-match/2
	var _RegExp = server ? RegExp : root['RegExp'];


	// 
	// Operators codes
	// 
	var KEY_JS = 1,
		KEY_FOR = 2,
		KEY_BLOCK = 3,
		KEY_FILTER = 4,
		KEY_ECHO = 5,
		KEY_ESCAPE = 6;

	// 
	// 
	// Cache indexes
	var 
		_cacheCompiled = {},
		_cacheCompiledByTpl = {},
		_cachePartials = {},
		_cacheParsing = {},
		_cachePartialsIndex = {};

	
	// 
	// 
	// First and last lines of compiled tpl
	var 
		CODE_FIRST, 
		CODE_LAST = "return " + OUTPUT_VAR;


	// 	
	// It is possible but not recommended to use Wzhik in underscore's style
	// E.g.  {someProp: 2} => someProp
	if( USE_WITH ) {

		// 
		// Try to replace "With" with real(?) local vars
		// updt: local vars tested. "With" works better :/
		CODE_FIRST = 
			(IGNORE_NULLS ? OUTPUT_OPETATOR_VAR + " _v=" + WZHIK_NAME + ".v," : OUTPUT_OPETATOR_VAR)
			+ OUTPUT_VAR_PREFIX + OUTPUT_VAR + "=" + (DEBUG ? "[]" : "''")
			+ ";with(" + INPUT_VAR + "){";
		CODE_LAST  = "} " + CODE_LAST;

	} else {

		CODE_FIRST = 
			(IGNORE_NULLS ? OUTPUT_OPETATOR_VAR + " _v=" + WZHIK_NAME + ".v," : OUTPUT_OPETATOR_VAR)
			+ OUTPUT_VAR_PREFIX + OUTPUT_VAR + "=" + (DEBUG ? "[]" : "''");
	}


	// 
	// 
	// 
	if( DEBUG ) {
		CODE_FIRST += "," + OUTPUT_VAR_PREFIX + "_d=" + WZHIK_NAME + ".debug";
		CODE_LAST = (USE_WITH ? "}" : "") + "return " + OUTPUT_VAR_PREFIX + OUTPUT_VAR + (DEBUG ? ".join('')" : "");
	}


	var Wzhik = function (templateString, templateID, isPartial ){

		if(templateString.charAt(0) === "#"){
			templateID = templateString;
			if( WZHIK_BROWSER_ENV ) {
				if( DEBUG ) {
					var element = document.getElementById(templateString.substr(1));
					if( !element ) {
						console.error("The is no element with ID ", templateString);
					}
					templateString = element.innerHTML;
				} else {
					templateString = document.getElementById(templateString.substr(1)).innerHTML;
				}
			} else {
				// TEST ONLY
				// templateString = String(
				// 	fs.readFileSync(
				// 		path.join(
				// 			__dirname,
				// 			"../../" + Wzhik['cwd'] + "/" + templateString.substr(1) + ".html")
				// 	)
				// );
			}
		}

		!templateID && (templateID = ("t" + UID++));

		// if(templateID && _cacheCompiled[templateID])
		// 	return _cacheCompiled[templateID];

		if(_cacheCompiledByTpl[templateString])
			return _cacheCompiledByTpl[templateString];

		if( DEBUG ) {
			if( console.groupCollapsed ) {
				console.groupCollapsed( "Template: " + templateID );
			} else {
				console.group( "Template: " + templateID );
			}
		}

		var compiledString = compileTemplateString(templateString, templateID, isPartial);

		if( DEBUG ) {
			console.groupEnd("Template: " + templateID);
		}

		var fn = new Function(INPUT_VAR, compiledString),
			template = new Template(templateID, fn);

		_cacheCompiledByTpl[templateString] = template;

		if(templateID && !_cacheCompiled[templateID]){
			// _cacheCompiled[templateID] = fn;
			_cacheCompiled[templateID] = compiledString;
		}

		return template;
    }


    // 
	// 
	// 
	function Template( templateID, render ){
		this.id = templateID;
		this['render'] = render;
	}

	if(SUPPORT_EXPERIMENTAL) {
		//= "_experimental.js"
	}


	//= "_oldbrowsers.js"
	//= "_utils.js"
	//= "_parser.js"
	//= "_compiler.js"

    
    if( DEBUG ) {
    	//= "_debug.js"
    }


    root[WZHIK_NAME] = Wzhik;
    
    // For tests usage only
    root[WZHIK_NAME]['_name'] = WZHIK_NAME;

    if( server ) {
    	module['exports'] = Wzhik;
    } else {
    	root[WZHIK_NAME] = Wzhik;
    }

}( this, typeof exports !== 'undefined', this.$ );

