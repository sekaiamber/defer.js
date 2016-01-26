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
    // global key
    var _key = new Date().valueOf();
    // cache
    var _temp = undefined;
    // entrance
    var factory = function(func, key) {
        // defer(a) and defer(defer(a)) have same return
        if (func && func.__defer__) {
            func.clearArgs();
            return func;
        }
        // using closure to hide the arguments
        var args = [];
        // return our defer function
        var obj = function() {
            if (typeof func !== 'function') { return; }
            var _args = [].slice.call(arguments);
            // if the function get arguments, we use them to call the original function
            if (_args.length == 0) {
                _args = args;
            }
            var _context = obj.context || this;
            // we call the function immediately
            return func.apply(_context, _args);
        }
        // important: when call 'a >> b' operator, js will call a.valueOf and b.valueOf
        // we use valueOf() to pass and get data to cache
        obj.valueOf = function() {
            if (this.multiargs) {
                _temp = args.concat([func]); 
            } else {
                args = args.concat(_temp);
                _temp = [func];
            }
            if (typeof func === 'function' && this.autorun && func.length <= args.length) {
                var _context = this.context || this;
                this.value = func.apply(_context, args);
            }
            // hide our defer function
            return func.valueOf();
        }
        // hide our defer function
        obj.toString = function() {
            return func.toString();
        }
        // if the data is a function, we support 'call' and 'apply', and give a function to set context
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
        }
        obj.clearArgs = function() {
            args = [];
        }
        obj.autorun = false;
        obj.setAutorun = function(at) {
            this.autorun = at;
            return this;
        };
        obj.setMultiArgs = function() {
            args = [].slice.call(arguments);
            this.multiargs = true;
            return this;
        };
        // give the sign and key
        obj.__defer__ = key;
        return obj;
    }

    function defer(value) {
        var _args = [].slice.call(arguments);
        if (_args.length !== 1) {
            // support defer(a, b, ...)
            var ret = factory(_args.pop(), _key++).setAutorun(false);
            ret.setMultiArgs.apply(ret, _args);
            return ret;
        } else {
            return factory(value, _key++);
        }
    }

    global.defer = defer;
})(this);