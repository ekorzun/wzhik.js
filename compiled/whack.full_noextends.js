+function(n) {
  var t, u;
  function g(a, d) {
    "#" === a.charAt(0) && (d = a, a = document.getElementById(a.substr(1)).innerHTML);
    !d && (d = "t" + r++);
    if(v[a]) {
      return v[a]
    }
    var e, h;
    h = d;
    var k, f, p = a.split("}}");
    k = 1;
    f = {0:{b:l, a:u}};
    for(var m = 0, g = p.length;m < g;m++) {
      var b = p[m].replace(/\\/g, "\\\\").split("{{");
      "" !== b[0] && (f[k++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var c = E.test(b) && s.$1;
        if(c) {
          b = w[c](b, h), f[k++] = b
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
          c && (f[k++] = {b:c, a:b})
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
      if(e !== m || m === l) {
        f[p++] = ";"
      }
      b = b.a;
      if(m === l) {
        f[p++] = b
      }else {
        if(m === y) {
          e = b[1] || "item";
          var c = "i" + r, n = "l" + r, q = "a" + r;
          r++;
          f[p++] = "for(var " + c + "=0," + e + "," + q + "=" + b[0] + "," + n + "=" + q + ".length;" + c + "<" + n + ";" + c + "++){" + e + "=" + q + "[" + c + "]"
        }else {
          b = "WhackNoExtends.v(" + b + ")", "=" !== e ? f[p++] = "_o+=(" + b + ")" : f[p++] = "+(" + b + ")"
        }
      }
      e = m
    }
    e = f.join("");
    h = new Function("data", e);
    v[a] = h;
    d && !x[d] && (x[d] = e);
    return h
  }
  var r = 0, s = n.RegExp, l = 1, y = 2, x = {}, v = {}, z = {}, F = {};
  u = "var _o='';";
  t = "return _o";
  var w = {end:function() {
    return{b:l, a:"}"}
  }, "else":function() {
    return{b:l, a:"}else{"}
  }, elseif:function(a) {
    return w["if"]("}else" + a)
  }, "if":function(a) {
    var d = a.lastIndexOf(":"), e = "" === a.split(":").slice(-1)[0].trim();
    -1 < d && e ? a = a.substr(0, d) + "{" : -1 === d && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:l, a:a}
  }, each:function(a) {
    a = G.test(a) && s;
    return{b:y, a:[a.$1, a.$2]}
  }, include:function(a) {
    a = H.test(a) && s.$1;
    return{b:l, a:z[a] || (z[a] = x[a].replace(u, "").replace(t, ""))}
  }};
  Object.keys || (Object.keys = function(a) {
    var d = [], e;
    for(e in a) {
      a.hasOwnProperty(e) && d.push(e)
    }
    return d
  });
  var q = {}, A = n.chrome, B = n.document;
  if(!A) {
    var C = B.createTextNode(""), D = B.createElement("span");
    D.appendChild(C)
  }
  var I = /&/g, J = /"/g, K = /'/g, L = />/g, M = /</g, N = /\//g;
  q.escapeHTML = function(a) {
    return A ? a.replace(I, "&amp;").replace(M, "&lt;").replace(L, "&gt;").replace(J, "&quot;").replace(K, "&#x27;").replace(N, "&#x2F;") : (C.nodeValue = a) && D.innerHTML
  };
  var G = /\(([\w\.\_]+),?\s*(\w+)?\)/, H = /([\w\-#_]+)\s?$/, E = new s("^\\s*(" + Object.keys(w).join("|") + ")\\b");
  g.v = function(a) {
    return"number" === typeof a || a ? a : ""
  };
  g.f = q;
  g.addFilter = function(a, d) {
    q[a] = d
  };
  g.e = function(a) {
    return g.f.escapeHTML(a)
  };
  n.WhackNoExtends = g;
  n.WhackNoExtends._name = "WhackNoExtends"
}(this);

