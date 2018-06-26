$(function () {

  var currentPage = 1;
  var pageSize = 5;

  render();

  // 渲染当前页面
  function render() {
    $.ajax({
      url: '/user/queryUser',
      type: 'get',
      dataType: 'json',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
        // 通过,模板引擎渲染页面
        $('.lt_main tbody').html(template('tpl', info))
        // 设置分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (event, originalEvent, type, page) {
            // 将当前页修改为 page
            currentPage = page;
            render();
          }
        })
      }
    })
  };

  // 禁用按钮显示模态框
  var currentId;
  var isDelete;
  
  $('table tbody').on('click', '.btn', function () {
    // console.log($(this).parent().data('id'));
    // 记录当前点击按钮的id
    currentId = $(this).parent().data('id');
    // 记录点的是禁用还是启用
    var flag = $(this).hasClass('btn-danger')
    if (flag) {
      isDelete = 0;
    }else {
      isDelete = 1;
    }
    // 显示模态框
    $('#userModal').modal('show');
    // 确认按钮点击事件
    $('#submitBtn').click(function () {
      // 1. 关闭模态框
      $('#userModal').modal('hide');
      // 2. 修改用户状态
      $.ajax({
        url: '/user/updateUser',
        type: 'post',
        dataType: 'json',
        data: {
          id: currentId,
          isDelete: isDelete
        },
        success: function (info) {
          // console.log(info)
          // 重新渲染页面
          render();
        }
      })
    });

  })

})