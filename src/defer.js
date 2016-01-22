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
    var _temp = undefined;

    var factory = function(func, key) {
        var args = [];
        var context = undefined;
        var obj = function() {
            if (typeof func !== 'function') { return; }
            // if there are arguments input, we push them to the end of args.
            var _args = [].slice.call(arguments);
            if (_args.length == 0) {
                _args = args;
            }
            var _context = context || this;
            return func.apply(_context, _args);
        }
        obj.valueOf = function() {
            args.push(_temp);
            _temp = func;
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
            obj.setContext = function(ctxt) {
                context = ctxt;
                return this;
            }
        }
        obj.__defer__ = true;
        return obj;
    }

    function defer(value) {
        // let user decide the scope of context
        return factory(value, typeof value);
    }

    global.defer = defer;
})(this);