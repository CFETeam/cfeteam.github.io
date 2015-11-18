title: Scoped Reality
date: 2015-11-18 12:12:58
tags:
  - javascript
author: miusuncle
---

> 有人叫她“熟食铺子”，因为只有熟食店会把那许多颜色暖热的肉公开陈列；
> 又有人叫她“真理”，因为据说“真理是赤裸裸的”；
> 而鲍小姐并未一丝不挂，所以他们修正为“局部的真理”。
> 　　　　　　　　　　　　　　　　　　　　　　　　　《围城》 — 钱钟书


```javascript
/**
 * Execute javascript code within specific scope
 * @param  {Function} fn      scoped function
 * @param  {Object}   imports An object defines required local variables
 * @return {Function}         A function that can trigger to run code in specific scope
 */
function scopedRunner(fn, imports) {
  var rfunc = /^function\s+(?:[^(]*)\(([^)]*)\)\s*{([^]*)}$/;
  var found = String(fn).match(rfunc) || [,,'return ' + fn];
  var args = found[1] || '';
  var stmt = found[2] || '';

  var body = Object.keys(imports || {}).reduce(function (ret, key, idx) {
    return ret + (idx ? ', ' : 'var ') + key + ' = __locals__["' + key + '"]';
  }, '') + '; return function (' + args + ') {' + stmt + '};';

  return Function('__locals__', body).call(null, imports);
}
```

The following are some examples.

```javascript
// e.g 1
void function () {
   scopedRunner(
     function (m, n) {
       var result = (x + y) + (m + n);
       console.log('The meaning of life is:', result);  //=> 42
     },
     { x: 10, y: 1 }
   ).call(null, 30, 1);
}();
```

```javascript
// e.g 2
void function () {
  var result = scopedRunner(
    'times(a, b)',
    { a: 6, b: 7, times: (x, y) => x * y }
  )();

  console.log('The meaning of life is:', result);      //=> 42
}();
```

```javascript
// e.g 3
Object.prototype.__eval = function (expr) { return scopedRunner(expr, this)(); };

void function () {
  var obj = { a: 6, b: 7, times: (x, y) => x * y };
  var result = obj.__eval('times(a, b)');

  console.log('The meaning of life is:', result);      //=> 42
}();
```

```javascript
// e.g 4
var take = (scope => scopedRunner(scope.eval, scope.with)());

void function () {
  var a = 6, b = 7, times = (a, b) => a * b;

  // take result out from evaluated value within specific scope
  var result = take({
    with: { a, b, times },
    eval: 'times(a, b)'
  });

  console.log('The meaning of life is:', result);      //=> 42
}();
```

```javascript
// e.g 5
var invoke = scopedRunner((fn, ...args) => fn.apply(null, args))();

void function () {
  var result = invoke((a, b) => a + b, 6, 7);
  console.log('The meaning of life is:', result);      //=> 13
}();
```