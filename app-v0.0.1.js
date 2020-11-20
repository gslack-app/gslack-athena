var app = function(e) {
    var t = {};
    function __webpack_require__(i) {
        if (t[i]) {
            return t[i].exports;
        }
        var s = t[i] = {
            i,
            l: !1,
            exports: {}
        };
        return e[i].call(s.exports, s, s.exports, __webpack_require__), s.l = !0, s.exports;
    }
    return __webpack_require__.m = e, __webpack_require__.c = t, __webpack_require__.d = function(e, t, i) {
        __webpack_require__.o(e, t) || Object.defineProperty(e, t, {
            enumerable: !0,
            get: i
        });
    }, __webpack_require__.r = function(e) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(e, "__esModule", {
            value: !0
        });
    }, __webpack_require__.t = function(e, t) {
        if (1 & t && (e = __webpack_require__(e)), 8 & t) {
            return e;
        }
        if (4 & t && "object" == typeof e && e && e.__esModule) {
            return e;
        }
        var i = Object.create(null);
        if (__webpack_require__.r(i), Object.defineProperty(i, "default", {
            enumerable: !0,
            value: e
        }), 2 & t && "string" != typeof e) {
            for (var s in e) {
                __webpack_require__.d(i, s, function(t) {
                    return e[t];
                }.bind(null, s));
            }
        }
        return i;
    }, __webpack_require__.n = function(e) {
        var t = e && e.__esModule ? function getDefault() {
            return e.default;
        } : function getModuleExports() {
            return e;
        };
        return __webpack_require__.d(t, "a", t), t;
    }, __webpack_require__.o = function(e, t) {
        return Object.prototype.hasOwnProperty.call(e, t);
    }, __webpack_require__.p = "", __webpack_require__(__webpack_require__.s = "./www/app.ts");
}({
    "./gservlet/common/cache.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "CacheProvider", (function() {
            return CacheProvider;
        }));
        var s = i("./node_modules/@babel/runtime/helpers/defineProperty.js"), r = i.n(s);
        class CacheProvider {
            constructor({ILogger: e, CacheService: t}) {
                r()(this, "logger", void 0), r()(this, "expiration", 1200), r()(this, "provider", void 0), 
                this.logger = e, this.provider = t || t.getScriptCache();
            }
            setExpiration(e) {
                this.expiration = e;
            }
            get(e) {
                let t, i = null;
                if (t = this.provider.get(e), t) {
                    try {
                        i = JSON.parse(t);
                    } catch (t) {
                        this.logger && this.logger.error("CacheProvider -> " + t.stack), this.remove(e);
                    }
                }
                return i;
            }
            set(e, t) {
                try {
                    let i = JSON.stringify(t);
                    this.provider.put(e, i, this.expiration);
                } catch (e) {
                    this.logger && this.logger.error("CacheProvider -> " + e.stack);
                }
            }
            remove(e) {
                this.provider.remove(e);
            }
            removeAll(e) {
                this.provider.removeAll(e);
            }
        }
    },
    "./gservlet/common/configuration.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "Configuration", (function() {
            return Configuration;
        }));
        class Configuration {
            get store() {
                return PropertiesService.getScriptProperties();
            }
            get(e, t) {
                return this.store.getProperty(e) || t;
            }
            set(e, t) {
                this.store.setProperty(e, t);
            }
        }
    },
    "./gservlet/common/filter.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "LogFilter", (function() {
            return LogFilter;
        }));
        var s = i("./node_modules/@babel/runtime/helpers/defineProperty.js"), r = i.n(s), n = i("./gservlet/http.ts");
        class LogFilter extends n.HttpFilter {
            constructor({ILogger: e}) {
                super(), r()(this, "logger", void 0), this.logger = e;
            }
            init(e) {
                super.init(e), this.logger.setLevel(this.param.level);
            }
            filter(e, t) {
                let i = e.raw.postData ? e.raw.postData.contents : "", s = [];
                s.push(e.method.toUpperCase()), s.push(Object.keys(e.query).length ? `${e.url}&${this.objectToString(e.query)}` : e.url), 
                i && s.push("BODY " + i), this.logger.debug(s.join(" "));
            }
            objectToString(e) {
                return Object.keys(e).map((t => `${t}=${e[t]}`)).join("&");
            }
        }
    },
    "./gservlet/common/handler.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "RedirectHandler", (function() {
            return RedirectHandler;
        }));
        var s = i("./node_modules/@babel/runtime/helpers/defineProperty.js"), r = i.n(s), n = i("./gservlet/common/html.ts");
        class RedirectHandler {
            constructor({gsuite: e}) {
                r()(this, "gsuite", void 0), this.gsuite = e;
            }
            redirect(e) {
                return e.startsWith("http") || (e = `${Object(n.getPublishUrl)(this.gsuite)}?url=${e}`), 
                Object(n.redirect)(e);
            }
        }
    },
    "./gservlet/common/html.ts": function(e, t, i) {
        "use strict";
        function json(e) {
            return ContentService.createTextOutput(JSON.stringify(e)).setMimeType(ContentService.MimeType.JSON);
        }
        function text(e) {
            return ContentService.createTextOutput(e).setMimeType(ContentService.MimeType.TEXT);
        }
        function render(e, t, i) {
            let s = HtmlService.createTemplateFromFile("" + e);
            return i = i || "", t && Object.assign(s, t), s.evaluate().setTitle(i).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);
        }
        function redirect(e, t = "views/redirect") {
            return render(t, {
                url: e
            });
        }
        function _(e) {
            return JSON.stringify(e);
        }
        function html(e, t) {
            return e.map((e => HtmlService.createHtmlOutputFromFile(`${e}${t || ""}`).getContent())).join("\n");
        }
        function css(e) {
            return "<style>\n" + html(e, ".css") + "</style>\n";
        }
        function js(e) {
            return "<script>\n" + html(e, ".js") + "<\/script>\n";
        }
        function decodeHtml(e) {
            let t = {
                amp: "&",
                apos: "'",
                lt: "<",
                gt: ">",
                quot: '"',
                nbsp: " "
            };
            return e = (e = e.replace(/&([a-z]+);/gi, (function(e, i) {
                if (i = i.toLowerCase(), t.hasOwnProperty(i)) {
                    return t[i];
                }
            }))).replace(/&#(\d+);/g, (function(e, t) {
                return String.fromCharCode(t);
            }));
        }
        function getPublishUrl(e = "") {
            let t = ScriptApp.getService().getUrl();
            return t = t.replace("/a/" + e, ""), t;
        }
        i.r(t), i.d(t, "json", (function() {
            return json;
        })), i.d(t, "text", (function() {
            return text;
        })), i.d(t, "render", (function() {
            return render;
        })), i.d(t, "redirect", (function() {
            return redirect;
        })), i.d(t, "_", (function() {
            return _;
        })), i.d(t, "html", (function() {
            return html;
        })), i.d(t, "css", (function() {
            return css;
        })), i.d(t, "js", (function() {
            return js;
        })), i.d(t, "decodeHtml", (function() {
            return decodeHtml;
        })), i.d(t, "getPublishUrl", (function() {
            return getPublishUrl;
        }));
    },
    "./gservlet/common/logger.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "NullLogger", (function() {
            return NullLogger;
        })), i.d(t, "SimpleLogger", (function() {
            return SimpleLogger;
        })), i.d(t, "StackdriverLogger", (function() {
            return StackdriverLogger;
        })), i.d(t, "SheetLogger", (function() {
            return SheetLogger;
        }));
        var s = i("./node_modules/@babel/runtime/helpers/defineProperty.js"), r = i.n(s), n = i("./gservlet/interfaces.ts");
        class NullLogger {
            constructor({logLevel: e}) {}
            setLevel(e) {}
            trace(e) {}
            debug(e) {}
            info(e) {}
            warn(e) {}
            error(e) {}
        }
        class SimpleLogger {
            constructor({logLevel: e}) {
                r()(this, "minLevel", void 0), this.minLevel = e || n.LogLevel.Info;
            }
            setLevel(e) {
                this.minLevel = e;
            }
            trace(e) {
                if (this.minLevel <= n.LogLevel.Trace) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    Logger.log(t);
                }
            }
            debug(e) {
                if (this.minLevel <= n.LogLevel.Debug) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    Logger.log(t);
                }
            }
            info(e) {
                if (this.minLevel <= n.LogLevel.Info) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    Logger.log(t);
                }
            }
            warn(e) {
                if (this.minLevel <= n.LogLevel.Warn) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    Logger.log(t);
                }
            }
            error(e) {
                if (this.minLevel <= n.LogLevel.Error) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    Logger.log(t);
                }
            }
        }
        class StackdriverLogger {
            constructor({logLevel: e}) {
                r()(this, "minLevel", void 0), this.minLevel = e || n.LogLevel.Info;
            }
            setLevel(e) {
                this.minLevel = e;
            }
            trace(e) {
                if (this.minLevel <= n.LogLevel.Trace) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    console.trace(t);
                }
            }
            debug(e) {
                if (this.minLevel <= n.LogLevel.Debug) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    console.debug(t);
                }
            }
            info(e) {
                if (this.minLevel <= n.LogLevel.Info) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    console.info(t);
                }
            }
            warn(e) {
                if (this.minLevel <= n.LogLevel.Warn) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    console.warn(t);
                }
            }
            error(e) {
                if (this.minLevel <= n.LogLevel.Error) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    console.error(t);
                }
            }
        }
        class SheetLogger {
            constructor({SheetLoggerConfig: e}) {
                r()(this, "DATE_TIME_LAYOUT", "yyyy-MM-dd HH:mm:ss:SSS Z"), r()(this, "sheet", void 0), 
                r()(this, "header", void 0), r()(this, "sheetName", void 0), r()(this, "minLevel", void 0);
                let {name: t, id: i, level: s} = e;
                this.setConfig(t, i, s);
            }
            setLevel(e) {
                this.minLevel = e;
            }
            trace(e) {
                if (this.minLevel <= n.LogLevel.Trace) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    this.log("TRACE", t);
                }
            }
            debug(e) {
                if (this.minLevel <= n.LogLevel.Debug) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    this.log("DEBUG", t);
                }
            }
            info(e) {
                if (this.minLevel <= n.LogLevel.Info) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    this.log("INFO", t);
                }
            }
            warn(e) {
                if (this.minLevel <= n.LogLevel.Warn) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    this.log("WARN", t);
                }
            }
            error(e) {
                if (this.minLevel <= n.LogLevel.Error) {
                    let t = "object" == typeof e ? JSON.stringify(e) : e;
                    this.log("ERROR", t);
                }
            }
            setConfig(e = "Logs", t = null, i = n.LogLevel.Info) {
                this.sheetName = e, this.sheet = t ? SpreadsheetApp.openById(t).getSheetByName(this.sheetName) : SpreadsheetApp.getActiveSpreadsheet().getSheetByName(this.sheetName), 
                this.header = {
                    row: 1,
                    column: 1,
                    numRows: 1,
                    numColumns: this.sheet.getLastColumn()
                }, this.minLevel = i;
            }
            log(e, t) {
                this.sheet.insertRowAfter(this.header.row);
                let i = this.header.row + 1, s = [ Utilities.formatDate(new Date, Session.getScriptTimeZone(), this.DATE_TIME_LAYOUT), e, t.substr(0, 5e3) ];
                this.sheet.getRange(i, this.header.column, 1, this.header.numColumns).setValues([ s ]);
            }
        }
    },
    "./gservlet/common/servlet.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "TextNotFoundServlet", (function() {
            return TextNotFoundServlet;
        })), i.d(t, "JSONNotFoundServlet", (function() {
            return JSONNotFoundServlet;
        }));
        var s = i("./gservlet/http.ts");
        class TextNotFoundServlet extends s.HttpServlet {
            async service(e, t) {
                t.setOutputType("text"), t.body = "404 Not Found", t.statusCode = 404, t.complete();
            }
        }
        class JSONNotFoundServlet extends s.HttpServlet {
            async service(e, t) {
                t.setOutputType("text"), t.contentType = ContentService.MimeType.JSON, t.body = JSON.stringify({
                    status: "error",
                    message: "Not Found",
                    code: 404
                }), t.statusCode = 404, t.complete();
            }
        }
    },
    "./gservlet/container.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "ServletContainer", (function() {
            return ServletContainer;
        }));
        var s = i("./node_modules/@babel/runtime/helpers/defineProperty.js"), r = i.n(s), n = i("./node_modules/trouter/index.mjs");
        class ServletContainer {
            constructor() {
                r()(this, "config", void 0), r()(this, "di", void 0), r()(this, "router", void 0), 
                r()(this, "filters", void 0), r()(this, "handler", void 0);
            }
            init(e, t) {
                this.config = e, this.di = t, this.handler = t.get("IHandler"), this.handler.init({
                    IDependencyInjection: t
                }), this.router = new n.default, this.config.routes.forEach((e => {
                    e.patterns.forEach((t => {
                        e.handlers.forEach((i => {
                            this.router.add(e.method.toUpperCase(), t, i);
                        }));
                    }));
                }));
            }
            processRequest(e, t) {
                let i = this.handler.processRequest(e, t), s = this.di.get("ServletResponse"), r = this.router.find(i.method.toUpperCase(), i.url), n = r.handlers.length;
                if (n) {
                    Object.assign(i.param, r.params), this.config.filters.sort(((e, t) => e.order - t.order));
                    for (let e = 0; e < this.config.filters.length; e++) {
                        let t = this.config.filters[e], r = this.di.get(t.name);
                        if (!r) {
                            throw new Error(t.name + " not found");
                        }
                        if (r.init(t.param), r.filter(i, s), s.isCommitted()) {
                            return s.getOutput();
                        }
                    }
                    for (let e = 0; e < n; e++) {
                        let t = r.handlers[e];
                        if ("string" != typeof t) {
                            if (r.params && Object.keys(r.params).length) {
                                let e = Object.keys(r.params).map((e => r.params[e]));
                                return t.apply(null, e);
                            }
                            return t();
                        }
                        {
                            let e = this.di.get(t);
                            if (!e) {
                                throw new Error(t + " not found");
                            }
                            let r = this.getServletConfig(t);
                            if (!r) {
                                throw new Error(t + " config not found");
                            }
                            e.init(r.param), e.service(i, s), e.destroy();
                        }
                    }
                    if (307 === s.statusCode) {
                        let e = this.di.get("IRedirectHandler");
                        if (!e) {
                            throw new Error("IRedirectHandler config not found");
                        }
                        return e.redirect(s.body);
                    }
                } else {
                    let e = this.di.get("NotFoundServlet");
                    if (!e) {
                        throw new Error("Unable to find NotFoundServlet");
                    }
                    e.init(), e.service(i, s), e.destroy();
                }
                return s.getOutput();
            }
            getServletConfig(e) {
                let t = this.config.servlets.map((e => e.name)).indexOf(e);
                return t > -1 ? this.config.servlets[t] : null;
            }
        }
    },
    "./gservlet/http.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "HttpServletRequest", (function() {
            return HttpServletRequest;
        })), i.d(t, "HttpServletResponse", (function() {
            return HttpServletResponse;
        })), i.d(t, "HttpHandler", (function() {
            return HttpHandler;
        })), i.d(t, "HttpFilter", (function() {
            return HttpFilter;
        })), i.d(t, "HttpServlet", (function() {
            return HttpServlet;
        }));
        var s = i("./node_modules/@babel/runtime/helpers/defineProperty.js"), r = i.n(s);
        class HttpServletRequest {
            constructor() {
                r()(this, "raw", void 0), r()(this, "method", void 0), r()(this, "url", void 0), 
                r()(this, "query", void 0), r()(this, "contentType", void 0), r()(this, "body", void 0), 
                r()(this, "items", void 0), r()(this, "param", void 0);
            }
        }
        class HttpServletResponse {
            constructor() {
                r()(this, "committed", void 0), r()(this, "type", void 0), r()(this, "contentType", void 0), 
                r()(this, "body", void 0), r()(this, "statusCode", void 0);
            }
            getOutput() {
                let e;
                switch (this.type) {
                  case "text":
                    e = ContentService.createTextOutput(this.body), e.setMimeType(this.contentType || ContentService.MimeType.TEXT);
                    break;

                  case "html":
                    e = HtmlService.createHtmlOutput(this.body);
                }
                return e;
            }
            setOutputType(e) {
                this.type = e;
            }
            isCommitted() {
                return this.committed;
            }
            complete() {
                this.committed = !0;
            }
            reset() {
                this.body = "";
            }
            redirect(e) {
                this.body = e, this.statusCode = 307, this.complete();
            }
        }
        class HttpHandler {
            constructor() {
                r()(this, "param", void 0), r()(this, "di", void 0);
            }
            init(e) {
                this.param = e, this.di = e.IDependencyInjection;
            }
            processRequest(e, t) {
                let i = this.di.get("ServletRequest");
                if (i.raw = t, i.param = {}, i.items = {}, i.url = t.parameter.url || "/", t.parameter.method ? i.method = t.parameter.method : i.method = "POST" === e ? "post" : "get", 
                i.query = {}, Object.assign(i.query, t.parameter), delete i.query.method, delete i.query.url, 
                t.postData) {
                    switch (i.contentType = t.postData.type, i.contentType) {
                      case "application/json":
                        try {
                            i.body = JSON.parse(t.postData.contents);
                        } catch (e) {
                            i.body = null;
                        }
                        break;

                      default:
                        i.body = t.postData.contents;
                    }
                }
                return i;
            }
        }
        class HttpFilter {
            constructor() {
                r()(this, "param", void 0);
            }
            init(e) {
                this.param = e;
            }
            filter(e, t) {}
        }
        class HttpServlet {
            constructor() {
                r()(this, "param", void 0);
            }
            init(e) {
                this.param = e;
            }
            async service(e, t) {
                switch (e.method) {
                  case "get":
                    await this.doGet(e, t);
                    break;

                  case "post":
                    await this.doPost(e, t);
                    break;

                  case "put":
                    await this.doPut(e, t);
                    break;

                  case "delete":
                    await this.doDelete(e, t);
                }
            }
            destroy() {}
            async doGet(e, t) {}
            async doPost(e, t) {}
            async doPut(e, t) {}
            async doDelete(e, t) {}
        }
    },
    "./gservlet/interfaces.ts": function(e, t, i) {
        "use strict";
        let s;
        i.r(t), i.d(t, "LogLevel", (function() {
            return s;
        })), function(e) {
            e[e.Trace = 0] = "Trace", e[e.Debug = 1] = "Debug", e[e.Info = 2] = "Info", e[e.Warn = 3] = "Warn", 
            e[e.Error = 4] = "Error";
        }(s || (s = {}));
    },
    "./node_modules/@babel/runtime/helpers/defineProperty.js": function(e, t) {
        e.exports = function _defineProperty(e, t, i) {
            return t in e ? Object.defineProperty(e, t, {
                value: i,
                enumerable: !0,
                configurable: !0,
                writable: !0
            }) : e[t] = i, e;
        };
    },
    "./node_modules/regexparam/dist/regexparam.js": function(e, t) {
        e.exports = function(e, t) {
            if (e instanceof RegExp) {
                return {
                    keys: !1,
                    pattern: e
                };
            }
            var i, s, r, n, a = [], o = "", l = e.split("/");
            for (l[0] || l.shift(); r = l.shift(); ) {
                "*" === (i = r[0]) ? (a.push("wild"), o += "/(.*)") : ":" === i ? (s = r.indexOf("?", 1), 
                n = r.indexOf(".", 1), a.push(r.substring(1, ~s ? s : ~n ? n : r.length)), o += ~s && !~n ? "(?:/([^/]+?))?" : "/([^/]+?)", 
                ~n && (o += (~s ? "?" : "") + "\\" + r.substring(n))) : o += "/" + r;
            }
            return {
                keys: a,
                pattern: new RegExp("^" + o + (t ? "(?=$|/)" : "/?$"), "i")
            };
        };
    },
    "./node_modules/travix-di/index.js": function(e, t, i) {
        var s = i("./node_modules/travix-di/lib/index.js");
        e.exports = s;
    },
    "./node_modules/travix-di/lib/createClass.js": function(e, t, i) {
        "use strict";
        function _classCallCheck(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = function createClass() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {}, t = function GeneratedClass() {
                var t = this;
                _classCallCheck(this, GeneratedClass), Object.keys(e).forEach((function(i) {
                    "function" == typeof e[i] ? t[i] = e[i].bind(t) : t[i] = e[i];
                })), "function" == typeof this.initialize && this.initialize.apply(this, arguments);
            };
            return t;
        };
    },
    "./node_modules/travix-di/lib/createContainer.js": function(e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        });
        var s = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e) {
            return typeof e;
        } : function(e) {
            return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
        }, r = function() {
            function defineProperties(e, t) {
                for (var i = 0; i < t.length; i++) {
                    var s = t[i];
                    s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), 
                    Object.defineProperty(e, s.key, s);
                }
            }
            return function(e, t, i) {
                return t && defineProperties(e.prototype, t), i && defineProperties(e, i), e;
            };
        }(), n = Object.assign || function(e) {
            for (var t = 1; t < arguments.length; t++) {
                var i = arguments[t];
                for (var s in i) {
                    Object.prototype.hasOwnProperty.call(i, s) && (e[s] = i[s]);
                }
            }
            return e;
        };
        function _classCallCheck(e, t) {
            if (!(e instanceof t)) {
                throw new TypeError("Cannot call a class as a function");
            }
        }
        t.default = function createContainer() {
            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [], t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {}, i = n({
                containerName: "container"
            }, t), a = function() {
                function Container() {
                    var t = this;
                    _classCallCheck(this, Container), this.registry = {}, Object.defineProperty(this.registry, i.containerName, {
                        get: function get() {
                            return t;
                        }
                    }), e.forEach((function(e) {
                        t.register(e);
                    }));
                }
                return r(Container, [ {
                    key: "getDeps",
                    value: function getDeps(e) {
                        var t = this, i = e.name, r = {};
                        return Array.isArray(e.deps) ? e.deps.forEach((function(e) {
                            if (!(e in t.registry)) {
                                throw new Error("For provider '" + i + "', dependency '" + e + "' is not available yet.");
                            }
                            r[e] = t.registry[e];
                        })) : "object" === s(e.deps) && Object.keys(e.deps).forEach((function(s) {
                            if (!(s in t.registry)) {
                                throw new Error("For provider '" + i + "', dependency '" + s + "' is not available yet.");
                            }
                            var n = e.deps[s];
                            r[n] = t.registry[s];
                        })), r;
                    }
                }, {
                    key: "register",
                    value: function register(e) {
                        if ("string" != typeof e.name) {
                            throw new Error("Provider has no 'name' key.");
                        }
                        var t = e.name;
                        if ("useValue" in e) {
                            this.registry[t] = e.useValue;
                        } else if ("useFactory" in e) {
                            this.registry[t] = e.useFactory(this.getDeps(e));
                        } else if ("useClass" in e) {
                            this.registry[t] = new e.useClass(this.getDeps(e));
                        } else {
                            if (!("useDefinedValue" in e)) {
                                throw new Error("No value given for '" + t + "' provider.");
                            }
                            Object.defineProperty(this.registry, t, {
                                get: function get() {
                                    return e.useDefinedValue;
                                }
                            });
                        }
                    }
                }, {
                    key: "get",
                    value: function get(e) {
                        return this.registry[e];
                    }
                } ]), Container;
            }();
            return a;
        };
    },
    "./node_modules/travix-di/lib/index.js": function(e, t, i) {
        "use strict";
        var s = _interopRequireDefault(i("./node_modules/travix-di/lib/createContainer.js")), r = _interopRequireDefault(i("./node_modules/travix-di/lib/resolveContainer.js")), n = _interopRequireDefault(i("./node_modules/travix-di/lib/createClass.js"));
        function _interopRequireDefault(e) {
            return e && e.__esModule ? e : {
                default: e
            };
        }
        e.exports = {
            createContainer: s.default,
            resolveContainer: r.default,
            createClass: n.default
        };
    },
    "./node_modules/travix-di/lib/resolveContainer.js": function(e, t, i) {
        "use strict";
        Object.defineProperty(t, "__esModule", {
            value: !0
        }), t.default = function resolveContainer(e) {
            return new e;
        };
    },
    "./node_modules/trouter/index.mjs": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "default", (function() {
            return Trouter;
        }));
        var s = i("./node_modules/regexparam/dist/regexparam.js");
        class Trouter {
            constructor() {
                this.routes = [], this.all = this.add.bind(this, ""), this.get = this.add.bind(this, "GET"), 
                this.head = this.add.bind(this, "HEAD"), this.patch = this.add.bind(this, "PATCH"), 
                this.options = this.add.bind(this, "OPTIONS"), this.connect = this.add.bind(this, "CONNECT"), 
                this.delete = this.add.bind(this, "DELETE"), this.trace = this.add.bind(this, "TRACE"), 
                this.post = this.add.bind(this, "POST"), this.put = this.add.bind(this, "PUT");
            }
            use(e, ...t) {
                let i = [].concat.apply([], t), {keys: r, pattern: n} = s(e, !0);
                return this.routes.push({
                    keys: r,
                    pattern: n,
                    method: "",
                    handlers: i
                }), this;
            }
            add(e, t, ...i) {
                let {keys: r, pattern: n} = s(t), a = [].concat.apply([], i);
                return this.routes.push({
                    keys: r,
                    pattern: n,
                    method: e,
                    handlers: a
                }), this;
            }
            find(e, t) {
                let i, s, r = "HEAD" === e, n = 0, a = 0, o = this.routes, l = [], c = {}, u = [];
                for (;n < o.length; n++) {
                    if (s = o[n], 0 === s.method.length || s.method === e || r && "GET" === s.method) {
                        if (!1 === s.keys) {
                            if (l = s.pattern.exec(t), null === l) {
                                continue;
                            }
                            if (void 0 !== l.groups) {
                                for (i in l.groups) {
                                    c[i] = l.groups[i];
                                }
                            }
                            s.handlers.length > 1 ? u = u.concat(s.handlers) : u.push(s.handlers[0]);
                        } else if (s.keys.length > 0) {
                            if (l = s.pattern.exec(t), null === l) {
                                continue;
                            }
                            for (a = 0; a < s.keys.length; ) {
                                c[s.keys[a]] = l[++a];
                            }
                            s.handlers.length > 1 ? u = u.concat(s.handlers) : u.push(s.handlers[0]);
                        } else {
                            s.pattern.test(t) && (s.handlers.length > 1 ? u = u.concat(s.handlers) : u.push(s.handlers[0]));
                        }
                    }
                }
                return {
                    params: c,
                    handlers: u
                };
            }
        }
    },
    "./slack/common/handler.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "SlackHandler", (function() {
            return SlackHandler;
        }));
        var s = i("./node_modules/@babel/runtime/helpers/defineProperty.js"), r = i.n(s), n = i("./gservlet/http.ts");
        class SlackHandler extends n.HttpHandler {
            constructor(...e) {
                super(...e), r()(this, "Slack", "_slack_");
            }
            init(e) {
                super.init(e);
            }
            processRequest(e, t) {
                let i = super.processRequest(e, t);
                return "GET" === e && "/slack/oauth" === i.url && (i.query.code && (i.url = `${i.url}/code/${i.query.code}/state/${i.query.state}`), 
                i.query.error && (i.url = i.url + "/error")), "POST" === e && this.buildPostUrl(i), 
                i;
            }
            buildPostUrl(e) {
                if (e.query) {
                    let t = e.query;
                    if ("1" === t.ssl_check) {
                        e.url = "/slack/ssl_check";
                    } else if (t.command) {
                        e.url = "/slack/command/" + t.command.replace("/", "");
                    } else if (t.payload) {
                        let i = JSON.parse(t.payload);
                        switch (e.items[this.Slack] = i, e.url = "/slack/action/" + i.type, i.type) {
                          case "block_actions":
                            e.url = `${e.url}/${i.actions[0].block_id}/${i.actions[0].action_id}`;
                            break;

                          case "shortcut":
                          case "message_action":
                            e.url = `${e.url}/${i.callback_id}`;
                            break;

                          case "view_submission":
                          case "view_closed":
                            e.url = `${e.url}/${i.view.callback_id}`;
                        }
                    }
                }
                if (e.body) {
                    let t = e.body;
                    if (t.type) {
                        switch (t.type) {
                          case "url_verification":
                            e.url = "/slack/url_verification/" + t.challenge;
                            break;

                          case "event_callback":
                            {
                                e.url = "/slack/event/" + t.type;
                                let i = t.event;
                                e.items[this.Slack] = i, i && (e.url = `${e.url}/${i.type}`, i.subtype && (e.url = `${e.url}/${i.subtype}`), 
                                i.channel_type && (e.url = `${e.url}/${i.channel_type}`));
                            }
                            break;

                          case "message":
                            e.url = `/slack/${t.type}/${t.subtype}`;
                            break;

                          default:
                            e.url = "/slack/event/" + t.type;
                        }
                    }
                    if (t.name || "block_suggestion" == t.type) {
                        let i = t.name ? t.name : t.type;
                        e.url = "/slack/options/" + i;
                    }
                }
            }
        }
    },
    "./slack/http.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "SlackServlet", (function() {
            return SlackServlet;
        })), i.d(t, "LoginServlet", (function() {
            return LoginServlet;
        })), i.d(t, "OAuthServlet", (function() {
            return OAuthServlet;
        })), i.d(t, "SlackBot", (function() {
            return SlackBot;
        })), i.d(t, "ack", (function() {
            return ack;
        })), i.d(t, "escape", (function() {
            return escape;
        })), i.d(t, "unescape", (function() {
            return unescape;
        })), i.d(t, "extractIds", (function() {
            return extractIds;
        })), i.d(t, "getTeam", (function() {
            return getTeam;
        })), i.d(t, "getChannel", (function() {
            return getChannel;
        })), i.d(t, "getUser", (function() {
            return getUser;
        })), i.d(t, "getMetadata", (function() {
            return getMetadata;
        })), i.d(t, "extractViewSubmission", (function() {
            return extractViewSubmission;
        }));
        var s = i("./node_modules/@babel/runtime/helpers/defineProperty.js"), r = i.n(s), n = i("./gservlet/common/html.ts"), a = i("./gservlet/http.ts"), o = i("./slack/web-api.ts");
        String.prototype.left = function(e) {
            return this.substring(0, e);
        };
        class SlackServlet extends a.HttpServlet {
            constructor({ILogger: e}) {
                super(), r()(this, "Slack", "_slack_"), r()(this, "slackBot", void 0), r()(this, "logger", void 0), 
                this.logger = e;
            }
            init(e) {
                super.init(e);
            }
            get bot() {
                return this.slackBot || (this.slackBot = new SlackBot(this.param.token, this.logger)), 
                this.slackBot;
            }
        }
        class LoginServlet extends a.HttpServlet {
            constructor(...e) {
                super(...e), r()(this, "scopes", void 0), r()(this, "clientId", void 0), r()(this, "teamId", void 0), 
                r()(this, "state", void 0), r()(this, "gsuite", void 0);
            }
            init(e) {
                super.init(e), this.scopes = encodeURIComponent(this.param.scopes), this.clientId = this.param.clientId, 
                this.teamId = this.param.teamId, this.gsuite = this.param.gsuite;
            }
            async doGet(e, t) {
                this.state = encodeURIComponent(this.param.state);
                let i = `https://slack.com/oauth/v2/authorize?client_id=${this.clientId}&scope=${this.scopes}&state=${this.state}`;
                this.teamId && (i += "&team=" + this.teamId), i += "&redirect_uri=" + encodeURIComponent(Object(n.getPublishUrl)(this.gsuite) + "?url=/slack/oauth"), 
                t.redirect(i);
            }
        }
        class OAuthServlet extends SlackServlet {
            constructor({IConfiguration: e, ILogger: t}) {
                super({
                    IConfiguration: e,
                    ILogger: t
                }), r()(this, "clientId", void 0), r()(this, "clientSecret", void 0), r()(this, "conf", void 0), 
                r()(this, "gsuite", void 0), this.conf = e;
            }
            init(e) {
                super.init(e), this.clientId = this.param.clientId, this.clientSecret = this.param.clientSecret, 
                this.gsuite = this.param.gsuite;
            }
            async doGet(e, t) {
                let i = e.param.code, s = e.param.state, r = this.param.installState, a = {
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    code: i,
                    redirect_uri: Object(n.getPublishUrl)(this.gsuite) + "?url=/slack/oauth"
                }, o = this.bot.api.oauth.v2.access(a);
                if (o.error) {
                    return this.logger.error("Error confirming oauth " + o.error), void t.redirect("/slack/oauth/error");
                }
                if (r == s) {
                    let e = this.bot.api.auth.test({
                        token: o.access_token
                    });
                    if (e.error) {
                        return this.logger.error("Error fetching user identity " + e.error), void t.redirect("/slack/oauth/error");
                    }
                    let i = o.team.id, s = o.bot_user_id;
                    this.conf.set("app.teamId", i), this.conf.set("app.teamName", o.team.name), this.conf.set("bot.userId", s), 
                    this.conf.set("bot.token", o.access_token), t.redirect(`/slack/oauth/success/${i}/${s}`);
                } else {
                    this.conf.set(s + ".token", o.access_token), t.redirect("/slack/oauth/approved");
                }
            }
        }
        class SlackBot {
            constructor(e, t) {
                r()(this, "token", void 0), r()(this, "api", void 0), r()(this, "logger", void 0), 
                this.token = e, this.logger = t, this.api = new o.WebClientEx(this.token, this.logger);
            }
            startDirectMessage(e, t) {
                let i = this.api.conversations.open({
                    users: e.user,
                    return_im: !0
                });
                if (i.ok) {
                    let e = "string" == typeof t ? {
                        text: t
                    } : t;
                    return e.channel = i.channel.id, this.api.chat.postMessage(e);
                }
                return i;
            }
            replyPublic(e, t) {
                return this.reply(e, t, "in_channel");
            }
            replyPrivate(e, t) {
                return this.reply(e, t, "ephemeral");
            }
            replyInThread(e, t) {
                return this.reply(e, t, "in_channel", !0);
            }
            replyPublicDelayed(e, t) {
                return this.replyDelayed(e, t, "in_channel");
            }
            replyPrivateDelayed(e, t) {
                return this.replyDelayed(e, t, "ephemeral");
            }
            ack(e) {
                e.setOutputType("text"), e.body = "", e.complete();
            }
            nack(e, t) {
                e.setOutputType("text"), e.body = t || "NOT OK", e.complete();
            }
            validate(e, t) {
                e.setOutputType("text"), e.body = JSON.stringify(t), e.complete();
            }
            reply(e, t, i, s = !1) {
                let r = {};
                return "string" == typeof t ? r.text = t : r = t, r.channel = getChannel(e), "ephemeral" == i && (r.user = getUser(e)), 
                e.thread_ts && (r.thread_ts = e.thread_ts), s && (r.thread_ts = e.thread_ts ? e.thread_ts : e.ts), 
                "ephemeral" == i ? this.api.chat.postEphemeral(r) : this.api.chat.postMessage(r);
            }
            replyDelayed(e, t, i) {
                let s = {};
                "string" == typeof t ? s.text = t : s = t, s.channel = getChannel(e), "ephemeral" == i ? (s.user = getUser(e), 
                s.response_type = "ephemeral") : s.response_type = "in_channel", e.thread_ts && (s.thread_ts = e.thread_ts);
                let r = this.api.JSON;
                this.api.JSON = !0;
                let n = this.api.apiCall(e.response_url, s);
                return this.api.JSON = r, n;
            }
        }
        function ack() {
            return ContentService.createTextOutput("");
        }
        function escape(e) {
            if (e) {
                return function splitProcessor(e, t, i) {
                    const s = e.split(i);
                    for (let e = 0; e < s.length; e += 2) {
                        s[e] = t(s[e]);
                    }
                    return s.join("");
                }(e, (e => e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")), /(&(?:\w+|#\d+);)/);
            }
            return "";
        }
        function unescape(e) {
            let t = {
                amp: "&",
                apos: "'",
                lt: "<",
                gt: ">",
                quot: '"',
                nbsp: " "
            };
            return e = (e = e.replace(/&([a-z]+);/gi, (function(e, i) {
                if (i = i.toLowerCase(), t.hasOwnProperty(i)) {
                    return t[i];
                }
            }))).replace(/&#(\d+);/g, (function(e, t) {
                return String.fromCharCode(t);
            }));
        }
        function extractIds(e) {
            let t = [], i = /<@(\w+)\|[^>]+>/g, s = i.exec(e);
            for (;null != s; ) {
                t.push(s[1]), s = i.exec(e);
            }
            return t;
        }
        function getTeam(e) {
            return e.team_id ? e.team_id : e.team ? "object" == typeof e.team ? e.team.id : e.team : "";
        }
        function getChannel(e) {
            return e.channel_id ? e.channel_id : e.channel ? "object" == typeof e.channel ? e.channel.id : e.channel : "";
        }
        function getUser(e) {
            return e.user_id ? e.user_id : e.user ? "object" == typeof e.user ? e.user.id : e.user : "";
        }
        function getMetadata(e) {
            return {
                user: getUser(e),
                channel: getChannel(e),
                team: getTeam(e)
            };
        }
        function extractValue(e, t, i, s = [ "type", "emoji" ]) {
            if ("object" != typeof t || Array.isArray(t)) {
                Array.isArray(t) ? (i[e] = [], t.forEach((t => extractValue(e, t, i, s)))) : Array.isArray(i[e]) ? i[e].indexOf(t) < 0 && i[e].push(t) : i[e] = t;
            } else {
                for (const r in t) {
                    s.indexOf(r) < 0 && extractValue(e, t[r], i, s);
                }
            }
        }
        function extractViewSubmission(e, t = [ "type", "emoji" ]) {
            var i = {};
            for (const s in e) {
                let r = e[s];
                for (const e in r) {
                    let s = r[e];
                    for (const r in s) {
                        if (t.indexOf(r) < 0) {
                            extractValue(e, s[r], i, t);
                            break;
                        }
                    }
                }
            }
            return i;
        }
    },
    "./slack/ui.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "MessageView", (function() {
            return MessageView;
        })), i.d(t, "AppHomeView", (function() {
            return AppHomeView;
        })), i.d(t, "ModalView", (function() {
            return ModalView;
        })), i.d(t, "UIFactory", (function() {
            return UIFactory;
        })), i.d(t, "atChannel", (function() {
            return atChannel;
        })), i.d(t, "atEveryone", (function() {
            return atEveryone;
        })), i.d(t, "atHere", (function() {
            return atHere;
        })), i.d(t, "bold", (function() {
            return bold;
        })), i.d(t, "channel", (function() {
            return channel;
        })), i.d(t, "codeBlock", (function() {
            return codeBlock;
        })), i.d(t, "codeLine", (function() {
            return codeLine;
        })), i.d(t, "date", (function() {
            return date;
        })), i.d(t, "emoji", (function() {
            return emoji;
        })), i.d(t, "italic", (function() {
            return italic;
        })), i.d(t, "listItem", (function() {
            return listItem;
        })), i.d(t, "phone", (function() {
            return phone;
        })), i.d(t, "strikethrough", (function() {
            return strikethrough;
        })), i.d(t, "url", (function() {
            return url;
        })), i.d(t, "user", (function() {
            return user;
        }));
        var s = i("./node_modules/@babel/runtime/helpers/defineProperty.js"), r = i.n(s);
        class BaseView {
            addBlock(e) {}
            getView() {}
            setView(e) {}
            addActions(e, t) {
                let i = {
                    type: "actions",
                    elements: e
                };
                return t && (i.block_id = t), this.addBlock(i), i;
            }
            addContext(e, t) {
                let i = {
                    type: "context",
                    elements: e
                };
                return t && (i.block_id = t), this.addBlock(i), i;
            }
            addDivider() {
                let e = {
                    type: "divider"
                };
                return this.addBlock(e), e;
            }
            addImage(e, t, i, s) {
                let r = {
                    type: "image",
                    image_url: e,
                    alt_text: t = t ? t.left(2e3) : "You might see this message in place of the failed image"
                };
                return (i = i ? i.left(2e3) : void 0) && (r.title = {
                    type: "plain_text",
                    text: i,
                    emoji: !0
                }), s && (r.block_id = s), this.addBlock(r), r;
            }
            addSection(e, t = !0, i = !1, s, r, n) {
                let a = {
                    type: "section",
                    text: t ? {
                        type: "mrkdwn",
                        text: e,
                        verbatim: i
                    } : {
                        type: "plain_text",
                        text: e,
                        emoji: !0
                    }
                };
                return r && (a.fields = [], r.forEach((e => a.fields.push(t ? {
                    type: "mrkdwn",
                    text: e
                } : {
                    type: "plain_text",
                    text: e
                })))), s && (a.block_id = s), n && (a.accessory = n), this.addBlock(a), a;
            }
        }
        class MessageView extends BaseView {
            constructor() {
                super(), r()(this, "view", void 0), this.view = {
                    blocks: []
                };
            }
            addBlock(e) {
                this.view.blocks.push(e);
            }
            getView() {
                return this.view;
            }
            addFile(e, t) {
                let i = {
                    type: "file",
                    external_id: e,
                    source: "remote"
                };
                return t && (i.block_id = t), this.view.blocks.push(i), i;
            }
        }
        class AppHomeView extends BaseView {
            constructor() {
                super(), r()(this, "view", void 0), this.view = {
                    type: "home",
                    blocks: []
                };
            }
            addBlock(e) {
                this.view.blocks.push(e);
            }
            getView() {
                return this.view;
            }
        }
        class ModalView extends BaseView {
            constructor(e, t, i, s, n, a, o) {
                super(), r()(this, "view", void 0), this.view = {
                    title: UIFactory.createPlainTextElement(e.left(24)),
                    type: "modal",
                    blocks: [],
                    callback_id: t,
                    close: UIFactory.createPlainTextElement(s || "Cancel"),
                    submit: UIFactory.createPlainTextElement(i || "Submit"),
                    clear_on_close: a,
                    notify_on_close: o
                }, n && (this.view.private_metadata = n);
            }
            addBlock(e) {
                this.view.blocks.push(e);
            }
            getView() {
                return this.view;
            }
            setView(e) {
                this.view = e;
            }
            addInput(e, t, i = !1, s, r) {
                let n = {
                    type: "input",
                    label: {
                        type: "plain_text",
                        text: e
                    },
                    element: t,
                    optional: i
                };
                return s && (n.hint = {
                    type: "plain_text",
                    text: s
                }), r && (n.block_id = r), this.view.blocks.push(n), n;
            }
            setMetadata(e) {
                this.view.private_metadata = e;
            }
        }
        class UIFactory {
            constructor() {}
            static createPlainTextElement(e, t = !0) {
                return {
                    type: "plain_text",
                    text: e,
                    emoji: t
                };
            }
            static createMrkdwnElement(e, t = !1) {
                return {
                    type: "mrkdwn",
                    text: e,
                    verbatim: t
                };
            }
            static createConfirm(e, t, i, s, r = !0, n = !1) {
                let a = {
                    text: r ? {
                        type: "mrkdwn",
                        text: t,
                        verbatim: n
                    } : {
                        type: "plain_text",
                        text: t,
                        emoji: !0
                    }
                };
                return e && (a.title = {
                    type: "plain_text",
                    text: e,
                    emoji: !0
                }), i && (a.confirm = {
                    type: "plain_text",
                    text: i,
                    emoji: !0
                }), s && (a.deny = {
                    type: "plain_text",
                    text: s,
                    emoji: !0
                }), a;
            }
            static createOption(e, t, i) {
                let s = {
                    text: {
                        type: "plain_text",
                        text: e.left(75),
                        emoji: !0
                    },
                    value: t.left(75)
                };
                return i && (s.url = i), s;
            }
            static createOptionGroup(e, t) {
                return {
                    label: e,
                    options: t
                };
            }
            static createButton(e, t, i, s, r, n) {
                let a = {
                    type: "button",
                    text: UIFactory.createPlainTextElement(e.left(75))
                };
                return t && (a.action_id = t.left(255)), s && (a.value = s), i && (a.url = i), r && (a.style = r), 
                n && (a.confirm = n), a;
            }
            static createDatepicker(e, t, i, s) {
                let r = {
                    type: "datepicker",
                    action_id: e
                };
                return t && (r.placeholder = UIFactory.createPlainTextElement(t.left(150))), i && (r.initial_date = i), 
                s && (r.confirm = s), r;
            }
            static createImage(e, t) {
                return {
                    type: "image",
                    image_url: e,
                    alt_text: t || e
                };
            }
            static createMultiStaticSelect(e, t, i, s, r, n) {
                let a = {
                    type: "multi_static_select",
                    action_id: e.left(255),
                    options: [],
                    option_groups: []
                };
                return t && (a.placeholder = UIFactory.createPlainTextElement(t.left(150))), i ? (a.options = i.slice(0, 100), 
                delete a.option_groups) : (s.forEach((e => {
                    a.option_groups.push({
                        label: UIFactory.createPlainTextElement(e.label.left(75)),
                        options: e.options
                    });
                })), delete a.options), r && r.length > 0 && (a.initial_options = r), n && (a.confirm = n), 
                a;
            }
            static createMultiExternalSelect(e, t, i, s, r) {
                let n = {
                    type: "multi_external_select",
                    action_id: e.left(255)
                };
                return t && (n.placeholder = UIFactory.createPlainTextElement(t.left(150))), s && s.length > 0 && (n.initial_options = s), 
                i && (n.min_query_length = i), r && (n.confirm = r), n;
            }
            static createMultiUsersSelect(e, t, i, s) {
                let r = {
                    type: "multi_users_select",
                    action_id: e.left(255)
                };
                return t && (r.placeholder = UIFactory.createPlainTextElement(t.left(150))), i && (r.initial_users = i), 
                s && (r.confirm = s), r;
            }
            static createMultiConversationsSelect(e, t, i, s) {
                let r = {
                    type: "multi_conversations_select",
                    action_id: e.left(255)
                };
                return t && (r.placeholder = UIFactory.createPlainTextElement(t.left(150))), i && (r.initial_conversations = i), 
                s && (r.confirm = s), r;
            }
            static createMultiChannelsSelect(e, t, i, s) {
                let r = {
                    type: "multi_channels_select",
                    action_id: e.left(255)
                };
                return t && (r.placeholder = UIFactory.createPlainTextElement(t.left(150))), i && (r.initial_channels = i), 
                s && (r.confirm = s), r;
            }
            static createOverflow(e, t, i) {
                let s = {
                    type: "overflow",
                    action_id: e.left(255),
                    options: t
                };
                return i && (s.confirm = i), s;
            }
            static createPlainTextInput(e, t = !1, i, s, r, n) {
                let a = {
                    type: "plain_text_input",
                    action_id: e.left(255),
                    multiline: t
                };
                return i && (a.placeholder = UIFactory.createPlainTextElement(i.left(150))), s && (a.initial_value = s), 
                r && (a.min_length = r), n && (a.max_length = n), a;
            }
            static createStaticSelect(e, t, i, s, r, n) {
                let a = {
                    type: "static_select",
                    action_id: e.left(255),
                    options: [],
                    option_groups: []
                };
                return t && (a.placeholder = UIFactory.createPlainTextElement(t.left(150))), i ? (a.options = i.slice(0, 100), 
                delete a.option_groups) : (s.forEach((e => {
                    a.option_groups.push({
                        label: UIFactory.createPlainTextElement(e.label.left(75)),
                        options: e.options
                    });
                })), delete a.options), r && (a.initial_option = r), n && (a.confirm = n), a;
            }
            static createExternalSelect(e, t, i, s, r) {
                let n = {
                    type: "external_select",
                    action_id: e.left(255)
                };
                return t && (n.placeholder = UIFactory.createPlainTextElement(t.left(150))), i && (n.initial_option = i), 
                s && (n.min_query_length = s), r && (n.confirm = r), n;
            }
            static createUsersSelect(e, t, i, s) {
                let r = {
                    type: "users_select",
                    action_id: e.left(255)
                };
                return t && (r.placeholder = UIFactory.createPlainTextElement(t.left(150))), i && (r.initial_user = i), 
                s && (r.confirm = s), r;
            }
            static createConversationsSelect(e, t, i, s) {
                let r = {
                    type: "conversations_select",
                    action_id: e.left(255)
                };
                return t && (r.placeholder = UIFactory.createPlainTextElement(t.left(150))), i && (r.initial_conversation = i), 
                s && (r.confirm = s), r;
            }
            static createChannelsSelect(e, t, i, s) {
                let r = {
                    type: "channels_select",
                    action_id: e.left(255)
                };
                return t && (r.placeholder = UIFactory.createPlainTextElement(t.left(150))), i && (r.initial_channel = i), 
                s && (r.confirm = s), r;
            }
            static createViewValidation(e) {
                return {
                    response_action: "errors",
                    errors: e
                };
            }
        }
        function atChannel() {
            return "<!channel>";
        }
        function atEveryone() {
            return "<!everyone>";
        }
        function atHere() {
            return "<!here>";
        }
        function bold(e) {
            return e ? `*${e}*` : "";
        }
        function channel(e, t) {
            return e && t ? `<#${e}|${t}>` : e ? `<#${e}>` : "";
        }
        function codeBlock(e) {
            return e ? "```" + e + "```" : "";
        }
        function codeLine(e) {
            return e ? "`" + e + "`" : "";
        }
        function date(e, t = "date") {
            if (e) {
                let i = "number" == typeof e ? new Date(e) : new Date((e || "").replace(/-/g, "/").replace(/[TZ]/g, " "));
                return `<!date^${Math.floor(i.getTime() / 1e3)}^{${t}}|${i.toLocaleString()}>`;
            }
            return e;
        }
        function emoji(e) {
            return e ? `:${e}:` : "";
        }
        function italic(e) {
            return e ? `_${e}_` : "";
        }
        function listItem(e) {
            return e ? "• " + e : "";
        }
        function phone(e) {
            return 10 == (e = e.replace(/[^\d]/g, "")).length ? e.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3") : e;
        }
        function strikethrough(e) {
            return e ? `~${e}~` : "";
        }
        function url(e, t) {
            return e && t ? `<${e}|${escape(t)}>` : e ? `<${e}>` : "";
        }
        function user(e, t) {
            return e && t ? `<@${e}|${t}>` : e ? `<@${e}>` : "";
        }
    },
    "./slack/web-api.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "WebClientEx", (function() {
            return WebClientEx;
        }));
        var s = i("./node_modules/@babel/runtime/helpers/defineProperty.js"), r = i.n(s);
        class WebClientEx {
            constructor(e, t) {
                r()(this, "version", "5.8.0"), r()(this, "token", void 0), r()(this, "logger", void 0), 
                r()(this, "JSON", void 0), r()(this, "admin", {
                    apps: {
                        approve: this.apiCall.bind(this, "admin.apps.approve"),
                        approved: {
                            list: this.apiCall.bind(this, "admin.apps.approved.list")
                        },
                        requests: {
                            list: this.apiCall.bind(this, "admin.apps.requests.list")
                        },
                        restrict: this.apiCall.bind(this, "admin.apps.restrict"),
                        restricted: {
                            list: this.apiCall.bind(this, "admin.apps.restricted.list")
                        }
                    },
                    conversations: {
                        setTeams: this.apiCall.bind(this, "admin.conversations.setTeams")
                    },
                    inviteRequests: {
                        approve: this.apiCall.bind(this, "admin.inviteRequests.approve"),
                        deny: this.apiCall.bind(this, "admin.inviteRequests.deny"),
                        list: this.apiCall.bind(this, "admin.inviteRequests.list"),
                        approved: {
                            list: this.apiCall.bind(this, "admin.inviteRequests.approved.list")
                        },
                        denied: {
                            list: this.apiCall.bind(this, "admin.inviteRequests.denied.list")
                        }
                    },
                    teams: {
                        admins: {
                            list: this.apiCall.bind(this, "admin.teams.admins.list")
                        },
                        create: this.apiCall.bind(this, "admin.teams.create"),
                        list: this.apiCall.bind(this, "admin.teams.list"),
                        owners: {
                            list: this.apiCall.bind(this, "admin.teams.owners.list")
                        },
                        settings: {
                            info: this.apiCall.bind(this, "admin.teams.settings.info"),
                            setDefaultChannels: this.apiCall.bind(this, "admin.teams.settings.setDefaultChannels"),
                            setDescription: this.apiCall.bind(this, "admin.teams.settings.setDescription"),
                            setDiscoverability: this.apiCall.bind(this, "admin.teams.settings.setDiscoverability"),
                            setIcon: this.apiCall.bind(this, "admin.teams.settings.setIcon"),
                            setName: this.apiCall.bind(this, "admin.teams.settings.setName")
                        }
                    },
                    users: {
                        session: {
                            reset: this.apiCall.bind(this, "admin.users.session.reset")
                        },
                        assign: this.apiCall.bind(this, "admin.users.assign"),
                        invite: this.apiCall.bind(this, "admin.users.invite"),
                        list: this.apiCall.bind(this, "admin.users.list"),
                        remove: this.apiCall.bind(this, "admin.users.remove"),
                        setAdmin: this.apiCall.bind(this, "admin.users.setAdmin"),
                        setExpiration: this.apiCall.bind(this, "admin.users.setExpiration"),
                        setOwner: this.apiCall.bind(this, "admin.users.setOwner"),
                        setRegular: this.apiCall.bind(this, "admin.users.setRegular")
                    }
                }), r()(this, "api", {
                    test: this.apiCall.bind(this, "api.test")
                }), r()(this, "auth", {
                    revoke: this.apiCall.bind(this, "auth.revoke"),
                    test: this.apiCall.bind(this, "auth.test")
                }), r()(this, "bots", {
                    info: this.apiCall.bind(this, "bots.info")
                }), r()(this, "channels", {
                    archive: this.apiCall.bind(this, "channels.archive"),
                    create: this.apiCall.bind(this, "channels.create"),
                    history: this.apiCall.bind(this, "channels.history"),
                    info: this.apiCall.bind(this, "channels.info"),
                    invite: this.apiCall.bind(this, "channels.invite"),
                    join: this.apiCall.bind(this, "channels.join"),
                    kick: this.apiCall.bind(this, "channels.kick"),
                    leave: this.apiCall.bind(this, "channels.leave"),
                    list: this.apiCall.bind(this, "channels.list"),
                    mark: this.apiCall.bind(this, "channels.mark"),
                    rename: this.apiCall.bind(this, "channels.rename"),
                    replies: this.apiCall.bind(this, "channels.replies"),
                    setPurpose: this.apiCall.bind(this, "channels.setPurpose"),
                    setTopic: this.apiCall.bind(this, "channels.setTopic"),
                    unarchive: this.apiCall.bind(this, "channels.unarchive")
                }), r()(this, "chat", {
                    delete: this.apiCall.bind(this, "chat.delete"),
                    deleteScheduledMessage: this.apiCall.bind(this, "chat.deleteScheduledMessage"),
                    getPermalink: this.apiCall.bind(this, "chat.getPermalink"),
                    meMessage: this.apiCall.bind(this, "chat.meMessage"),
                    postEphemeral: this.apiCall.bind(this, "chat.postEphemeral"),
                    postMessage: this.apiCall.bind(this, "chat.postMessage"),
                    scheduleMessage: this.apiCall.bind(this, "chat.scheduleMessage"),
                    scheduledMessages: {
                        list: this.apiCall.bind(this, "chat.scheduledMessages.list")
                    },
                    unfurl: this.apiCall.bind(this, "chat.unfurl"),
                    update: this.apiCall.bind(this, "chat.update")
                }), r()(this, "conversations", {
                    archive: this.apiCall.bind(this, "conversations.archive"),
                    close: this.apiCall.bind(this, "conversations.close"),
                    create: this.apiCall.bind(this, "conversations.create"),
                    history: this.apiCall.bind(this, "conversations.history"),
                    info: this.apiCall.bind(this, "conversations.info"),
                    invite: this.apiCall.bind(this, "conversations.invite"),
                    join: this.apiCall.bind(this, "conversations.join"),
                    kick: this.apiCall.bind(this, "conversations.kick"),
                    leave: this.apiCall.bind(this, "conversations.leave"),
                    list: this.apiCall.bind(this, "conversations.list"),
                    members: this.apiCall.bind(this, "conversations.members"),
                    open: this.apiCall.bind(this, "conversations.open"),
                    rename: this.apiCall.bind(this, "conversations.rename"),
                    replies: this.apiCall.bind(this, "conversations.replies"),
                    setPurpose: this.apiCall.bind(this, "conversations.setPurpose"),
                    setTopic: this.apiCall.bind(this, "conversations.setTopic"),
                    unarchive: this.apiCall.bind(this, "conversations.unarchive")
                }), r()(this, "views", {
                    open: this.apiCall.bind(this, "views.open"),
                    publish: this.apiCall.bind(this, "views.publish"),
                    push: this.apiCall.bind(this, "views.push"),
                    update: this.apiCall.bind(this, "views.update")
                }), r()(this, "dialog", {
                    open: this.apiCall.bind(this, "dialog.open")
                }), r()(this, "dnd", {
                    endDnd: this.apiCall.bind(this, "dnd.endDnd"),
                    endSnooze: this.apiCall.bind(this, "dnd.endSnooze"),
                    info: this.apiCall.bind(this, "dnd.info"),
                    setSnooze: this.apiCall.bind(this, "dnd.setSnooze"),
                    teamInfo: this.apiCall.bind(this, "dnd.teamInfo")
                }), r()(this, "emoji", {
                    list: this.apiCall.bind(this, "emoji.list")
                }), r()(this, "files", {
                    delete: this.apiCall.bind(this, "files.delete"),
                    info: this.apiCall.bind(this, "files.info"),
                    list: this.apiCall.bind(this, "files.list"),
                    revokePublicURL: this.apiCall.bind(this, "files.revokePublicURL"),
                    sharedPublicURL: this.apiCall.bind(this, "files.sharedPublicURL"),
                    upload: this.apiCall.bind(this, "files.upload"),
                    comments: {
                        delete: this.apiCall.bind(this, "files.comments.delete")
                    },
                    remote: {
                        info: this.apiCall.bind(this, "files.remote.info"),
                        list: this.apiCall.bind(this, "files.remote.list"),
                        add: this.apiCall.bind(this, "files.remote.add"),
                        update: this.apiCall.bind(this, "files.remote.update"),
                        remove: this.apiCall.bind(this, "files.remote.remove"),
                        share: this.apiCall.bind(this, "files.remote.share")
                    }
                }), r()(this, "groups", {
                    archive: this.apiCall.bind(this, "groups.archive"),
                    create: this.apiCall.bind(this, "groups.create"),
                    createChild: this.apiCall.bind(this, "groups.createChild"),
                    history: this.apiCall.bind(this, "groups.history"),
                    info: this.apiCall.bind(this, "groups.info"),
                    invite: this.apiCall.bind(this, "groups.invite"),
                    kick: this.apiCall.bind(this, "groups.kick"),
                    leave: this.apiCall.bind(this, "groups.leave"),
                    list: this.apiCall.bind(this, "groups.list"),
                    mark: this.apiCall.bind(this, "groups.mark"),
                    open: this.apiCall.bind(this, "groups.open"),
                    rename: this.apiCall.bind(this, "groups.rename"),
                    replies: this.apiCall.bind(this, "groups.replies"),
                    setPurpose: this.apiCall.bind(this, "groups.setPurpose"),
                    setTopic: this.apiCall.bind(this, "groups.setTopic"),
                    unarchive: this.apiCall.bind(this, "groups.unarchive")
                }), r()(this, "im", {
                    close: this.apiCall.bind(this, "im.close"),
                    history: this.apiCall.bind(this, "im.history"),
                    list: this.apiCall.bind(this, "im.list"),
                    mark: this.apiCall.bind(this, "im.mark"),
                    open: this.apiCall.bind(this, "im.open"),
                    replies: this.apiCall.bind(this, "im.replies")
                }), r()(this, "migration", {
                    exchange: this.apiCall.bind(this, "migration.exchange")
                }), r()(this, "mpim", {
                    close: this.apiCall.bind(this, "mpim.close"),
                    history: this.apiCall.bind(this, "mpim.history"),
                    list: this.apiCall.bind(this, "mpim.list"),
                    mark: this.apiCall.bind(this, "mpim.mark"),
                    open: this.apiCall.bind(this, "mpim.open"),
                    replies: this.apiCall.bind(this, "mpim.replies")
                }), r()(this, "oauth", {
                    access: this.apiCall.bind(this, "oauth.access"),
                    v2: {
                        access: this.apiCall.bind(this, "oauth.v2.access")
                    }
                }), r()(this, "pins", {
                    add: this.apiCall.bind(this, "pins.add"),
                    list: this.apiCall.bind(this, "pins.list"),
                    remove: this.apiCall.bind(this, "pins.remove")
                }), r()(this, "reactions", {
                    add: this.apiCall.bind(this, "reactions.add"),
                    get: this.apiCall.bind(this, "reactions.get"),
                    list: this.apiCall.bind(this, "reactions.list"),
                    remove: this.apiCall.bind(this, "reactions.remove")
                }), r()(this, "reminders", {
                    add: this.apiCall.bind(this, "reminders.add"),
                    complete: this.apiCall.bind(this, "reminders.complete"),
                    delete: this.apiCall.bind(this, "reminders.delete"),
                    info: this.apiCall.bind(this, "reminders.info"),
                    list: this.apiCall.bind(this, "reminders.list")
                }), r()(this, "rtm", {
                    connect: this.apiCall.bind(this, "rtm.connect"),
                    start: this.apiCall.bind(this, "rtm.start")
                }), r()(this, "search", {
                    all: this.apiCall.bind(this, "search.all"),
                    files: this.apiCall.bind(this, "search.files"),
                    messages: this.apiCall.bind(this, "search.messages")
                }), r()(this, "stars", {
                    add: this.apiCall.bind(this, "stars.add"),
                    list: this.apiCall.bind(this, "stars.list"),
                    remove: this.apiCall.bind(this, "stars.remove")
                }), r()(this, "team", {
                    accessLogs: this.apiCall.bind(this, "team.accessLogs"),
                    billableInfo: this.apiCall.bind(this, "team.billableInfo"),
                    info: this.apiCall.bind(this, "team.info"),
                    integrationLogs: this.apiCall.bind(this, "team.integrationLogs"),
                    profile: {
                        get: this.apiCall.bind(this, "team.profile.get")
                    }
                }), r()(this, "usergroups", {
                    create: this.apiCall.bind(this, "usergroups.create"),
                    disable: this.apiCall.bind(this, "usergroups.disable"),
                    enable: this.apiCall.bind(this, "usergroups.enable"),
                    list: this.apiCall.bind(this, "usergroups.list"),
                    update: this.apiCall.bind(this, "usergroups.update"),
                    users: {
                        list: this.apiCall.bind(this, "usergroups.users.list"),
                        update: this.apiCall.bind(this, "usergroups.users.update")
                    }
                }), r()(this, "users", {
                    conversations: this.apiCall.bind(this, "users.conversations"),
                    deletePhoto: this.apiCall.bind(this, "users.deletePhoto"),
                    getPresence: this.apiCall.bind(this, "users.getPresence"),
                    identity: this.apiCall.bind(this, "users.identity"),
                    info: this.apiCall.bind(this, "users.info"),
                    list: this.apiCall.bind(this, "users.list"),
                    lookupByEmail: this.apiCall.bind(this, "users.lookupByEmail"),
                    setPhoto: this.apiCall.bind(this, "users.setPhoto"),
                    setPresence: this.apiCall.bind(this, "users.setPresence"),
                    profile: {
                        get: this.apiCall.bind(this, "users.profile.get"),
                        set: this.apiCall.bind(this, "users.profile.set")
                    }
                }), this.token = e, this.logger = t;
            }
            apiCall(e, t) {
                let i = typeof t;
                if ("string" === i || "number" === i || "boolean" === i) {
                    throw new Error("Expected an options argument but instead received a " + i);
                }
                /test/i.test(e) || /oauth/i.test(e) || (t.token = t.token || this.token);
                let s = 0 == e.indexOf("https") ? e : "https://slack.com/api/" + e, r = this.makeRequest(s, t);
                return this.buildResult(r);
            }
            makeRequest(e, t) {
                try {
                    let i = {
                        method: "post",
                        muteHttpExceptions: !0,
                        payload: this.JSON ? JSON.stringify(t) : t
                    };
                    this.JSON && (i.contentType = "application/json; charset=utf-8", i.headers = {
                        Authorization: "Bearer " + t.token
                    }, delete t.token);
                    let s = UrlFetchApp.fetch(e, i), r = s.getResponseCode();
                    if (429 == r) {
                        let e = this.parseRetryHeaders(s.getHeaders());
                        void 0 !== e && this.logger && this.logger.error(`API Call failed due to rate limiting. Will retry in ${e} seconds.`);
                    }
                    return 200 != r ? this.logger && this.logger.error(s.getContentText()) : this.logger && this.logger.debug(s.getContentText()), 
                    s;
                } catch (e) {
                    this.logger && this.logger.error("HTTP request failed. " + e.message);
                }
            }
            buildResult(e) {
                let t = e.getHeaders(), i = t["Content-Type"], s = i && i.indexOf("json") >= 0, r = e.getContentText(), n = s ? JSON.parse(r) : {
                    ok: !0
                };
                null == n.response_metadata && (n.response_metadata = {}), void 0 !== t["x-oauth-scopes"] && (n.response_metadata.scopes = t["x-oauth-scopes"].trim().split(/\s*,\s*/)), 
                void 0 !== t["x-accepted-oauth-scopes"] && (n.response_metadata.acceptedScopes = t["x-accepted-oauth-scopes"].trim().split(/\s*,\s*/));
                let a = this.parseRetryHeaders(e);
                return void 0 !== a && (n.response_metadata.retryAfter = a), n.response_metadata.warnings && n.response_metadata.warnings.forEach((e => this.logger.warn(e))), 
                n;
            }
            parseRetryHeaders(e) {
                if (void 0 !== e["retry-after"]) {
                    let t = parseInt(e["retry-after"], 10);
                    if (!Number.isNaN(t)) {
                        return t;
                    }
                }
            }
        }
    },
    "./www/app.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "doGet", (function() {
            return doGet;
        })), i.d(t, "doPost", (function() {
            return doPost;
        })), i.d(t, "onOpen", (function() {
            return onOpen;
        })), i.d(t, "authorizeScript", (function() {
            return authorizeScript;
        })), i.d(t, "initSettings", (function() {
            return initSettings;
        }));
        var s = i("./node_modules/travix-di/index.js"), r = i("./gservlet/common/cache.ts"), n = i("./gservlet/common/configuration.ts"), a = i("./gservlet/common/filter.ts"), o = i("./gservlet/common/html.ts");
        i.d(t, "_", (function() {
            return o._;
        })), i.d(t, "html", (function() {
            return o.html;
        })), i.d(t, "js", (function() {
            return o.js;
        })), i.d(t, "css", (function() {
            return o.css;
        }));
        var l = i("./gservlet/common/handler.ts"), c = i("./gservlet/common/logger.ts"), u = i("./gservlet/common/servlet.ts"), h = i("./gservlet/container.ts"), d = i("./gservlet/http.ts"), p = i("./gservlet/interfaces.ts"), g = i("./slack/common/handler.ts"), m = i("./slack/http.ts"), f = i("./www/message.ts"), v = i("./www/slash-translate.ts");
        let b = PropertiesService.getScriptProperties().getProperty("app.name") || f.Message.SettingAppName, isProduction = () => {
            let e = PropertiesService.getScriptProperties().getProperty("app.env");
            return 0 !== parseInt(e);
        };
        function doGet(e) {
            let t = new h.ServletContainer;
            return t.init(getConfig(), getDI()), t.processRequest("GET", e);
        }
        function doPost(e) {
            let t = new h.ServletContainer;
            return t.init(getConfig(), getDI()), t.processRequest("POST", e);
        }
        function onOpen(e) {
            try {
                let e = SpreadsheetApp.getActive(), t = [ {
                    name: f.Message.MenuItemAuthorize,
                    functionName: "authorizeScript"
                }, {
                    name: f.Message.MenuItemInitSettings,
                    functionName: "initSettings"
                } ];
                e.addMenu(b, t), SpreadsheetApp.getUi().createMenu(b).addItem(f.Message.MenuItemAuthorize, "authorizeScript").addItem(f.Message.MenuItemInitSettings, "initSettings").addToUi();
            } catch (e) {
                errBox(e);
            }
        }
        function authorizeScript() {
            try {
                msgBox(ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL).getAuthorizationStatus() == ScriptApp.AuthorizationStatus.REQUIRED ? f.Message.AuthorizationFailed : f.Message.AuthorizationSuccess);
            } catch (e) {
                errBox(e);
            }
        }
        function initSettings() {
            let e = getDI();
            try {
                let t = e.get("IConfiguration"), i = {
                    "app.name": f.Message.SettingAppName,
                    "app.clientId": "<value>",
                    "app.clientSecret": "<value>",
                    "app.teamId": "<value>",
                    "app.gsuite": "<value>",
                    "app.logLevel": "1",
                    "app.env": "1",
                    "bot.scopes": "commands,chat:write,channels:history,groups:history,im:history,mpim:history",
                    "bot.token": "<value>",
                    "slash.translate": "translate"
                };
                Object.keys(i).forEach((e => {
                    t.get(e) || t.set(e, i[e]);
                })), msgBox(f.Message.MsgConfigSettings);
            } catch (t) {
                e.get("ILogger").error(`${t.message}\n${t.stack}`), errBox(t);
            }
        }
        function getConfig() {
            let e = getDI().get("IConfiguration"), t = e.get("bot.scopes") || "commands,chat:write", i = e.get("bot.token"), s = e.get("app.clientId"), r = e.get("app.clientSecret"), n = e.get("app.teamId"), a = e.get("app.gsuite"), l = e.get("app.logLevel", p.LogLevel.Info), c = e.get("slash.translate") || "translate", u = {
                name: b,
                description: "",
                servlets: [ {
                    name: "LoginServlet",
                    param: {
                        state: "install",
                        scopes: t,
                        gsuite: a,
                        clientId: s,
                        teamId: n
                    }
                }, {
                    name: "OAuthServlet",
                    param: {
                        installState: "install",
                        token: i,
                        gsuite: a,
                        clientId: s,
                        clientSecret: r
                    }
                }, {
                    name: "SlashTranslateServlet",
                    param: {
                        token: i
                    }
                } ],
                filters: [],
                routes: [ {
                    method: "get",
                    handlers: [ () => Object(o.render)("views/404", null, b) ],
                    patterns: [ "/404" ]
                }, {
                    method: "get",
                    handlers: [ () => Object(o.render)("views/index", null, b) ],
                    patterns: [ "/" ]
                }, {
                    method: "get",
                    handlers: [ "LoginServlet" ],
                    patterns: [ "/slack/login" ]
                }, {
                    method: "get",
                    handlers: [ "OAuthServlet" ],
                    patterns: [ "/slack/oauth/code/:code/state/:state" ]
                }, {
                    method: "get",
                    handlers: [ () => Object(o.render)("views/index", null, b) ],
                    patterns: [ "/slack/oauth/approved" ]
                }, {
                    method: "get",
                    handlers: [ () => Object(o.render)("views/error", null, b) ],
                    patterns: [ "/slack/oauth/error" ]
                }, {
                    method: "get",
                    handlers: [ (e, t) => Object(o.render)("views/success", {
                        team: e,
                        bot: t
                    }, b) ],
                    patterns: [ "/slack/oauth/success/:team/:bot" ]
                }, {
                    method: "post",
                    handlers: [ () => Object(m.ack)() ],
                    patterns: [ "/slack/ssl_check" ]
                }, {
                    method: "post",
                    handlers: [ e => Object(o.text)(e) ],
                    patterns: [ "/slack/url_verification/:challenge" ]
                }, {
                    method: "post",
                    handlers: [ "SlashTranslateServlet" ],
                    patterns: [ "/slack/command/" + c, "/slack/action/message_action/athena_translate", "/slack/action/view_submission/athena_translate" ]
                } ]
            };
            return isProduction() || u.filters.push({
                name: "LogFilter",
                order: 0,
                param: {
                    level: l
                }
            }), u;
        }
        function getDI() {
            let e = PropertiesService.getScriptProperties(), t = e.getProperty("app.logLevel") || p.LogLevel.Info, i = [];
            isProduction() ? (i.push({
                name: "logLevel",
                useValue: t
            }), i.push({
                name: "ILogger",
                useClass: c.NullLogger,
                deps: [ "logLevel" ]
            })) : (i.push({
                name: "SheetLoggerConfig",
                useValue: {
                    name: "Logs",
                    id: null,
                    level: t
                }
            }), i.push({
                name: "ILogger",
                useClass: c.SheetLogger,
                deps: [ "SheetLoggerConfig" ]
            })), i = i.concat([ {
                name: "gsuite",
                useValue: e.getProperty("app.gsuite")
            }, {
                name: "IRedirectHandler",
                useClass: l.RedirectHandler,
                deps: [ "gsuite" ]
            }, {
                name: "NotFoundServlet",
                useClass: u.JSONNotFoundServlet
            }, {
                name: "IHandler",
                useClass: g.SlackHandler
            }, {
                name: "ServletRequest",
                useClass: d.HttpServletRequest
            }, {
                name: "ServletResponse",
                useClass: d.HttpServletResponse
            }, {
                name: "IConfiguration",
                useClass: n.Configuration
            }, {
                name: "CacheService",
                useValue: CacheService.getScriptCache()
            }, {
                name: "ICache",
                useClass: r.CacheProvider,
                deps: [ "ILogger", "CacheService" ]
            }, {
                name: "LogFilter",
                useClass: a.LogFilter,
                deps: [ "ILogger" ]
            }, {
                name: "LoginServlet",
                useClass: m.LoginServlet
            }, {
                name: "OAuthServlet",
                useClass: m.OAuthServlet,
                deps: [ "ILogger", "IConfiguration" ]
            }, {
                name: "SlashTranslateServlet",
                useClass: v.SlashTranslateServlet,
                deps: [ "ILogger" ]
            } ]);
            const o = Object(s.createContainer)(i);
            return Object(s.resolveContainer)(o);
        }
        function msgBox(e) {
            Browser.msgBox(b, e, Browser.Buttons.OK);
        }
        function errBox(e) {
            msgBox(`${e.message}\n${e.stack}`);
        }
    },
    "./www/common/google-translate-api.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "getLanguages", (function() {
            return getLanguages;
        })), i.d(t, "isSupported", (function() {
            return isSupported;
        })), i.d(t, "translate", (function() {
            return translate;
        }));
        let s = null, wr = function(e) {
            return function() {
                return e;
            };
        }, xr = function(e, t) {
            for (let i = 0; i < t.length - 2; i += 3) {
                let s = t.charAt(i + 2);
                s = s >= "a" ? s.charCodeAt(0) - 87 : Number(s), s = "+" == t.charAt(i + 1) ? e >>> s : e << s, 
                e = "+" == t.charAt(i) ? e + s & 4294967295 : e ^ s;
            }
            return e;
        };
        const r = {}, n = {
            TKK: r.TKK || "0"
        };
        function generate(e) {
            !function updateTKK() {
                let e = Math.floor(Date.now() / 36e5);
                if (Number(n.TKK.split(".")[0]) !== e) {
                    const e = UrlFetchApp.fetch("https://translate.google.com").getContentText().match(/tkk:'\d+.\d+'/g);
                    if (e && e.length > 0) {
                        const t = e[0].split(":")[1].replace(/'/g, "");
                        n.TKK = t, r.TKK = t;
                    }
                }
            }();
            let t = function zr(e) {
                let t;
                if (null !== s) {
                    t = s;
                } else {
                    t = wr(String.fromCharCode(84));
                    let e = wr(String.fromCharCode(75));
                    t = [ t(), t() ], t[1] = e(), t = (s = n[t.join(e())] || "") || "";
                }
                let i = wr(String.fromCharCode(116)), r = wr(String.fromCharCode(107));
                i = [ i(), i() ], i[1] = r(), r = "&" + i.join("") + "=", i = t.split("."), t = Number(i[0]) || 0;
                for (var a = [], o = 0, l = 0; l < e.length; l++) {
                    let t = e.charCodeAt(l);
                    128 > t ? a[o++] = t : (2048 > t ? a[o++] = t >> 6 | 192 : (55296 == (64512 & t) && l + 1 < e.length && 56320 == (64512 & e.charCodeAt(l + 1)) ? (t = 65536 + ((1023 & t) << 10) + (1023 & e.charCodeAt(++l)), 
                    a[o++] = t >> 18 | 240, a[o++] = t >> 12 & 63 | 128) : a[o++] = t >> 12 | 224, a[o++] = t >> 6 & 63 | 128), 
                    a[o++] = 63 & t | 128);
                }
                e = t;
                for (let t = 0; t < a.length; t++) {
                    e += a[t], e = xr(e, "+-a^+6");
                }
                return e = xr(e, "+-3^+b+-f"), 0 > (e ^= Number(i[1]) || 0) && (e = 2147483648 + (2147483647 & e)), 
                r + ((e %= 1e6).toString() + ".") + (e ^ t);
            }(e);
            return t = t.replace("&tk=", ""), {
                name: "tk",
                value: t
            };
        }
        const a = {
            auto: "Automatic",
            af: "Afrikaans",
            sq: "Albanian",
            am: "Amharic",
            ar: "Arabic",
            hy: "Armenian",
            az: "Azerbaijani",
            eu: "Basque",
            be: "Belarusian",
            bn: "Bengali",
            bs: "Bosnian",
            bg: "Bulgarian",
            ca: "Catalan",
            ceb: "Cebuano",
            ny: "Chichewa",
            "zh-cn": "Chinese Simplified",
            "zh-tw": "Chinese Traditional",
            co: "Corsican",
            hr: "Croatian",
            cs: "Czech",
            da: "Danish",
            nl: "Dutch",
            en: "English",
            eo: "Esperanto",
            et: "Estonian",
            tl: "Filipino",
            fi: "Finnish",
            fr: "French",
            fy: "Frisian",
            gl: "Galician",
            ka: "Georgian",
            de: "German",
            el: "Greek",
            gu: "Gujarati",
            ht: "Haitian Creole",
            ha: "Hausa",
            haw: "Hawaiian",
            iw: "Hebrew",
            hi: "Hindi",
            hmn: "Hmong",
            hu: "Hungarian",
            is: "Icelandic",
            ig: "Igbo",
            id: "Indonesian",
            ga: "Irish",
            it: "Italian",
            ja: "Japanese",
            jw: "Javanese",
            kn: "Kannada",
            kk: "Kazakh",
            km: "Khmer",
            ko: "Korean",
            ku: "Kurdish (Kurmanji)",
            ky: "Kyrgyz",
            lo: "Lao",
            la: "Latin",
            lv: "Latvian",
            lt: "Lithuanian",
            lb: "Luxembourgish",
            mk: "Macedonian",
            mg: "Malagasy",
            ms: "Malay",
            ml: "Malayalam",
            mt: "Maltese",
            mi: "Maori",
            mr: "Marathi",
            mn: "Mongolian",
            my: "Myanmar (Burmese)",
            ne: "Nepali",
            no: "Norwegian",
            ps: "Pashto",
            fa: "Persian",
            pl: "Polish",
            pt: "Portuguese",
            pa: "Punjabi",
            ro: "Romanian",
            ru: "Russian",
            sm: "Samoan",
            gd: "Scots Gaelic",
            sr: "Serbian",
            st: "Sesotho",
            sn: "Shona",
            sd: "Sindhi",
            si: "Sinhala",
            sk: "Slovak",
            sl: "Slovenian",
            so: "Somali",
            es: "Spanish",
            su: "Sundanese",
            sw: "Swahili",
            sv: "Swedish",
            tg: "Tajik",
            ta: "Tamil",
            te: "Telugu",
            th: "Thai",
            tr: "Turkish",
            uk: "Ukrainian",
            ur: "Urdu",
            uz: "Uzbek",
            vi: "Vietnamese",
            cy: "Welsh",
            xh: "Xhosa",
            yi: "Yiddish",
            yo: "Yoruba",
            zu: "Zulu"
        };
        function getLanguages() {
            return a;
        }
        function getISOCode(e) {
            if (!e) {
                return null;
            }
            if ((e = e.toLowerCase()) in a) {
                return e;
            }
            return Object.keys(a).filter((t => "string" != typeof a[t] ? null : a[t].toLowerCase() === e))[0] || null;
        }
        function isSupported(e) {
            return Boolean(getISOCode(e));
        }
        function translate(e, t = {
            from: "auto",
            to: "en",
            raw: !1
        }) {
            let i;
            if ([ t.from, t.to ].forEach((e => {
                e && !isSupported(e) && (i = {}, i.code = 400, i.message = `The language '${e}' is not supported.`);
            })), i) {
                throw i;
            }
            t.from = getISOCode(t.from), t.to = getISOCode(t.to);
            let s, r = generate(e), n = "https://translate.google.com/translate_a/single", a = {
                client: "gtx",
                sl: t.from,
                tl: t.to,
                hl: t.to,
                dt: [ "at", "bd", "ex", "ld", "md", "qca", "rw", "rm", "ss", "t" ],
                ie: "UTF-8",
                oe: "UTF-8",
                otf: 1,
                ssel: 0,
                tsel: 0,
                kc: 7,
                q: e,
                [r.name]: r.value
            }, queryString = () => Object.keys(a).map((function(e) {
                return Array.isArray(a[e]) ? a[e].join(`&${e}=`) : e + "=" + encodeURI(a[e]);
            })).join("&"), o = `${n}?${queryString()}`;
            o.length > 2048 ? (delete a.q, o = `${n}?${queryString()}`, s = {
                method: "post",
                payload: {
                    q: e
                },
                followRedirects: !0,
                muteHttpExceptions: !0
            }) : s = {
                method: "get",
                followRedirects: !0,
                muteHttpExceptions: !0
            };
            let l = UrlFetchApp.fetch(o, s).getContentText(), c = {
                text: "",
                from: {
                    language: {
                        didYouMean: !1,
                        iso: ""
                    },
                    text: {
                        autoCorrected: !1,
                        value: "",
                        didYouMean: !1
                    }
                },
                raw: ""
            };
            t.raw && (c.raw = l);
            let u = JSON.parse(l);
            if (u[0].forEach((e => {
                e[0] && (c.text += e[0]);
            })), u[2] === u[8][0][0] ? c.from.language.iso = u[2] : (c.from.language.didYouMean = !0, 
            c.from.language.iso = u[8][0][0]), u[7] && u[7][0]) {
                let e = u[7][0];
                e = e.replace(/<b><i>/g, "["), e = e.replace(/<\/i><\/b>/g, "]"), c.from.text.value = e, 
                !0 === u[7][5] ? c.from.text.autoCorrected = !0 : c.from.text.didYouMean = !0;
            }
            return c;
        }
    },
    "./www/message.ts": function(e, t, i) {
        "use strict";
        let s;
        i.r(t), i.d(t, "Message", (function() {
            return s;
        })), function(e) {
            e.MenuItemAuthorize = "Authorize", e.MenuItemInitSettings = "Init Settings", e.AuthorizationFailed = "Authorization Failed", 
            e.AuthorizationSuccess = "Authorization Success", e.SettingAppName = "GSlack", e.MsgConfigSettings = "Please configure the initialized settings", 
            e.FormCallbackId = "athena_translate", e.FormTitleField = "Translate Text", e.FormFromField = "From", 
            e.FormToField = "To", e.FormTextField = "Text", e.FormTranslateButton = "Translate", 
            e.FormCloseButton = "Close";
        }(s || (s = {}));
    },
    "./www/slash-translate.ts": function(e, t, i) {
        "use strict";
        i.r(t), i.d(t, "SlashTranslateServlet", (function() {
            return SlashTranslateServlet;
        }));
        var s = i("./slack/http.ts"), r = i("./slack/ui.ts"), n = i("./www/common/google-translate-api.ts"), a = i("./www/message.ts");
        class SlashTranslateServlet extends s.SlackServlet {
            constructor({ILogger: e}) {
                super({
                    ILogger: e
                });
            }
            async doPost(e, t) {
                this.bot.ack(t);
                let i = e.query, r = e.items[this.Slack], n = r, a = r;
                try {
                    if (i.command) {
                        this.onSlash(i);
                    } else if (n.callback_id) {
                        this.onAction(n);
                    } else if (a.view && a.view.state) {
                        let e = JSON.parse(a.view.private_metadata), t = Object(s.extractViewSubmission)(a.view.state.values);
                        this.onSubmission(e, t);
                    }
                } catch (e) {
                    this.bot.replyPrivateDelayed(i || n, `${e.message}\n${e.stack}`), this.logger.error(`SlashTranslateServlet -> ${e.message}\n${e.stack}`);
                }
            }
            onSubmission(e, t) {
                let i = Object(n.translate)(t.text, {
                    from: t.from,
                    to: t.to
                });
                this.bot.replyPrivate(e, i.text);
            }
            onSlash(e) {
                let t = e.text;
                if (t) {
                    let i = (t.split(/\s+/gi)[0] || "en").trim(), s = t.substr(t.indexOf(i) + i.length).trim();
                    if (Object(n.isSupported)(i)) {
                        let t = Object(n.translate)(s, {
                            from: "auto",
                            to: i
                        });
                        this.bot.replyPublicDelayed(e, t.text);
                    } else {
                        this.bot.replyPrivateDelayed(e, `:boom: ${i} not supported`);
                    }
                } else {
                    this.buildDialog(e.trigger_id, "", Object(s.getMetadata)(e));
                }
            }
            onAction(e) {
                this.buildDialog(e.trigger_id, e.message.text, Object(s.getMetadata)(e));
            }
            buildDialog(e, t, i) {
                let s = Object(n.getLanguages)(), o = [];
                Object.keys(s).forEach((e => o.push(r.UIFactory.createOption(s[e], e))));
                let l = r.UIFactory.createOption(s.auto, "auto"), c = r.UIFactory.createOption(s.en, "en"), u = new r.ModalView(a.Message.FormTitleField, a.Message.FormCallbackId, a.Message.FormTranslateButton, a.Message.FormCloseButton, JSON.stringify(i)), h = r.UIFactory.createStaticSelect("from", null, o, null, l);
                u.addInput(a.Message.FormFromField, h, !1);
                let d = r.UIFactory.createStaticSelect("to", null, o, null, c);
                u.addInput(a.Message.FormToField, d, !1);
                let p = r.UIFactory.createPlainTextInput("text", !0, null, t);
                u.addInput(a.Message.FormTextField, p), this.bot.api.JSON = !0, this.bot.api.views.open({
                    trigger_id: e,
                    view: u.getView()
                });
            }
        }
    }
});