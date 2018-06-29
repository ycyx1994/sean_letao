// 入口函数
$(function () {
  // ajax
  $.ajax({
    url: '/category/queryTopCategory',
    type: 'get',
    dataType: 'json',
    success: function (info) {
      // console.log(info);
      // 渲染左侧列表
      $('.lt_category_left ul').html(template('tpl', info))
      // console.log(info.rows[0].id)
      renderSecondById(info.rows[0].id)
    }
  })

  // 左侧按钮点击事件，获取id，渲染页面
  $('.lt_category_left').on('click', 'a', function () {
    var id = $(this).data('id');
    renderSecondById(id);
  })

  // 渲染二级列表函数
  function renderSecondById(id) {
    $.ajax({
      url: '/category/querySecondCategory',
      type: 'get',
      dataType: 'json',
      data: {
        id: id
      },
      success: function (info) {
        console.log(info)
        $('.lt_category_right ul').html(template('rightTpl', info))
      }
    })
  };


})