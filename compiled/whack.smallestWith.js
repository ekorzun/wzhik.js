+function(g) {
  function m(a, c) {
    "#" === a.charAt(0) && (c = a, a = document.getElementById(a.substr(1)).innerHTML);
    !c && (c = "t" + r++);
    if(t[a]) {
      return t[a]
    }
    var d, h;
    h = c;
    var k, f, n = a.split("}}");
    k = 1;
    f = {0:{b:p, a:B}};
    for(var l = 0, g = n.length;l < g;l++) {
      var b = n[l].replace(/\\/g, "\\\\").split("{{");
      "" !== b[0] && (f[k++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var e = C.test(b) && s.$1;
        if(e) {
          b = u[e](b, h), f[k++] = b
        }else {
          e = b.charAt(0);
          if(" " === e) {
            e = p
          }else {
            if("!" === e) {
              continue
            }else {
              "-" === e ? (e = "=", b = "WhackSmallestWith.e(" + b.substring(1) + ")") : ("=" === e && (b = b.substring(1)), /\|\s(\w+)/.test(b) && (e = s.$1, b = b.replace("| " + e, ""), b = "WhackSmallestWith.f." + e + "(" + b + ")"), e = "=")
            }
          }
          e && (f[k++] = {b:e, a:b})
        }
      }
    }
    f[k++] = {b:p, a:D};
    f.c = k;
    h = E[h] = f;
    k = h.c;
    f = Array(k);
    for(g = n = 0;g < k;g++) {
      b = h[g];
      l = b.b;
      if(d !== l || l === p) {
        f[n++] = ";"
      }
      b = b.a;
      if(l === p) {
        f[n++] = b
      }else {
        if(l === w) {
          d = b[1] || "item";
          var e = "i" + r, m = "l" + r, q = "a" + r;
          r++;
          f[n++] = "for(var " + e + "=0," + d + "," + q + "=" + b[0] + "," + m + "=" + q + ".length;" + e + "<" + m + ";" + e + "++){" + d + "=" + q + "[" + e + "]"
        }else {
          "=" !== d ? f[n++] = "_o+=(" + b + ")" : f[n++] = "+(" + b + ")"
        }
      }
      d = l
    }
    d = f.join("");
    h = new Function("data", d);
    t[a] = h;
    c && !x[c] && (x[c] = d);
    return h
  }
  var r = 0, s = g.RegExp, p = 1, w = 2, x = {}, t = {}, E = {}, B = "var _o='';with(data){", D = "} return _o", u = {end:function() {
    return{b:p, a:"}"}
  }, "else":function() {
    return{b:p, a:"}else{"}
  }, elseif:function(a) {
    return u["if"]("}else" + a)
  }, "if":function(a) {
    var c = a.lastIndexOf(":"), d = "" === a.split(":").slice(-1)[0].trim();
    -1 < c && d ? a = a.substr(0, c) + "{" : -1 === c && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:p, a:a}
  }, each:function(a) {
    a = F.test(a) && s;
    return{b:w, a:[a.$1, a.$2]}
  }}, q = g.chrome;
  Object.keys || (Object.keys = function(a) {
    var c = [], d;
    for(d in a) {
      a.hasOwnProperty(d) && c.push(d)
    }
    return c
  });
  String.prototype.trim || (String.prototype.trim = function() {
    var a = q ? this.match(/\S+(?:\s+\S+)*/) : this;
    if(q) {
      return a && a[0] || ""
    }
    for(var c = 0, d = a.length - 1;c < a.length && -1 < " \n\r\t\v\f\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(c));) {
      c++
    }
    for(;d > c && -1 < " \n\r\t\v\f\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(d));) {
      d--
    }
    return a.substring(c, d + 1)
  });
  var v = {}, y = g.document;
  if(!q) {
    var z = y.createTextNode(""), A = y.createElement("span");
    A.appendChild(z)
  }
  var G = /&/g, H = /"/g, I = /'/g, J = />/g, K = /</g, L = /\//g;
  v.escapeHTML = function(a) {
    return q ? a.replace(G, "&amp;").replace(K, "&lt;").replace(J, "&gt;").replace(H, "&quot;").replace(I, "&#x27;").replace(L, "&#x2F;") : (z.nodeValue = a) && A.innerHTML
  };
  var F = /\(([\w\.\_]+),?\s*(\w+)?\)/, C = new s("^\\s*(" + Object.keys(u).join("|") + ")\\b");
  m.f = v;
  m.addFilter = function(a, c) {
    v[a] = c
  };
  m.e = function(a) {
    return m.f.escapeHTML(a)
  };
  g.WhackSmallestWith = m;
  g.WhackSmallestWith._name = "WhackSmallestWith"
}(this);

