+function(d) {
  var v, w;
  function m(a, f) {
    "#" === a.charAt(0) && (f = a, a = document.getElementById(a.substr(1)).innerHTML);
    !f && (f = "t" + r++);
    if(t[a]) {
      return t[a]
    }
    var g, h;
    h = f;
    var k, e, n = a.split("}}");
    k = 1;
    e = {0:{b:p, a:w}};
    for(var l = 0, d = n.length;l < d;l++) {
      var b = n[l].replace(/\\/g, "\\\\").split("{{");
      "" !== b[0] && (e[k++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var c = D.test(b) && s.$1;
        if(c) {
          b = u[c](b, h), e[k++] = b
        }else {
          c = b.charAt(0);
          if(" " === c) {
            c = p
          }else {
            if("!" === c) {
              continue
            }else {
              "-" === c ? (c = "=", b = "WhackSmallest.e(" + b.substring(1) + ")") : ("=" === c && (b = b.substring(1)), /\|\s(\w+)/.test(b) && (c = s.$1, b = b.replace("| " + c, ""), b = "WhackSmallest.f." + c + "(" + b + ")"), c = "=")
            }
          }
          c && (e[k++] = {b:c, a:b})
        }
      }
    }
    e[k++] = {b:p, a:v};
    e.c = k;
    h = E[h] = e;
    k = h.c;
    e = Array(k);
    for(d = n = 0;d < k;d++) {
      b = h[d];
      l = b.b;
      if(g !== l || l === p) {
        e[n++] = ";"
      }
      b = b.a;
      if(l === p) {
        e[n++] = b
      }else {
        if(l === x) {
          g = b[1] || "item";
          var c = "i" + r, m = "l" + r, q = "a" + r;
          r++;
          e[n++] = "for(var " + c + "=0," + g + "," + q + "=" + b[0] + "," + m + "=" + q + ".length;" + c + "<" + m + ";" + c + "++){" + g + "=" + q + "[" + c + "]"
        }else {
          "=" !== g ? e[n++] = "_o+=(" + b + ")" : e[n++] = "+(" + b + ")"
        }
      }
      g = l
    }
    g = e.join("");
    h = new Function("data", g);
    t[a] = h;
    f && !y[f] && (y[f] = g);
    return h
  }
  var r = 0, s = d.RegExp, p = 1, x = 2, y = {}, t = {}, E = {};
  w = "var _o='';";
  v = "return _o";
  var u = {end:function() {
    return{b:p, a:"}"}
  }, "else":function() {
    return{b:p, a:"}else{"}
  }, elseif:function(a) {
    return u["if"]("}else" + a)
  }, "if":function(a) {
    var f = a.lastIndexOf(":"), d = "" === a.split(":").slice(-1)[0].trim();
    -1 < f && d ? a = a.substr(0, f) + "{" : -1 === f && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:p, a:a}
  }, each:function(a) {
    a = F.test(a) && s;
    return{b:x, a:[a.$1, a.$2]}
  }}, q = {}, z = d.chrome, A = d.document;
  if(!z) {
    var B = A.createTextNode(""), C = A.createElement("span");
    C.appendChild(B)
  }
  var G = /&/g, H = /"/g, I = /'/g, J = />/g, K = /</g, L = /\//g;
  q.escapeHTML = function(a) {
    return z ? a.replace(G, "&amp;").replace(K, "&lt;").replace(J, "&gt;").replace(H, "&quot;").replace(I, "&#x27;").replace(L, "&#x2F;") : (B.nodeValue = a) && C.innerHTML
  };
  var F = /\(([\w\.\_]+),?\s*(\w+)?\)/, D = new s("^\\s*(" + Object.keys(u).join("|") + ")\\b");
  m.f = q;
  m.addFilter = function(a, d) {
    q[a] = d
  };
  m.e = function(a) {
    return m.f.escapeHTML(a)
  };
  d.WhackSmallest = m;
  d.WhackSmallest._name = "WhackSmallest"
}(this);

