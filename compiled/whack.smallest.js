+function(n) {
  function d(a, f) {
    "#" === a.charAt(0) && (f = a, a = document.getElementById(a.substr(1)).innerHTML);
    !f && (f = "t" + r++);
    if(t[a]) {
      return t[a]
    }
    var g, h;
    h = f;
    var l, e, m = a.split("%>");
    l = 1;
    e = {0:{b:p, a:B}};
    for(var k = 0, d = m.length;k < d;k++) {
      var b = m[k].replace(/\\/g, "\\\\").split("<%");
      "" !== b[0] && (e[l++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var c = C.test(b) && s.$1;
        if(c) {
          b = u[c](b, h), e[l++] = b
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
          c && (e[l++] = {b:c, a:b})
        }
      }
    }
    e.c = l;
    h = D[h] = e;
    l = h.c;
    e = Array(l);
    for(d = m = 0;d < l;d++) {
      b = h[d];
      k = b.b;
      if(g !== k || k === p) {
        e[m++] = ";"
      }
      b = b.a;
      if(k === p) {
        e[m++] = b
      }else {
        if(k === v) {
          g = b[1] || "item";
          var c = "i" + r, n = "l" + r, q = "a" + r;
          r++;
          e[m++] = "for(var " + c + "=0," + g + "," + q + "=" + b[0] + "," + n + "=" + q + ".length;" + c + "<" + n + ";" + c + "++){" + g + "=" + q + "[" + c + "]"
        }else {
          "=" !== g ? e[m++] = "_o+=(" + b + ")" : e[m++] = "+(" + b + ")"
        }
      }
      g = k
    }
    g = e.join("");
    h = new Function("data", g);
    t[a] = h;
    f && !w[f] && (w[f] = g);
    return h
  }
  var r = 0, s = n.RegExp, p = 1, v = 2, w = {}, t = {}, D = {}, B = "var _o='';", u = {end:function() {
    return{b:p, a:"}"}
  }, "else":function() {
    return{b:p, a:"} else {"}
  }, elseif:function(a) {
    return u["if"]("} else " + a)
  }, "if":function(a) {
    var f = a.lastIndexOf(":"), d = "" === a.split(":").slice(-1)[0].trim();
    -1 < f && d ? a = a.substr(0, f) + "{" : -1 === f && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:p, a:a}
  }, each:function(a) {
    a = E.test(a) && s;
    return{b:v, a:[a.$1, a.$2]}
  }}, q = {}, x = n.chrome, y = n.document;
  if(x) {
    var z = y.createTextNode(""), A = y.createElement("span");
    A.appendChild(z)
  }
  var F = /&/g, G = /"/g, H = /'/g, I = />/g, J = /</g, K = /\//g;
  q.escapeHTML = function(a) {
    return x ? a.replace(F, "&amp;").replace(J, "&lt;").replace(I, "&gt;").replace(G, "&quot;").replace(H, "&#x27;").replace(K, "&#x2F;") : (z.nodeValue = a) && A.innerHTML
  };
  var E = /\(([\w\.\_]+),?\s*(\w+)?\)/, C = new s("^\\s*(" + Object.keys(u).join("|") + ")\\b");
  d.f = q;
  d.addFilter = function(a, d) {
    q[a] = d
  };
  d.e = function(a) {
    return d.f.escapeHTML(a)
  };
  n.WhackSmallest = d
}(this);

