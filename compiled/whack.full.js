+function(w) {
  function E(a, c) {
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
        t[c] = t[h];
        f = t[c];
        e = f.c;
        g.shift();
        l = 1;
        console.log("Extending: ", c, "extends", h)
      }else {
        e = 1, f = {0:{b:m, a:A}}
      }
      for(var n = 0, k = g.length;n < k;n++) {
        var b = g[n].replace(/\\/g, "\\\\").split("{{");
        "" !== b[0] && (f[e++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
        if(b = b[1]) {
          var d = N.test(b) && r.$1;
          if(d) {
            if((b = B[d](b, c)) && b.b === u) {
              var d = g[++n], p = [d], b = b.a, q = 0;
              if(0 > d.indexOf("endblock")) {
                for(;!q && void 0 !== (d = g[++n]);) {
                  -1 < d.indexOf("endblock") ? (q = 1, p.push(d.split("}}")[0])) : p.push(d)
                }
              }
              p = p.join("}}");
              d = E(p, b).replace(A, "").replace(x, "");
              y[b] = d;
              F[b] = e;
              l ? f[F[b.replace(c, h)]] = {b:u, a:b} : f[e++] = {b:u, a:b}
            }else {
              f[e++] = b
            }
          }else {
            d = b.charAt(0);
            if(" " === d) {
              d = m
            }else {
              if("!" === d) {
                continue
              }else {
                "-" === d ? (d = "=", b = "WhackFull.e(" + b.substring(1) + ")") : ("=" === d && (b = b.substring(1)), /\|\s(\w+)/.test(b) && (d = r.$1, b = b.replace("| " + d, ""), b = "WhackFull.f." + d + "(" + b + ")"), d = "=")
              }
            }
            d && (f[e++] = {b:d, a:b})
          }
        }
      }
      l || (f[e++] = {b:m, a:x});
      f.c = e;
      console.log("Parsed lines: ", f);
      e = t[c] = f
    }
    f = e.c;
    g = Array(f);
    l = 0;
    for(var s, n = 0;n < f;n++) {
      k = e[n];
      h = k.b;
      if(s !== h || h === m) {
        g[l++] = ";"
      }
      k = k.a;
      h === m ? g[l++] = k : h === G ? (s = k[1] || "item", b = "i" + v, d = "l" + v, p = "a" + v, v++, g[l++] = "for(var " + b + "=0," + s + "," + p + "=" + k[0] + "," + d + "=" + p + ".length;" + b + "<" + d + ";" + b + "++){" + s + "=" + p + "[" + b + "]") : h === u ? g[l++] = y[k] : (k = "WhackFull.v(" + k + ")", "=" !== s ? g[l++] = "_o+=(" + k + ")" : g[l++] = "+(" + k + ")");
      s = h
    }
    g[0] = "try{" + g[0];
    g[l - 1] = "}catch(e){console.error(e.message);};return _o";
    console.log("Compiled function: ", g.join(""));
    return g.join("")
  }
  function q(a, c) {
    "#" === a.charAt(0) && (c = a, a = document.getElementById(a.substr(1)).innerHTML);
    !c && (c = "t" + v++);
    console.group("tpl: " + c);
    if(C[a]) {
      return C[a]
    }
    var e = E(a, c);
    console.groupEnd("tpl: " + c);
    var f = new Function("data", e);
    C[a] = f;
    c && !z[c] && (z[c] = e);
    return f
  }
  var v = 0, r = w.RegExp, m = 1, G = 2, u = 3, z = {}, C = {}, y = {}, t = {}, F = {}, A = "var _o='';", x;
  x = "return _o";
  var B = {end:function() {
    return{b:m, a:"}"}
  }, "else":function() {
    return{b:m, a:"} else {"}
  }, elseif:function(a) {
    return B["if"]("} else " + a)
  }, "if":function(a) {
    var c = a.lastIndexOf(":"), e = "" === a.split(":").slice(-1)[0].trim();
    -1 < c && e ? a = a.substr(0, c) + "{" : -1 === c && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:m, a:a}
  }, each:function(a) {
    var c = O.test(a) && r;
    console.log("Parsing <for>: ", a, c);
    return{b:G, a:[c.$1, c.$2]}
  }, include:function(a) {
    a = H.test(a) && r.$1;
    return z[a] ? {b:m, a:y[a] || (y[a] = z[a].replace(A, "").replace(x, ""))} : (console.error("There is no compiled template named " + a), {b:m, a:";"})
  }, block:function(a, c) {
    var e = H.test(a) && r.$1, e = c + ":" + e;
    console.log("Parsing <block>", e, a);
    return{b:u, a:e}
  }, endblock:function() {
    return{b:"=", a:"''"}
  }}, D = {}, I = w.chrome, J = w.document;
  if(I) {
    var K = J.createTextNode(""), L = J.createElement("span");
    L.appendChild(K)
  }
  var P = /&/g, Q = /"/g, R = /'/g, S = />/g, T = /</g, U = /\//g;
  D.escapeHTML = function(a) {
    return I ? a.replace(P, "&amp;").replace(T, "&lt;").replace(S, "&gt;").replace(Q, "&quot;").replace(R, "&#x27;").replace(U, "&#x2F;") : (K.nodeValue = a) && L.innerHTML
  };
  var O = /\(([\w\.\_]+),?\s*(\w+)?\)/, H = /([\w\-#_]+)\s?$/, M = /extends\s+([\w\-_#]+)/, N = new r("^\\s*(" + Object.keys(B).join("|") + ")\\b");
  q.v = function(a) {
    return"number" === typeof a || a ? a : ""
  };
  q.f = D;
  q.addFilter = function(a, c) {
    D[a] = c
  };
  q.e = function(a) {
    return q.f.escapeHTML(a)
  };
  w.WhackFull = q
}(this);

