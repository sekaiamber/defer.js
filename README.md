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
**Note**: `defer()` function does not change the prototype of `function` or other types. Actually, it modify the `toString(), call(), apply()...` of the return function.

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
sum(); // 3
```

## LICENSE

Copyright 2016 XU XIAOMENG([@sekaiamber](http://github.com/sekaiamber))

Released under the MIT and GPL(v2 or later) License.
