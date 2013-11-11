+function(m) {
  function n(a, d) {
    "#" === a.charAt(0) && (d = a, a = document.getElementById(a.substr(1)).innerHTML);
    !d && (d = "t" + q++);
    if(t[a]) {
      return t[a]
    }
    var f, g;
    g = d;
    var p, e, k = a.split("}}");
    p = 1;
    e = {0:{b:l, a:u}};
    for(var h = 0, r = k.length;h < r;h++) {
      var b = k[h].replace(/\\/g, "\\\\").split("{{");
      "" !== b[0] && (e[p++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var c = E.test(b) && s.$1;
        if(c) {
          b = v[c](b, g), e[p++] = b
        }else {
          c = b.charAt(0);
          if(" " === c) {
            c = l
          }else {
            if("!" === c) {
              continue
            }else {
              "=" === c && (b = b.substring(1)), /\|\s(\w+)/.test(b) && (c = s.$1, b = b.replace("| " + c, ""), b = "WhackNoExtends.f." + c + "(" + b + ")"), c = "="
            }
          }
          c && (e[p++] = {b:c, a:b})
        }
      }
    }
    g = F[g] = e;
    p = g.c;
    e = Array(p);
    for(r = k = 0;r < p;r++) {
      b = g[r];
      h = b.b;
      if(f !== h || h === l) {
        e[k++] = ";"
      }
      b = b.a;
      if(h === l) {
        e[k++] = b
      }else {
        if(h === y) {
          f = b[1] || "item";
          var c = "i" + q, m = "l" + q, n = "a" + q;
          q++;
          e[k++] = "for(var " + c + "=0," + f + "," + n + "=" + b[0] + "," + m + "=" + n + ".length;" + c + "<" + m + ";" + c + "++){" + f + "=" + n + "[" + c + "]"
        }else {
          "=" !== f ? e[k++] = "_o+=(" + b + ")" : e[k++] = "+(" + b + ")"
        }
      }
      f = h
    }
    f = e.join("");
    g = new Function("data", f);
    t[a] = g;
    d && !w[d] && (w[d] = f);
    return g
  }
  var q = 0, s = m.RegExp, l = 1, y = 2, w = {}, t = {}, z = {}, F = {}, u;
  u = "var _o;";
  var v = {end:function() {
    return{b:l, a:"}"}
  }, "else":function() {
    return{b:l, a:"} else {"}
  }, elseif:function(a) {
    return v["if"]("} else " + a)
  }, "if":function(a) {
    var d = a.lastIndexOf(":"), f = "" === a.split(":").slice(-1)[0].trim();
    -1 < d && f ? a = a.substr(0, d) + "{" : -1 === d && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:l, a:a}
  }, each:function(a) {
    a = G.test(a) && s;
    return{b:y, a:[a.$1, a.$2]}
  }, include:function(a) {
    a = H.test(a) && s.$1;
    return{b:l, a:z[a] || (z[a] = w[a].replace(u, "").replace("return _o", ""))}
  }}, x = {}, A = m.chrome, B = m.document;
  if(A) {
    var C = B.createTextNode(""), D = B.createElement("span");
    D.appendChild(C)
  }
  var I = /&/g, J = /"/g, K = /'/g, L = />/g, M = /</g, N = /\//g;
  x.escapeHTML = function(a) {
    return A ? a.replace(I, "&amp;").replace(M, "&lt;").replace(L, "&gt;").replace(J, "&quot;").replace(K, "&#x27;").replace(N, "&#x2F;") : (C.nodeValue = a) && D.innerHTML
  };
  var G = /\(([\w\.\_]+),?\s*(\w+)?\)/, H = /([\w\-#_]+)\s?$/, E = new s("^\\s*(" + Object.keys(v).join("|") + ")\\b");
  n.f = x;
  n.addFilter = function(a, d) {
    x[a] = d
  };
  m.WhackNoExtends = n
}(this);

