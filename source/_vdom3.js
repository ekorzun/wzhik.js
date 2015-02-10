

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





