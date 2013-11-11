+function(p) {
  function d(a, f) {
    "#" === a.charAt(0) && (f = a, a = document.getElementById(a.substr(1)).innerHTML);
    !f && (f = "t" + r++);
    if(t[a]) {
      return t[a]
    }
    var g, h;
    h = f;
    var l, e, m = a.split("}}");
    l = 1;
    e = {0:{b:n, a:w}};
    for(var k = 0, d = m.length;k < d;k++) {
      var b = m[k].replace(/\\/g, "\\\\").split("{{");
      "" !== b[0] && (e[l++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var c = D.test(b) && s.$1;
        if(c) {
          b = u[c](b, h), e[l++] = b
        }else {
          c = b.charAt(0);
          if(" " === c) {
            c = n
          }else {
            if("!" === c) {
              continue
            }else {
              "-" === c ? (c = "=", b = "WhackNoExtends.e(" + b.substring(1) + ")") : ("=" === c && (b = b.substring(1)), /\|\s(\w+)/.test(b) && (c = s.$1, b = b.replace("| " + c, ""), b = "WhackNoExtends.f." + c + "(" + b + ")"), c = "=")
            }
          }
          c && (e[l++] = {b:c, a:b})
        }
      }
    }
    e.c = l;
    h = E[h] = e;
    l = h.c;
    e = Array(l);
    for(d = m = 0;d < l;d++) {
      b = h[d];
      k = b.b;
      if(g !== k || k === n) {
        e[m++] = ";"
      }
      b = b.a;
      if(k === n) {
        e[m++] = b
      }else {
        if(k === x) {
          g = b[1] || "item";
          var c = "i" + r, p = "l" + r, q = "a" + r;
          r++;
          e[m++] = "for(var " + c + "=0," + g + "," + q + "=" + b[0] + "," + p + "=" + q + ".length;" + c + "<" + p + ";" + c + "++){" + g + "=" + q + "[" + c + "]"
        }else {
          "=" !== g ? e[m++] = "_o+=(" + b + ")" : e[m++] = "+(" + b + ")"
        }
      }
      g = k
    }
    g = e.join("");
    h = new Function("data", g);
    t[a] = h;
    f && !v[f] && (v[f] = g);
    return h
  }
  var r = 0, s = p.RegExp, n = 1, x = 2, v = {}, t = {}, y = {}, E = {}, w = "var _o='';", u = {end:function() {
    return{b:n, a:"}"}
  }, "else":function() {
    return{b:n, a:"} else {"}
  }, elseif:function(a) {
    return u["if"]("} else " + a)
  }, "if":function(a) {
    var f = a.lastIndexOf(":"), d = "" === a.split(":").slice(-1)[0].trim();
    -1 < f && d ? a = a.substr(0, f) + "{" : -1 === f && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:n, a:a}
  }, each:function(a) {
    a = F.test(a) && s;
    return{b:x, a:[a.$1, a.$2]}
  }, include:function(a) {
    a = G.test(a) && s.$1;
    return{b:n, a:y[a] || (y[a] = v[a].replace(w, "").replace("return _o", ""))}
  }}, q = {}, z = p.chrome, A = p.document;
  if(z) {
    var B = A.createTextNode(""), C = A.createElement("span");
    C.appendChild(B)
  }
  var H = /&/g, I = /"/g, J = /'/g, K = />/g, L = /</g, M = /\//g;
  q.escapeHTML = function(a) {
    return z ? a.replace(H, "&amp;").replace(L, "&lt;").replace(K, "&gt;").replace(I, "&quot;").replace(J, "&#x27;").replace(M, "&#x2F;") : (B.nodeValue = a) && C.innerHTML
  };
  var F = /\(([\w\.\_]+),?\s*(\w+)?\)/, G = /([\w\-#_]+)\s?$/, D = new s("^\\s*(" + Object.keys(u).join("|") + ")\\b");
  d.f = q;
  d.addFilter = function(a, d) {
    q[a] = d
  };
  d.e = function(a) {
    return d.f.escapeHTML(a)
  };
  p.WhackNoExtends = d
}(this);

