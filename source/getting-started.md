title: 'Getting Started'
------------------------

滑块输入 (Slider-range)
-----------------------

```html
<slider-range id="slider-range-demo1" max="200" step="5" value="6"></slider-range>
```

```js
Bee.mount('slider-range-demo1')
```

表格 (Grid-view)
----------------

```html
<grid-view min-height="auto" show-pagination="" show-state="">
  <script type="text/json" data>
  {
    "colums": [
      {"name": "主机名", "key": "alias"},
      {"name": "所属网络", "key": "netName"},
      {"name": "内网 IP", "key": "ip"}
    ],
    "list": [
      {"alias": "未命名", "netName": "基础网络", "ip": "10.143.64.70"}
    ]
  }
  </script>
</grid-view>
```

```html
<grid-view id="grid-view-example"></grid-view>
```

```js
Bee.mount('grid-view-example', {
  $data: {
    "colums": [
      {"name": "主机名", "key": "alias"},
      {"name": "所属网络", "key": "netName"},
      {"name": "内网 IP", "key": "ip"}
    ],
    count: 5,
    minHeight: 350
  },
  getData: function(options, callback) {
    setTimeout(function() {
      callback(null, {
        "list": [
          {"alias": "未命名", "netName": "基础网络", "ip": "10.143.64.70"}
        ],
        totalNum: 10
      })
    }, 0)
  }
})
```

end
---
