+function(m) {
  var n = 0, q = m.RegExp, u = {}, r = {}, v = {}, s = {end:function() {
    return{b:1, a:"}"}
  }, "else":function() {
    return{b:1, a:"} else {"}
  }, elseif:function(a) {
    return s["if"]("} else " + a)
  }, "if":function(a) {
    var c = a.lastIndexOf(":"), f = "" === a.split(":").slice(-1)[0].trim();
    -1 < c && f ? a = a.substr(0, c) + "{" : -1 === c && "" === a.split(")").slice(-1)[0].trim() && (a += "{");
    return{b:1, a:a}
  }, each:function(a) {
    var c = w.test(a) && q;
    console.log("Parsing <for>: ", a, c);
    return{b:2, a:[c.$1, c.$2]}
  }}, w = /\(([\w\.\_]+),?\s*(\w+)?\)/, x = new q("^\\s*(" + Object.keys(s).join("|") + ")\\b");
  m.WhackSmallest = function(a, c) {
    "#" === a.charAt(0) && (c = a, a = document.getElementById(a.substr(1)).innerHTML);
    !c && (c = "t" + n++);
    console.group("tpl: " + c);
    if(r[a]) {
      return r[a]
    }
    var f, g;
    g = c;
    var l, e, k = a.split("%>");
    l = 1;
    e = {0:{b:1, a:"var _o;"}};
    for(var h = 0, p = k.length;h < p;h++) {
      var b = k[h].replace(/\\/g, "\\\\").split("<%");
      "" !== b[0] && (e[l++] = {b:"=", a:"'" + b[0].replace(/'/g, "\\'").replace(/\n/g, "\\n") + "'"});
      if(b = b[1]) {
        var d = x.test(b) && q.$1;
        if(d) {
          b = s[d](b, g), e[l++] = b
        }else {
          d = b.charAt(0);
          if(" " === d) {
            d = 1
          }else {
            if("!" === d) {
              continue
            }else {
              "=" === d && (b = b.substring(1)), d = "="
            }
          }
          d && (e[l++] = {b:d, a:b})
        }
      }
    }
    console.log("Parsed lines: ", e);
    g = v[g] = e;
    l = g.c;
    e = Array(l);
    for(p = k = 0;p < l;p++) {
      b = g[p];
      h = b.b;
      if(f !== h || 1 === h) {
        e[k++] = ";"
      }
      b = b.a;
      if(1 === h) {
        e[k++] = b
      }else {
        if(2 === h) {
          f = b[1] || "item";
          var d = "i" + n, m = "l" + n, t = "a" + n;
          n++;
          e[k++] = "for(var " + d + "=0," + f + "," + t + "=" + b[0] + "," + m + "=" + t + ".length;" + d + "<" + m + ";" + d + "++){" + f + "=" + t + "[" + d + "]"
        }else {
          "=" !== f ? e[k++] = "_o+=(" + b + ")" : e[k++] = "+(" + b + ")"
        }
      }
      f = h
    }
    console.log("Compiled function: ", e);
    f = e.join("");
    console.groupEnd("tpl: " + c);
    g = new Function("data", f);
    r[a] = g;
    c && !u[c] && (u[c] = f);
    return g
  }
}(this);

