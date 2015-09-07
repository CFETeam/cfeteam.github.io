title: 'DFS & BFS simple implementation'
date: 2015-09-07 12:22:50
tags:
 - javascript
 - DFS
 - BFS
author: miusuncle
-------------------------

Often times, we need to traverse some hierarchy structure, javascript object is a typical one. Say we've got an object called `obj` defined below.

```js
var obj = {
    ninja: {
        robot: {},
        pizza: function () {}
    },
    foo: {
        bar: {
            baz: [],
            qux: ''
        }
    },
    eggs: {
        spam: []
    }
};
```

Now, I want to collect all keys defined in `obj`, commonly we have two choice to traverse `obj` keys: DFS(depth-first search) and BFS(breadth-first search).

Most times we will use `DFS` to do traverse, cause it is more intuitive than `BFS`, just use recursion, and the work is done, see the code below:

```js
function dfs(o) {
    var out = [];

    function _dfs(o) {
        isPlainObject(o) && Object.keys(o).forEach(function (key) {
            out.push(key);
            _dfs(o[key]);
        });
    }

    _dfs(o);

    return out;
}


function isPlainObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]';
}

// output: ["ninja", "robot", "pizza", "foo", "bar", "baz", "qux", "eggs", "spam"]
dfs(obj);
```

Sometimes, maybe `BFS` is our choice, it is also very simple to implement, the basic idea is to use `FIFO(First in first out)` queue strategy, see the code below to have a taste.

```js
function bfs(o) {
    var out = [];
    var objs = [o];

    while (objs.length) {
        var obj = objs.shift();
        var keys = Object.keys(obj);
        out.push.apply(out, keys);

        keys.forEach(function (key) {
            if (isPlainObject(obj[key])) {
                objs.push(obj[key]);
            }
        });
    }

    return out;
}

function isPlainObject(target) {
  return Object.prototype.toString.call(target) === '[object Object]';
}

// output: ["ninja", "foo", "eggs", "robot", "pizza", "bar", "spam", "baz", "qux"]
bfs(obj);
```