+function(n) {
  function f(a, d) {
    "#" === a.charAt(0) && (d = a, a = document.getElementById(a.substr(1)).innerHTML);
    !d && (d = "t" + r++);
    console.group("tpl: " + d);
    if(t[a]) {
      return t[a]
    }
    var g, h;
    h = d;
    var m, e, k = a.split("%>");
    m = 1;
    e = {0:{b:p, a:B}};
    for(var l = 0, f = k.length;l < f;l++) {
      var b = k[l].replace(/\\/g, "\\\\").split("<%");
      "" !== b[0] && (e[m++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var c = C.test(b) && s.$1;
        if(c) {
          b = u[c](b, h), e[m++] = b
        }else {
          c = b.charAt(0);
          if(" " === c) {
            c = p
          }else {
            if("!" === c) {
              continue
            }else {
              "-" === c ? (c = "=", b = "WhackSmallest.e(" + b.substring(1) + ")") : ("=" === c && (b = b.substring(1)), /\|\s(\w+)/.test(b) && (c = s.$1, b = b.replace("| " + c, ""), b = "WhackSmallest.f." + c + "(" + b + ")"), c = "=")
            }
          }
          c && (e[m++] = {b:c, a:b})
        }
      }
    }
    e.c = m;
    console.log("Parsed lines: ", e);
    h = D[h] = e;
    m = h.c;
    e = Array(m);
    for(f = k = 0;f < m;f++) {
      b = h[f];
      l = b.b;
      if(g !== l || l === p) {
        e[k++] = ";"
      }
      b = b.a;
      if(l === p) {
        e[k++] = b
      }else {
        if(l === v) {
          g = b[1] || "item";
          var c = "i" + r, n = "l" + r, q = "a" + r;
          r++;
          e[k++] = "for(var " + c + "=0," + g + "," + q + "=" + b[0] + "," + n + "=" + q + ".length;" + c + "<" + n + ";" + c + "++){" + g + "=" + q + "[" + c + "]"
        }else {
          "=" !== g ? e[k++] = "_o+=(" + b + ")" : e[k++] = "+(" + b + ")"
        }
      }
      g = l
    }
    e[0] = "try{" + e[0];
    e[k - 1] = "}catch(e){console.error(e.message);};return _o";
    console.log("Compiled function: ", e.join(""));
    g = e.join("");
    console.groupEnd("tpl: " + d);
    h = new Function("data", g);
    t[a] = h;
    d && !w[d] && (w[d] = g);
    return h
  }
  var r = 0, s = n.RegExp, p = 1, v = 2, w = {}, t = {}, D = {}, B = "var _o='';", u = {end:function() {
    return{b:p, a:"}"}
  }, "else":function() {
    return{b:p, a:"} else {"}
  }, elseif:function(a) {
    return u["if"]("} else " + a)
  }, "if":function(a) {
    var d = a.lastIndexOf(":"), f = "" === a.split(":").slice(-1)[0].trim();
    -1 < d && f ? a = a.substr(0, d) + "{" : -1 === d && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:p, a:a}
  }, each:function(a) {
    var d = E.test(a) && s;
    console.log("Parsing <for>: ", a, d);
    return{b:v, a:[d.$1, d.$2]}
  }}, q = {}, x = n.chrome, y = n.document;
  if(x) {
    var z = y.createTextNode(""), A = y.createElement("span");
    A.appendChild(z)
  }
  var F = /&/g, G = /"/g, H = /'/g, I = />/g, J = /</g, K = /\//g;
  q.escapeHTML = function(a) {
    return x ? a.replace(F, "&amp;").replace(J, "&lt;").replace(I, "&gt;").replace(G, "&quot;").replace(H, "&#x27;").replace(K, "&#x2F;") : (z.nodeValue = a) && A.innerHTML
  };
  var E = /\(([\w\.\_]+),?\s*(\w+)?\)/, C = new s("^\\s*(" + Object.keys(u).join("|") + ")\\b");
  f.f = q;
  f.addFilter = function(a, d) {
    q[a] = d
  };
  f.e = function(a) {
    return f.f.escapeHTML(a)
  };
  n.WhackSmallest = f
}(this);

