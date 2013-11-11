+function(p) {
  function E(a, b) {
    var e;
    a: {
      var f, g = a.split("}}"), l, h;
      if(h = M.test(g[0]) && r.$1) {
        if(!t[h]) {
          console.error("There is no compiled template named " + h);
          console.info("To prevent this error, please use autocompile flag or precompiled templates");
          e = !1;
          break a
        }
        t[b] = t[h];
        f = t[b];
        e = f.c;
        g.shift();
        l = 1;
        console.log("Extending: ", b, "extends", h)
      }
      for(var m = 0, k = g.length;m < k;m++) {
        var c = g[m].replace(/\\/g, "\\\\").split("{{");
        "" !== c[0] && (f[e++] = {b:"=", a:"'" + c[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
        if(c = c[1]) {
          var d = N.test(c) && r.$1;
          if(d) {
            if((c = A[d](c, b)) && c.b === u) {
              var d = g[++m], q = [d], c = c.a, s = 0;
              if(0 > d.indexOf("endblock")) {
                for(;!s && void 0 !== (d = g[++m]);) {
                  -1 < d.indexOf("endblock") ? (s = 1, q.push(d.split("}}")[0])) : q.push(d)
                }
              }
              q = q.join("}}");
              d = E(q, c).replace(B, "").replace(w, "");
              x[c] = d;
              F[c] = e;
              l ? f[F[c.replace(b, h)]] = {b:u, a:c} : f[e++] = {b:u, a:c}
            }
          }else {
            d = c.charAt(0);
            if(" " === d) {
              d = n
            }else {
              if("!" === d) {
                continue
              }else {
                "=" === d && (c = c.substring(1)), /\|\s(\w+)/.test(c) && (d = r.$1, c = c.replace("| " + d, ""), c = "WhackFull.f." + d + "(" + c + ")"), d = "="
              }
            }
            d && (f[e++] = {b:d, a:c})
          }
        }
      }
      l || (f[e++] = {b:n, a:w}, f.c = e);
      console.log("Parsed lines: ", f);
      e = t[b] = f
    }
    f = e.c;
    g = Array(f);
    l = 0;
    for(var p, m = 0;m < f;m++) {
      k = e[m];
      h = k.b;
      if(p !== h || h === n) {
        g[l++] = ";"
      }
      k = k.a;
      h === n ? g[l++] = k : h === G && (c = k[1] || "item", d = "i" + v, q = "l" + v, s = "a" + v, v++, g[l++] = "for(var " + d + "=0," + c + "," + s + "=" + k[0] + "," + q + "=" + s + ".length;" + d + "<" + q + ";" + d + "++){" + c + "=" + s + "[" + d + "]");
      k = "WhackFull.v(" + k + ")";
      "=" !== p ? g[l++] = "_o+=(" + k + ")" : g[l++] = "+(" + k + ")";
      h === u && (g[l++] = x[k]);
      p = h
    }
    console.log("Compiled function: ", g);
    return g.join("")
  }
  function y(a, b) {
    "#" === a.charAt(0) && (b = a, a = document.getElementById(a.substr(1)).innerHTML);
    !b && (b = "t" + v++);
    console.group("tpl: " + b);
    if(C[a]) {
      return C[a]
    }
    var e = E(a, b);
    console.groupEnd("tpl: " + b);
    var f = new Function("data", e);
    C[a] = f;
    b && !z[b] && (z[b] = e);
    return f
  }
  var v = 0, r = p.RegExp, n = 1, G = 2, u = 3, z = {}, C = {}, x = {}, t = {}, F = {}, B, w;
  B = "var _o;";
  w = "return _o";
  var A = {end:function() {
    return{b:n, a:"}"}
  }, "else":function() {
    return{b:n, a:"} else {"}
  }, elseif:function(a) {
    return A["if"]("} else " + a)
  }, "if":function(a) {
    var b = a.lastIndexOf(":"), e = "" === a.split(":").slice(-1)[0].trim();
    -1 < b && e ? a = a.substr(0, b) + "{" : -1 === b && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:n, a:a}
  }, each:function(a) {
    var b = O.test(a) && r;
    console.log("Parsing <for>: ", a, b);
    return{b:G, a:[b.$1, b.$2]}
  }, include:function(a) {
    a = H.test(a) && r.$1;
    return z[a] ? {b:n, a:x[a] || (x[a] = z[a].replace(B, "").replace(w, ""))} : (console.error("There is no compiled template named " + a), {b:n, a:";"})
  }, block:function(a, b) {
    var e = H.test(a) && r.$1, e = b + ":" + e;
    console.log("Parsing <block>", e, a);
    return{b:u, a:e}
  }, endblock:function() {
    return{b:"=", a:"''"}
  }}, D = {}, I = p.chrome, J = p.document;
  if(I) {
    var K = J.createTextNode(""), L = J.createElement("span");
    L.appendChild(K)
  }
  var P = /&/g, Q = /"/g, R = /'/g, S = />/g, T = /</g, U = /\//g;
  D.escapeHTML = function(a) {
    return I ? a.replace(P, "&amp;").replace(T, "&lt;").replace(S, "&gt;").replace(Q, "&quot;").replace(R, "&#x27;").replace(U, "&#x2F;") : (K.nodeValue = a) && L.innerHTML
  };
  var O = /\(([\w\.\_]+),?\s*(\w+)?\)/, H = /([\w\-#_]+)\s?$/, M = /extends\s+([\w\-_#]+)/, N = new r("^\\s*(" + Object.keys(A).join("|") + ")\\b");
  y.v = function(a) {
    return"number" === typeof a ? a : a ? a : ""
  };
  y.f = D;
  y.addFilter = function(a, b) {
    D[a] = b
  };
  p.WhackFull = y
}(this);

