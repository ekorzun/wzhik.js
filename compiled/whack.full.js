+function(q) {
  function E(a, d) {
    var e, f, g = a.split("}}"), k, l;
    (l = M.test(g[0]) && r.$1) ? (v[d] = v[l], f = v[d], e = f.c, g.shift(), k = 1) : (e = 1, f = {0:{b:m, a:w}});
    for(var n = 0, h = g.length;n < h;n++) {
      var b = g[n].replace(/\\/g, "\\\\").split("{{");
      "" !== b[0] && (f[e++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var c = N.test(b) && r.$1;
        if(c) {
          if((b = A[c](b, d)) && b.b === t) {
            var c = g[++n], p = [c], b = b.a, q = 0;
            if(0 > c.indexOf("endblock")) {
              for(;!q && void 0 !== (c = g[++n]);) {
                -1 < c.indexOf("endblock") ? (q = 1, p.push(c.split("}}")[0])) : p.push(c)
              }
            }
            p = p.join("}}");
            c = E(p, b).replace(w, "").replace(x, "");
            y[b] = c;
            F[b] = e;
            k ? f[F[b.replace(d, l)]] = {b:t, a:b} : f[e++] = {b:t, a:b}
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
              "=" === c && (b = b.substring(1)), /\|\s(\w+)/.test(b) && (c = r.$1, b = b.replace("| " + c, ""), b = "Whack.f." + c + "(" + b + ")"), c = "="
            }
          }
          c && (f[e++] = {b:c, a:b})
        }
      }
    }
    k || (f[e++] = {b:m, a:x}, f.c = e);
    e = v[d] = f;
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
      l === m ? g[k++] = h : l === G ? (s = h[1] || "item", b = "i" + u, c = "l" + u, p = "a" + u, u++, g[k++] = "for(var " + b + "=0," + s + "," + p + "=" + h[0] + "," + c + "=" + p + ".length;" + b + "<" + c + ";" + b + "++){" + s + "=" + p + "[" + b + "]") : l === t ? g[k++] = y[h] : (h = "Whack.v(" + h + ")", "=" !== s ? g[k++] = "_o+=(" + h + ")" : g[k++] = "+(" + h + ")");
      s = l
    }
    return g.join("")
  }
  function z(a, d) {
    "#" === a.charAt(0) && (d = a, a = document.getElementById(a.substr(1)).innerHTML);
    !d && (d = "t" + u++);
    if(B[a]) {
      return B[a]
    }
    var e = E(a, d), f = new Function("data", e);
    B[a] = f;
    d && !C[d] && (C[d] = e);
    return f
  }
  var u = 0, r = q.RegExp, m = 1, G = 2, t = 3, C = {}, B = {}, y = {}, v = {}, F = {}, w, x;
  w = "var _o;";
  x = "return _o";
  var A = {end:function() {
    return{b:m, a:"}"}
  }, "else":function() {
    return{b:m, a:"} else {"}
  }, elseif:function(a) {
    return A["if"]("} else " + a)
  }, "if":function(a) {
    var d = a.lastIndexOf(":"), e = "" === a.split(":").slice(-1)[0].trim();
    -1 < d && e ? a = a.substr(0, d) + "{" : -1 === d && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:m, a:a}
  }, each:function(a) {
    a = O.test(a) && r;
    return{b:G, a:[a.$1, a.$2]}
  }, include:function(a) {
    a = H.test(a) && r.$1;
    return{b:m, a:y[a] || (y[a] = C[a].replace(w, "").replace(x, ""))}
  }, block:function(a, d) {
    var e = H.test(a) && r.$1;
    return{b:t, a:d + ":" + e}
  }, endblock:function() {
    return{b:"=", a:"''"}
  }}, D = {}, I = q.chrome, J = q.document;
  if(I) {
    var K = J.createTextNode(""), L = J.createElement("span");
    L.appendChild(K)
  }
  var P = /&/g, Q = /"/g, R = /'/g, S = />/g, T = /</g, U = /\//g;
  D.escapeHTML = function(a) {
    return I ? a.replace(P, "&amp;").replace(T, "&lt;").replace(S, "&gt;").replace(Q, "&quot;").replace(R, "&#x27;").replace(U, "&#x2F;") : (K.nodeValue = a) && L.innerHTML
  };
  var O = /\(([\w\.\_]+),?\s*(\w+)?\)/, H = /([\w\-#_]+)\s?$/, M = /extends\s+([\w\-_#]+)/, N = new r("^\\s*(" + Object.keys(A).join("|") + ")\\b");
  z.v = function(a) {
    return"number" === typeof a ? a : a ? a : ""
  };
  z.f = D;
  z.addFilter = function(a, d) {
    D[a] = d
  };
  q.Whack = z
}(this);

