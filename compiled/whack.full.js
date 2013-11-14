+function(t) {
  var w, x;
  function F(a, c) {
    var d, f, g = a.split("}}"), k, l;
    (l = M.test(g[0]) && r.$1) ? (y[c] = y[l], f = y[c], d = f.c, g.shift(), k = 1) : (d = 1, f = {0:{b:m, a:x}});
    for(var n = 0, h = g.length;n < h;n++) {
      var b = g[n].replace(/\\/g, "\\\\").split("{{");
      "" !== b[0] && (f[d++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var e = N.test(b) && r.$1;
        if(e) {
          if((b = B[e](b, c)) && b.b === u) {
            var e = g[++n], p = [e], b = b.a, q = 0;
            if(0 > e.indexOf("endblock")) {
              for(;!q && void 0 !== (e = g[++n]);) {
                -1 < e.indexOf("endblock") ? (q = 1, p.push(e.split("}}")[0])) : p.push(e)
              }
            }
            p = p.join("}}");
            e = F(p, b).replace(x, "").replace(w, "");
            z[b] = e;
            G[b] = d;
            k ? f[G[b.replace(c, l)]] = {b:u, a:b} : f[d++] = {b:u, a:b}
          }else {
            f[d++] = b
          }
        }else {
          e = b.charAt(0);
          if(" " === e) {
            e = m
          }else {
            if("!" === e) {
              continue
            }else {
              "-" === e ? (e = "=", b = "WhackFull.e(" + b.substring(1) + ")") : ("=" === e && (b = b.substring(1)), /\|\s(\w+)/.test(b) && (e = r.$1, b = b.replace("| " + e, ""), b = "WhackFull.f." + e + "(" + b + ")"), e = "=")
            }
          }
          e && (f[d++] = {b:e, a:b})
        }
      }
    }
    k || (f[d++] = {b:m, a:w});
    f.c = d;
    d = y[c] = f;
    f = d.c;
    g = Array(f);
    k = 0;
    for(var s, n = 0;n < f;n++) {
      h = d[n];
      l = h.b;
      if(s !== l || l === m) {
        g[k++] = ";"
      }
      h = h.a;
      l === m ? g[k++] = h : l === H ? (s = h[1] || "item", b = "i" + v, e = "l" + v, p = "a" + v, v++, g[k++] = "for(var " + b + "=0," + s + "," + p + "=" + h[0] + "," + e + "=" + p + ".length;" + b + "<" + e + ";" + b + "++){" + s + "=" + p + "[" + b + "]") : l === u ? g[k++] = z[h] : (h = "WhackFull.v(" + h + ")", "=" !== s ? g[k++] = "_o+=(" + h + ")" : g[k++] = "+(" + h + ")");
      s = l
    }
    return g.join("")
  }
  function q(a, c) {
    "#" === a.charAt(0) && (c = a, a = document.getElementById(a.substr(1)).innerHTML);
    !c && (c = "t" + v++);
    if(C[a]) {
      return C[a]
    }
    var d = F(a, c), f = new Function("data", d);
    C[a] = f;
    c && !D[c] && (D[c] = d);
    return f
  }
  var v = 0, r = t.RegExp, m = 1, H = 2, u = 3, D = {}, C = {}, z = {}, y = {}, G = {};
  x = "var _o='';";
  w = "return _o";
  var B = {end:function() {
    return{b:m, a:"}"}
  }, "else":function() {
    return{b:m, a:"}else{"}
  }, elseif:function(a) {
    return B["if"]("}else" + a)
  }, "if":function(a) {
    var c = a.lastIndexOf(":"), d = "" === a.split(":").slice(-1)[0].trim();
    -1 < c && d ? a = a.substr(0, c) + "{" : -1 === c && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:m, a:a}
  }, each:function(a) {
    a = O.test(a) && r;
    return{b:H, a:[a.$1, a.$2]}
  }, include:function(a) {
    a = I.test(a) && r.$1;
    return{b:m, a:z[a] || (z[a] = D[a].replace(x, "").replace(w, ""))}
  }, block:function(a, c) {
    var d = I.test(a) && r.$1;
    return{b:u, a:c + ":" + d}
  }, endblock:function() {
    return{b:"=", a:"''"}
  }}, A = t.chrome;
  Object.keys || (Object.keys = function(a) {
    var c = [], d;
    for(d in a) {
      a.hasOwnProperty(d) && c.push(d)
    }
    return c
  });
  String.prototype.trim || (String.prototype.trim = function() {
    var a = A ? this.match(/\S+(?:\s+\S+)*/) : this;
    if(A) {
      return a && a[0] || ""
    }
    for(var c = 0, d = a.length - 1;c < a.length && -1 < " \n\r\t\v\f\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(c));) {
      c++
    }
    for(;d > c && -1 < " \n\r\t\v\f\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(d));) {
      d--
    }
    return a.substring(c, d + 1)
  });
  var E = {}, J = t.document;
  if(!A) {
    var K = J.createTextNode(""), L = J.createElement("span");
    L.appendChild(K)
  }
  var P = /&/g, Q = /"/g, R = /'/g, S = />/g, T = /</g, U = /\//g;
  E.escapeHTML = function(a) {
    return A ? a.replace(P, "&amp;").replace(T, "&lt;").replace(S, "&gt;").replace(Q, "&quot;").replace(R, "&#x27;").replace(U, "&#x2F;") : (K.nodeValue = a) && L.innerHTML
  };
  var O = /\(([\w\.\_]+),?\s*(\w+)?\)/, I = /([\w\-#_]+)\s?$/, M = /extends\s+([\w\-_#]+)/, N = new r("^\\s*(" + Object.keys(B).join("|") + ")\\b");
  q.v = function(a) {
    return"number" === typeof a || a ? a : ""
  };
  q.f = E;
  q.addFilter = function(a, c) {
    E[a] = c
  };
  q.e = function(a) {
    return q.f.escapeHTML(a)
  };
  t.WhackFull = q;
  t.WhackFull._name = "WhackFull"
}(this);

