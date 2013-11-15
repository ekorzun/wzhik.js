+function(r) {
  var u, v;
  function F(a, c) {
    var d, f, h = a.split("}}"), m, l;
    (l = M.test(h[0]) && s.$1) ? (w[l] || n(l), w[c] = w[l], f = w[c], d = f.c, h.shift(), m = 1) : (d = 1, f = {0:{b:p, a:v}});
    for(var q = 0, g = h.length;q < g;q++) {
      var b = h[q].replace(/\\/g, "\\\\").replace(/\t+/g, "\t").replace(/\n+/g, "\n").replace(/\n\t/, "");
      if(!/^\s+$/.test(b) && (b = b.split("{{"), "" !== b[0] && (f[d++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"}), b = b[1])) {
        var e = N.test(b) && s.$1;
        if(e) {
          if((b = C[e](b, c)) && b.b === x) {
            var e = h[++q], k = [e], b = b.a, r = 0;
            if(0 > e.indexOf("endblock")) {
              for(;!r && void 0 !== (e = h[++q]);) {
                -1 < e.indexOf("endblock") ? (r = 1, k.push(e.split("}}")[0])) : k.push(e)
              }
            }
            k = k.join("}}");
            e = F(k, b).replace(v, "").replace(u, "");
            y[b] = e;
            G[b] = d;
            m ? f[G[b.replace(c, l)]] = {b:x, a:b} : f[d++] = {b:x, a:b}
          }else {
            f[d++] = b
          }
        }else {
          e = b.charAt(0);
          if(" " === e) {
            e = p
          }else {
            if("!" === e) {
              continue
            }else {
              "-" === e ? (e = "=", b = "WhackFull.e(" + b.substring(1) + ")") : ("=" === e && (b = b.substring(1)), /\|(\w+)(?:\((.+)\))?\s*$/.test(b) && (e = s.$1, k = s.$2, n.f[e] && (b = b.replace("|" + e + (k ? "(" + k + ")" : ""), ""), b = "WhackFull.f." + e + "(" + b + (k && "," + k) + ")")), e = "=")
            }
          }
          e && (f[d++] = {b:e, a:b})
        }
      }
    }
    m || (f[d++] = {b:p, a:u});
    f.c = d;
    d = w[c] = f;
    f = d.c;
    h = Array(f);
    m = 0;
    for(var t, q = 0;q < f;q++) {
      g = d[q];
      l = g.b;
      if(t !== l || l === p) {
        h[m++] = ";"
      }
      g = g.a;
      l === p ? h[m++] = g : l === H ? (t = g[1] || "item", b = "i" + z, e = "l" + z, k = "a" + z, z++, h[m++] = "for(var " + b + "=0," + t + "," + k + "=" + g[0] + "," + e + "=" + k + ".length;" + b + "<" + e + ";" + b + "++){" + t + "=" + k + "[" + b + "]") : l === x ? h[m++] = y[g] : (g = "'" === g.charAt(0) ? g : "_v(" + g + ")", "=" !== t ? h[m++] = "_o+=" + g : h[m++] = "+" + g);
      t = l
    }
    return h.join("")
  }
  function n(a, c) {
    "#" === a.charAt(0) && (c = a, a = document.getElementById(a.substr(1)).innerHTML);
    !c && (c = "t" + z++);
    if(D[a]) {
      return D[a]
    }
    var d = F(a, c), f = new Function("data", d);
    D[a] = f;
    c && !A[c] && (A[c] = d);
    return f
  }
  var z = 0, s = r.RegExp, p = 1, H = 2, x = 3, A = {}, D = {}, y = {}, w = {}, G = {};
  v = "var _v=WhackFull.v,_o=''";
  u = "return _o";
  var C = {end:function() {
    return{b:p, a:"}"}
  }, "else":function() {
    return{b:p, a:"}else{"}
  }, elseif:function(a) {
    return C["if"]("}else" + a)
  }, "if":function(a) {
    var c = a.lastIndexOf(":"), d = "" === a.split(":").slice(-1)[0].trim();
    -1 < c && d ? a = a.substr(0, c) + "{" : -1 === c && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:p, a:a}
  }, each:function(a) {
    a = O.test(a) && s;
    return{b:H, a:[a.$1, a.$2]}
  }, include:function(a) {
    a = I.test(a) && s.$1;
    A[a] || (n(a), y[a] = A[a].replace(v, "").replace(u, ""));
    return{b:p, a:y[a] || (y[a] = A[a].replace(v, "").replace(u, ""))}
  }, block:function(a, c) {
    var d = I.test(a) && s.$1;
    return{b:x, a:c + ":" + d}
  }, endblock:function() {
    return{b:"=", a:"''"}
  }}, B = r.chrome;
  Object.keys || (Object.keys = function(a) {
    var c = [], d;
    for(d in a) {
      a.hasOwnProperty(d) && c.push(d)
    }
    return c
  });
  String.prototype.trim || (String.prototype.trim = function() {
    var a = B ? this.match(/\S+(?:\s+\S+)*/) : this;
    if(B) {
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
  var E = {}, J = r.document;
  if(!B) {
    var K = J.createTextNode(""), L = J.createElement("span");
    L.appendChild(K)
  }
  var P = /&/g, Q = /"/g, R = /'/g, S = />/g, T = /</g, U = /\//g;
  E.escapeHTML = function(a) {
    return B ? a.replace(P, "&amp;").replace(T, "&lt;").replace(S, "&gt;").replace(Q, "&quot;").replace(R, "&#x27;").replace(U, "&#x2F;") : (K.nodeValue = a) && L.innerHTML
  };
  var O = /\(([\w\.\_]+),?\s*(\w+)?\)/, I = /([\w\-#_]+)\s?$/, M = /extends\s+([\w\-_#]+)/, N = new s("^\\s*(" + Object.keys(C).join("|") + ")\\b");
  n.v = function(a) {
    return"number" === typeof a || a ? a : ""
  };
  n.f = E;
  n.addFilter = function(a, c) {
    E[a] = c;
    return n
  };
  n.e = function(a) {
    return n.f.escapeHTML(a)
  };
  r.WhackFull = n;
  r.WhackFull._name = "WhackFull"
}(this);

