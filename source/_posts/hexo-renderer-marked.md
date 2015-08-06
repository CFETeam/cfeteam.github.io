title: 开启 markdown 预览
-------------------------

定制了一个 `markdown` 解析插件: https://github.com/justan/hexo-renderer-marked

在 `_config.yml` 中可以配置是否实时预览 `HTML` 及 `JS` 文件:

```yml
marked:
  htmldemo: true
  jsdemo: true
```

开启之后 `markdown` 中的 `HTML` 及 `JS` 代码就会输入在文章中, 当访问时就会立即执行.
