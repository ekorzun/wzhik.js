+function(p) {
  var t, u;
  function d(a, f) {
    "#" === a.charAt(0) && (f = a, a = document.getElementById(a.substr(1)).innerHTML);
    !f && (f = "t" + r++);
    if(v[a]) {
      return v[a]
    }
    var g, h;
    h = f;
    var k, e, n = a.split("}}");
    k = 1;
    e = {0:{b:l, a:u}};
    for(var m = 0, d = n.length;m < d;m++) {
      var b = n[m].replace(/\\/g, "\\\\").split("{{");
      "" !== b[0] && (e[k++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var c = E.test(b) && s.$1;
        if(c) {
          b = w[c](b, h), e[k++] = b
        }else {
          c = b.charAt(0);
          if(" " === c) {
            c = l
          }else {
            if("!" === c) {
              continue
            }else {
              "-" === c ? (c = "=", b = "WhackNoExtends.e(" + b.substring(1) + ")") : ("=" === c && (b = b.substring(1)), /\|\s(\w+)/.test(b) && (c = s.$1, b = b.replace("| " + c, ""), b = "WhackNoExtends.f." + c + "(" + b + ")"), c = "=")
            }
          }
          c && (e[k++] = {b:c, a:b})
        }
      }
    }
    e[k++] = {b:l, a:t};
    e.c = k;
    h = F[h] = e;
    k = h.c;
    e = Array(k);
    for(d = n = 0;d < k;d++) {
      b = h[d];
      m = b.b;
      if(g !== m || m === l) {
        e[n++] = ";"
      }
      b = b.a;
      if(m === l) {
        e[n++] = b
      }else {
        if(m === y) {
          g = b[1] || "item";
          var c = "i" + r, p = "l" + r, q = "a" + r;
          r++;
          e[n++] = "for(var " + c + "=0," + g + "," + q + "=" + b[0] + "," + p + "=" + q + ".length;" + c + "<" + p + ";" + c + "++){" + g + "=" + q + "[" + c + "]"
        }else {
          "=" !== g ? e[n++] = "_o+=(" + b + ")" : e[n++] = "+(" + b + ")"
        }
      }
      g = m
    }
    g = e.join("");
    h = new Function("data", g);
    v[a] = h;
    f && !x[f] && (x[f] = g);
    return h
  }
  var r = 0, s = p.RegExp, l = 1, y = 2, x = {}, v = {}, z = {}, F = {};
  u = "var _o='';";
  t = "return _o";
  var w = {end:function() {
    return{b:l, a:"}"}
  }, "else":function() {
    return{b:l, a:"} else {"}
  }, elseif:function(a) {
    return w["if"]("} else " + a)
  }, "if":function(a) {
    var f = a.lastIndexOf(":"), d = "" === a.split(":").slice(-1)[0].trim();
    -1 < f && d ? a = a.substr(0, f) + "{" : -1 === f && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:l, a:a}
  }, each:function(a) {
    a = G.test(a) && s;
    return{b:y, a:[a.$1, a.$2]}
  }, include:function(a) {
    a = H.test(a) && s.$1;
    return{b:l, a:z[a] || (z[a] = x[a].replace(u, "").replace(t, ""))}
  }}, q = {}, A = p.chrome, B = p.document;
  if(!A) {
    var C = B.createTextNode(""), D = B.createElement("span");
    D.appendChild(C)
  }
  var I = /&/g, J = /"/g, K = /'/g, L = />/g, M = /</g, N = /\//g;
  q.escapeHTML = function(a) {
    return A ? a.replace(I, "&amp;").replace(M, "&lt;").replace(L, "&gt;").replace(J, "&quot;").replace(K, "&#x27;").replace(N, "&#x2F;") : (C.nodeValue = a) && D.innerHTML
  };
  var G = /\(([\w\.\_]+),?\s*(\w+)?\)/, H = /([\w\-#_]+)\s?$/, E = new s("^\\s*(" + Object.keys(w).join("|") + ")\\b");
  d.f = q;
  d.addFilter = function(a, d) {
    q[a] = d
  };
  d.e = function(a) {
    return d.f.escapeHTML(a)
  };
  p.WhackNoExtends = d
}(this);

