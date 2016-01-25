/*
 * defer.js
 *
 * Copyright 2016 Xu Xiaomeng(@sekaiamber)
 *
 * Released under the MIT and GPL Licenses.
 *
 * ------------------------------------------------
 *  author:  Xu Xiaomeng
 *  version: 0.1
 *  source:  github.com/sekaiamber/defer.js
 */

(function(global) {
    var _key = new Date().valueOf();
    var _temp = undefined;

    var factory = function(func, key) {
        var args = [];
        var obj = function() {
            if (typeof func !== 'function') { return; }
            var _args = [].slice.call(arguments);
            if (_args.length == 0) {
                _args = args;
            }
            var _context = obj.context || this;
            return func.apply(_context, _args);
        }
        obj.valueOf = function() {
            args.push(_temp);
            _temp = func;
            if (typeof func === 'function' && this.autorun && func.length == args.length) {
                var _context = this.context || this;
                func.apply(_context, args);
            }
            return func.valueOf();
        }
        obj.toString = function() {
            return func.toString();
        }
        if (typeof func === 'function') {
            obj.call = function() {
                var _args = [].slice.call(arguments);
                return func.apply(_args.shift(), _args);
            };
            obj.apply = function(v1, v2) {
                return func.apply(v1, v2);
            };
            obj.currentArgs = function() {
                return args;
            };
            this.context = undefined;
            obj.setContext = function(ctxt) {
                this.context = ctxt;
                return this;
            };
            obj.autorun = false;
            obj.setAutorun = function(at) {
                this.autorun = at;
                return this;
            };
        }
        obj.__defer__ = _key;
        return obj;
    }

    function defer(value) {
        return factory(value, _key++);
    }

    global.defer = defer;
})(this);