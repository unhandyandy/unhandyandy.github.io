(function(e) {
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = e()
    } else if (typeof define === "function" && define.amd) {
        define([], e)
    } else {
        var t;
        if (typeof window !== "undefined") {
            t = window
        } else if (typeof global !== "undefined") {
            t = global
        } else if (typeof self !== "undefined") {
            t = self
        } else {
            t = this
        }
        t.SimplePeer = e()
    }
})(function() {
    var e, t, r;
    return function n(e, t, r) {
        function i(o, s) {
            if (!t[o]) {
                if (!e[o]) {
                    var f = typeof require == "function" && require;
                    if (!s && f) return f(o, !0);
                    if (a) return a(o, !0);
                    var u = new Error("Cannot find module '" + o + "'");
                    throw u.code = "MODULE_NOT_FOUND", u
                }
                var c = t[o] = {
                    exports: {}
                };
                e[o][0].call(c.exports, function(t) {
                    var r = e[o][1][t];
                    return i(r ? r : t)
                }, c, c.exports, n, e, t, r)
            }
            return t[o].exports
        }
        var a = typeof require == "function" && require;
        for (var o = 0; o < r.length; o++) i(r[o]);
        return i
    }({
        1: [function(e, t, r) {}, {}],
        2: [function(e, t, r) {
            var n = e("base64-js");
            var i = e("ieee754");
            var a = e("is-array");
            r.Buffer = f;
            r.SlowBuffer = y;
            r.INSPECT_MAX_BYTES = 50;
            f.poolSize = 8192;
            var o = {};
            f.TYPED_ARRAY_SUPPORT = function() {
                function e() {}
                try {
                    var t = new ArrayBuffer(0);
                    var r = new Uint8Array(t);
                    r.foo = function() {
                        return 42
                    };
                    r.constructor = e;
                    return r.foo() === 42 && r.constructor === e && typeof r.subarray === "function" && new Uint8Array(1).subarray(1, 1).byteLength === 0
                } catch (n) {
                    return false
                }
            }();

            function s() {
                return f.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823
            }

            function f(e) {
                if (!(this instanceof f)) {
                    if (arguments.length > 1) return new f(e, arguments[1]);
                    return new f(e)
                }
                this.length = 0;
                this.parent = undefined;
                if (typeof e === "number") {
                    return u(this, e)
                }
                if (typeof e === "string") {
                    return c(this, e, arguments.length > 1 ? arguments[1] : "utf8")
                }
                return l(this, e)
            }

            function u(e, t) {
                e = m(e, t < 0 ? 0 : b(t) | 0);
                if (!f.TYPED_ARRAY_SUPPORT) {
                    for (var r = 0; r < t; r++) {
                        e[r] = 0
                    }
                }
                return e
            }

            function c(e, t, r) {
                if (typeof r !== "string" || r === "") r = "utf8";
                var n = w(t, r) | 0;
                e = m(e, n);
                e.write(t, r);
                return e
            }

            function l(e, t) {
                if (f.isBuffer(t)) return h(e, t);
                if (a(t)) return d(e, t);
                if (t == null) {
                    throw new TypeError("must start with number, buffer, array or string")
                }
                if (typeof ArrayBuffer !== "undefined" && t.buffer instanceof ArrayBuffer) {
                    return p(e, t)
                }
                if (t.length) return g(e, t);
                return v(e, t)
            }

            function h(e, t) {
                var r = b(t.length) | 0;
                e = m(e, r);
                t.copy(e, 0, 0, r);
                return e
            }

            function d(e, t) {
                var r = b(t.length) | 0;
                e = m(e, r);
                for (var n = 0; n < r; n += 1) {
                    e[n] = t[n] & 255
                }
                return e
            }

            function p(e, t) {
                var r = b(t.length) | 0;
                e = m(e, r);
                for (var n = 0; n < r; n += 1) {
                    e[n] = t[n] & 255
                }
                return e
            }

            function g(e, t) {
                var r = b(t.length) | 0;
                e = m(e, r);
                for (var n = 0; n < r; n += 1) {
                    e[n] = t[n] & 255
                }
                return e
            }

            function v(e, t) {
                var r;
                var n = 0;
                if (t.type === "Buffer" && a(t.data)) {
                    r = t.data;
                    n = b(r.length) | 0
                }
                e = m(e, n);
                for (var i = 0; i < n; i += 1) {
                    e[i] = r[i] & 255
                }
                return e
            }

            function m(e, t) {
                if (f.TYPED_ARRAY_SUPPORT) {
                    e = f._augment(new Uint8Array(t))
                } else {
                    e.length = t;
                    e._isBuffer = true
                }
                var r = t !== 0 && t <= f.poolSize >>> 1;
                if (r) e.parent = o;
                return e
            }

            function b(e) {
                if (e >= s()) {
                    throw new RangeError("Attempt to allocate Buffer larger than maximum " + "size: 0x" + s().toString(16) + " bytes")
                }
                return e | 0
            }

            function y(e, t) {
                if (!(this instanceof y)) return new y(e, t);
                var r = new f(e, t);
                delete r.parent;
                return r
            }
            f.isBuffer = function V(e) {
                return !!(e != null && e._isBuffer)
            };
            f.compare = function Z(e, t) {
                if (!f.isBuffer(e) || !f.isBuffer(t)) {
                    throw new TypeError("Arguments must be Buffers")
                }
                if (e === t) return 0;
                var r = e.length;
                var n = t.length;
                var i = 0;
                var a = Math.min(r, n);
                while (i < a) {
                    if (e[i] !== t[i]) break;
                    ++i
                }
                if (i !== a) {
                    r = e[i];
                    n = t[i]
                }
                if (r < n) return -1;
                if (n < r) return 1;
                return 0
            };
            f.isEncoding = function ee(e) {
                switch (String(e).toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "binary":
                    case "base64":
                    case "raw":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                        return true;
                    default:
                        return false
                }
            };
            f.concat = function te(e, t) {
                if (!a(e)) throw new TypeError("list argument must be an Array of Buffers.");
                if (e.length === 0) {
                    return new f(0)
                } else if (e.length === 1) {
                    return e[0]
                }
                var r;
                if (t === undefined) {
                    t = 0;
                    for (r = 0; r < e.length; r++) {
                        t += e[r].length
                    }
                }
                var n = new f(t);
                var i = 0;
                for (r = 0; r < e.length; r++) {
                    var o = e[r];
                    o.copy(n, i);
                    i += o.length
                }
                return n
            };

            function w(e, t) {
                if (typeof e !== "string") e = "" + e;
                var r = e.length;
                if (r === 0) return 0;
                var n = false;
                for (;;) {
                    switch (t) {
                        case "ascii":
                        case "binary":
                        case "raw":
                        case "raws":
                            return r;
                        case "utf8":
                        case "utf-8":
                            return H(e).length;
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return r * 2;
                        case "hex":
                            return r >>> 1;
                        case "base64":
                            return G(e).length;
                        default:
                            if (n) return H(e).length;
                            t = ("" + t).toLowerCase();
                            n = true
                    }
                }
            }
            f.byteLength = w;
            f.prototype.length = undefined;
            f.prototype.parent = undefined;

            function _(e, t, r) {
                var n = false;
                t = t | 0;
                r = r === undefined || r === Infinity ? this.length : r | 0;
                if (!e) e = "utf8";
                if (t < 0) t = 0;
                if (r > this.length) r = this.length;
                if (r <= t) return "";
                while (true) {
                    switch (e) {
                        case "hex":
                            return M(this, t, r);
                        case "utf8":
                        case "utf-8":
                            return T(this, t, r);
                        case "ascii":
                            return k(this, t, r);
                        case "binary":
                            return B(this, t, r);
                        case "base64":
                            return I(this, t, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return x(this, t, r);
                        default:
                            if (n) throw new TypeError("Unknown encoding: " + e);
                            e = (e + "").toLowerCase();
                            n = true
                    }
                }
            }
            f.prototype.toString = function re() {
                var e = this.length | 0;
                if (e === 0) return "";
                if (arguments.length === 0) return T(this, 0, e);
                return _.apply(this, arguments)
            };
            f.prototype.equals = function ne(e) {
                if (!f.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                if (this === e) return true;
                return f.compare(this, e) === 0
            };
            f.prototype.inspect = function ie() {
                var e = "";
                var t = r.INSPECT_MAX_BYTES;
                if (this.length > 0) {
                    e = this.toString("hex", 0, t).match(/.{2}/g).join(" ");
                    if (this.length > t) e += " ... "
                }
                return "<Buffer " + e + ">"
            };
            f.prototype.compare = function ae(e) {
                if (!f.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
                if (this === e) return 0;
                return f.compare(this, e)
            };
            f.prototype.indexOf = function oe(e, t) {
                if (t > 2147483647) t = 2147483647;
                else if (t < -2147483648) t = -2147483648;
                t >>= 0;
                if (this.length === 0) return -1;
                if (t >= this.length) return -1;
                if (t < 0) t = Math.max(this.length + t, 0);
                if (typeof e === "string") {
                    if (e.length === 0) return -1;
                    return String.prototype.indexOf.call(this, e, t)
                }
                if (f.isBuffer(e)) {
                    return r(this, e, t)
                }
                if (typeof e === "number") {
                    if (f.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === "function") {
                        return Uint8Array.prototype.indexOf.call(this, e, t)
                    }
                    return r(this, [e], t)
                }

                function r(e, t, r) {
                    var n = -1;
                    for (var i = 0; r + i < e.length; i++) {
                        if (e[r + i] === t[n === -1 ? 0 : i - n]) {
                            if (n === -1) n = i;
                            if (i - n + 1 === t.length) return r + n
                        } else {
                            n = -1
                        }
                    }
                    return -1
                }
                throw new TypeError("val must be string, number or Buffer")
            };
            f.prototype.get = function se(e) {
                console.log(".get() is deprecated. Access using array indexes instead.");
                return this.readUInt8(e)
            };
            f.prototype.set = function fe(e, t) {
                console.log(".set() is deprecated. Access using array indexes instead.");
                return this.writeUInt8(e, t)
            };

            function E(e, t, r, n) {
                r = Number(r) || 0;
                var i = e.length - r;
                if (!n) {
                    n = i
                } else {
                    n = Number(n);
                    if (n > i) {
                        n = i
                    }
                }
                var a = t.length;
                if (a % 2 !== 0) throw new Error("Invalid hex string");
                if (n > a / 2) {
                    n = a / 2
                }
                for (var o = 0; o < n; o++) {
                    var s = parseInt(t.substr(o * 2, 2), 16);
                    if (isNaN(s)) throw new Error("Invalid hex string");
                    e[r + o] = s
                }
                return o
            }

            function A(e, t, r, n) {
                return K(H(t, e.length - r), e, r, n)
            }

            function S(e, t, r, n) {
                return K($(t), e, r, n)
            }

            function R(e, t, r, n) {
                return S(e, t, r, n)
            }

            function C(e, t, r, n) {
                return K(G(t), e, r, n)
            }

            function L(e, t, r, n) {
                return K(X(t, e.length - r), e, r, n)
            }
            f.prototype.write = function ue(e, t, r, n) {
                if (t === undefined) {
                    n = "utf8";
                    r = this.length;
                    t = 0
                } else if (r === undefined && typeof t === "string") {
                    n = t;
                    r = this.length;
                    t = 0
                } else if (isFinite(t)) {
                    t = t | 0;
                    if (isFinite(r)) {
                        r = r | 0;
                        if (n === undefined) n = "utf8"
                    } else {
                        n = r;
                        r = undefined
                    }
                } else {
                    var i = n;
                    n = t;
                    t = r | 0;
                    r = i
                }
                var a = this.length - t;
                if (r === undefined || r > a) r = a;
                if (e.length > 0 && (r < 0 || t < 0) || t > this.length) {
                    throw new RangeError("attempt to write outside buffer bounds")
                }
                if (!n) n = "utf8";
                var o = false;
                for (;;) {
                    switch (n) {
                        case "hex":
                            return E(this, e, t, r);
                        case "utf8":
                        case "utf-8":
                            return A(this, e, t, r);
                        case "ascii":
                            return S(this, e, t, r);
                        case "binary":
                            return R(this, e, t, r);
                        case "base64":
                            return C(this, e, t, r);
                        case "ucs2":
                        case "ucs-2":
                        case "utf16le":
                        case "utf-16le":
                            return L(this, e, t, r);
                        default:
                            if (o) throw new TypeError("Unknown encoding: " + n);
                            n = ("" + n).toLowerCase();
                            o = true
                    }
                }
            };
            f.prototype.toJSON = function ce() {
                return {
                    type: "Buffer",
                    data: Array.prototype.slice.call(this._arr || this, 0)
                }
            };

            function I(e, t, r) {
                if (t === 0 && r === e.length) {
                    return n.fromByteArray(e)
                } else {
                    return n.fromByteArray(e.slice(t, r))
                }
            }

            function T(e, t, r) {
                var n = "";
                var i = "";
                r = Math.min(e.length, r);
                for (var a = t; a < r; a++) {
                    if (e[a] <= 127) {
                        n += Q(i) + String.fromCharCode(e[a]);
                        i = ""
                    } else {
                        i += "%" + e[a].toString(16)
                    }
                }
                return n + Q(i)
            }

            function k(e, t, r) {
                var n = "";
                r = Math.min(e.length, r);
                for (var i = t; i < r; i++) {
                    n += String.fromCharCode(e[i] & 127)
                }
                return n
            }

            function B(e, t, r) {
                var n = "";
                r = Math.min(e.length, r);
                for (var i = t; i < r; i++) {
                    n += String.fromCharCode(e[i])
                }
                return n
            }

            function M(e, t, r) {
                var n = e.length;
                if (!t || t < 0) t = 0;
                if (!r || r < 0 || r > n) r = n;
                var i = "";
                for (var a = t; a < r; a++) {
                    i += J(e[a])
                }
                return i
            }

            function x(e, t, r) {
                var n = e.slice(t, r);
                var i = "";
                for (var a = 0; a < n.length; a += 2) {
                    i += String.fromCharCode(n[a] + n[a + 1] * 256)
                }
                return i
            }
            f.prototype.slice = function le(e, t) {
                var r = this.length;
                e = ~~e;
                t = t === undefined ? r : ~~t;
                if (e < 0) {
                    e += r;
                    if (e < 0) e = 0
                } else if (e > r) {
                    e = r
                }
                if (t < 0) {
                    t += r;
                    if (t < 0) t = 0
                } else if (t > r) {
                    t = r
                }
                if (t < e) t = e;
                var n;
                if (f.TYPED_ARRAY_SUPPORT) {
                    n = f._augment(this.subarray(e, t))
                } else {
                    var i = t - e;
                    n = new f(i, undefined);
                    for (var a = 0; a < i; a++) {
                        n[a] = this[a + e]
                    }
                }
                if (n.length) n.parent = this.parent || this;
                return n
            };

            function U(e, t, r) {
                if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
                if (e + t > r) throw new RangeError("Trying to access beyond buffer length")
            }
            f.prototype.readUIntLE = function he(e, t, r) {
                e = e | 0;
                t = t | 0;
                if (!r) U(e, t, this.length);
                var n = this[e];
                var i = 1;
                var a = 0;
                while (++a < t && (i *= 256)) {
                    n += this[e + a] * i
                }
                return n
            };
            f.prototype.readUIntBE = function de(e, t, r) {
                e = e | 0;
                t = t | 0;
                if (!r) {
                    U(e, t, this.length)
                }
                var n = this[e + --t];
                var i = 1;
                while (t > 0 && (i *= 256)) {
                    n += this[e + --t] * i
                }
                return n
            };
            f.prototype.readUInt8 = function pe(e, t) {
                if (!t) U(e, 1, this.length);
                return this[e]
            };
            f.prototype.readUInt16LE = function ge(e, t) {
                if (!t) U(e, 2, this.length);
                return this[e] | this[e + 1] << 8
            };
            f.prototype.readUInt16BE = function ve(e, t) {
                if (!t) U(e, 2, this.length);
                return this[e] << 8 | this[e + 1]
            };
            f.prototype.readUInt32LE = function me(e, t) {
                if (!t) U(e, 4, this.length);
                return (this[e] | this[e + 1] << 8 | this[e + 2] << 16) + this[e + 3] * 16777216
            };
            f.prototype.readUInt32BE = function be(e, t) {
                if (!t) U(e, 4, this.length);
                return this[e] * 16777216 + (this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3])
            };
            f.prototype.readIntLE = function ye(e, t, r) {
                e = e | 0;
                t = t | 0;
                if (!r) U(e, t, this.length);
                var n = this[e];
                var i = 1;
                var a = 0;
                while (++a < t && (i *= 256)) {
                    n += this[e + a] * i
                }
                i *= 128;
                if (n >= i) n -= Math.pow(2, 8 * t);
                return n
            };
            f.prototype.readIntBE = function we(e, t, r) {
                e = e | 0;
                t = t | 0;
                if (!r) U(e, t, this.length);
                var n = t;
                var i = 1;
                var a = this[e + --n];
                while (n > 0 && (i *= 256)) {
                    a += this[e + --n] * i
                }
                i *= 128;
                if (a >= i) a -= Math.pow(2, 8 * t);
                return a
            };
            f.prototype.readInt8 = function _e(e, t) {
                if (!t) U(e, 1, this.length);
                if (!(this[e] & 128)) return this[e];
                return (255 - this[e] + 1) * -1
            };
            f.prototype.readInt16LE = function Ee(e, t) {
                if (!t) U(e, 2, this.length);
                var r = this[e] | this[e + 1] << 8;
                return r & 32768 ? r | 4294901760 : r
            };
            f.prototype.readInt16BE = function Ae(e, t) {
                if (!t) U(e, 2, this.length);
                var r = this[e + 1] | this[e] << 8;
                return r & 32768 ? r | 4294901760 : r
            };
            f.prototype.readInt32LE = function Se(e, t) {
                if (!t) U(e, 4, this.length);
                return this[e] | this[e + 1] << 8 | this[e + 2] << 16 | this[e + 3] << 24
            };
            f.prototype.readInt32BE = function Re(e, t) {
                if (!t) U(e, 4, this.length);
                return this[e] << 24 | this[e + 1] << 16 | this[e + 2] << 8 | this[e + 3]
            };
            f.prototype.readFloatLE = function Ce(e, t) {
                if (!t) U(e, 4, this.length);
                return i.read(this, e, true, 23, 4)
            };
            f.prototype.readFloatBE = function Le(e, t) {
                if (!t) U(e, 4, this.length);
                return i.read(this, e, false, 23, 4)
            };
            f.prototype.readDoubleLE = function Ie(e, t) {
                if (!t) U(e, 8, this.length);
                return i.read(this, e, true, 52, 8)
            };
            f.prototype.readDoubleBE = function Te(e, t) {
                if (!t) U(e, 8, this.length);
                return i.read(this, e, false, 52, 8)
            };

            function j(e, t, r, n, i, a) {
                if (!f.isBuffer(e)) throw new TypeError("buffer must be a Buffer instance");
                if (t > i || t < a) throw new RangeError("value is out of bounds");
                if (r + n > e.length) throw new RangeError("index out of range")
            }
            f.prototype.writeUIntLE = function ke(e, t, r, n) {
                e = +e;
                t = t | 0;
                r = r | 0;
                if (!n) j(this, e, t, r, Math.pow(2, 8 * r), 0);
                var i = 1;
                var a = 0;
                this[t] = e & 255;
                while (++a < r && (i *= 256)) {
                    this[t + a] = e / i & 255
                }
                return t + r
            };
            f.prototype.writeUIntBE = function Be(e, t, r, n) {
                e = +e;
                t = t | 0;
                r = r | 0;
                if (!n) j(this, e, t, r, Math.pow(2, 8 * r), 0);
                var i = r - 1;
                var a = 1;
                this[t + i] = e & 255;
                while (--i >= 0 && (a *= 256)) {
                    this[t + i] = e / a & 255
                }
                return t + r
            };
            f.prototype.writeUInt8 = function Me(e, t, r) {
                e = +e;
                t = t | 0;
                if (!r) j(this, e, t, 1, 255, 0);
                if (!f.TYPED_ARRAY_SUPPORT) e = Math.floor(e);
                this[t] = e;
                return t + 1
            };

            function P(e, t, r, n) {
                if (t < 0) t = 65535 + t + 1;
                for (var i = 0, a = Math.min(e.length - r, 2); i < a; i++) {
                    e[r + i] = (t & 255 << 8 * (n ? i : 1 - i)) >>> (n ? i : 1 - i) * 8
                }
            }
            f.prototype.writeUInt16LE = function xe(e, t, r) {
                e = +e;
                t = t | 0;
                if (!r) j(this, e, t, 2, 65535, 0);
                if (f.TYPED_ARRAY_SUPPORT) {
                    this[t] = e;
                    this[t + 1] = e >>> 8
                } else {
                    P(this, e, t, true)
                }
                return t + 2
            };
            f.prototype.writeUInt16BE = function Ue(e, t, r) {
                e = +e;
                t = t | 0;
                if (!r) j(this, e, t, 2, 65535, 0);
                if (f.TYPED_ARRAY_SUPPORT) {
                    this[t] = e >>> 8;
                    this[t + 1] = e
                } else {
                    P(this, e, t, false)
                }
                return t + 2
            };

            function D(e, t, r, n) {
                if (t < 0) t = 4294967295 + t + 1;
                for (var i = 0, a = Math.min(e.length - r, 4); i < a; i++) {
                    e[r + i] = t >>> (n ? i : 3 - i) * 8 & 255
                }
            }
            f.prototype.writeUInt32LE = function je(e, t, r) {
                e = +e;
                t = t | 0;
                if (!r) j(this, e, t, 4, 4294967295, 0);
                if (f.TYPED_ARRAY_SUPPORT) {
                    this[t + 3] = e >>> 24;
                    this[t + 2] = e >>> 16;
                    this[t + 1] = e >>> 8;
                    this[t] = e
                } else {
                    D(this, e, t, true)
                }
                return t + 4
            };
            f.prototype.writeUInt32BE = function Pe(e, t, r) {
                e = +e;
                t = t | 0;
                if (!r) j(this, e, t, 4, 4294967295, 0);
                if (f.TYPED_ARRAY_SUPPORT) {
                    this[t] = e >>> 24;
                    this[t + 1] = e >>> 16;
                    this[t + 2] = e >>> 8;
                    this[t + 3] = e
                } else {
                    D(this, e, t, false)
                }
                return t + 4
            };
            f.prototype.writeIntLE = function De(e, t, r, n) {
                e = +e;
                t = t | 0;
                if (!n) {
                    var i = Math.pow(2, 8 * r - 1);
                    j(this, e, t, r, i - 1, -i)
                }
                var a = 0;
                var o = 1;
                var s = e < 0 ? 1 : 0;
                this[t] = e & 255;
                while (++a < r && (o *= 256)) {
                    this[t + a] = (e / o >> 0) - s & 255
                }
                return t + r
            };
            f.prototype.writeIntBE = function Oe(e, t, r, n) {
                e = +e;
                t = t | 0;
                if (!n) {
                    var i = Math.pow(2, 8 * r - 1);
                    j(this, e, t, r, i - 1, -i)
                }
                var a = r - 1;
                var o = 1;
                var s = e < 0 ? 1 : 0;
                this[t + a] = e & 255;
                while (--a >= 0 && (o *= 256)) {
                    this[t + a] = (e / o >> 0) - s & 255
                }
                return t + r
            };
            f.prototype.writeInt8 = function Ne(e, t, r) {
                e = +e;
                t = t | 0;
                if (!r) j(this, e, t, 1, 127, -128);
                if (!f.TYPED_ARRAY_SUPPORT) e = Math.floor(e);
                if (e < 0) e = 255 + e + 1;
                this[t] = e;
                return t + 1
            };
            f.prototype.writeInt16LE = function Ye(e, t, r) {
                e = +e;
                t = t | 0;
                if (!r) j(this, e, t, 2, 32767, -32768);
                if (f.TYPED_ARRAY_SUPPORT) {
                    this[t] = e;
                    this[t + 1] = e >>> 8
                } else {
                    P(this, e, t, true)
                }
                return t + 2
            };
            f.prototype.writeInt16BE = function Fe(e, t, r) {
                e = +e;
                t = t | 0;
                if (!r) j(this, e, t, 2, 32767, -32768);
                if (f.TYPED_ARRAY_SUPPORT) {
                    this[t] = e >>> 8;
                    this[t + 1] = e
                } else {
                    P(this, e, t, false)
                }
                return t + 2
            };
            f.prototype.writeInt32LE = function We(e, t, r) {
                e = +e;
                t = t | 0;
                if (!r) j(this, e, t, 4, 2147483647, -2147483648);
                if (f.TYPED_ARRAY_SUPPORT) {
                    this[t] = e;
                    this[t + 1] = e >>> 8;
                    this[t + 2] = e >>> 16;
                    this[t + 3] = e >>> 24
                } else {
                    D(this, e, t, true)
                }
                return t + 4
            };
            f.prototype.writeInt32BE = function ze(e, t, r) {
                e = +e;
                t = t | 0;
                if (!r) j(this, e, t, 4, 2147483647, -2147483648);
                if (e < 0) e = 4294967295 + e + 1;
                if (f.TYPED_ARRAY_SUPPORT) {
                    this[t] = e >>> 24;
                    this[t + 1] = e >>> 16;
                    this[t + 2] = e >>> 8;
                    this[t + 3] = e
                } else {
                    D(this, e, t, false)
                }
                return t + 4
            };

            function O(e, t, r, n, i, a) {
                if (t > i || t < a) throw new RangeError("value is out of bounds");
                if (r + n > e.length) throw new RangeError("index out of range");
                if (r < 0) throw new RangeError("index out of range")
            }

            function N(e, t, r, n, a) {
                if (!a) {
                    O(e, t, r, 4, 3.4028234663852886e38, -3.4028234663852886e38)
                }
                i.write(e, t, r, n, 23, 4);
                return r + 4
            }
            f.prototype.writeFloatLE = function qe(e, t, r) {
                return N(this, e, t, true, r)
            };
            f.prototype.writeFloatBE = function Je(e, t, r) {
                return N(this, e, t, false, r)
            };

            function Y(e, t, r, n, a) {
                if (!a) {
                    O(e, t, r, 8, 1.7976931348623157e308, -1.7976931348623157e308)
                }
                i.write(e, t, r, n, 52, 8);
                return r + 8
            }
            f.prototype.writeDoubleLE = function He(e, t, r) {
                return Y(this, e, t, true, r)
            };
            f.prototype.writeDoubleBE = function $e(e, t, r) {
                return Y(this, e, t, false, r)
            };
            f.prototype.copy = function Xe(e, t, r, n) {
                if (!r) r = 0;
                if (!n && n !== 0) n = this.length;
                if (t >= e.length) t = e.length;
                if (!t) t = 0;
                if (n > 0 && n < r) n = r;
                if (n === r) return 0;
                if (e.length === 0 || this.length === 0) return 0;
                if (t < 0) {
                    throw new RangeError("targetStart out of bounds")
                }
                if (r < 0 || r >= this.length) throw new RangeError("sourceStart out of bounds");
                if (n < 0) throw new RangeError("sourceEnd out of bounds");
                if (n > this.length) n = this.length;
                if (e.length - t < n - r) {
                    n = e.length - t + r
                }
                var i = n - r;
                if (i < 1e3 || !f.TYPED_ARRAY_SUPPORT) {
                    for (var a = 0; a < i; a++) {
                        e[a + t] = this[a + r]
                    }
                } else {
                    e._set(this.subarray(r, r + i), t)
                }
                return i
            };
            f.prototype.fill = function Ge(e, t, r) {
                if (!e) e = 0;
                if (!t) t = 0;
                if (!r) r = this.length;
                if (r < t) throw new RangeError("end < start");
                if (r === t) return;
                if (this.length === 0) return;
                if (t < 0 || t >= this.length) throw new RangeError("start out of bounds");
                if (r < 0 || r > this.length) throw new RangeError("end out of bounds");
                var n;
                if (typeof e === "number") {
                    for (n = t; n < r; n++) {
                        this[n] = e
                    }
                } else {
                    var i = H(e.toString());
                    var a = i.length;
                    for (n = t; n < r; n++) {
                        this[n] = i[n % a]
                    }
                }
                return this
            };
            f.prototype.toArrayBuffer = function Ke() {
                if (typeof Uint8Array !== "undefined") {
                    if (f.TYPED_ARRAY_SUPPORT) {
                        return new f(this).buffer
                    } else {
                        var e = new Uint8Array(this.length);
                        for (var t = 0, r = e.length; t < r; t += 1) {
                            e[t] = this[t]
                        }
                        return e.buffer
                    }
                } else {
                    throw new TypeError("Buffer.toArrayBuffer not supported in this browser")
                }
            };
            var F = f.prototype;
            f._augment = function Qe(e) {
                e.constructor = f;
                e._isBuffer = true;
                e._set = e.set;
                e.get = F.get;
                e.set = F.set;
                e.write = F.write;
                e.toString = F.toString;
                e.toLocaleString = F.toString;
                e.toJSON = F.toJSON;
                e.equals = F.equals;
                e.compare = F.compare;
                e.indexOf = F.indexOf;
                e.copy = F.copy;
                e.slice = F.slice;
                e.readUIntLE = F.readUIntLE;
                e.readUIntBE = F.readUIntBE;
                e.readUInt8 = F.readUInt8;
                e.readUInt16LE = F.readUInt16LE;
                e.readUInt16BE = F.readUInt16BE;
                e.readUInt32LE = F.readUInt32LE;
                e.readUInt32BE = F.readUInt32BE;
                e.readIntLE = F.readIntLE;
                e.readIntBE = F.readIntBE;
                e.readInt8 = F.readInt8;
                e.readInt16LE = F.readInt16LE;
                e.readInt16BE = F.readInt16BE;
                e.readInt32LE = F.readInt32LE;
                e.readInt32BE = F.readInt32BE;
                e.readFloatLE = F.readFloatLE;
                e.readFloatBE = F.readFloatBE;
                e.readDoubleLE = F.readDoubleLE;
                e.readDoubleBE = F.readDoubleBE;
                e.writeUInt8 = F.writeUInt8;
                e.writeUIntLE = F.writeUIntLE;
                e.writeUIntBE = F.writeUIntBE;
                e.writeUInt16LE = F.writeUInt16LE;
                e.writeUInt16BE = F.writeUInt16BE;
                e.writeUInt32LE = F.writeUInt32LE;
                e.writeUInt32BE = F.writeUInt32BE;
                e.writeIntLE = F.writeIntLE;
                e.writeIntBE = F.writeIntBE;
                e.writeInt8 = F.writeInt8;
                e.writeInt16LE = F.writeInt16LE;
                e.writeInt16BE = F.writeInt16BE;
                e.writeInt32LE = F.writeInt32LE;
                e.writeInt32BE = F.writeInt32BE;
                e.writeFloatLE = F.writeFloatLE;
                e.writeFloatBE = F.writeFloatBE;
                e.writeDoubleLE = F.writeDoubleLE;
                e.writeDoubleBE = F.writeDoubleBE;
                e.fill = F.fill;
                e.inspect = F.inspect;
                e.toArrayBuffer = F.toArrayBuffer;
                return e
            };
            var W = /[^+\/0-9A-z\-]/g;

            function z(e) {
                e = q(e).replace(W, "");
                if (e.length < 2) return "";
                while (e.length % 4 !== 0) {
                    e = e + "="
                }
                return e
            }

            function q(e) {
                if (e.trim) return e.trim();
                return e.replace(/^\s+|\s+$/g, "")
            }

            function J(e) {
                if (e < 16) return "0" + e.toString(16);
                return e.toString(16)
            }

            function H(e, t) {
                t = t || Infinity;
                var r;
                var n = e.length;
                var i = null;
                var a = [];
                var o = 0;
                for (; o < n; o++) {
                    r = e.charCodeAt(o);
                    if (r > 55295 && r < 57344) {
                        if (i) {
                            if (r < 56320) {
                                if ((t -= 3) > -1) a.push(239, 191, 189);
                                i = r;
                                continue
                            } else {
                                r = i - 55296 << 10 | r - 56320 | 65536;
                                i = null
                            }
                        } else {
                            if (r > 56319) {
                                if ((t -= 3) > -1) a.push(239, 191, 189);
                                continue
                            } else if (o + 1 === n) {
                                if ((t -= 3) > -1) a.push(239, 191, 189);
                                continue
                            } else {
                                i = r;
                                continue
                            }
                        }
                    } else if (i) {
                        if ((t -= 3) > -1) a.push(239, 191, 189);
                        i = null
                    }
                    if (r < 128) {
                        if ((t -= 1) < 0) break;
                        a.push(r)
                    } else if (r < 2048) {
                        if ((t -= 2) < 0) break;
                        a.push(r >> 6 | 192, r & 63 | 128)
                    } else if (r < 65536) {
                        if ((t -= 3) < 0) break;
                        a.push(r >> 12 | 224, r >> 6 & 63 | 128, r & 63 | 128)
                    } else if (r < 2097152) {
                        if ((t -= 4) < 0) break;
                        a.push(r >> 18 | 240, r >> 12 & 63 | 128, r >> 6 & 63 | 128, r & 63 | 128)
                    } else {
                        throw new Error("Invalid code point")
                    }
                }
                return a
            }

            function $(e) {
                var t = [];
                for (var r = 0; r < e.length; r++) {
                    t.push(e.charCodeAt(r) & 255)
                }
                return t
            }

            function X(e, t) {
                var r, n, i;
                var a = [];
                for (var o = 0; o < e.length; o++) {
                    if ((t -= 2) < 0) break;
                    r = e.charCodeAt(o);
                    n = r >> 8;
                    i = r % 256;
                    a.push(i);
                    a.push(n)
                }
                return a
            }

            function G(e) {
                return n.toByteArray(z(e))
            }

            function K(e, t, r, n) {
                for (var i = 0; i < n; i++) {
                    if (i + r >= t.length || i >= e.length) break;
                    t[i + r] = e[i]
                }
                return i
            }

            function Q(e) {
                try {
                    return decodeURIComponent(e)
                } catch (t) {
                    return String.fromCharCode(65533)
                }
            }
        }, {
            "base64-js": 3,
            ieee754: 4,
            "is-array": 5
        }],
        3: [function(e, t, r) {
            var n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
            (function(e) {
                "use strict";
                var t = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
                var r = "+".charCodeAt(0);
                var i = "/".charCodeAt(0);
                var a = "0".charCodeAt(0);
                var o = "a".charCodeAt(0);
                var s = "A".charCodeAt(0);
                var f = "-".charCodeAt(0);
                var u = "_".charCodeAt(0);

                function c(e) {
                    var t = e.charCodeAt(0);
                    if (t === r || t === f) return 62;
                    if (t === i || t === u) return 63;
                    if (t < a) return -1;
                    if (t < a + 10) return t - a + 26 + 26;
                    if (t < s + 26) return t - s;
                    if (t < o + 26) return t - o + 26
                }

                function l(e) {
                    var r, n, i, a, o, s;
                    if (e.length % 4 > 0) {
                        throw new Error("Invalid string. Length must be a multiple of 4")
                    }
                    var f = e.length;
                    o = "=" === e.charAt(f - 2) ? 2 : "=" === e.charAt(f - 1) ? 1 : 0;
                    s = new t(e.length * 3 / 4 - o);
                    i = o > 0 ? e.length - 4 : e.length;
                    var u = 0;

                    function l(e) {
                        s[u++] = e
                    }
                    for (r = 0, n = 0; r < i; r += 4, n += 3) {
                        a = c(e.charAt(r)) << 18 | c(e.charAt(r + 1)) << 12 | c(e.charAt(r + 2)) << 6 | c(e.charAt(r + 3));
                        l((a & 16711680) >> 16);
                        l((a & 65280) >> 8);
                        l(a & 255)
                    }
                    if (o === 2) {
                        a = c(e.charAt(r)) << 2 | c(e.charAt(r + 1)) >> 4;
                        l(a & 255)
                    } else if (o === 1) {
                        a = c(e.charAt(r)) << 10 | c(e.charAt(r + 1)) << 4 | c(e.charAt(r + 2)) >> 2;
                        l(a >> 8 & 255);
                        l(a & 255)
                    }
                    return s
                }

                function h(e) {
                    var t, r = e.length % 3,
                        i = "",
                        a, o;

                    function s(e) {
                        return n.charAt(e)
                    }

                    function f(e) {
                        return s(e >> 18 & 63) + s(e >> 12 & 63) + s(e >> 6 & 63) + s(e & 63)
                    }
                    for (t = 0, o = e.length - r; t < o; t += 3) {
                        a = (e[t] << 16) + (e[t + 1] << 8) + e[t + 2];
                        i += f(a)
                    }
                    switch (r) {
                        case 1:
                            a = e[e.length - 1];
                            i += s(a >> 2);
                            i += s(a << 4 & 63);
                            i += "==";
                            break;
                        case 2:
                            a = (e[e.length - 2] << 8) + e[e.length - 1];
                            i += s(a >> 10);
                            i += s(a >> 4 & 63);
                            i += s(a << 2 & 63);
                            i += "=";
                            break
                    }
                    return i
                }
                e.toByteArray = l;
                e.fromByteArray = h
            })(typeof r === "undefined" ? this.base64js = {} : r)
        }, {}],
        4: [function(e, t, r) {
            r.read = function(e, t, r, n, i) {
                var a, o;
                var s = i * 8 - n - 1;
                var f = (1 << s) - 1;
                var u = f >> 1;
                var c = -7;
                var l = r ? i - 1 : 0;
                var h = r ? -1 : 1;
                var d = e[t + l];
                l += h;
                a = d & (1 << -c) - 1;
                d >>= -c;
                c += s;
                for (; c > 0; a = a * 256 + e[t + l], l += h, c -= 8) {}
                o = a & (1 << -c) - 1;
                a >>= -c;
                c += n;
                for (; c > 0; o = o * 256 + e[t + l], l += h, c -= 8) {}
                if (a === 0) {
                    a = 1 - u
                } else if (a === f) {
                    return o ? NaN : (d ? -1 : 1) * Infinity
                } else {
                    o = o + Math.pow(2, n);
                    a = a - u
                }
                return (d ? -1 : 1) * o * Math.pow(2, a - n)
            };
            r.write = function(e, t, r, n, i, a) {
                var o, s, f;
                var u = a * 8 - i - 1;
                var c = (1 << u) - 1;
                var l = c >> 1;
                var h = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
                var d = n ? 0 : a - 1;
                var p = n ? 1 : -1;
                var g = t < 0 || t === 0 && 1 / t < 0 ? 1 : 0;
                t = Math.abs(t);
                if (isNaN(t) || t === Infinity) {
                    s = isNaN(t) ? 1 : 0;
                    o = c
                } else {
                    o = Math.floor(Math.log(t) / Math.LN2);
                    if (t * (f = Math.pow(2, -o)) < 1) {
                        o--;
                        f *= 2
                    }
                    if (o + l >= 1) {
                        t += h / f
                    } else {
                        t += h * Math.pow(2, 1 - l)
                    }
                    if (t * f >= 2) {
                        o++;
                        f /= 2
                    }
                    if (o + l >= c) {
                        s = 0;
                        o = c
                    } else if (o + l >= 1) {
                        s = (t * f - 1) * Math.pow(2, i);
                        o = o + l
                    } else {
                        s = t * Math.pow(2, l - 1) * Math.pow(2, i);
                        o = 0
                    }
                }
                for (; i >= 8; e[r + d] = s & 255, d += p, s /= 256, i -= 8) {}
                o = o << i | s;
                u += i;
                for (; u > 0; e[r + d] = o & 255, d += p, o /= 256, u -= 8) {}
                e[r + d - p] |= g * 128
            }
        }, {}],
        5: [function(e, t, r) {
            var n = Array.isArray;
            var i = Object.prototype.toString;
            t.exports = n || function(e) {
                return !!e && "[object Array]" == i.call(e)
            }
        }, {}],
        6: [function(e, t, r) {
            function n() {
                this._events = this._events || {};
                this._maxListeners = this._maxListeners || undefined
            }
            t.exports = n;
            n.EventEmitter = n;
            n.prototype._events = undefined;
            n.prototype._maxListeners = undefined;
            n.defaultMaxListeners = 10;
            n.prototype.setMaxListeners = function(e) {
                if (!a(e) || e < 0 || isNaN(e)) throw TypeError("n must be a positive number");
                this._maxListeners = e;
                return this
            };
            n.prototype.emit = function(e) {
                var t, r, n, a, f, u;
                if (!this._events) this._events = {};
                if (e === "error") {
                    if (!this._events.error || o(this._events.error) && !this._events.error.length) {
                        t = arguments[1];
                        if (t instanceof Error) {
                            throw t
                        }
                        throw TypeError('Uncaught, unspecified "error" event.')
                    }
                }
                r = this._events[e];
                if (s(r)) return false;
                if (i(r)) {
                    switch (arguments.length) {
                        case 1:
                            r.call(this);
                            break;
                        case 2:
                            r.call(this, arguments[1]);
                            break;
                        case 3:
                            r.call(this, arguments[1], arguments[2]);
                            break;
                        default:
                            n = arguments.length;
                            a = new Array(n - 1);
                            for (f = 1; f < n; f++) a[f - 1] = arguments[f];
                            r.apply(this, a)
                    }
                } else if (o(r)) {
                    n = arguments.length;
                    a = new Array(n - 1);
                    for (f = 1; f < n; f++) a[f - 1] = arguments[f];
                    u = r.slice();
                    n = u.length;
                    for (f = 0; f < n; f++) u[f].apply(this, a)
                }
                return true
            };
            n.prototype.addListener = function(e, t) {
                var r;
                if (!i(t)) throw TypeError("listener must be a function");
                if (!this._events) this._events = {};
                if (this._events.newListener) this.emit("newListener", e, i(t.listener) ? t.listener : t);
                if (!this._events[e]) this._events[e] = t;
                else if (o(this._events[e])) this._events[e].push(t);
                else this._events[e] = [this._events[e], t];
                if (o(this._events[e]) && !this._events[e].warned) {
                    var r;
                    if (!s(this._maxListeners)) {
                        r = this._maxListeners
                    } else {
                        r = n.defaultMaxListeners
                    }
                    if (r && r > 0 && this._events[e].length > r) {
                        this._events[e].warned = true;
                        console.error("(node) warning: possible EventEmitter memory " + "leak detected. %d listeners added. " + "Use emitter.setMaxListeners() to increase limit.", this._events[e].length);
                        if (typeof console.trace === "function") {
                            console.trace()
                        }
                    }
                }
                return this
            };
            n.prototype.on = n.prototype.addListener;
            n.prototype.once = function(e, t) {
                if (!i(t)) throw TypeError("listener must be a function");
                var r = false;

                function n() {
                    this.removeListener(e, n);
                    if (!r) {
                        r = true;
                        t.apply(this, arguments)
                    }
                }
                n.listener = t;
                this.on(e, n);
                return this
            };
            n.prototype.removeListener = function(e, t) {
                var r, n, a, s;
                if (!i(t)) throw TypeError("listener must be a function");
                if (!this._events || !this._events[e]) return this;
                r = this._events[e];
                a = r.length;
                n = -1;
                if (r === t || i(r.listener) && r.listener === t) {
                    delete this._events[e];
                    if (this._events.removeListener) this.emit("removeListener", e, t)
                } else if (o(r)) {
                    for (s = a; s-- > 0;) {
                        if (r[s] === t || r[s].listener && r[s].listener === t) {
                            n = s;
                            break
                        }
                    }
                    if (n < 0) return this;
                    if (r.length === 1) {
                        r.length = 0;
                        delete this._events[e]
                    } else {
                        r.splice(n, 1)
                    }
                    if (this._events.removeListener) this.emit("removeListener", e, t)
                }
                return this
            };
            n.prototype.removeAllListeners = function(e) {
                var t, r;
                if (!this._events) return this;
                if (!this._events.removeListener) {
                    if (arguments.length === 0) this._events = {};
                    else if (this._events[e]) delete this._events[e];
                    return this
                }
                if (arguments.length === 0) {
                    for (t in this._events) {
                        if (t === "removeListener") continue;
                        this.removeAllListeners(t)
                    }
                    this.removeAllListeners("removeListener");
                    this._events = {};
                    return this
                }
                r = this._events[e];
                if (i(r)) {
                    this.removeListener(e, r)
                } else {
                    while (r.length) this.removeListener(e, r[r.length - 1])
                }
                delete this._events[e];
                return this
            };
            n.prototype.listeners = function(e) {
                var t;
                if (!this._events || !this._events[e]) t = [];
                else if (i(this._events[e])) t = [this._events[e]];
                else t = this._events[e].slice();
                return t
            };
            n.listenerCount = function(e, t) {
                var r;
                if (!e._events || !e._events[t]) r = 0;
                else if (i(e._events[t])) r = 1;
                else r = e._events[t].length;
                return r
            };

            function i(e) {
                return typeof e === "function"
            }

            function a(e) {
                return typeof e === "number"
            }

            function o(e) {
                return typeof e === "object" && e !== null
            }

            function s(e) {
                return e === void 0
            }
        }, {}],
        7: [function(e, t, r) {
            t.exports = Array.isArray || function(e) {
                return Object.prototype.toString.call(e) == "[object Array]"
            }
        }, {}],
        8: [function(e, t, r) {
            var n = t.exports = {};
            var i = [];
            var a = false;
            var o;
            var s = -1;

            function f() {
                a = false;
                if (o.length) {
                    i = o.concat(i)
                } else {
                    s = -1
                }
                if (i.length) {
                    u()
                }
            }

            function u() {
                if (a) {
                    return
                }
                var e = setTimeout(f);
                a = true;
                var t = i.length;
                while (t) {
                    o = i;
                    i = [];
                    while (++s < t) {
                        o[s].run()
                    }
                    s = -1;
                    t = i.length
                }
                o = null;
                a = false;
                clearTimeout(e)
            }
            n.nextTick = function(e) {
                var t = new Array(arguments.length - 1);
                if (arguments.length > 1) {
                    for (var r = 1; r < arguments.length; r++) {
                        t[r - 1] = arguments[r]
                    }
                }
                i.push(new c(e, t));
                if (i.length === 1 && !a) {
                    setTimeout(u, 0)
                }
            };

            function c(e, t) {
                this.fun = e;
                this.array = t
            }
            c.prototype.run = function() {
                this.fun.apply(null, this.array)
            };
            n.title = "browser";
            n.browser = true;
            n.env = {};
            n.argv = [];
            n.version = "";
            n.versions = {};

            function l() {}
            n.on = l;
            n.addListener = l;
            n.once = l;
            n.off = l;
            n.removeListener = l;
            n.removeAllListeners = l;
            n.emit = l;
            n.binding = function(e) {
                throw new Error("process.binding is not supported")
            };
            n.cwd = function() {
                return "/"
            };
            n.chdir = function(e) {
                throw new Error("process.chdir is not supported")
            };
            n.umask = function() {
                return 0
            }
        }, {}],
        9: [function(e, t, r) {
            t.exports = e("./lib/_stream_duplex.js")
        }, {
            "./lib/_stream_duplex.js": 10
        }],
        10: [function(e, t, r) {
            (function(r) {
                t.exports = s;
                var n = Object.keys || function(e) {
                    var t = [];
                    for (var r in e) t.push(r);
                    return t
                };
                var i = e("core-util-is");
                i.inherits = e("inherits");
                var a = e("./_stream_readable");
                var o = e("./_stream_writable");
                i.inherits(s, a);
                u(n(o.prototype), function(e) {
                    if (!s.prototype[e]) s.prototype[e] = o.prototype[e]
                });

                function s(e) {
                    if (!(this instanceof s)) return new s(e);
                    a.call(this, e);
                    o.call(this, e);
                    if (e && e.readable === false) this.readable = false;
                    if (e && e.writable === false) this.writable = false;
                    this.allowHalfOpen = true;
                    if (e && e.allowHalfOpen === false) this.allowHalfOpen = false;
                    this.once("end", f)
                }

                function f() {
                    if (this.allowHalfOpen || this._writableState.ended) return;
                    r.nextTick(this.end.bind(this))
                }

                function u(e, t) {
                    for (var r = 0, n = e.length; r < n; r++) {
                        t(e[r], r)
                    }
                }
            }).call(this, e("_process"))
        }, {
            "./_stream_readable": 12,
            "./_stream_writable": 14,
            _process: 8,
            "core-util-is": 15,
            inherits: 27
        }],
        11: [function(e, t, r) {
            t.exports = a;
            var n = e("./_stream_transform");
            var i = e("core-util-is");
            i.inherits = e("inherits");
            i.inherits(a, n);

            function a(e) {
                if (!(this instanceof a)) return new a(e);
                n.call(this, e)
            }
            a.prototype._transform = function(e, t, r) {
                r(null, e)
            }
        }, {
            "./_stream_transform": 13,
            "core-util-is": 15,
            inherits: 27
        }],
        12: [function(e, t, r) {
            (function(r) {
                t.exports = l;
                var n = e("isarray");
                var i = e("buffer").Buffer;
                l.ReadableState = c;
                var a = e("events").EventEmitter;
                if (!a.listenerCount) a.listenerCount = function(e, t) {
                    return e.listeners(t).length
                };
                var o = e("stream");
                var s = e("core-util-is");
                s.inherits = e("inherits");
                var f;
                var u = e("util");
                if (u && u.debuglog) {
                    u = u.debuglog("stream")
                } else {
                    u = function() {}
                }
                s.inherits(l, o);

                function c(t, r) {
                    var n = e("./_stream_duplex");
                    t = t || {};
                    var i = t.highWaterMark;
                    var a = t.objectMode ? 16 : 16 * 1024;
                    this.highWaterMark = i || i === 0 ? i : a;
                    this.highWaterMark = ~~this.highWaterMark;
                    this.buffer = [];
                    this.length = 0;
                    this.pipes = null;
                    this.pipesCount = 0;
                    this.flowing = null;
                    this.ended = false;
                    this.endEmitted = false;
                    this.reading = false;
                    this.sync = true;
                    this.needReadable = false;
                    this.emittedReadable = false;
                    this.readableListening = false;
                    this.objectMode = !!t.objectMode;
                    if (r instanceof n) this.objectMode = this.objectMode || !!t.readableObjectMode;
                    this.defaultEncoding = t.defaultEncoding || "utf8";
                    this.ranOut = false;
                    this.awaitDrain = 0;
                    this.readingMore = false;
                    this.decoder = null;
                    this.encoding = null;
                    if (t.encoding) {
                        if (!f) f = e("string_decoder/").StringDecoder;
                        this.decoder = new f(t.encoding);
                        this.encoding = t.encoding
                    }
                }

                function l(t) {
                    var r = e("./_stream_duplex");
                    if (!(this instanceof l)) return new l(t);
                    this._readableState = new c(t, this);
                    this.readable = true;
                    o.call(this)
                }
                l.prototype.push = function(e, t) {
                    var r = this._readableState;
                    if (s.isString(e) && !r.objectMode) {
                        t = t || r.defaultEncoding;
                        if (t !== r.encoding) {
                            e = new i(e, t);
                            t = ""
                        }
                    }
                    return h(this, r, e, t, false)
                };
                l.prototype.unshift = function(e) {
                    var t = this._readableState;
                    return h(this, t, e, "", true)
                };

                function h(e, t, r, n, i) {
                    var a = m(t, r);
                    if (a) {
                        e.emit("error", a)
                    } else if (s.isNullOrUndefined(r)) {
                        t.reading = false;
                        if (!t.ended) b(e, t)
                    } else if (t.objectMode || r && r.length > 0) {
                        if (t.ended && !i) {
                            var o = new Error("stream.push() after EOF");
                            e.emit("error", o)
                        } else if (t.endEmitted && i) {
                            var o = new Error("stream.unshift() after end event");
                            e.emit("error", o)
                        } else {
                            if (t.decoder && !i && !n) r = t.decoder.write(r);
                            if (!i) t.reading = false;
                            if (t.flowing && t.length === 0 && !t.sync) {
                                e.emit("data", r);
                                e.read(0)
                            } else {
                                t.length += t.objectMode ? 1 : r.length;
                                if (i) t.buffer.unshift(r);
                                else t.buffer.push(r);
                                if (t.needReadable) y(e)
                            }
                            _(e, t)
                        }
                    } else if (!i) {
                        t.reading = false
                    }
                    return d(t)
                }

                function d(e) {
                    return !e.ended && (e.needReadable || e.length < e.highWaterMark || e.length === 0)
                }
                l.prototype.setEncoding = function(t) {
                    if (!f) f = e("string_decoder/").StringDecoder;
                    this._readableState.decoder = new f(t);
                    this._readableState.encoding = t;
                    return this
                };
                var p = 8388608;

                function g(e) {
                    if (e >= p) {
                        e = p
                    } else {
                        e--;
                        for (var t = 1; t < 32; t <<= 1) e |= e >> t;
                        e++
                    }
                    return e
                }

                function v(e, t) {
                    if (t.length === 0 && t.ended) return 0;
                    if (t.objectMode) return e === 0 ? 0 : 1;
                    if (isNaN(e) || s.isNull(e)) {
                        if (t.flowing && t.buffer.length) return t.buffer[0].length;
                        else return t.length
                    }
                    if (e <= 0) return 0;
                    if (e > t.highWaterMark) t.highWaterMark = g(e);
                    if (e > t.length) {
                        if (!t.ended) {
                            t.needReadable = true;
                            return 0
                        } else return t.length
                    }
                    return e
                }
                l.prototype.read = function(e) {
                    u("read", e);
                    var t = this._readableState;
                    var r = e;
                    if (!s.isNumber(e) || e > 0) t.emittedReadable = false;
                    if (e === 0 && t.needReadable && (t.length >= t.highWaterMark || t.ended)) {
                        u("read: emitReadable", t.length, t.ended);
                        if (t.length === 0 && t.ended) I(this);
                        else y(this);
                        return null
                    }
                    e = v(e, t);
                    if (e === 0 && t.ended) {
                        if (t.length === 0) I(this);
                        return null
                    }
                    var n = t.needReadable;
                    u("need readable", n);
                    if (t.length === 0 || t.length - e < t.highWaterMark) {
                        n = true;
                        u("length less than watermark", n)
                    }
                    if (t.ended || t.reading) {
                        n = false;
                        u("reading or ended", n)
                    }
                    if (n) {
                        u("do read");
                        t.reading = true;
                        t.sync = true;
                        if (t.length === 0) t.needReadable = true;
                        this._read(t.highWaterMark);
                        t.sync = false
                    }
                    if (n && !t.reading) e = v(r, t);
                    var i;
                    if (e > 0) i = L(e, t);
                    else i = null;
                    if (s.isNull(i)) {
                        t.needReadable = true;
                        e = 0
                    }
                    t.length -= e;
                    if (t.length === 0 && !t.ended) t.needReadable = true;
                    if (r !== e && t.ended && t.length === 0) I(this);
                    if (!s.isNull(i)) this.emit("data", i);
                    return i
                };

                function m(e, t) {
                    var r = null;
                    if (!s.isBuffer(t) && !s.isString(t) && !s.isNullOrUndefined(t) && !e.objectMode) {
                        r = new TypeError("Invalid non-string/buffer chunk")
                    }
                    return r
                }

                function b(e, t) {
                    if (t.decoder && !t.ended) {
                        var r = t.decoder.end();
                        if (r && r.length) {
                            t.buffer.push(r);
                            t.length += t.objectMode ? 1 : r.length
                        }
                    }
                    t.ended = true;
                    y(e)
                }

                function y(e) {
                    var t = e._readableState;
                    t.needReadable = false;
                    if (!t.emittedReadable) {
                        u("emitReadable", t.flowing);
                        t.emittedReadable = true;
                        if (t.sync) r.nextTick(function() {
                            w(e)
                        });
                        else w(e)
                    }
                }

                function w(e) {
                    u("emit readable");
                    e.emit("readable");
                    C(e)
                }

                function _(e, t) {
                    if (!t.readingMore) {
                        t.readingMore = true;
                        r.nextTick(function() {
                            E(e, t)
                        })
                    }
                }

                function E(e, t) {
                    var r = t.length;
                    while (!t.reading && !t.flowing && !t.ended && t.length < t.highWaterMark) {
                        u("maybeReadMore read 0");
                        e.read(0);
                        if (r === t.length) break;
                        else r = t.length
                    }
                    t.readingMore = false
                }
                l.prototype._read = function(e) {
                    this.emit("error", new Error("not implemented"))
                };
                l.prototype.pipe = function(e, t) {
                    var i = this;
                    var o = this._readableState;
                    switch (o.pipesCount) {
                        case 0:
                            o.pipes = e;
                            break;
                        case 1:
                            o.pipes = [o.pipes, e];
                            break;
                        default:
                            o.pipes.push(e);
                            break
                    }
                    o.pipesCount += 1;
                    u("pipe count=%d opts=%j", o.pipesCount, t);
                    var s = (!t || t.end !== false) && e !== r.stdout && e !== r.stderr;
                    var f = s ? l : d;
                    if (o.endEmitted) r.nextTick(f);
                    else i.once("end", f);
                    e.on("unpipe", c);

                    function c(e) {
                        u("onunpipe");
                        if (e === i) {
                            d()
                        }
                    }

                    function l() {
                        u("onend");
                        e.end()
                    }
                    var h = A(i);
                    e.on("drain", h);

                    function d() {
                        u("cleanup");
                        e.removeListener("close", v);
                        e.removeListener("finish", m);
                        e.removeListener("drain", h);
                        e.removeListener("error", g);
                        e.removeListener("unpipe", c);
                        i.removeListener("end", l);
                        i.removeListener("end", d);
                        i.removeListener("data", p);
                        if (o.awaitDrain && (!e._writableState || e._writableState.needDrain)) h()
                    }
                    i.on("data", p);

                    function p(t) {
                        u("ondata");
                        var r = e.write(t);
                        if (false === r) {
                            u("false write response, pause", i._readableState.awaitDrain);
                            i._readableState.awaitDrain++;
                            i.pause()
                        }
                    }

                    function g(t) {
                        u("onerror", t);
                        b();
                        e.removeListener("error", g);
                        if (a.listenerCount(e, "error") === 0) e.emit("error", t)
                    }
                    if (!e._events || !e._events.error) e.on("error", g);
                    else if (n(e._events.error)) e._events.error.unshift(g);
                    else e._events.error = [g, e._events.error];

                    function v() {
                        e.removeListener("finish", m);
                        b()
                    }
                    e.once("close", v);

                    function m() {
                        u("onfinish");
                        e.removeListener("close", v);
                        b()
                    }
                    e.once("finish", m);

                    function b() {
                        u("unpipe");
                        i.unpipe(e)
                    }
                    e.emit("pipe", i);
                    if (!o.flowing) {
                        u("pipe resume");
                        i.resume()
                    }
                    return e
                };

                function A(e) {
                    return function() {
                        var t = e._readableState;
                        u("pipeOnDrain", t.awaitDrain);
                        if (t.awaitDrain) t.awaitDrain--;
                        if (t.awaitDrain === 0 && a.listenerCount(e, "data")) {
                            t.flowing = true;
                            C(e)
                        }
                    }
                }
                l.prototype.unpipe = function(e) {
                    var t = this._readableState;
                    if (t.pipesCount === 0) return this;
                    if (t.pipesCount === 1) {
                        if (e && e !== t.pipes) return this;
                        if (!e) e = t.pipes;
                        t.pipes = null;
                        t.pipesCount = 0;
                        t.flowing = false;
                        if (e) e.emit("unpipe", this);
                        return this
                    }
                    if (!e) {
                        var r = t.pipes;
                        var n = t.pipesCount;
                        t.pipes = null;
                        t.pipesCount = 0;
                        t.flowing = false;
                        for (var i = 0; i < n; i++) r[i].emit("unpipe", this);
                        return this
                    }
                    var i = k(t.pipes, e);
                    if (i === -1) return this;
                    t.pipes.splice(i, 1);
                    t.pipesCount -= 1;
                    if (t.pipesCount === 1) t.pipes = t.pipes[0];
                    e.emit("unpipe", this);
                    return this
                };
                l.prototype.on = function(e, t) {
                    var n = o.prototype.on.call(this, e, t);
                    if (e === "data" && false !== this._readableState.flowing) {
                        this.resume()
                    }
                    if (e === "readable" && this.readable) {
                        var i = this._readableState;
                        if (!i.readableListening) {
                            i.readableListening = true;
                            i.emittedReadable = false;
                            i.needReadable = true;
                            if (!i.reading) {
                                var a = this;
                                r.nextTick(function() {
                                    u("readable nexttick read 0");
                                    a.read(0)
                                })
                            } else if (i.length) {
                                y(this, i)
                            }
                        }
                    }
                    return n
                };
                l.prototype.addListener = l.prototype.on;
                l.prototype.resume = function() {
                    var e = this._readableState;
                    if (!e.flowing) {
                        u("resume");
                        e.flowing = true;
                        if (!e.reading) {
                            u("resume read 0");
                            this.read(0)
                        }
                        S(this, e)
                    }
                    return this
                };

                function S(e, t) {
                    if (!t.resumeScheduled) {
                        t.resumeScheduled = true;
                        r.nextTick(function() {
                            R(e, t)
                        })
                    }
                }

                function R(e, t) {
                    t.resumeScheduled = false;
                    e.emit("resume");
                    C(e);
                    if (t.flowing && !t.reading) e.read(0)
                }
                l.prototype.pause = function() {
                    u("call pause flowing=%j", this._readableState.flowing);
                    if (false !== this._readableState.flowing) {
                        u("pause");
                        this._readableState.flowing = false;
                        this.emit("pause")
                    }
                    return this
                };

                function C(e) {
                    var t = e._readableState;
                    u("flow", t.flowing);
                    if (t.flowing) {
                        do {
                            var r = e.read()
                        } while (null !== r && t.flowing)
                    }
                }
                l.prototype.wrap = function(e) {
                    var t = this._readableState;
                    var r = false;
                    var n = this;
                    e.on("end", function() {
                        u("wrapped end");
                        if (t.decoder && !t.ended) {
                            var e = t.decoder.end();
                            if (e && e.length) n.push(e)
                        }
                        n.push(null)
                    });
                    e.on("data", function(i) {
                        u("wrapped data");
                        if (t.decoder) i = t.decoder.write(i);
                        if (!i || !t.objectMode && !i.length) return;
                        var a = n.push(i);
                        if (!a) {
                            r = true;
                            e.pause()
                        }
                    });
                    for (var i in e) {
                        if (s.isFunction(e[i]) && s.isUndefined(this[i])) {
                            this[i] = function(t) {
                                return function() {
                                    return e[t].apply(e, arguments)
                                }
                            }(i)
                        }
                    }
                    var a = ["error", "close", "destroy", "pause", "resume"];
                    T(a, function(t) {
                        e.on(t, n.emit.bind(n, t))
                    });
                    n._read = function(t) {
                        u("wrapped _read", t);
                        if (r) {
                            r = false;
                            e.resume()
                        }
                    };
                    return n
                };
                l._fromList = L;

                function L(e, t) {
                    var r = t.buffer;
                    var n = t.length;
                    var a = !!t.decoder;
                    var o = !!t.objectMode;
                    var s;
                    if (r.length === 0) return null;
                    if (n === 0) s = null;
                    else if (o) s = r.shift();
                    else if (!e || e >= n) {
                        if (a) s = r.join("");
                        else s = i.concat(r, n);
                        r.length = 0
                    } else {
                        if (e < r[0].length) {
                            var f = r[0];
                            s = f.slice(0, e);
                            r[0] = f.slice(e)
                        } else if (e === r[0].length) {
                            s = r.shift()
                        } else {
                            if (a) s = "";
                            else s = new i(e);
                            var u = 0;
                            for (var c = 0, l = r.length; c < l && u < e; c++) {
                                var f = r[0];
                                var h = Math.min(e - u, f.length);
                                if (a) s += f.slice(0, h);
                                else f.copy(s, u, 0, h);
                                if (h < f.length) r[0] = f.slice(h);
                                else r.shift();
                                u += h
                            }
                        }
                    }
                    return s
                }

                function I(e) {
                    var t = e._readableState;
                    if (t.length > 0) throw new Error("endReadable called on non-empty stream");
                    if (!t.endEmitted) {
                        t.ended = true;
                        r.nextTick(function() {
                            if (!t.endEmitted && t.length === 0) {
                                t.endEmitted = true;
                                e.readable = false;
                                e.emit("end")
                            }
                        })
                    }
                }

                function T(e, t) {
                    for (var r = 0, n = e.length; r < n; r++) {
                        t(e[r], r)
                    }
                }

                function k(e, t) {
                    for (var r = 0, n = e.length; r < n; r++) {
                        if (e[r] === t) return r
                    }
                    return -1
                }
            }).call(this, e("_process"))
        }, {
            "./_stream_duplex": 10,
            _process: 8,
            buffer: 2,
            "core-util-is": 15,
            events: 6,
            inherits: 27,
            isarray: 7,
            stream: 20,
            "string_decoder/": 21,
            util: 1
        }],
        13: [function(e, t, r) {
            t.exports = s;
            var n = e("./_stream_duplex");
            var i = e("core-util-is");
            i.inherits = e("inherits");
            i.inherits(s, n);

            function a(e, t) {
                this.afterTransform = function(e, r) {
                    return o(t, e, r)
                };
                this.needTransform = false;
                this.transforming = false;
                this.writecb = null;
                this.writechunk = null
            }

            function o(e, t, r) {
                var n = e._transformState;
                n.transforming = false;
                var a = n.writecb;
                if (!a) return e.emit("error", new Error("no writecb in Transform class"));
                n.writechunk = null;
                n.writecb = null;
                if (!i.isNullOrUndefined(r)) e.push(r);
                if (a) a(t);
                var o = e._readableState;
                o.reading = false;
                if (o.needReadable || o.length < o.highWaterMark) {
                    e._read(o.highWaterMark)
                }
            }

            function s(e) {
                if (!(this instanceof s)) return new s(e);
                n.call(this, e);
                this._transformState = new a(e, this);
                var t = this;
                this._readableState.needReadable = true;
                this._readableState.sync = false;
                this.once("prefinish", function() {
                    if (i.isFunction(this._flush)) this._flush(function(e) {
                        f(t, e)
                    });
                    else f(t)
                })
            }
            s.prototype.push = function(e, t) {
                this._transformState.needTransform = false;
                return n.prototype.push.call(this, e, t)
            };
            s.prototype._transform = function(e, t, r) {
                throw new Error("not implemented")
            };
            s.prototype._write = function(e, t, r) {
                var n = this._transformState;
                n.writecb = r;
                n.writechunk = e;
                n.writeencoding = t;
                if (!n.transforming) {
                    var i = this._readableState;
                    if (n.needTransform || i.needReadable || i.length < i.highWaterMark) this._read(i.highWaterMark)
                }
            };
            s.prototype._read = function(e) {
                var t = this._transformState;
                if (!i.isNull(t.writechunk) && t.writecb && !t.transforming) {
                    t.transforming = true;
                    this._transform(t.writechunk, t.writeencoding, t.afterTransform)
                } else {
                    t.needTransform = true
                }
            };

            function f(e, t) {
                if (t) return e.emit("error", t);
                var r = e._writableState;
                var n = e._transformState;
                if (r.length) throw new Error("calling transform done when ws.length != 0");
                if (n.transforming) throw new Error("calling transform done when still transforming");
                return e.push(null)
            }
        }, {
            "./_stream_duplex": 10,
            "core-util-is": 15,
            inherits: 27
        }],
        14: [function(e, t, r) {
            (function(r) {
                t.exports = f;
                var n = e("buffer").Buffer;
                f.WritableState = s;
                var i = e("core-util-is");
                i.inherits = e("inherits");
                var a = e("stream");
                i.inherits(f, a);

                function o(e, t, r) {
                    this.chunk = e;
                    this.encoding = t;
                    this.callback = r
                }

                function s(t, r) {
                    var n = e("./_stream_duplex");
                    t = t || {};
                    var i = t.highWaterMark;
                    var a = t.objectMode ? 16 : 16 * 1024;
                    this.highWaterMark = i || i === 0 ? i : a;
                    this.objectMode = !!t.objectMode;
                    if (r instanceof n) this.objectMode = this.objectMode || !!t.writableObjectMode;
                    this.highWaterMark = ~~this.highWaterMark;
                    this.needDrain = false;
                    this.ending = false;
                    this.ended = false;
                    this.finished = false;
                    var o = t.decodeStrings === false;
                    this.decodeStrings = !o;
                    this.defaultEncoding = t.defaultEncoding || "utf8";
                    this.length = 0;
                    this.writing = false;
                    this.corked = 0;
                    this.sync = true;
                    this.bufferProcessing = false;
                    this.onwrite = function(e) {
                        v(r, e)
                    };
                    this.writecb = null;
                    this.writelen = 0;
                    this.buffer = [];
                    this.pendingcb = 0;
                    this.prefinished = false;
                    this.errorEmitted = false
                }

                function f(t) {
                    var r = e("./_stream_duplex");
                    if (!(this instanceof f) && !(this instanceof r)) return new f(t);
                    this._writableState = new s(t, this);
                    this.writable = true;
                    a.call(this)
                }
                f.prototype.pipe = function() {
                    this.emit("error", new Error("Cannot pipe. Not readable."))
                };

                function u(e, t, n) {
                    var i = new Error("write after end");
                    e.emit("error", i);
                    r.nextTick(function() {
                        n(i)
                    })
                }

                function c(e, t, n, a) {
                    var o = true;
                    if (!i.isBuffer(n) && !i.isString(n) && !i.isNullOrUndefined(n) && !t.objectMode) {
                        var s = new TypeError("Invalid non-string/buffer chunk");
                        e.emit("error", s);
                        r.nextTick(function() {
                            a(s)
                        });
                        o = false
                    }
                    return o
                }
                f.prototype.write = function(e, t, r) {
                    var n = this._writableState;
                    var a = false;
                    if (i.isFunction(t)) {
                        r = t;
                        t = null
                    }
                    if (i.isBuffer(e)) t = "buffer";
                    else if (!t) t = n.defaultEncoding;
                    if (!i.isFunction(r)) r = function() {};
                    if (n.ended) u(this, n, r);
                    else if (c(this, n, e, r)) {
                        n.pendingcb++;
                        a = h(this, n, e, t, r)
                    }
                    return a
                };
                f.prototype.cork = function() {
                    var e = this._writableState;
                    e.corked++
                };
                f.prototype.uncork = function() {
                    var e = this._writableState;
                    if (e.corked) {
                        e.corked--;
                        if (!e.writing && !e.corked && !e.finished && !e.bufferProcessing && e.buffer.length) y(this, e)
                    }
                };

                function l(e, t, r) {
                    if (!e.objectMode && e.decodeStrings !== false && i.isString(t)) {
                        t = new n(t, r)
                    }
                    return t
                }

                function h(e, t, r, n, a) {
                    r = l(t, r, n);
                    if (i.isBuffer(r)) n = "buffer";
                    var s = t.objectMode ? 1 : r.length;
                    t.length += s;
                    var f = t.length < t.highWaterMark;
                    if (!f) t.needDrain = true;
                    if (t.writing || t.corked) t.buffer.push(new o(r, n, a));
                    else d(e, t, false, s, r, n, a);
                    return f
                }

                function d(e, t, r, n, i, a, o) {
                    t.writelen = n;
                    t.writecb = o;
                    t.writing = true;
                    t.sync = true;
                    if (r) e._writev(i, t.onwrite);
                    else e._write(i, a, t.onwrite);
                    t.sync = false
                }

                function p(e, t, n, i, a) {
                    if (n) r.nextTick(function() {
                        t.pendingcb--;
                        a(i)
                    });
                    else {
                        t.pendingcb--;
                        a(i)
                    }
                    e._writableState.errorEmitted = true;
                    e.emit("error", i)
                }

                function g(e) {
                    e.writing = false;
                    e.writecb = null;
                    e.length -= e.writelen;
                    e.writelen = 0
                }

                function v(e, t) {
                    var n = e._writableState;
                    var i = n.sync;
                    var a = n.writecb;
                    g(n);
                    if (t) p(e, n, i, t, a);
                    else {
                        var o = w(e, n);
                        if (!o && !n.corked && !n.bufferProcessing && n.buffer.length) {
                            y(e, n)
                        }
                        if (i) {
                            r.nextTick(function() {
                                m(e, n, o, a)
                            })
                        } else {
                            m(e, n, o, a)
                        }
                    }
                }

                function m(e, t, r, n) {
                    if (!r) b(e, t);
                    t.pendingcb--;
                    n();
                    E(e, t)
                }

                function b(e, t) {
                    if (t.length === 0 && t.needDrain) {
                        t.needDrain = false;
                        e.emit("drain")
                    }
                }

                function y(e, t) {
                    t.bufferProcessing = true;
                    if (e._writev && t.buffer.length > 1) {
                        var r = [];
                        for (var n = 0; n < t.buffer.length; n++) r.push(t.buffer[n].callback);
                        t.pendingcb++;
                        d(e, t, true, t.length, t.buffer, "", function(e) {
                            for (var n = 0; n < r.length; n++) {
                                t.pendingcb--;
                                r[n](e)
                            }
                        });
                        t.buffer = []
                    } else {
                        for (var n = 0; n < t.buffer.length; n++) {
                            var i = t.buffer[n];
                            var a = i.chunk;
                            var o = i.encoding;
                            var s = i.callback;
                            var f = t.objectMode ? 1 : a.length;
                            d(e, t, false, f, a, o, s);
                            if (t.writing) {
                                n++;
                                break
                            }
                        }
                        if (n < t.buffer.length) t.buffer = t.buffer.slice(n);
                        else t.buffer.length = 0
                    }
                    t.bufferProcessing = false
                }
                f.prototype._write = function(e, t, r) {
                    r(new Error("not implemented"))
                };
                f.prototype._writev = null;
                f.prototype.end = function(e, t, r) {
                    var n = this._writableState;
                    if (i.isFunction(e)) {
                        r = e;
                        e = null;
                        t = null
                    } else if (i.isFunction(t)) {
                        r = t;
                        t = null
                    }
                    if (!i.isNullOrUndefined(e)) this.write(e, t);
                    if (n.corked) {
                        n.corked = 1;
                        this.uncork()
                    }
                    if (!n.ending && !n.finished) A(this, n, r)
                };

                function w(e, t) {
                    return t.ending && t.length === 0 && !t.finished && !t.writing
                }

                function _(e, t) {
                    if (!t.prefinished) {
                        t.prefinished = true;
                        e.emit("prefinish")
                    }
                }

                function E(e, t) {
                    var r = w(e, t);
                    if (r) {
                        if (t.pendingcb === 0) {
                            _(e, t);
                            t.finished = true;
                            e.emit("finish")
                        } else _(e, t)
                    }
                    return r
                }

                function A(e, t, n) {
                    t.ending = true;
                    E(e, t);
                    if (n) {
                        if (t.finished) r.nextTick(n);
                        else e.once("finish", n)
                    }
                    t.ended = true
                }
            }).call(this, e("_process"))
        }, {
            "./_stream_duplex": 10,
            _process: 8,
            buffer: 2,
            "core-util-is": 15,
            inherits: 27,
            stream: 20
        }],
        15: [function(e, t, r) {
            (function(e) {
                function t(e) {
                    return Array.isArray(e)
                }
                r.isArray = t;

                function n(e) {
                    return typeof e === "boolean"
                }
                r.isBoolean = n;

                function i(e) {
                    return e === null
                }
                r.isNull = i;

                function a(e) {
                    return e == null
                }
                r.isNullOrUndefined = a;

                function o(e) {
                    return typeof e === "number"
                }
                r.isNumber = o;

                function s(e) {
                    return typeof e === "string"
                }
                r.isString = s;

                function f(e) {
                    return typeof e === "symbol"
                }
                r.isSymbol = f;

                function u(e) {
                    return e === void 0
                }
                r.isUndefined = u;

                function c(e) {
                    return l(e) && m(e) === "[object RegExp]"
                }
                r.isRegExp = c;

                function l(e) {
                    return typeof e === "object" && e !== null
                }
                r.isObject = l;

                function h(e) {
                    return l(e) && m(e) === "[object Date]"
                }
                r.isDate = h;

                function d(e) {
                    return l(e) && (m(e) === "[object Error]" || e instanceof Error)
                }
                r.isError = d;

                function p(e) {
                    return typeof e === "function"
                }
                r.isFunction = p;

                function g(e) {
                    return e === null || typeof e === "boolean" || typeof e === "number" || typeof e === "string" || typeof e === "symbol" || typeof e === "undefined"
                }
                r.isPrimitive = g;

                function v(t) {
                    return e.isBuffer(t)
                }
                r.isBuffer = v;

                function m(e) {
                    return Object.prototype.toString.call(e)
                }
            }).call(this, e("buffer").Buffer)
        }, {
            buffer: 2
        }],
        16: [function(e, t, r) {
            t.exports = e("./lib/_stream_passthrough.js")
        }, {
            "./lib/_stream_passthrough.js": 11
        }],
        17: [function(e, t, r) {
            r = t.exports = e("./lib/_stream_readable.js");
            r.Stream = e("stream");
            r.Readable = r;
            r.Writable = e("./lib/_stream_writable.js");
            r.Duplex = e("./lib/_stream_duplex.js");
            r.Transform = e("./lib/_stream_transform.js");
            r.PassThrough = e("./lib/_stream_passthrough.js")
        }, {
            "./lib/_stream_duplex.js": 10,
            "./lib/_stream_passthrough.js": 11,
            "./lib/_stream_readable.js": 12,
            "./lib/_stream_transform.js": 13,
            "./lib/_stream_writable.js": 14,
            stream: 20
        }],
        18: [function(e, t, r) {
            t.exports = e("./lib/_stream_transform.js")
        }, {
            "./lib/_stream_transform.js": 13
        }],
        19: [function(e, t, r) {
            t.exports = e("./lib/_stream_writable.js")
        }, {
            "./lib/_stream_writable.js": 14
        }],
        20: [function(e, t, r) {
            t.exports = a;
            var n = e("events").EventEmitter;
            var i = e("inherits");
            i(a, n);
            a.Readable = e("readable-stream/readable.js");
            a.Writable = e("readable-stream/writable.js");
            a.Duplex = e("readable-stream/duplex.js");
            a.Transform = e("readable-stream/transform.js");
            a.PassThrough = e("readable-stream/passthrough.js");
            a.Stream = a;

            function a() {
                n.call(this)
            }
            a.prototype.pipe = function(e, t) {
                var r = this;

                function i(t) {
                    if (e.writable) {
                        if (false === e.write(t) && r.pause) {
                            r.pause()
                        }
                    }
                }
                r.on("data", i);

                function a() {
                    if (r.readable && r.resume) {
                        r.resume()
                    }
                }
                e.on("drain", a);
                if (!e._isStdio && (!t || t.end !== false)) {
                    r.on("end", s);
                    r.on("close", f)
                }
                var o = false;

                function s() {
                    if (o) return;
                    o = true;
                    e.end()
                }

                function f() {
                    if (o) return;
                    o = true;
                    if (typeof e.destroy === "function") e.destroy()
                }

                function u(e) {
                    c();
                    if (n.listenerCount(this, "error") === 0) {
                        throw e
                    }
                }
                r.on("error", u);
                e.on("error", u);

                function c() {
                    r.removeListener("data", i);
                    e.removeListener("drain", a);
                    r.removeListener("end", s);
                    r.removeListener("close", f);
                    r.removeListener("error", u);
                    e.removeListener("error", u);
                    r.removeListener("end", c);
                    r.removeListener("close", c);
                    e.removeListener("close", c)
                }
                r.on("end", c);
                r.on("close", c);
                e.on("close", c);
                e.emit("pipe", r);
                return e
            }
        }, {
            events: 6,
            inherits: 27,
            "readable-stream/duplex.js": 9,
            "readable-stream/passthrough.js": 16,
            "readable-stream/readable.js": 17,
            "readable-stream/transform.js": 18,
            "readable-stream/writable.js": 19
        }],
        21: [function(e, t, r) {
            var n = e("buffer").Buffer;
            var i = n.isEncoding || function(e) {
                switch (e && e.toLowerCase()) {
                    case "hex":
                    case "utf8":
                    case "utf-8":
                    case "ascii":
                    case "binary":
                    case "base64":
                    case "ucs2":
                    case "ucs-2":
                    case "utf16le":
                    case "utf-16le":
                    case "raw":
                        return true;
                    default:
                        return false
                }
            };

            function a(e) {
                if (e && !i(e)) {
                    throw new Error("Unknown encoding: " + e)
                }
            }
            var o = r.StringDecoder = function(e) {
                this.encoding = (e || "utf8").toLowerCase().replace(/[-_]/, "");
                a(e);
                switch (this.encoding) {
                    case "utf8":
                        this.surrogateSize = 3;
                        break;
                    case "ucs2":
                    case "utf16le":
                        this.surrogateSize = 2;
                        this.detectIncompleteChar = f;
                        break;
                    case "base64":
                        this.surrogateSize = 3;
                        this.detectIncompleteChar = u;
                        break;
                    default:
                        this.write = s;
                        return
                }
                this.charBuffer = new n(6);
                this.charReceived = 0;
                this.charLength = 0
            };
            o.prototype.write = function(e) {
                var t = "";
                while (this.charLength) {
                    var r = e.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : e.length;
                    e.copy(this.charBuffer, this.charReceived, 0, r);
                    this.charReceived += r;
                    if (this.charReceived < this.charLength) {
                        return ""
                    }
                    e = e.slice(r, e.length);
                    t = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
                    var n = t.charCodeAt(t.length - 1);
                    if (n >= 55296 && n <= 56319) {
                        this.charLength += this.surrogateSize;
                        t = "";
                        continue
                    }
                    this.charReceived = this.charLength = 0;
                    if (e.length === 0) {
                        return t
                    }
                    break
                }
                this.detectIncompleteChar(e);
                var i = e.length;
                if (this.charLength) {
                    e.copy(this.charBuffer, 0, e.length - this.charReceived, i);
                    i -= this.charReceived
                }
                t += e.toString(this.encoding, 0, i);
                var i = t.length - 1;
                var n = t.charCodeAt(i);
                if (n >= 55296 && n <= 56319) {
                    var a = this.surrogateSize;
                    this.charLength += a;
                    this.charReceived += a;
                    this.charBuffer.copy(this.charBuffer, a, 0, a);
                    e.copy(this.charBuffer, 0, 0, a);
                    return t.substring(0, i)
                }
                return t
            };
            o.prototype.detectIncompleteChar = function(e) {
                var t = e.length >= 3 ? 3 : e.length;
                for (; t > 0; t--) {
                    var r = e[e.length - t];
                    if (t == 1 && r >> 5 == 6) {
                        this.charLength = 2;
                        break
                    }
                    if (t <= 2 && r >> 4 == 14) {
                        this.charLength = 3;
                        break
                    }
                    if (t <= 3 && r >> 3 == 30) {
                        this.charLength = 4;
                        break
                    }
                }
                this.charReceived = t
            };
            o.prototype.end = function(e) {
                var t = "";
                if (e && e.length) t = this.write(e);
                if (this.charReceived) {
                    var r = this.charReceived;
                    var n = this.charBuffer;
                    var i = this.encoding;
                    t += n.slice(0, r).toString(i)
                }
                return t
            };

            function s(e) {
                return e.toString(this.encoding)
            }

            function f(e) {
                this.charReceived = e.length % 2;
                this.charLength = this.charReceived ? 2 : 0
            }

            function u(e) {
                this.charReceived = e.length % 3;
                this.charLength = this.charReceived ? 3 : 0
            }
        }, {
            buffer: 2
        }],
        22: [function(e, t, r) {
            r = t.exports = e("./debug");
            r.log = a;
            r.formatArgs = i;
            r.save = o;
            r.load = s;
            r.useColors = n;
            r.storage = "undefined" != typeof chrome && "undefined" != typeof chrome.storage ? chrome.storage.local : f();
            r.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"];

            function n() {
                return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
            }
            r.formatters.j = function(e) {
                return JSON.stringify(e)
            };

            function i() {
                var e = arguments;
                var t = this.useColors;
                e[0] = (t ? "%c" : "") + this.namespace + (t ? " %c" : " ") + e[0] + (t ? "%c " : " ") + "+" + r.humanize(this.diff);
                if (!t) return e;
                var n = "color: " + this.color;
                e = [e[0], n, "color: inherit"].concat(Array.prototype.slice.call(e, 1));
                var i = 0;
                var a = 0;
                e[0].replace(/%[a-z%]/g, function(e) {
                    if ("%%" === e) return;
                    i++;
                    if ("%c" === e) {
                        a = i
                    }
                });
                e.splice(a, 0, n);
                return e
            }

            function a() {
                return "object" === typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
            }

            function o(e) {
                try {
                    if (null == e) {
                        r.storage.removeItem("debug")
                    } else {
                        r.storage.debug = e
                    }
                } catch (t) {}
            }

            function s() {
                var e;
                try {
                    e = r.storage.debug
                } catch (t) {}
                return e
            }
            r.enable(s());

            function f() {
                try {
                    return window.localStorage
                } catch (e) {}
            }
        }, {
            "./debug": 23
        }],
        23: [function(e, t, r) {
            r = t.exports = o;
            r.coerce = c;
            r.disable = f;
            r.enable = s;
            r.enabled = u;
            r.humanize = e("ms");
            r.names = [];
            r.skips = [];
            r.formatters = {};
            var n = 0;
            var i;

            function a() {
                return r.colors[n++ % r.colors.length]
            }

            function o(e) {
                function t() {}
                t.enabled = false;

                function n() {
                    var e = n;
                    var t = +new Date;
                    var o = t - (i || t);
                    e.diff = o;
                    e.prev = i;
                    e.curr = t;
                    i = t;
                    if (null == e.useColors) e.useColors = r.useColors();
                    if (null == e.color && e.useColors) e.color = a();
                    var s = Array.prototype.slice.call(arguments);
                    s[0] = r.coerce(s[0]);
                    if ("string" !== typeof s[0]) {
                        s = ["%o"].concat(s)
                    }
                    var f = 0;
                    s[0] = s[0].replace(/%([a-z%])/g, function(t, n) {
                        if (t === "%%") return t;
                        f++;
                        var i = r.formatters[n];
                        if ("function" === typeof i) {
                            var a = s[f];
                            t = i.call(e, a);
                            s.splice(f, 1);
                            f--
                        }
                        return t
                    });
                    if ("function" === typeof r.formatArgs) {
                        s = r.formatArgs.apply(e, s)
                    }
                    var u = n.log || r.log || console.log.bind(console);
                    u.apply(e, s)
                }
                n.enabled = true;
                var o = r.enabled(e) ? n : t;
                o.namespace = e;
                return o
            }

            function s(e) {
                r.save(e);
                var t = (e || "").split(/[\s,]+/);
                var n = t.length;
                for (var i = 0; i < n; i++) {
                    if (!t[i]) continue;
                    e = t[i].replace(/\*/g, ".*?");
                    if (e[0] === "-") {
                        r.skips.push(new RegExp("^" + e.substr(1) + "$"))
                    } else {
                        r.names.push(new RegExp("^" + e + "$"))
                    }
                }
            }

            function f() {
                r.enable("")
            }

            function u(e) {
                var t, n;
                for (t = 0, n = r.skips.length; t < n; t++) {
                    if (r.skips[t].test(e)) {
                        return false
                    }
                }
                for (t = 0, n = r.names.length; t < n; t++) {
                    if (r.names[t].test(e)) {
                        return true
                    }
                }
                return false
            }

            function c(e) {
                if (e instanceof Error) return e.stack || e.message;
                return e
            }
        }, {
            ms: 24
        }],
        24: [function(e, t, r) {
            var n = 1e3;
            var i = n * 60;
            var a = i * 60;
            var o = a * 24;
            var s = o * 365.25;
            t.exports = function(e, t) {
                t = t || {};
                if ("string" == typeof e) return f(e);
                return t.long ? c(e) : u(e)
            };

            function f(e) {
                e = "" + e;
                if (e.length > 1e4) return;
                var t = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(e);
                if (!t) return;
                var r = parseFloat(t[1]);
                var f = (t[2] || "ms").toLowerCase();
                switch (f) {
                    case "years":
                    case "year":
                    case "yrs":
                    case "yr":
                    case "y":
                        return r * s;
                    case "days":
                    case "day":
                    case "d":
                        return r * o;
                    case "hours":
                    case "hour":
                    case "hrs":
                    case "hr":
                    case "h":
                        return r * a;
                    case "minutes":
                    case "minute":
                    case "mins":
                    case "min":
                    case "m":
                        return r * i;
                    case "seconds":
                    case "second":
                    case "secs":
                    case "sec":
                    case "s":
                        return r * n;
                    case "milliseconds":
                    case "millisecond":
                    case "msecs":
                    case "msec":
                    case "ms":
                        return r
                }
            }

            function u(e) {
                if (e >= o) return Math.round(e / o) + "d";
                if (e >= a) return Math.round(e / a) + "h";
                if (e >= i) return Math.round(e / i) + "m";
                if (e >= n) return Math.round(e / n) + "s";
                return e + "ms"
            }

            function c(e) {
                return l(e, o, "day") || l(e, a, "hour") || l(e, i, "minute") || l(e, n, "second") || e + " ms"
            }

            function l(e, t, r) {
                if (e < t) return;
                if (e < t * 1.5) return Math.floor(e / t) + " " + r;
                return Math.ceil(e / t) + " " + r + "s"
            }
        }, {}],
        25: [function(e, t, r) {
            t.exports = function n() {
                if (typeof window === "undefined") return null;
                var e = {
                    RTCPeerConnection: window.mozRTCPeerConnection || window.RTCPeerConnection || window.webkitRTCPeerConnection,
                    RTCSessionDescription: window.mozRTCSessionDescription || window.RTCSessionDescription || window.webkitRTCSessionDescription,
                    RTCIceCandidate: window.mozRTCIceCandidate || window.RTCIceCandidate || window.webkitRTCIceCandidate
                };
                if (!e.RTCPeerConnection) return null;
                return e
            }
        }, {}],
        26: [function(e, t, r) {
            var n = t.exports = function(e, t) {
                if (!t) t = 16;
                if (e === undefined) e = 128;
                if (e <= 0) return "0";
                var r = Math.log(Math.pow(2, e)) / Math.log(t);
                for (var i = 2; r === Infinity; i *= 2) {
                    r = Math.log(Math.pow(2, e / i)) / Math.log(t) * i
                }
                var a = r - Math.floor(r);
                var o = "";
                for (var i = 0; i < Math.floor(r); i++) {
                    var s = Math.floor(Math.random() * t).toString(t);
                    o = s + o
                }
                if (a) {
                    var f = Math.pow(t, a);
                    var s = Math.floor(Math.random() * f).toString(t);
                    o = s + o
                }
                var u = parseInt(o, t);
                if (u !== Infinity && u >= Math.pow(2, e)) {
                    return n(e, t)
                } else return o
            };
            n.rack = function(e, t, r) {
                var i = function(i) {
                    var o = 0;
                    do {
                        if (o++ > 10) {
                            if (r) e += r;
                            else throw new Error("too many ID collisions, use more bits")
                        }
                        var s = n(e, t)
                    } while (Object.hasOwnProperty.call(a, s));
                    a[s] = i;
                    return s
                };
                var a = i.hats = {};
                i.get = function(e) {
                    return i.hats[e]
                };
                i.set = function(e, t) {
                    i.hats[e] = t;
                    return i
                };
                i.bits = e || 128;
                i.base = t || 16;
                return i
            }
        }, {}],
        27: [function(e, t, r) {
            if (typeof Object.create === "function") {
                t.exports = function n(e, t) {
                    e.super_ = t;
                    e.prototype = Object.create(t.prototype, {
                        constructor: {
                            value: e,
                            enumerable: false,
                            writable: true,
                            configurable: true
                        }
                    })
                }
            } else {
                t.exports = function i(e, t) {
                    e.super_ = t;
                    var r = function() {};
                    r.prototype = t.prototype;
                    e.prototype = new r;
                    e.prototype.constructor = e
                }
            }
        }, {}],
        28: [function(e, t, r) {
            t.exports = a;
            a.strict = o;
            a.loose = s;
            var n = Object.prototype.toString;
            var i = {
                "[object Int8Array]": true,
                "[object Int16Array]": true,
                "[object Int32Array]": true,
                "[object Uint8Array]": true,
                "[object Uint8ClampedArray]": true,
                "[object Uint16Array]": true,
                "[object Uint32Array]": true,
                "[object Float32Array]": true,
                "[object Float64Array]": true
            };

            function a(e) {
                return o(e) || s(e)
            }

            function o(e) {
                return e instanceof Int8Array || e instanceof Int16Array || e instanceof Int32Array || e instanceof Uint8Array || e instanceof Uint8ClampedArray || e instanceof Uint16Array || e instanceof Uint32Array || e instanceof Float32Array || e instanceof Float64Array
            }

            function s(e) {
                return i[n.call(e)]
            }
        }, {}],
        29: [function(e, t, r) {
            t.exports = n;

            function n(e, t) {
                if (e && t) return n(e)(t);
                if (typeof e !== "function") throw new TypeError("need wrapper function");
                Object.keys(e).forEach(function(t) {
                    r[t] = e[t]
                });
                return r;

                function r() {
                    var t = new Array(arguments.length);
                    for (var r = 0; r < t.length; r++) {
                        t[r] = arguments[r]
                    }
                    var n = e.apply(this, t);
                    var i = t[t.length - 1];
                    if (typeof n === "function" && n !== i) {
                        Object.keys(i).forEach(function(e) {
                            n[e] = i[e]
                        })
                    }
                    return n
                }
            }
        }, {}],
        30: [function(e, t, r) {
            var n = e("wrappy");
            t.exports = n(i);
            i.proto = i(function() {
                Object.defineProperty(Function.prototype, "once", {
                    value: function() {
                        return i(this)
                    },
                    configurable: true
                })
            });

            function i(e) {
                var t = function() {
                    if (t.called) return t.value;
                    t.called = true;
                    return t.value = e.apply(this, arguments)
                };
                t.called = false;
                return t
            }
        }, {
            wrappy: 29
        }],
        31: [function(e, t, r) {
            (function(r) {
                var n = e("is-typedarray").strict;
                t.exports = function(e) {
                    var t = r.TYPED_ARRAY_SUPPORT ? r._augment : function(e) {
                        return new r(e)
                    };
                    if (e instanceof Uint8Array) {
                        return t(e)
                    } else if (e instanceof ArrayBuffer) {
                        return t(new Uint8Array(e))
                    } else if (n(e)) {
                        return t(new Uint8Array(e.buffer, e.byteOffset, e.byteLength))
                    } else {
                        return new r(e)
                    }
                }
            }).call(this, e("buffer").Buffer)
        }, {
            buffer: 2,
            "is-typedarray": 32
        }],
        32: [function(e, t, r) {
            arguments[4][28][0].apply(r, arguments)
        }, {
            dup: 28
        }],
        "/": [function(e, t, r) {
            (function(r) {
                t.exports = l;
                var n = e("debug")("simple-peer");
                var i = e("get-browser-rtc");
                var a = e("hat");
                var o = e("inherits");
                var s = e("is-typedarray");
                var f = e("once");
                var u = e("stream");
                var c = e("typedarray-to-buffer");
                o(l, u.Duplex);

                function l(e) {
                    var t = this;
                    if (!(t instanceof l)) return new l(e);
                    t._debug("new peer %o", e);
                    if (!e) e = {};
                    e.allowHalfOpen = false;
                    if (e.highWaterMark == null) e.highWaterMark = 1024 * 1024;
                    u.Duplex.call(t, e);
                    t.initiator = e.initiator || false;
                    t.channelConfig = e.channelConfig || l.channelConfig;
                    t.channelName = e.channelName || a(160);
                    if (!e.initiator) t.channelName = null;
                    t.config = e.config || l.config;
                    t.constraints = e.constraints || l.constraints;
                    t.reconnectTimer = e.reconnectTimer || 0;
                    t.sdpTransform = e.sdpTransform || function(e) {
                        return e
                    };
                    t.stream = e.stream || false;
                    t.trickle = e.trickle !== undefined ? e.trickle : true;
                    t.destroyed = false;
                    t.connected = false;
                    t.remoteAddress = undefined;
                    t.remoteFamily = undefined;
                    t.remotePort = undefined;
                    t.localAddress = undefined;
                    t.localPort = undefined;
                    t._wrtc = e.wrtc || i();
                    if (!t._wrtc) {
                        if (typeof window === "undefined") {
                            throw new Error("No WebRTC support: Specify `opts.wrtc` option in this environment")
                        } else {
                            throw new Error("No WebRTC support: Not a supported browser")
                        }
                    }
                    t._maxBufferedAmount = e.highWaterMark;
                    t._pcReady = false;
                    t._channelReady = false;
                    t._iceComplete = false;
                    t._channel = null;
                    t._pendingCandidates = [];
                    t._chunk = null;
                    t._cb = null;
                    t._interval = null;
                    t._reconnectTimeout = null;
                    t._pc = new t._wrtc.RTCPeerConnection(t.config, t.constraints);
                    t._pc.oniceconnectionstatechange = t._onIceConnectionStateChange.bind(t);
                    t._pc.onsignalingstatechange = t._onSignalingStateChange.bind(t);
                    t._pc.onicecandidate = t._onIceCandidate.bind(t);
                    if (t.stream) t._pc.addStream(t.stream);
                    t._pc.onaddstream = t._onAddStream.bind(t);
                    if (t.initiator) {
                        t._setupData({
                            channel: t._pc.createDataChannel(t.channelName, t.channelConfig)
                        });
                        t._pc.onnegotiationneeded = f(t._createOffer.bind(t));
                        if (typeof window === "undefined" || !window.webkitRTCPeerConnection) {
                            t._pc.onnegotiationneeded()
                        }
                    } else {
                        t._pc.ondatachannel = t._setupData.bind(t)
                    }
                    t.on("finish", function() {
                        if (t.connected) {
                            setTimeout(function() {
                                t._destroy()
                            }, 100)
                        } else {
                            t.once("connect", function() {
                                setTimeout(function() {
                                    t._destroy()
                                }, 100)
                            })
                        }
                    })
                }
                l.WEBRTC_SUPPORT = !!i();
                l.config = {
                    iceServers: [{
                        url: "stun:23.21.150.121",
                        urls: "stun:23.21.150.121"
                    }]
                };
                l.constraints = {};
                l.channelConfig = {};
                Object.defineProperty(l.prototype, "bufferSize", {
                    get: function() {
                        var e = this;
                        return e._channel && e._channel.bufferedAmount || 0
                    }
                });
                l.prototype.address = function() {
                    var e = this;
                    return {
                        port: e.localPort,
                        family: "IPv4",
                        address: e.localAddress
                    }
                };
                l.prototype.signal = function(e) {
                    var t = this;
                    if (t.destroyed) throw new Error("cannot signal after peer is destroyed");
                    if (typeof e === "string") {
                        try {
                            e = JSON.parse(e)
                        } catch (r) {
                            e = {}
                        }
                    }
                    t._debug("signal()");

                    function n(e) {
                        try {
                            t._pc.addIceCandidate(new t._wrtc.RTCIceCandidate(e), h, t._onError.bind(t))
                        } catch (r) {
                            t._destroy(new Error("error adding candidate: " + r.message))
                        }
                    }
                    if (e.sdp) {
                        t._pc.setRemoteDescription(new t._wrtc.RTCSessionDescription(e), function() {
                            if (t.destroyed) return;
                            if (t._pc.remoteDescription.type === "offer") t._createAnswer();
                            t._pendingCandidates.forEach(n);
                            t._pendingCandidates = []
                        }, t._onError.bind(t))
                    }
                    if (e.candidate) {
                        if (t._pc.remoteDescription) n(e.candidate);
                        else t._pendingCandidates.push(e.candidate)
                    }
                    if (!e.sdp && !e.candidate) {
                        t._destroy(new Error("signal() called with invalid signal data"))
                    }
                };
                l.prototype.send = function(e) {
                    var t = this;
                    if (!s.strict(e) && !(e instanceof ArrayBuffer) && !r.isBuffer(e) && typeof e !== "string" && (typeof Blob === "undefined" || !(e instanceof Blob))) {
                        e = JSON.stringify(e)
                    }
                    if (r.isBuffer(e) && !s.strict(e)) {
                        e = new Uint8Array(e)
                    }
                    var n = e.length || e.byteLength || e.size;
                    t._channel.send(e);
                    t._debug("write: %d bytes", n)
                };
                l.prototype.destroy = function(e) {
                    var t = this;
                    t._destroy(null, e)
                };
                l.prototype._destroy = function(e, t) {
                    var r = this;
                    if (r.destroyed) return;
                    if (t) r.once("close", t);
                    r._debug("destroy (error: %s)", e && e.message);
                    r.readable = r.writable = false;
                    if (!r._readableState.ended) r.push(null);
                    if (!r._writableState.finished) r.end();
                    r.destroyed = true;
                    r.connected = false;
                    r._pcReady = false;
                    r._channelReady = false;
                    r._chunk = null;
                    r._cb = null;
                    clearInterval(r._interval);
                    clearTimeout(r._reconnectTimeout);
                    if (r._pc) {
                        try {
                            r._pc.close()
                        } catch (e) {}
                        r._pc.oniceconnectionstatechange = null;
                        r._pc.onsignalingstatechange = null;
                        r._pc.onicecandidate = null
                    }
                    if (r._channel) {
                        try {
                            r._channel.close()
                        } catch (e) {}
                        r._channel.onmessage = null;
                        r._channel.onopen = null;
                        r._channel.onclose = null
                    }
                    r._pc = null;
                    r._channel = null;
                    if (e) r.emit("error", e);
                    r.emit("close")
                };
                l.prototype._setupData = function(e) {
                    var t = this;
                    t._channel = e.channel;
                    t.channelName = t._channel.label;
                    t._channel.binaryType = "arraybuffer";
                    t._channel.onmessage = t._onChannelMessage.bind(t);
                    t._channel.onopen = t._onChannelOpen.bind(t);
                    t._channel.onclose = t._onChannelClose.bind(t)
                };
                l.prototype._read = function() {};
                l.prototype._write = function(e, t, r) {
                    var n = this;
                    if (n.destroyed) return r(new Error("cannot write after peer is destroyed"));
                    if (n.connected) {
                        try {
                            n.send(e)
                        } catch (i) {
                            return n._onError(i)
                        }
                        if (n._channel.bufferedAmount > n._maxBufferedAmount) {
                            n._debug("start backpressure: bufferedAmount %d", n._channel.bufferedAmount);
                            n._cb = r
                        } else {
                            r(null)
                        }
                    } else {
                        n._debug("write before connect");
                        n._chunk = e;
                        n._cb = r
                    }
                };
                l.prototype._createOffer = function() {
                    var e = this;
                    if (e.destroyed) return;
                    e._pc.createOffer(function(t) {
                        if (e.destroyed) return;
                        t.sdp = e.sdpTransform(t.sdp);
                        e._pc.setLocalDescription(t, h, e._onError.bind(e));
                        var r = function() {
                            var r = e._pc.localDescription || t;
                            e._debug("signal");
                            e.emit("signal", {
                                type: r.type,
                                sdp: r.sdp
                            })
                        };
                        if (e.trickle || e._iceComplete) r();
                        else e.once("_iceComplete", r)
                    }, e._onError.bind(e), e.offerConstraints)
                };
                l.prototype._createAnswer = function() {
                    var e = this;
                    if (e.destroyed) return;
                    e._pc.createAnswer(function(t) {
                        if (e.destroyed) return;
                        t.sdp = e.sdpTransform(t.sdp);
                        e._pc.setLocalDescription(t, h, e._onError.bind(e));
                        var r = function() {
                            var r = e._pc.localDescription || t;
                            e._debug("signal");
                            e.emit("signal", {
                                type: r.type,
                                sdp: r.sdp
                            })
                        };
                        if (e.trickle || e._iceComplete) r();
                        else e.once("_iceComplete", r)
                    }, e._onError.bind(e), e.answerConstraints)
                };
                l.prototype._onIceConnectionStateChange = function() {
                    var e = this;
                    if (e.destroyed) return;
                    var t = e._pc.iceGatheringState;
                    var r = e._pc.iceConnectionState;
                    e._debug("iceConnectionStateChange %s %s", t, r);
                    e.emit("iceConnectionStateChange", t, r);
                    if (r === "connected" || r === "completed") {
                        clearTimeout(e._reconnectTimeout);
                        e._pcReady = true;
                        e._maybeReady()
                    }
                    if (r === "disconnected") {
                        if (e.reconnectTimer) {
                            clearTimeout(e._reconnectTimeout);
                            e._reconnectTimeout = setTimeout(function() {
                                e._destroy()
                            }, e.reconnectTimer)
                        } else {
                            e._destroy()
                        }
                    }
                    if (r === "closed") {
                        e._destroy()
                    }
                };
                l.prototype._maybeReady = function() {
                    var e = this;
                    e._debug("maybeReady pc %s channel %s", e._pcReady, e._channelReady);
                    if (e.connected || e._connecting || !e._pcReady || !e._channelReady) return;
                    e._connecting = true;
                    if (typeof window !== "undefined" && !!window.mozRTCPeerConnection) {
                        e._pc.getStats(null, function(e) {
                            var r = [];
                            e.forEach(function(e) {
                                r.push(e)
                            });
                            t(r)
                        }, e._onError.bind(e))
                    } else {
                        e._pc.getStats(function(e) {
                            var r = [];
                            e.result().forEach(function(e) {
                                var t = {};
                                e.names().forEach(function(r) {
                                    t[r] = e.stat(r)
                                });
                                t.id = e.id;
                                t.type = e.type;
                                t.timestamp = e.timestamp;
                                r.push(t)
                            });
                            t(r)
                        })
                    }

                    function t(t) {
                        t.forEach(function(t) {
                            if (t.type === "remotecandidate") {
                                e.remoteAddress = t.ipAddress;
                                e.remoteFamily = "IPv4";
                                e.remotePort = Number(t.portNumber);
                                e._debug("connect remote: %s:%s (%s)", e.remoteAddress, e.remotePort, e.remoteFamily)
                            } else if (t.type === "localcandidate" && t.candidateType === "host") {
                                e.localAddress = t.ipAddress;
                                e.localPort = Number(t.portNumber);
                                e._debug("connect local: %s:%s", e.localAddress, e.localPort)
                            }
                        });
                        e._connecting = false;
                        e.connected = true;
                        if (e._chunk) {
                            try {
                                e.send(e._chunk)
                            } catch (r) {
                                return e._onError(r)
                            }
                            e._chunk = null;
                            e._debug('sent chunk from "write before connect"');
                            var n = e._cb;
                            e._cb = null;
                            n(null)
                        }
                        e._interval = setInterval(function() {
                            if (!e._cb || !e._channel || e._channel.bufferedAmount > e._maxBufferedAmount) return;
                            e._debug("ending backpressure: bufferedAmount %d", e._channel.bufferedAmount);
                            var t = e._cb;
                            e._cb = null;
                            t(null)
                        }, 150);
                        if (e._interval.unref) e._interval.unref();
                        e._debug("connect");
                        e.emit("connect")
                    }
                };
                l.prototype._onSignalingStateChange = function() {
                    var e = this;
                    if (e.destroyed) return;
                    e._debug("signalingStateChange %s", e._pc.signalingState);
                    e.emit("signalingStateChange", e._pc.signalingState)
                };
                l.prototype._onIceCandidate = function(e) {
                    var t = this;
                    if (t.destroyed) return;
                    if (e.candidate && t.trickle) {
                        t.emit("signal", {
                            candidate: {
                                candidate: e.candidate.candidate,
                                sdpMLineIndex: e.candidate.sdpMLineIndex,
                                sdpMid: e.candidate.sdpMid
                            }
                        })
                    } else if (!e.candidate) {
                        t._iceComplete = true;
                        t.emit("_iceComplete")
                    }
                };
                l.prototype._onChannelMessage = function(e) {
                    var t = this;
                    if (t.destroyed) return;
                    var r = e.data;
                    t._debug("read: %d bytes", r.byteLength || r.length);
                    if (r instanceof ArrayBuffer) {
                        r = c(new Uint8Array(r));
                        t.push(r)
                    } else {
                        try {
                            r = JSON.parse(r)
                        } catch (n) {}
                        t.emit("data", r)
                    }
                };
                l.prototype._onChannelOpen = function() {
                    var e = this;
                    if (e.connected || e.destroyed) return;
                    e._debug("on channel open");
                    e._channelReady = true;
                    e._maybeReady()
                };
                l.prototype._onChannelClose = function() {
                    var e = this;
                    if (e.destroyed) return;
                    e._debug("on channel close");
                    e._destroy()
                };
                l.prototype._onAddStream = function(e) {
                    var t = this;
                    if (t.destroyed) return;
                    t._debug("on add stream");
                    t.emit("stream", e.stream)
                };
                l.prototype._onError = function(e) {
                    var t = this;
                    if (t.destroyed) return;
                    t._debug("error %s", e.message || e);
                    t._destroy(e)
                };
                l.prototype._debug = function() {
                    var e = this;
                    var t = [].slice.call(arguments);
                    var r = e.channelName && e.channelName.substring(0, 7);
                    t[0] = "[" + r + "] " + t[0];
                    n.apply(null, t)
                };

                function h() {}
            }).call(this, e("buffer").Buffer)
        }, {
            buffer: 2,
            debug: 22,
            "get-browser-rtc": 25,
            hat: 26,
            inherits: 27,
            "is-typedarray": 28,
            once: 30,
            stream: 20,
            "typedarray-to-buffer": 31
        }]
    }, {}, [])("/")
});
