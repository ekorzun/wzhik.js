+function(g) {
  function q(a, c) {
    "#" === a.charAt(0) && (c = a, a = document.getElementById(a.substr(1)).innerHTML);
    !c && (c = "t" + s++);
    if(u[a]) {
      return u[a]
    }
    var e, h;
    h = c;
    var k, f, m = a.split("}}");
    k = 1;
    f = {0:{b:n, a:C}};
    for(var l = 0, g = m.length;l < g;l++) {
      var b = m[l].replace(/\\/g, "\\\\").replace(/\t+/g, "\t").replace(/\n+/g, "\n").replace(/\n\t/, "");
      if(!/^\s+$/.test(b) && (b = b.split("{{"), "" !== b[0] && (f[k++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"}), b = b[1])) {
        var d = D.test(b) && t.$1;
        if(d) {
          b = v[d](b, h), f[k++] = b
        }else {
          d = b.charAt(0);
          if(" " === d) {
            d = n
          }else {
            if("!" === d) {
              continue
            }else {
              if("-" === d) {
                d = "=", b = "WhackSmallestWith.e(" + b.substring(1) + ")"
              }else {
                "=" === d && (b = b.substring(1));
                if(/\|(\w+)(?:\((.+)\))?\s*$/.test(b)) {
                  var d = t.$1, r = t.$2;
                  q.f[d] && (b = b.replace("|" + d + (r ? "(" + r + ")" : ""), ""), b = "WhackSmallestWith.f." + d + "(" + b + (r && "," + r) + ")")
                }
                d = "="
              }
            }
          }
          d && (f[k++] = {b:d, a:b})
        }
      }
    }
    f[k++] = {b:n, a:E};
    f.c = k;
    h = F[h] = f;
    k = h.c;
    f = Array(k);
    for(g = m = 0;g < k;g++) {
      b = h[g];
      l = b.b;
      if(e !== l || l === n) {
        f[m++] = ";"
      }
      b = b.a;
      if(l === n) {
        f[m++] = b
      }else {
        if(l === x) {
          e = b[1] || "item";
          var d = "i" + s, r = "l" + s, p = "a" + s;
          s++;
          f[m++] = "for(var " + d + "=0," + e + "," + p + "=" + b[0] + "," + r + "=" + p + ".length;" + d + "<" + r + ";" + d + "++){" + e + "=" + p + "[" + d + "]"
        }else {
          "=" !== e ? f[m++] = "_o+=(" + b + ")" : f[m++] = "+(" + b + ")"
        }
      }
      e = l
    }
    e = f.join("");
    h = new Function("data", e);
    u[a] = h;
    c && !y[c] && (y[c] = e);
    return h
  }
  var s = 0, t = g.RegExp, n = 1, x = 2, y = {}, u = {}, F = {}, C = "var_o='';with(data){", E = "} return _o", v = {end:function() {
    return{b:n, a:"}"}
  }, "else":function() {
    return{b:n, a:"}else{"}
  }, elseif:function(a) {
    return v["if"]("}else" + a)
  }, "if":function(a) {
    var c = a.lastIndexOf(":"), e = "" === a.split(":").slice(-1)[0].trim();
    -1 < c && e ? a = a.substr(0, c) + "{" : -1 === c && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:n, a:a}
  }, each:function(a) {
    a = G.test(a) && t;
    return{b:x, a:[a.$1, a.$2]}
  }}, p = g.chrome;
  Object.keys || (Object.keys = function(a) {
    var c = [], e;
    for(e in a) {
      a.hasOwnProperty(e) && c.push(e)
    }
    return c
  });
  String.prototype.trim || (String.prototype.trim = function() {
    var a = p ? this.match(/\S+(?:\s+\S+)*/) : this;
    if(p) {
      return a && a[0] || ""
    }
    for(var c = 0, e = a.length - 1;c < a.length && -1 < " \n\r\t\v\f\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(c));) {
      c++
    }
    for(;e > c && -1 < " \n\r\t\v\f\u00a0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000".indexOf(a.charAt(e));) {
      e--
    }
    return a.substring(c, e + 1)
  });
  var w = {}, z = g.document;
  if(!p) {
    var A = z.createTextNode(""), B = z.createElement("span");
    B.appendChild(A)
  }
  var H = /&/g, I = /"/g, J = /'/g, K = />/g, L = /</g, M = /\//g;
  w.escapeHTML = function(a) {
    return p ? a.replace(H, "&amp;").replace(L, "&lt;").replace(K, "&gt;").replace(I, "&quot;").replace(J, "&#x27;").replace(M, "&#x2F;") : (A.nodeValue = a) && B.innerHTML
  };
  var G = /\(([\w\.\_]+),?\s*(\w+)?\)/, D = new t("^\\s*(" + Object.keys(v).join("|") + ")\\b");
  q.f = w;
  q.addFilter = function(a, c) {
    w[a] = c;
    return q
  };
  q.e = function(a) {
    return q.f.escapeHTML(a)
  };
  g.WhackSmallestWith = q;
  g.WhackSmallestWith._name = "WhackSmallestWith"
}(this);

