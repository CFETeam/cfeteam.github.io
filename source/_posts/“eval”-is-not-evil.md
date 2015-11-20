title: “eval” is not evil
date: 2015-11-19 18:06:19
tags:
  - javascript
  - eval
  - scope
author: miusuncle
---

一般我们代码几乎不会使用到`eval`, 但凡需要使用到`eval`的地方，都会代而`使用构造器Function生成函数实例`的方式，因为`eval is evil`。`eval`可以在全局作域下执行代码，也可以在局部作用域（间接调用`eval`）下执行代码。而`使用构造器Function生成函数实例`的方式，可以确保我们的代码是在全局作用域下执行。

依赖`Function`构造函数，我们可以实现自己的`“eval”`。这里我将实现的`“eval”`命名为`$eval`，以示区分。当然，`$eval`实现的功能和原生`eval`功能不尽相同。`$eval`可以让我们在指定作用域下执行代码。同时，这里还额外将`$eval`方法定义到`Object.prototype`中以适用不同场合。

下面是`$eval`和`Object.prototype.$eval`的代码实现。

```javascript
void function (global) {
  /**
   * Execute javascript code within specific scope
   * @param  {Function|String} fn Scoped function or expression
   * @param  {Object} imports     An object which defines required local variables
   * @return {Function}           Function that can be invoked to run code in specific scope
   */
  function scopedRunner(fn, imports) {
    var rfunc = /^function\s+(?:[^(]*)\(([^)]*)\)\s*{([^]*)}$/;
    var found = String(fn).match(rfunc) || [,,'return (' + fn + ');'];
    var args = found[1] || '';
    var stmt = found[2] || '';

    var body = Object.keys(imports || {}).reduce(function (ret, key, idx) {
      return ret + (idx ? ', ' : 'var ') + key + ' = $scope["' + key + '"]';
    }, '') + '; return function (' + args + ') {' + stmt + '};';

    return Function('$scope', body).call(null, imports);
  }

  // define `global.$eval`
  Object.defineProperty(global, '$eval', {
    value: function () {
      return scopedRunner.apply(null, arguments)();
    }
  });

  // define `Object.prototype.$eval`
  Object.defineProperty(Object.prototype, '$eval', {
    value: function (expr) {
      return global.$eval(expr, this);
    }
  });
}(function () { return this; }());
```

以下是一些关于`$eval`和`Object.prototype.$eval`的使用例子。

 - e.g 1

```javascript
// define some global variables
x = 10;
y = 30;

void function () {
  // define some local variables
  var a = 6, b = 7;

  $eval(function () {
    // ReferenceError: a is not defined
    // console.log(a + b);
  });

  // ReferenceError: a is not defined
  // $eval('a + b');

  $eval('y / x'); //=> 3
}();
```

 - e.g 2

```javascript
void function () {
  var obj = { a: 6, b: 7 };
  var result;

  result = $eval(function () {
    return a * b;
  }, obj);
  console.log(result); //=> 42

  result = $eval('a * b', obj);
  console.log(result); //=> 42

  result = obj.$eval('a * b');
  console.log(result); //=> 42
}();
```

 - e.g 3

```javascript
void function () {
  var raws = ['42', '"42"', 'a * b', '[a, b]', '{ x: a, y: b }'];
  var out = raws.map(eval.$eval.bind({ a: 6, b: 7 }));

  //=> [42, '42', 42, [6, 7], { x: 6, y: 7 }]
  console.log(out);
}();
```

 - e.g 4

```javascript
x = 10;
y = 30;

void function () {
  var obj = {
    x: 6,
    y: 7,
    times: function () {
      return this.x * this.y;
    },
    sum: function (x, y) {
      return x + y;
    }
  };

  console.log(
    $eval('$scope', obj) === obj,                        //=> true
    $eval(function () { return $scope; }, obj) === obj,  //=> true
    obj.$eval('$scope') === obj,                         //=> true
    obj.$eval(function () { return $scope; }) === obj    //=> true
  );

  console.log(
    obj.$eval('times()'),             //=> 300
    obj.$eval('$scope.times()'),      //=> 42
    obj.$eval('times.call($scope)')   //=> 42
  );

  obj.$eval(function () {
    console.log(times());             //=> 300
    console.log($scope.times());      //=> 42
    console.log(times.call($scope));  //=> 42
  });

  console.log(
    obj.$eval('sum(x,y)'),                          //=> 13
    obj.$eval(function () { return sum(x, y); }),   //=> 13
    $eval('sum(x,y)', obj),                         //=> 13
    $eval(function () { return sum(x, y); }, obj)   //=> 13
  );
}();
```

最后，`$eval is not eval, $eval is not evil`。