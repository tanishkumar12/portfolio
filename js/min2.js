!(function (t, e) {
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = e())
    : "function" == typeof define && define.amd
    ? define(e)
    : (t.Delaunator = e());
})(this, function () {
  "use strict";
  function t(t) {
    if (!ArrayBuffer.isView(t))
      throw new Error("Expected coords to be a typed array.");
    var o = 1 / 0,
      l = 1 / 0,
      f = -1 / 0,
      u = -1 / 0,
      v = t.length >> 1,
      d = (this.ids = new Uint32Array(v));
    this.coords = t;
    for (var g = 0; g < v; g++) {
      var _ = t[2 * g],
        x = t[2 * g + 1];
      _ < o && (o = _),
        x < l && (l = x),
        _ > f && (f = _),
        x > u && (u = x),
        (d[g] = g);
    }
    var p,
      c,
      y,
      w = (o + f) / 2,
      z = (l + u) / 2,
      E = 1 / 0;
    for (g = 0; g < v; g++) {
      var k = e(w, z, t[2 * g], t[2 * g + 1]);
      k < E && ((p = g), (E = k));
    }
    for (E = 1 / 0, g = 0; g < v; g++)
      g !== p &&
        (k = e(t[2 * p], t[2 * p + 1], t[2 * g], t[2 * g + 1])) < E &&
        k > 0 &&
        ((c = g), (E = k));
    var m = 1 / 0;
    for (g = 0; g < v; g++)
      if (g !== p && g !== c) {
        var b = i(
          t[2 * p],
          t[2 * p + 1],
          t[2 * c],
          t[2 * c + 1],
          t[2 * g],
          t[2 * g + 1]
        );
        b < m && ((y = g), (m = b));
      }
    if (m === 1 / 0)
      throw new Error("No Delaunay triangulation exists for this input.");
    if (
      r(
        t[2 * p],
        t[2 * p + 1],
        t[2 * c],
        t[2 * c + 1],
        t[2 * y],
        t[2 * y + 1]
      ) < 0
    ) {
      var A = c;
      (c = y), (y = A);
    }
    var L = t[2 * p],
      M = t[2 * p + 1],
      S = t[2 * c],
      T = t[2 * c + 1],
      K = t[2 * y],
      D = t[2 * y + 1],
      U = (function (t, e, r, i, n, h) {
        var s = (r -= t) * r + (i -= e) * i,
          a = (n -= t) * n + (h -= e) * h,
          o = r * h - i * n;
        return {
          x: t + (0.5 * (h * s - i * a)) / o,
          y: e + (0.5 * (r * a - n * s)) / o,
        };
      })(L, M, S, T, K, D);
    for (
      this._cx = U.x,
        this._cy = U.y,
        (function t(e, r, i, n, h, o) {
          var l, f, u;
          if (n - i <= 20)
            for (l = i + 1; l <= n; l++) {
              for (u = e[l], f = l - 1; f >= i && s(r, e[f], u, h, o) > 0; )
                e[f + 1] = e[f--];
              e[f + 1] = u;
            }
          else {
            var v = (i + n) >> 1;
            for (
              f = n,
                a(e, v, (l = i + 1)),
                s(r, e[i], e[n], h, o) > 0 && a(e, i, n),
                s(r, e[l], e[n], h, o) > 0 && a(e, l, n),
                s(r, e[i], e[l], h, o) > 0 && a(e, i, l),
                u = e[l];
              ;

            ) {
              do {
                l++;
              } while (s(r, e[l], u, h, o) < 0);
              do {
                f--;
              } while (s(r, e[f], u, h, o) > 0);
              if (f < l) break;
              a(e, l, f);
            }
            (e[i + 1] = e[f]),
              (e[f] = u),
              n - l + 1 >= f - i
                ? (t(e, r, l, n, h, o), t(e, r, i, f - 1, h, o))
                : (t(e, r, i, f - 1, h, o), t(e, r, l, n, h, o));
          }
        })(d, t, 0, d.length - 1, U.x, U.y),
        this._hashSize = Math.ceil(Math.sqrt(v)),
        this._hash = [],
        g = 0;
      g < this._hashSize;
      g++
    )
      this._hash[g] = null;
    var j = (this.hull = n(t, p));
    this._hashEdge(j),
      (j.t = 0),
      (j = n(t, c, j)),
      this._hashEdge(j),
      (j.t = 1),
      (j = n(t, y, j)),
      this._hashEdge(j),
      (j.t = 2);
    var q,
      B,
      F = 2 * v - 5,
      I = (this.triangles = new Uint32Array(3 * F)),
      N = (this.halfedges = new Int32Array(3 * F));
    (this.trianglesLen = 0), this._addTriangle(p, c, y, -1, -1, -1);
    for (var V = 0; V < d.length; V++)
      if (
        ((_ = t[2 * (g = d[V])]),
        (x = t[2 * g + 1]),
        !(
          (_ === q && x === B) ||
          ((q = _),
          (B = x),
          (_ === L && x === M) || (_ === S && x === T) || (_ === K && x === D))
        ))
      ) {
        var C,
          G = this._hashKey(_, x),
          H = G;
        do {
          (C = this._hash[H]), (H = (H + 1) % this._hashSize);
        } while ((!C || C.removed) && H !== G);
        for (j = C; r(_, x, j.x, j.y, j.next.x, j.next.y) >= 0; )
          if ((j = j.next) === C)
            throw new Error("Something is wrong with the input points.");
        var J = j === C,
          O = this._addTriangle(j.i, g, j.next.i, -1, -1, j.t);
        (j.t = O),
          ((j = n(t, g, j)).t = this._legalize(O + 2)),
          j.prev.prev.t === N[O + 1] && (j.prev.prev.t = O + 2);
        for (var P = j.next; r(_, x, P.x, P.y, P.next.x, P.next.y) < 0; )
          (O = this._addTriangle(P.i, g, P.next.i, P.prev.t, -1, P.t)),
            (P.prev.t = this._legalize(O + 2)),
            (this.hull = h(P)),
            (P = P.next);
        if (J)
          for (P = j.prev; r(_, x, P.prev.x, P.prev.y, P.x, P.y) < 0; )
            (O = this._addTriangle(P.prev.i, g, P.i, -1, P.t, P.prev.t)),
              this._legalize(O + 2),
              (P.prev.t = O),
              (this.hull = h(P)),
              (P = P.prev);
        this._hashEdge(j), this._hashEdge(j.prev);
      }
    (this.triangles = I.subarray(0, this.trianglesLen)),
      (this.halfedges = N.subarray(0, this.trianglesLen));
  }
  function e(t, e, r, i) {
    var n = t - r,
      h = e - i;
    return n * n + h * h;
  }
  function r(t, e, r, i, n, h) {
    return (i - e) * (n - r) - (r - t) * (h - i);
  }
  function i(t, e, r, i, n, h) {
    var s = (r -= t) * r + (i -= e) * i,
      a = (n -= t) * n + (h -= e) * h;
    if (0 === s || 0 === a) return 1 / 0;
    var o = r * h - i * n;
    if (0 === o) return 1 / 0;
    var l = (0.5 * (h * s - i * a)) / o,
      f = (0.5 * (r * a - n * s)) / o;
    return l * l + f * f;
  }
  function n(t, e, r) {
    var i = {
      i: e,
      x: t[2 * e],
      y: t[2 * e + 1],
      t: 0,
      prev: null,
      next: null,
      removed: !1,
    };
    return (
      r
        ? ((i.next = r.next), (i.prev = r), (r.next.prev = i), (r.next = i))
        : ((i.prev = i), (i.next = i)),
      i
    );
  }
  function h(t) {
    return (
      (t.prev.next = t.next), (t.next.prev = t.prev), (t.removed = !0), t.prev
    );
  }
  function s(t, r, i, n, h) {
    return (
      e(t[2 * r], t[2 * r + 1], n, h) - e(t[2 * i], t[2 * i + 1], n, h) ||
      t[2 * r] - t[2 * i] ||
      t[2 * r + 1] - t[2 * i + 1]
    );
  }
  function a(t, e, r) {
    var i = t[e];
    (t[e] = t[r]), (t[r] = i);
  }
  function o(t) {
    return t[0];
  }
  function l(t) {
    return t[1];
  }
  return (
    (t.from = function (e, r, i) {
      r || (r = o), i || (i = l);
      for (var n = e.length, h = new Float64Array(2 * n), s = 0; s < n; s++) {
        var a = e[s];
        (h[2 * s] = r(a)), (h[2 * s + 1] = i(a));
      }
      return new t(h);
    }),
    (t.prototype = {
      _hashEdge: function (t) {
        this._hash[this._hashKey(t.x, t.y)] = t;
      },
      _hashKey: function (t, e) {
        var r = t - this._cx,
          i = e - this._cy,
          n = 1 - r / (Math.abs(r) + Math.abs(i));
        return Math.floor(((2 + (i < 0 ? -n : n)) / 4) * this._hashSize);
      },
      _legalize: function (t) {
        var e,
          r,
          i,
          n,
          h,
          s,
          a,
          o,
          l,
          f,
          u = this.triangles,
          v = this.coords,
          d = this.halfedges,
          g = d[t],
          _ = t - (t % 3),
          x = g - (g % 3),
          p = _ + ((t + 1) % 3),
          c = _ + ((t + 2) % 3),
          y = x + ((g + 2) % 3),
          w = u[c],
          z = u[t],
          E = u[p],
          k = u[y];
        if (
          ((e = v[2 * w]),
          (r = v[2 * w + 1]),
          (i = v[2 * z]),
          (n = v[2 * z + 1]),
          (h = v[2 * E]),
          (s = v[2 * E + 1]),
          (a = v[2 * k]),
          (o = v[2 * k + 1]),
          (l = (i -= a) * i + (n -= o) * n),
          (f = (h -= a) * h + (s -= o) * s),
          (e -= a) * (n * f - l * s) -
            (r -= o) * (i * f - l * h) +
            (e * e + r * r) * (i * s - n * h) <
            0)
        ) {
          (u[t] = k),
            (u[g] = w),
            this._link(t, d[y]),
            this._link(g, d[c]),
            this._link(c, y);
          var m = x + ((g + 1) % 3);
          return this._legalize(t), this._legalize(m);
        }
        return c;
      },
      _link: function (t, e) {
        (this.halfedges[t] = e), -1 !== e && (this.halfedges[e] = t);
      },
      _addTriangle: function (t, e, r, i, n, h) {
        var s = this.trianglesLen;
        return (
          (this.triangles[s] = t),
          (this.triangles[s + 1] = e),
          (this.triangles[s + 2] = r),
          this._link(s, i),
          this._link(s + 1, n),
          this._link(s + 2, h),
          (this.trianglesLen += 3),
          s
        );
      },
    }),
    t
  );
});
