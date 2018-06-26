// 入口函数
$(function () {
  var currentPage = 1;
  var pageSize = 2;

  render();
  // 渲染页面
  function render() {
    $.ajax({
      url: '/category/queryTopCategoryPaging',
      type: 'get',
      dataType: 'json',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        // console.log(info);
        // 用模板引擎渲染页面
        $('table tbody').html(template('tpl', info));

        // 设置分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          totalPages: Math.ceil(info.total / info.size),
          currentPage: info.page,
          onPageClicked: function (event, originEvent, type, page) {
            // 更新全局中记录的当前页
            currentPage = page;
            // 渲染当前页
            render();
          }
        })
      }
    })
  }

  // 添加分类按钮
  $('#addBtn').click(function () {
    // 添加模态框显示
    $('#addModal').modal('show');
  })

  // 配置表单验证
  $('#form').bootstrapValidator({
    // 1. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 制定字段
    fields: {
      // 字段名
      categoryName: {
        validators: {
          // 非空校验
          notEmpty: {
            message: '分类名不能为空'
          }
        }
      }
    }
  });

  // 确认添加
  // 注册表单验证完成事件
  $('form').on('success.form.bv', function (e) {
    e.preventDefault();
    // 1. 关闭模态框
    $('#addModal').modal('hide');
    // 2. ajax
    $.ajax({
      url: '/category/addTopCategory',
      type:'post',
      dataType: 'json',
      data: $('#form').serialize(),
      success: function (info) {
        // console.log(info);
        currentPage = 1;
        // 渲染页面
        render();
        // 重置表单
        $('#form').data('bootstrapValidator').resetForm(true);
      }
    })

  })



})