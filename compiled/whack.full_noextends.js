+function(p) {
  function f(a, d) {
    "#" === a.charAt(0) && (d = a, a = document.getElementById(a.substr(1)).innerHTML);
    !d && (d = "t" + r++);
    console.group("tpl: " + d);
    if(u[a]) {
      return u[a]
    }
    var g, h;
    h = d;
    var n, e, k = a.split("}}");
    n = 1;
    e = {0:{b:l, a:w}};
    for(var m = 0, f = k.length;m < f;m++) {
      var b = k[m].replace(/\\/g, "\\\\").split("{{");
      "" !== b[0] && (e[n++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var c = D.test(b) && s.$1;
        if(c) {
          b = v[c](b, h), e[n++] = b
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
          c && (e[n++] = {b:c, a:b})
        }
      }
    }
    e.c = n;
    console.log("Parsed lines: ", e);
    h = E[h] = e;
    n = h.c;
    e = Array(n);
    for(f = k = 0;f < n;f++) {
      b = h[f];
      m = b.b;
      if(g !== m || m === l) {
        e[k++] = ";"
      }
      b = b.a;
      if(m === l) {
        e[k++] = b
      }else {
        if(m === x) {
          g = b[1] || "item";
          var c = "i" + r, p = "l" + r, q = "a" + r;
          r++;
          e[k++] = "for(var " + c + "=0," + g + "," + q + "=" + b[0] + "," + p + "=" + q + ".length;" + c + "<" + p + ";" + c + "++){" + g + "=" + q + "[" + c + "]"
        }else {
          "=" !== g ? e[k++] = "_o+=(" + b + ")" : e[k++] = "+(" + b + ")"
        }
      }
      g = m
    }
    e[0] = "try{" + e[0];
    e[k - 1] = "}catch(e){console.error(e.message);};return _o";
    console.log("Compiled function: ", e.join(""));
    g = e.join("");
    console.groupEnd("tpl: " + d);
    h = new Function("data", g);
    u[a] = h;
    d && !t[d] && (t[d] = g);
    return h
  }
  var r = 0, s = p.RegExp, l = 1, x = 2, t = {}, u = {}, y = {}, E = {}, w = "var _o='';", v = {end:function() {
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
    var d = F.test(a) && s;
    console.log("Parsing <for>: ", a, d);
    return{b:x, a:[d.$1, d.$2]}
  }, include:function(a) {
    a = G.test(a) && s.$1;
    return t[a] ? {b:l, a:y[a] || (y[a] = t[a].replace(w, "").replace("return _o", ""))} : (console.error("There is no compiled template named " + a), {b:l, a:";"})
  }}, q = {}, z = p.chrome, A = p.document;
  if(z) {
    var B = A.createTextNode(""), C = A.createElement("span");
    C.appendChild(B)
  }
  var H = /&/g, I = /"/g, J = /'/g, K = />/g, L = /</g, M = /\//g;
  q.escapeHTML = function(a) {
    return z ? a.replace(H, "&amp;").replace(L, "&lt;").replace(K, "&gt;").replace(I, "&quot;").replace(J, "&#x27;").replace(M, "&#x2F;") : (B.nodeValue = a) && C.innerHTML
  };
  var F = /\(([\w\.\_]+),?\s*(\w+)?\)/, G = /([\w\-#_]+)\s?$/, D = new s("^\\s*(" + Object.keys(v).join("|") + ")\\b");
  f.f = q;
  f.addFilter = function(a, d) {
    q[a] = d
  };
  f.e = function(a) {
    return f.f.escapeHTML(a)
  };
  p.WhackNoExtends = f
}(this);

