if(SUPPORT_EXPERIMENTAL) {

	var NODETYPE_COMMENT = 8;


	function findElementComments( element , comments) {
		if( !comments ) {
			comments = {};
		}

		var children;

		if( !element || !(children = element.childNodes) ) {
			return comments;
		} 

		if( element.nodeType == NODETYPE_COMMENT ){
			comments[element.data] = element.nextSibling;
		}

		for(var i = -1, l = children.length ; ++i < l; ) {
			findElementComments(children[i], comments);
		}

		return comments;
	}

    function tpl( render ){
    	
    	this.render = render;

    	this.update = function( element, variable, value ){
    		
    		if( USE_WITH === false ) {
    			variable = INPUT_VAR + "." + variable;
    		}

    		// jquery element can be passed
    		element = element.jquery ? element[0] : element;

    		var vars = findElementComments( element );

    		if( vars[variable] ) {
    			if( DEBUG ) {
    				vars[variable].data = Zippr.v(value);
    			} else {
    				vars[variable].data = Zippr.v(value);
    			}
    		}
    	}

    	this.observe = function( data, element ){
    		var self = this;
    		Object.observe(data, function(changes){
			    changes.forEach(function(change) {
			    	console.log(change.type, change.name, change.oldValue);
			        self.update( preview, change.name, data[change.name] );
			    });
			});
    	}
    }


    // Redefine
    function Zippr(templateString, templateID){

		if(templateString.charAt(0) === "#"){
			templateID = templateString;
			if( DEBUG ) {
				var element = document.getElementById(templateString.substr(1));
				if( !element ) {
					console.error("The is no element with ID ", templateString);
				}

				templateString = element.innerHTML;

			} else {
				templateString = document.getElementById(templateString.substr(1)).innerHTML;
			}
		}

		!templateID && (templateID = ("t" + UID++));

		if(_cacheCompiledByTpl[templateString])
			return _cacheCompiledByTpl[templateString];

		if( DEBUG ) {
			console.group( "tpl: " + templateID );
		}

		var compiled = compileTemplateString(templateString, templateID);

		if( DEBUG ) {
			console.groupEnd("tpl: " + templateID);
		}

		var fn = new tpl(new Function(INPUT_VAR, compiled));

		_cacheCompiledByTpl[templateString] = fn;

		if(templateID && !_cacheCompiled[templateID]){
			// _cacheCompiled[templateID] = fn;
			_cacheCompiled[templateID] = compiled;
		}

		return fn;
    }	
	
}