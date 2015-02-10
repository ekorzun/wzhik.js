

//= "_vdom3.js"

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
