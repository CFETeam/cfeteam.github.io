title: 开启 markdown 中 HTML 及 JS 的预览
date: 2015-08-08 12:34:58
tags:
  - markdown
author: Justan
-------------------------

标准的 `markdown` 中代码块转成 `HTML` 后都是静态用于展示的, 这是符合一般预期的.

但是对于前端开发者来说经常希望写在 `markdown` 中的代码可以直接在浏览器中执行, 这样可以省去一些可能的重复工作, 并且往往可以增强表现力.

对于 `hexo`, 这里定制了其 `marked` 解析插件: https://github.com/justan/hexo-renderer-marked

使用
---

在 `_config.yml` 中可以配置是否实时预览 `HTML` 及 `JS` 文件:

```yml
marked:
  htmldemo: true
  jsdemo: true
```

开启之后 `markdown` 中的 `HTML` 及 `JS` 代码就会输入在文章中, 当访问时就会立即执行.
