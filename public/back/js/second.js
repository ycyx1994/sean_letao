// 入口函数
$(function () {
  var currentPage = 1;
  var pageSize = 5;
  render()
  // 渲染当前页
  function render() {
    $.ajax({
      url: '/category/querySecondCategoryPaging',
      type: 'get',
      dataType: 'json',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        $('tbody').html(template('tpl', info));
        // 设置分类
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (event, originEvent, type, page) {
            currentPage = page;
            // 渲染当前页
            render();
          }
        })
      }
    })
  }

  // 添加模态框
  $('#addBtn').click(function () {
    $('#addModal').modal('show');
    // 动态渲染下拉菜单
    $.ajax({
      url: '/category/queryTopCategoryPaging',
      type: 'get',
      dataType: 'json',
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        $('.dropdown-menu').html(template('dropdownTpl', info));
        console.log(info);
      }
    })
  })

  // 模态框内的下拉菜单点击事件
  $('.dropdown-menu').on('click', 'a', function () {
    // 把点击的文本内容赋值给下拉菜单
    var txt = $(this).text();
    $('#dropdownTxt').text(txt);
    // console.log($(this).data('id'))
    // 将下拉菜单选中的一级分类id赋值给input框
    $('[name="categoryId"]').val($(this).data('id'))
    // 手动重置表单校验状态
    $('#form').data('bootstrapValidator').updateStatus('categoryId', 'VALID')
    // $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID")

  })

  // 上传图片
  $("#fileupload").fileupload({
    dataType: "json",
    //e：事件对象
    //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
    done: function (e, data) {
      // console.log(data);
      var src = data.result.picAddr
      // console.log(src)
      // 同步更改下面的预览图
      $('#addModal form img').attr('src', src);
      $('[name="brandLogo"]').val(src)
      // 手动重置表单校验状态
      $('#form').data('bootstrapValidator').updateStatus('brandLogo', 'VALID')

    }
  });

  // 配置表单校验
  $('#form').bootstrapValidator({
    // 包括隐藏域
    excluded: [],
    // 配置图标显示
    //2. 指定校验时的图标显示，默认是bootstrap风格
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    // 配置校验字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: '请选择一级分类'
          }
        }
      },
      brandName: {
        validators: {
          notEmpty: {
            message: '二级分类不能为空'
          }
        }
      },
      brandLogo: {
        validators: {
          notEmpty: {
            message: '请上传图片'
          }
        }
      }
    }
  })

  // 注册表单校验成功实践
  $('#form').on('success.form.bv', function (e) {
    // 阻止默认事件
    e.preventDefault()
    $.ajax({
      url: '/category/addSecondCategory',
      type: 'post',
      dataType: 'json',
      data: $('#form').serialize(),
      success: function (info) {
        // console.log(info);
        currentPage = 1;
        render();
        // 关闭模态框
        $('#addModal').modal('hide');
        // 重置表单验证状态
        $('#form').data('bootstrapValidator').resetForm(true);
        // 手动重置非表单组件
        $('#dropdownTxt').text('请选择一级分类');
        $('#form img').attr('src', './images/none.png')
      }
    })
  })






})