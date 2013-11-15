+function(g) {
  var u, v;
  function n(a, c) {
    "#" === a.charAt(0) && (c = a, a = document.getElementById(a.substr(1)).innerHTML);
    !c && (c = "t" + t++);
    if(w[a]) {
      return w[a]
    }
    var e, h;
    h = c;
    var k, f, p = a.split("}}");
    k = 1;
    f = {0:{b:l, a:v}};
    for(var m = 0, g = p.length;m < g;m++) {
      var b = p[m].replace(/\\/g, "\\\\").replace(/\t+/g, "\t").replace(/\n+/g, "\n").replace(/\n\t/, "");
      if(!/^\s+$/.test(b) && (b = b.split("{{"), "" !== b[0] && (f[k++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"}), b = b[1])) {
        var d = F.test(b) && s.$1;
        if(d) {
          b = x[d](b, h), f[k++] = b
        }else {
          d = b.charAt(0);
          if(" " === d) {
            d = l
          }else {
            if("!" === d) {
              continue
            }else {
              if("-" === d) {
                d = "=", b = "WhackNoExtends.e(" + b.substring(1) + ")"
              }else {
                "=" === d && (b = b.substring(1));
                if(/\|(\w+)(?:\((.+)\))?\s*$/.test(b)) {
                  var d = s.$1, r = s.$2;
                  n.f[d] && (b = b.replace("|" + d + (r ? "(" + r + ")" : ""), ""), b = "WhackNoExtends.f." + d + "(" + b + (r && "," + r) + ")")
                }
                d = "="
              }
            }
          }
          d && (f[k++] = {b:d, a:b})
        }
      }
    }
    f[k++] = {b:l, a:u};
    f.c = k;
    h = G[h] = f;
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
        if(m === A) {
          e = b[1] || "item";
          var d = "i" + t, r = "l" + t, q = "a" + t;
          t++;
          f[p++] = "for(var " + d + "=0," + e + "," + q + "=" + b[0] + "," + r + "=" + q + ".length;" + d + "<" + r + ";" + d + "++){" + e + "=" + q + "[" + d + "]"
        }else {
          b = "'" === b.charAt(0) ? b : "_v(" + b + ")", "=" !== e ? f[p++] = "_o+=" + b : f[p++] = "+" + b
        }
      }
      e = m
    }
    e = f.join("");
    h = new Function("data", e);
    w[a] = h;
    c && !y[c] && (y[c] = e);
    return h
  }
  var t = 0, s = g.RegExp, l = 1, A = 2, y = {}, w = {}, B = {}, G = {};
  v = "var _v=WhackNoExtends.v,_o=''";
  u = "return _o";
  var x = {end:function() {
    return{b:l, a:"}"}
  }, "else":function() {
    return{b:l, a:"}else{"}
  }, elseif:function(a) {
    return x["if"]("}else" + a)
  }, "if":function(a) {
    var c = a.lastIndexOf(":"), e = "" === a.split(":").slice(-1)[0].trim();
    -1 < c && e ? a = a.substr(0, c) + "{" : -1 === c && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:l, a:a}
  }, each:function(a) {
    a = H.test(a) && s;
    return{b:A, a:[a.$1, a.$2]}
  }, include:function(a) {
    a = I.test(a) && s.$1;
    return{b:l, a:B[a] || (B[a] = y[a].replace(v, "").replace(u, ""))}
  }}, q = g.chrome;
  Object.keys || (Object.keys = function(a) {
    var c = [], e;
    for(e in a) {
      a.hasOwnProperty(e) && c.push(e)
    }
    return c
  });
  String.prototype.trim || (String.prototype.trim = function() {
    var a = q ? this.match(/\S+(?:\s+\S+)*/) : this;
    if(q) {
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
  var z = {}, C = g.document;
  if(!q) {
    var D = C.createTextNode(""), E = C.createElement("span");
    E.appendChild(D)
  }
  var J = /&/g, K = /"/g, L = /'/g, M = />/g, N = /</g, O = /\//g;
  z.escapeHTML = function(a) {
    return q ? a.replace(J, "&amp;").replace(N, "&lt;").replace(M, "&gt;").replace(K, "&quot;").replace(L, "&#x27;").replace(O, "&#x2F;") : (D.nodeValue = a) && E.innerHTML
  };
  var H = /\(([\w\.\_]+),?\s*(\w+)?\)/, I = /([\w\-#_]+)\s?$/, F = new s("^\\s*(" + Object.keys(x).join("|") + ")\\b");
  n.v = function(a) {
    return"number" === typeof a || a ? a : ""
  };
  n.f = z;
  n.addFilter = function(a, c) {
    z[a] = c;
    return n
  };
  n.e = function(a) {
    return n.f.escapeHTML(a)
  };
  g.WhackNoExtends = n;
  g.WhackNoExtends._name = "WhackNoExtends"
}(this);

