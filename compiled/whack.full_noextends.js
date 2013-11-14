+function(n) {
  var t, u;
  function g(a, c) {
    "#" === a.charAt(0) && (c = a, a = document.getElementById(a.substr(1)).innerHTML);
    !c && (c = "t" + r++);
    if(v[a]) {
      return v[a]
    }
    var d, h;
    h = c;
    var k, f, p = a.split("}}");
    k = 1;
    f = {0:{b:l, a:u}};
    for(var m = 0, g = p.length;m < g;m++) {
      var b = p[m].replace(/\\/g, "\\\\").split("{{");
      "" !== b[0] && (f[k++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var e = E.test(b) && s.$1;
        if(e) {
          b = w[e](b, h), f[k++] = b
        }else {
          e = b.charAt(0);
          if(" " === e) {
            e = l
          }else {
            if("!" === e) {
              continue
            }else {
              "-" === e ? (e = "=", b = "WhackNoExtends.e(" + b.substring(1) + ")") : ("=" === e && (b = b.substring(1)), /\|\s(\w+)/.test(b) && (e = s.$1, b = b.replace("| " + e, ""), b = "WhackNoExtends.f." + e + "(" + b + ")"), e = "=")
            }
          }
          e && (f[k++] = {b:e, a:b})
        }
      }
    }
    f[k++] = {b:l, a:t};
    f.c = k;
    h = F[h] = f;
    k = h.c;
    f = Array(k);
    for(g = p = 0;g < k;g++) {
      b = h[g];
      m = b.b;
      if(d !== m || m === l) {
        f[p++] = ";"
      }
      b = b.a;
      if(m === l) {
        f[p++] = b
      }else {
        if(m === z) {
          d = b[1] || "item";
          var e = "i" + r, n = "l" + r, q = "a" + r;
          r++;
          f[p++] = "for(var " + e + "=0," + d + "," + q + "=" + b[0] + "," + n + "=" + q + ".length;" + e + "<" + n + ";" + e + "++){" + d + "=" + q + "[" + e + "]"
        }else {
          b = "WhackNoExtends.v(" + b + ")", "=" !== d ? f[p++] = "_o+=(" + b + ")" : f[p++] = "+(" + b + ")"
        }
      }
      d = m
    }
    d = f.join("");
    h = new Function("data", d);
    v[a] = h;
    c && !x[c] && (x[c] = d);
    return h
  }
  var r = 0, s = n.RegExp, l = 1, z = 2, x = {}, v = {}, A = {}, F = {};
  u = "var _o='';";
  t = "return _o";
  var w = {end:function() {
    return{b:l, a:"}"}
  }, "else":function() {
    return{b:l, a:"}else{"}
  }, elseif:function(a) {
    return w["if"]("}else" + a)
  }, "if":function(a) {
    var c = a.lastIndexOf(":"), d = "" === a.split(":").slice(-1)[0].trim();
    -1 < c && d ? a = a.substr(0, c) + "{" : -1 === c && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:l, a:a}
  }, each:function(a) {
    a = G.test(a) && s;
    return{b:z, a:[a.$1, a.$2]}
  }, include:function(a) {
    a = H.test(a) && s.$1;
    return{b:l, a:A[a] || (A[a] = x[a].replace(u, "").replace(t, ""))}
  }}, q = n.chrome;
  Object.keys || (Object.keys = function(a) {
    var c = [], d;
    for(d in a) {
      a.hasOwnProperty(d) && c.push(d)
    }
    return c
  });
  String.prototype.trim || (String.prototype.trim = function() {
    var a = q ? this.match(/\S+(?:\s+\S+)*/) : this;
    if(q) {
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
  var y = {}, B = n.document;
  if(!q) {
    var C = B.createTextNode(""), D = B.createElement("span");
    D.appendChild(C)
  }
  var I = /&/g, J = /"/g, K = /'/g, L = />/g, M = /</g, N = /\//g;
  y.escapeHTML = function(a) {
    return q ? a.replace(I, "&amp;").replace(M, "&lt;").replace(L, "&gt;").replace(J, "&quot;").replace(K, "&#x27;").replace(N, "&#x2F;") : (C.nodeValue = a) && D.innerHTML
  };
  var G = /\(([\w\.\_]+),?\s*(\w+)?\)/, H = /([\w\-#_]+)\s?$/, E = new s("^\\s*(" + Object.keys(w).join("|") + ")\\b");
  g.v = function(a) {
    return"number" === typeof a || a ? a : ""
  };
  g.f = y;
  g.addFilter = function(a, c) {
    y[a] = c
  };
  g.e = function(a) {
    return g.f.escapeHTML(a)
  };
  n.WhackNoExtends = g;
  n.WhackNoExtends._name = "WhackNoExtends"
}(this);

