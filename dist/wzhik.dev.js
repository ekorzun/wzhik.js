


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
		
		
		
		
		var 
		    ELEMENT = "element",
		    NAME = "name",
		    VALUE = "value",
		    TEXT = "text",
		    ATTRIBUTES = "attributes",
		    NODE_NAME = "nodeName",
		    COMMENT = "comment",
		    CHILD_NODES = "childNodes",
		    CHECKED = "checked",
		    SELECTED = "selected",
		    CLASS_NAME = "className";
		
		var _attrMap = {
		    "selected" : 1,
		    "value"  : 1,
		    "checked" : 1,
		    "id" : 1,
		    "data" : 1,
		    "className" : 1
		},
		
		 _attrRMap = {
		    "text" : "data"
		}
		
		
		
		// 
		// 
		// 
		function Diff(kind, path, value, origin, index, item ) {
		    this.kind = kind;
		    path && (this._path = path);
		    origin !== undefined && (this.lhs = origin);
		    value !== undefined && (this.rhs = value);
		    index && (this.index = index);
		    item && (this.item = item);
		}
		
		
		// 
		// 
		// 
		function diffArrayRemove(arr, from, to) {
		    var rest = arr.slice((to || from) + 1 || arr.length);
		    arr.length = from < 0 ? arr.length + from : from;
		    arr.push.apply(arr, rest);
		    return arr;
		}
		
		
		// 
		// 
		// 
		function realTypeOf(subject) {
		    var type = typeof subject;
		    if (type !== 'object') {
		        return type;
		    }
		
		    return (
		        (subject === null && 'null') 
		        || (isArray(subject) && 'array')
		        || (subject instanceof Date && 'date')
		        || (/^\/.*\//.test(subject.toString()) && 'regexp')
		        || 'object'
		    );
		}
		
		
		// 
		// 
		// 
		function deepDiff(lhs, rhs, changes, prefilter, path, key, stack) {
		    path = path || [];
		    var currentPath = path.slice(0);
		    if (typeof key !== 'undefined') {
		        if (prefilter && prefilter(currentPath, key)) {
		            return;
		        }
		        currentPath.push(key);
		    }
		    var ltype = typeof lhs;
		    var rtype = typeof rhs;
		    if (ltype === 'undefined') {
		        if (rtype !== 'undefined') {
		            changes(new Diff("N", currentPath, rhs));
		        }
		    } else if (rtype === 'undefined') {
		        changes(new DiffDeleted("D", currentPath, undefined, lhs));
		    } else if (realTypeOf(lhs) !== realTypeOf(rhs)) {
		        changes(new Diff("E", currentPath, rhs, lhs));
		    } else if (lhs instanceof Date && rhs instanceof Date && ((lhs - rhs) !== 0)) {
		        changes(new Diff("E", currentPath, rhs, lhs));
		    } else if (ltype === 'object' && lhs !== null && rhs !== null) {
		        stack = stack || [];
		        if (stack.indexOf(lhs) < 0) {
		            stack.push(lhs);
		            if (isArray(lhs)) {
		                var i, len = lhs.length;
		                for (i = 0; i < lhs.length; i++) {
		                    if (i >= rhs.length) {
		                        changes(new DiffArray("A", currentPath, undefined, undefined, i, new DiffDeleted("D", undefined, undefined, lhs[i])));
		                    } else {
		                        deepDiff(lhs[i], rhs[i], changes, prefilter, currentPath, i, stack);
		                    }
		                }
		                while (i < rhs.length) {
		                    changes(new DiffArray("A", currentPath, undefined, undefined, i, new Diff("N", undefined, rhs[i++])));
		                }
		            } else {
		                var akeys = Object.keys(lhs);
		                var pkeys = Object.keys(rhs);
		
		                Wzhik.each(akeys, function(k, i) {
		                    var other = pkeys.indexOf(k);
		                    if (other >= 0) {
		                        deepDiff(lhs[k], rhs[k], changes, prefilter, currentPath, k, stack);
		                        pkeys = diffArrayRemove(pkeys, other);
		                    } else {
		                        deepDiff(lhs[k], undefined, changes, prefilter, currentPath, k, stack);
		                    }
		                });
		
		                Wzhik.each(pkeys, function(k) {
		                    deepDiff(undefined, rhs[k], changes, prefilter, currentPath, k, stack);
		                });
		            }
		            stack.length = stack.length - 1;
		        }
		    } else if (lhs !== rhs) {
		        if (!(ltype === "number" && isNaN(lhs) && isNaN(rhs))) {
		            changes(new Diff("E", currentPath, rhs, lhs));
		        }
		    }
		}
		
		
		// 
		// 
		// 
		function accumulateDiff(lhs, rhs, prefilter, accum) {
		    accum = accum || [];
		    deepDiff(lhs, rhs,
		        function(diff) {
		            if (diff) {
		                accum.push(diff);
		            }
		        },
		        prefilter);
		    return (accum.length) ? accum : undefined;
		}
		
		
		// 
		// 
		// 
		function diffApplyArrayChange(arr, index, change) {
		    if (change._path && change._path.length) {
		        var it = arr[index],
		            i, u = change._path.length - 1;
		        for (i = 0; i < u; i++) {
		            it = it[change._path[i]];
		        }
		        switch (change.kind) {
		            case 'A':
		                diffApplyArrayChange(it[change._path[i]], change.index, change.item);
		                break;
		            case 'D':
		                delete it[change._path[i]];
		                break;
		            case 'E':
		            case 'N':
		                it[change._path[i]] = change.rhs;
		                break;
		        }
		    } else {
		        switch (change.kind) {
		            case 'A':
		                diffApplyArrayChange(arr[index], change.index, change.item);
		                break;
		            case 'D':
		                arr = diffArrayRemove(arr, index);
		                break;
		            case 'E':
		            case 'N':
		                arr[index] = change.rhs;
		                break;
		        }
		    }
		    return arr;
		}
		
		
		// 
		// 
		// 
		function diffApplyChange(target, source, change) {
		    if (target && source && change && change.kind) {
		        var it = target,
		            i = -1,
		            last = change._path.length - 1;
		        while (++i < last) {
		            if (typeof it[change._path[i]] === 'undefined') {
		                it[change._path[i]] = (typeof change._path[i] === 'number') ? new Array() : {};
		            }
		            it = it[change._path[i]];
		        }
		        switch (change.kind) {
		            case 'A':
		                diffApplyArrayChange(it[change._path[i]], change.index, change.item);
		                break;
		            case 'D':
		                delete it[change._path[i]];
		                break;
		            case 'E':
		            case 'N':
		                it[change._path[i]] = change.rhs;
		                break;
		        }
		    }
		}
		
		
		// 
		// 
		// 
		function applyAttributes( target, source ) {
		    Wzhik.each([
		        'id', 
		        CLASS_NAME,
		        VALUE,
		        TEXT,
		        CHECKED,
		        SELECTED
		    ], function( prop ){
		        source[prop] && (target[prop] = source[prop]);
		    });
		}
		
		
		// 
		// 
		// 
		function nodeToObj(node) {
		    var objNode = {},
		        i;
		
		    if (node.nodeType === 3) {
		        objNode["text"] = node.data;
		    } else if (node.nodeType === 8) {
		        objNode[COMMENT] = node.data;
		    } else {
		        objNode[NODE_NAME] = node.nodeName;
		        if (node.attributes && node.attributes.length > 0) {
		            objNode[ATTRIBUTES] = [];
		            for (i = 0; i < node.attributes.length; i++) {
		                objNode[ATTRIBUTES].push([node.attributes[i].name, node.attributes[i].value]);
		            }
		        }
		        if (node.childNodes && node.childNodes.length > 0) {
		            objNode[CHILD_NODES] = [];
		            for (i = 0; i < node.childNodes.length; i++) {
		                objNode[CHILD_NODES].push(nodeToObj(node.childNodes[i]));
		            }
		        }
		        
		        applyAttributes(objNode, node);
		    }
		    return objNode;
		}
		
		
		// 
		// 
		// 
		function objToNode(objNode, insideSvg) {
		    var node, i;
		    if (objNode.hasOwnProperty(TEXT)) {
		        node = document.createTextNode(objNode[TEXT]);
		    } else if (objNode.hasOwnProperty(COMMENT)) {
		        node = document.createComment(objNode[COMMENT]);
		    } else {
		        if (objNode[NODE_NAME] === 'svg' || insideSvg) {
		            node = document.createElementNS('http://www.w3.org/2000/svg', objNode[NODE_NAME]);
		            insideSvg = true;
		        } else {
		            node = document.createElement(objNode[NODE_NAME]);
		        }
		        if (objNode[ATTRIBUTES]) {
		            for (i = 0; i < objNode[ATTRIBUTES].length; i++) {
		                node.setAttribute(objNode[ATTRIBUTES][i][0], objNode[ATTRIBUTES][i][1]);
		            }
		        }
		        if (objNode[CHILD_NODES]) {
		            for (i = 0; i < objNode[CHILD_NODES].length; i++) {
		                node.appendChild(objToNode(objNode[CHILD_NODES][i], insideSvg));
		            }
		        }
		        applyAttributes(node, objNode);
		    }
		    return node;
		}
		
		
		
		// 
		// 
		// 
		function applyNodeChange( element, diff, source ) {
		    var 
		        attr = false,
		        path = diff._path,
		        kind = diff.kind, tmpEl;
		
		    if( !diff._path ) return ;
		
		    for (var i = 0, j, index; i < path.length; i++) {
		
		        index = path[i];
		
		        if( typeof index === "string" ) {
		            if( index == CHILD_NODES ) {
		
		                tmpEl = element.childNodes[path[++i]];
		                tmpEl && (element = tmpEl);
		                source = source[CHILD_NODES][path[i]];
		
		
		            } else if (index == ATTRIBUTES  ) {
		                attr = source.attributes[path[++i]][0];
		            } else {
		                attr = index;
		            }
		        }
		    }
		
		    // console.warn(index, attr , source );
		
		    _applyNodeChange( element, diff.rhs, attr, kind , diff );
		
		}
		
		
		// 
		// 
		// 
		function _applyNodeChange( element, value, attr, kind, diff ) {
		
		    if( (attr && (attr = _attrRMap[attr] || attr)) && !value ) {
		        kind = "D";
		    }
		
		    switch (kind) {
		        case 'A':
		            if( diff.item ) {   
		                if( diff.item.kind === "D" ) {
		                    element.removeChild(element.childNodes[diff.index]);
		                }  else if( diff.item.kind === "N" ) {
		                    element.appendChild(objToNode(diff.item.rhs));
		                }
		            } 
		        break;
		        case 'D':
		            if ( attr ) {
		                if(_attrMap[attr]) {
		                    delete element[attr];
		                } else {
		                    element['removeAttribute']( attr );
		                }
		            } else {
		                element.parentNode.removeChild( element );
		            }
		        break;
		        case 'E':
		        case 'N':
		            if ( attr ) {
		                if(_attrMap[attr]) {
		                    element[attr] = value;
		                } else {
		                    element['setAttribute']( attr, value );
		                }
		            } else if( typeof value === "object" ) {
		                element.appendChild(objToNode(value));
		            }
		        break;
		    }
		}
		
		function cloneObject(obj) {
		    if(obj == null || typeof(obj) != 'object')
		        return obj;
		
		    var temp = obj.constructor(); // changed
		
		    for(var key in obj) {
		        if(obj.hasOwnProperty(key)) {
		            temp[key] = cloneObject(obj[key]);
		        }
		    }
		    return temp;
		}
		
		
		Template.prototype = {
		
		    update : function( newData ) {
		
		        // var self = this;
		        // if(!this.olddata) {
		        //     this.olddata = cloneObject(newData);
		        // }
		        // var dataDiffs = accumulateDiff(this.olddata, newData);
		        // console.log( this.olddata, newData , dataDiffs );
		        // dataDiffs && dataDiffs.length && Wzhik.each(dataDiffs, function(diff){
		        //     diffApplyChange(self.olddata, {}, diff);
		        // });
		
		        var element = this.element;
		
		        var tmp = element.cloneNode( false );
		        tmp.innerHTML = this.render( newData );
		        
		        var tmpJSON = nodeToObj(tmp);
		        var diffs = accumulateDiff( this.vdom, tmpJSON );
		
		        if( !diffs || !diffs.length ) {
		            return false;
		        }
		
		        // @todo 
		        // Make groupping diffs by kind.
		        // E.g. append documentfragment
		
		        for( var diff, k = diffs.length; k--;){
		            diff = diffs[k];
		            // 
		            // Apply change to virtual DOM object
		            this.updateVDOM(diff);
		            // 
		            // Apply change to real DOM object
		            applyNodeChange(element, diff, tmpJSON);
		        }
		
		    },
		
		    'attach' : function( selector ){
		    	this.element = $(selector || this.id)[0];
		        return this;
		    },
		
		    'renderTo' : function( data ) {
		    	this.element.innerHTML = this.render(data);
		        this.updateVDOM();
		    },
		
		    diffs : [],
		
		    updateVDOM : function( diff ){
		        var self = this;
		        if (diff ) {
		            self.diffs.push( diff );
		        }
		        clearTimeout(this.t);
		        self.t = setTimeout(function(){
		            if( diff ) {
		                var tmp;
		                while( tmp = self.diffs.pop() ) {
		                    diffApplyChange(self.vdom, {}, tmp);
		                }
		            } else {
		                self.vdom = nodeToObj(self.element);   
		            }
		        }, 0);
		    }
		}
	}


	
	// http://kangax.github.io/es5-compat-table/#Object.keys
	// IE8- / FF3.6- / SF 4- / Opera 11
	if(SUPPORT_OLD_BROWSERS && !Object.keys) {
		Object.keys = function( obj ){
			var keys = [];
			for(var k in obj) {
				obj.hasOwnProperty(k) && keys.push(k);
			}
			return keys;
		}
	}
	
	
	
	// http://jsperf.com/mega-trim-test
	if(SUPPORT_OLD_BROWSERS && !String.prototype.trim) {
	
		String.prototype.trim = function(){
		    for (var _char, ws = /32|10|13|9|12/, str = this, i = -1, j = str.length; ++i < j; ) {
		        _char = str.charCodeAt(i);
		        if (!ws.test(_char))  {
		        	for ( ; --j >= i; ) {
				        if (!ws.test(str.charCodeAt(j)))  {
				        	return str.substring(i, ++j);
				        }
				    }
		        }
		    }
		    return str.substring(i, ++j);
		}
	}
	
	
	var isArray = Array.isArray || function(arg) {
	    return toString.call(arg) === '[object Array]';
	};
	
	
	
	if( SUPPORT_FILTERS ) {
		var isChrome = root['chrome'];
		var _filters = {}, doc = root.document;
	
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
	
		Wzhik['e'] = _filters["escape"] = function( code ) {
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
	
		Wzhik['f'] = _filters;
		Wzhik['addFilter'] = function(name, fn){
			_filters[name] = fn;
			return Wzhik
		}
	}
	
	
	
	if( IGNORE_NULLS ) {
		// Ignoring empty values
		// Example:
		// v(null) === ""
		// v(false) === ""
		// v(undefined) === ""
		// v(0) === 0
		Wzhik['v'] = function( value, templateID, lineNumber ){
			if( DEBUG ) {
				if( lineNumber ) {
					if( value === undefined ) {
	    				console.warn(
	    					"Undefined value: ",
	    					variable, '===', value,
	    					"in template", "#" +templateID,
	    					"at line #", lineNumber, 
	    					"(", (_cacheOriginals[templateID][originalLineNumber] || "").trim(), ")"
	    				);
	    			}
				}
			}
			return (typeof value === "number" || value) ? value : "";
		}
	}
	
	
	
	
	// @todo perf test: array detection vs 2 functions for object and array
	// Each function
	Wzhik["each"] = function(subject, fn){
		for(
			var index = -1,
				isarr = subject instanceof Array,
				arr = isarr ? subject : Object.keys( subject ),
				length = arr.length,
				value, key, r, last = length - 1;
			++index < length;
		) {
			if ( isarr ) {
				value = arr[index];
				key = index;
			} else {
				key = arr[index];
				value = subject[key];
			}
	
			if((r = fn( value,  key, index === 0, index === last, index % 2)) === false){
				return r
			};
		}
	}
	
	//
	//
	function parseTemplateString( templateString, name, isPartial){
	
		var parsedLinesIndex = 0;
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
	
		// If Wzhik supports extend, it should be in the first line
		if( SUPPORT_EXTENDS && (parentID = regexEXTEND.test(tokens[0]) && _RegExp.$1)) {
	
			// In autocompile mode make sure that parentID is exist
			if(AUTOCOMPILE && !_cacheParsing[parentID]){
				// Try to compile parent from DOM useing ID selector
				Wzhik( parentID );
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
	
			if( !isPartial ) {
				// Wzhik doesnt support extending, so we use default code
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
			} else {
				parsedLines = {};
			}
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
						_cacheParsingDebug[name].push({
							parsed : parsedLinesIndex,
							original: getOriginalLine(ln, name)
						});
					});
				} else {
					_cacheParsingDebug[name].push({
						parsed : parsedLinesIndex,
						original:  getOriginalLine(debugline, name)
					});
				}
			}
	
			
			// Do not insert empty lines
			if( /^\s+$/.test(line)) continue;
	
			var l = line.split( OPEN_TAG );
	
			// Code may start with plain text
			if( l[0] !== ''){
				
				if( DEBUG ) {
					_cacheParsingDebug[name].push({
						parsed :parsedLinesIndex,
						original:  getOriginalLine(l[0], name)
					});
				}
	
				parsedLines[parsedLinesIndex++] = {
					operator: OPERATOR_ECHO,
					_code :'\''+l[0].replace(/'/g,'\\\'').replace(/\n/g,'\\n')+'\''
				};
			}
	
			var code = l[1];
	
			if( DEBUG ) {
				_cacheParsingDebug[name].push({
					parsed : parsedLinesIndex,
					original:  getOriginalLine(l[1], name)
				});
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
						code = WZHIK_NAME + ".e" + "(" + code.substring(1) + ")";
	
					} else {
	
						if(symbol === OPERATOR_ECHO ) {
							code = code.substring(1);
						}
	
						if( SUPPORT_FILTERS && /\|(\w+)(?:\((.+)\))?\s*$/.test(code)){
							var f = _RegExp.$1, param = _RegExp.$2;
							if( Wzhik['f'][f] ) {
								code = code.replace("|" + f + (param ? ("("+param+")") : ""), "");
								// var __code = code;
								code = WZHIK_NAME + ".f." + f + "(" + code + (param && "," + param) + ")";
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
			if( !extended && !isPartial ) {
				parsedLines[parsedLinesIndex++] = {
					operator : KEY_JS,
					_code : CODE_LAST
				}
				parsedLines.len = parsedLinesIndex;
			} else {
				parsedLines.len = parsedLinesIndex;
			}
		} else {
			if( !isPartial ) {
				parsedLines[parsedLinesIndex++] = {
					operator : KEY_JS,
					_code : CODE_LAST
				}
			}
	
			parsedLines.len = parsedLinesIndex;
		}
	
		// if( DEBUG ) {
		// 	console.log("Parsed lines: ", parsedLines)
		// }
	
		return (_cacheParsing[name] = parsedLines);
	}
	
	
	if( DEBUG ) {
		Wzhik.parseTemplateString = parseTemplateString;
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
	
				Wzhik(r);
	
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

    
    if( DEBUG ) {
    	
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
    	
    	
    	if(!root['console']) {
    		console = root['console'] = {};
    	}
    	
    	(["log", "group", "groupCollapsed", "groupEnd", "warn", "error", "info"]).forEach(function( fn ){
    		!console[fn] && (console[fn] = function(){});
    	});
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