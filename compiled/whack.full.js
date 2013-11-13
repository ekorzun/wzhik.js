+function(t) {
  var w, x;
  function E(a, d) {
    var e, f, g = a.split("}}"), k, l;
    (l = M.test(g[0]) && r.$1) ? (y[d] = y[l], f = y[d], e = f.c, g.shift(), k = 1) : (e = 1, f = {0:{b:m, a:x}});
    for(var n = 0, h = g.length;n < h;n++) {
      var b = g[n].replace(/\\/g, "\\\\").split("{{");
      "" !== b[0] && (f[e++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var c = N.test(b) && r.$1;
        if(c) {
          if((b = A[c](b, d)) && b.b === u) {
            var c = g[++n], p = [c], b = b.a, q = 0;
            if(0 > c.indexOf("endblock")) {
              for(;!q && void 0 !== (c = g[++n]);) {
                -1 < c.indexOf("endblock") ? (q = 1, p.push(c.split("}}")[0])) : p.push(c)
              }
            }
            p = p.join("}}");
            c = E(p, b).replace(x, "").replace(w, "");
            z[b] = c;
            F[b] = e;
            k ? f[F[b.replace(d, l)]] = {b:u, a:b} : f[e++] = {b:u, a:b}
          }else {
            f[e++] = b
          }
        }else {
          c = b.charAt(0);
          if(" " === c) {
            c = m
          }else {
            if("!" === c) {
              continue
            }else {
              "-" === c ? (c = "=", b = "WhackFull.e(" + b.substring(1) + ")") : ("=" === c && (b = b.substring(1)), /\|\s(\w+)/.test(b) && (c = r.$1, b = b.replace("| " + c, ""), b = "WhackFull.f." + c + "(" + b + ")"), c = "=")
            }
          }
          c && (f[e++] = {b:c, a:b})
        }
      }
    }
    k || (f[e++] = {b:m, a:w});
    f.c = e;
    e = y[d] = f;
    f = e.c;
    g = Array(f);
    k = 0;
    for(var s, n = 0;n < f;n++) {
      h = e[n];
      l = h.b;
      if(s !== l || l === m) {
        g[k++] = ";"
      }
      h = h.a;
      l === m ? g[k++] = h : l === G ? (s = h[1] || "item", b = "i" + v, c = "l" + v, p = "a" + v, v++, g[k++] = "for(var " + b + "=0," + s + "," + p + "=" + h[0] + "," + c + "=" + p + ".length;" + b + "<" + c + ";" + b + "++){" + s + "=" + p + "[" + b + "]") : l === u ? g[k++] = z[h] : (h = "WhackFull.v(" + h + ")", "=" !== s ? g[k++] = "_o+=(" + h + ")" : g[k++] = "+(" + h + ")");
      s = l
    }
    return g.join("")
  }
  function q(a, d) {
    "#" === a.charAt(0) && (d = a, a = document.getElementById(a.substr(1)).innerHTML);
    !d && (d = "t" + v++);
    if(B[a]) {
      return B[a]
    }
    var e = E(a, d), f = new Function("data", e);
    B[a] = f;
    d && !C[d] && (C[d] = e);
    return f
  }
  var v = 0, r = t.RegExp, m = 1, G = 2, u = 3, C = {}, B = {}, z = {}, y = {}, F = {};
  x = "var _o='';";
  w = "return _o";
  var A = {end:function() {
    return{b:m, a:"}"}
  }, "else":function() {
    return{b:m, a:"}else{"}
  }, elseif:function(a) {
    return A["if"]("}else" + a)
  }, "if":function(a) {
    var d = a.lastIndexOf(":"), e = "" === a.split(":").slice(-1)[0].trim();
    -1 < d && e ? a = a.substr(0, d) + "{" : -1 === d && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:m, a:a}
  }, each:function(a) {
    a = O.test(a) && r;
    return{b:G, a:[a.$1, a.$2]}
  }, include:function(a) {
    a = H.test(a) && r.$1;
    return{b:m, a:z[a] || (z[a] = C[a].replace(x, "").replace(w, ""))}
  }, block:function(a, d) {
    var e = H.test(a) && r.$1;
    return{b:u, a:d + ":" + e}
  }, endblock:function() {
    return{b:"=", a:"''"}
  }}, D = {}, I = t.chrome, J = t.document;
  if(!I) {
    var K = J.createTextNode(""), L = J.createElement("span");
    L.appendChild(K)
  }
  var P = /&/g, Q = /"/g, R = /'/g, S = />/g, T = /</g, U = /\//g;
  D.escapeHTML = function(a) {
    return I ? a.replace(P, "&amp;").replace(T, "&lt;").replace(S, "&gt;").replace(Q, "&quot;").replace(R, "&#x27;").replace(U, "&#x2F;") : (K.nodeValue = a) && L.innerHTML
  };
  var O = /\(([\w\.\_]+),?\s*(\w+)?\)/, H = /([\w\-#_]+)\s?$/, M = /extends\s+([\w\-_#]+)/, N = new r("^\\s*(" + Object.keys(A).join("|") + ")\\b");
  q.v = function(a) {
    return"number" === typeof a || a ? a : ""
  };
  q.f = D;
  q.addFilter = function(a, d) {
    D[a] = d
  };
  q.e = function(a) {
    return q.f.escapeHTML(a)
  };
  t.WhackFull = q;
  t.WhackFull._name = "WhackFull"
}(this);

