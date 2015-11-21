var tabTpl = '<div class="tc-15-tab">\
                  <ul role="tablist" class="tc-15-tablist">\
                      <li class="tc-cur"><a href="javascript:;">HTML</a></li>\
                      <li style="display:none"><a href="javascript:;">JavaScript</a></li>\
                  </ul>\
              </div>';

function wrapTab($html, $js) {
  var $tab = $(tabTpl)

  $html.before($tab);

  if($js.length) {
    $tab.find('li').show()

    $tab.on('click', 'li', function() {
      var $this = $(this);
      var index = $this.index()
      $this.siblings().removeClass('tc-cur')
      $this.addClass('tc-cur')
      if(index == 0) {
        $js.hide()
        $html.show()
      }else{
        $html.hide()
        $js.show()
      }
    })
  }
}

$('pre[data-code=html]').each(function() {
  var $html = $(this)
  var $js = $html.next('pre[data-code=js]')
  if($js.length) {
    wrapTab($html, $js)
  }
})
new Bee(document.body)
