+function(m) {
  var n = 0, r = m.RegExp, v = {}, s = {}, w = {}, q;
  q = "var _o;";
  q += "with(data){";
  var t = {end:function() {
    return{b:1, a:"}"}
  }, "else":function() {
    return{b:1, a:"} else {"}
  }, elseif:function(a) {
    return t["if"]("} else " + a)
  }, "if":function(a) {
    var e = a.lastIndexOf(":"), f = "" === a.split(":").slice(-1)[0].trim();
    -1 < e && f ? a = a.substr(0, e) + "{" : -1 === e && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:1, a:a}
  }, each:function(a) {
    a = x.test(a) && r;
    return{b:2, a:[a.$1, a.$2]}
  }}, x = /\(([\w\.\_]+),?\s*(\w+)?\)/, y = new r("^\\s*(" + Object.keys(t).join("|") + ")\\b");
  m.WhackSmallestWith = function(a, e) {
    "#" === a.charAt(0) && (e = a, a = document.getElementById(a.substr(1)).innerHTML);
    !e && (e = "t" + n++);
    if(s[a]) {
      return s[a]
    }
    var f, g;
    g = e;
    var l, d, k = a.split("%>");
    l = 1;
    d = {0:{b:1, a:q}};
    for(var h = 0, p = k.length;h < p;h++) {
      var b = k[h].replace(/\\/g, "\\\\").split("<%");
      "" !== b[0] && (d[l++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var c = y.test(b) && r.$1;
        if(c) {
          b = t[c](b, g), d[l++] = b
        }else {
          c = b.charAt(0);
          if(" " === c) {
            c = 1
          }else {
            if("!" === c) {
              continue
            }else {
              "=" === c && (b = b.substring(1)), c = "="
            }
          }
          c && (d[l++] = {b:c, a:b})
        }
      }
    }
    g = w[g] = d;
    l = g.c;
    d = Array(l);
    for(p = k = 0;p < l;p++) {
      b = g[p];
      h = b.b;
      if(f !== h || 1 === h) {
        d[k++] = ";"
      }
      b = b.a;
      if(1 === h) {
        d[k++] = b
      }else {
        if(2 === h) {
          f = b[1] || "item";
          var c = "i" + n, m = "l" + n, u = "a" + n;
          n++;
          d[k++] = "for(var " + c + "=0," + f + "," + u + "=" + b[0] + "," + m + "=" + u + ".length;" + c + "<" + m + ";" + c + "++){" + f + "=" + u + "[" + c + "]"
        }else {
          "=" !== f ? d[k++] = "_o+=(" + b + ")" : d[k++] = "+(" + b + ")"
        }
      }
      f = h
    }
    f = d.join("");
    g = new Function("data", f);
    s[a] = g;
    e && !v[e] && (v[e] = f);
    return g
  }
}(this);

