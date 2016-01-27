# defer.js

Version v0.1

## Introduction

This is a project help user to call their function wherever and whenever they like. This is designed to solve the 'callback hell' problem.

## Contributing

Feel free to make a pull request. :)

## Usage

Use `defer()` to package your function, the return function is almost the same with the with the original function:
```javascript
var sum = function(a, b) {
    return a + b;
}
sum(1, 2); // 3
sum.call(this, 1, 2); // 3
sum.apply(this, [1, 2]); // 3
sum.toString(); // source of sum()

sum = defer(sum);
sum(1, 2); // 3
sum.call(this, 1, 2); // 3
sum.apply(this, [1, 2]); // 3
sum.toString(); // source of the original sum()
```
**Note**: `defer()` function does not change the prototype of `function` or other types.

When function is packaged with `defer`, there are something changed, we can use `>>` operator to pass the argument to the function, and it can store the argument temporarily, and then you can call the function itself at any time:
```javascript
var sum = defer(function(a, b) {
    return a + b;
});

// pass value 1 to the sum.
// use defer to package argument,
// use >> to pass to the function.
defer(1) >> sum;

// some code ...

// pass the 2nd argument.
defer(2) >> sum;

// some code ...

// call function, and with no argument pass in.
sum(); // 3
```
Some times, we don't need to pass all arguments to a function:
```javascript
var sum = function(a, b) {
    b = b || 2;
    return a + b;
};

sum(1) // 3
sum(1, 3) // 4

sum = defer(sum);

defer(1) >> sum;
sum(); // 3, the same with sum(1)

// clear the stored arguments
defer(sum);
// use defer(arg1, arg2, ..) to pass
// more than one arguments to the function
defer(1, 3) >> sum;
sum(); // 4, the same with sum(1, 3)  
```
Also, `defer` support autorun a function when the stored arguments fit the length of the list of arguments which the function needed:
```javascript
var sum = defer(function(a, b) {
    console.log(a + b);
    return a + b;
}).setAutorun(true); // set the function to autorun

defer(1) >> sum; // nothing happen.
defer(2) >> sum; // call sum(), console.log(3)

var return_value = sum.value; // 3
```
What's more, `defer` can invoke a function and specifying the context for `this`:
```javascript
var sum = defer(function() {
    console.log(this.a + this.b);
});

var obj1 = { a: 1, b: 2 }
var obj2 = { a: 2, b: 3 }

sum.setContext(obj1)(); // 3 
sum.setContext(obj2)(); // 5
```
And a `defer` argument can be use in more than one functions:
```javascript
var sum = defer(function(a) {
    console.log(a + 1);
});
var sub = defer(function(a) {
    console.log(a - 1);
});
var arg1 = defer(1);

arg1 >> sum;
sum(); // 2

arg1 >> sub;
sub(); // 0
```
Let's see how `defer` help to solve the 'callback hell' problem. A real example, some code may like this:
```javascript
var step1 = function(fx) {
    var start = 1;
    fx(start);
};
var step2 = function(prep, fx) {
    var next = prep + 1;
    fx(next);
};
var step3 = function(prep, fx) {
    var next = prep + 1;
    fx(next);
};
var step4 = function(prep, fx) {
    var next = prep + 1;
    fx(next);
};
step1(function (value1) {
    value1 *= 2;
    step2(value1, function(value2) {
        value2 *= 2;
        step3(value2, function(value3) {
            value3 *= 2;
            step4(value3, function(value4) {
                console.log(value4);  // 15
            });
        });
    });
});
```
Too many `function` and `})` comfused a lot. So we use `defer`:
```javascript
// the same with previous code
var step1 = function(fx) {
    var start = 1;
    fx(start);
};
var step2 = function(prep, fx) {
    var next = prep + 1;
    fx(next);
};
var step3 = function(prep, fx) {
    var next = prep + 1;
    fx(next);
};
var step4 = function(prep, fx) {
    var next = prep + 1;
    fx(next);
};

// package each function, and switch them to autorun.
step1 = defer(step1).setAutorun(true);
step2 = defer(step2).setAutorun(true);
step3 = defer(step3).setAutorun(true);
step4 = defer(step4).setAutorun(true);

// step1 run automatically, because it only need one argument
defer(function(value1) {
    value1 *= 2;
    // pass the 1st argument to step2, and waiting for the 2nd argument
    defer(value1) >> step2;
}) >> step1;
// pass the 2nd arg to step2, and step2 run automatically
defer(function(value2) {
    value2 *= 2;
    defer(value2) >> step3;
}) >> step2;
defer(function(value3) {
    value3 *= 2;
    defer(value3) >> step4;
}) >> step3;
defer(function(value4) {
    console.log(value4); // 15
}) >> step4;
```
You can see, use `defer` can flatten the "[Pyramid of Doom](http://calculist.org/blog/2011/12/14/why-coroutines-wont-work-on-the-web/)"

## LICENSE

Copyright 2016 XU XIAOMENG([@sekaiamber](http://github.com/sekaiamber))

Released under the MIT and GPL(v2 or later) License.
