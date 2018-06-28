// 入口函数
$(function () {
  var currentPage = 1;
  var pageSize = 5;

  render();

  // 渲染页面
  function render() {
    $.ajax({
      url: '/product/queryProductDetailList',
      type: 'get',
      dataType: 'json',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        // 模板引擎动态渲染
        $('.lt_main tbody').html(template('tpl', info))
        // 设置分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          // 配置分页文字
          itemTexts: function (type, page, current) {
            switch (type) {
              case 'first':
                return '首页';
              case 'prev':
                return '上一页';
              case 'next':
                return '下一页';
              case 'last':
                return '尾页';
              case 'page':
                return page;
            }
          },
          // 配置每个按钮的title
          tooltipTitles: function (type, page, current) {
            switch (type) {
              case "first":
                return "首页";
              case "prev":
                return "上一页";
              case "next":
                return "下一页";
              case "last":
                return "尾页";
              case "page":
                return "前往" + page + "页";
            }
          },
          // 使用 bootstrap 的提示框
          useBootstrapTooltip: true,
          onPageClicked: function (event, originEvent, type, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  };

  // 点击添加按钮显示模态框
  $('#addBtn').click(function () {
    $('#addModal').modal('show');
    // 动态渲染下拉菜单
    $.ajax({
      url: '/category/querySecondCategoryPaging',
      type: 'get',
      dataType: 'json',
      data: {
        page: 1,
        pageSize: 100
      },
      success: function (info) {
        console.log(info);
        $('.dropdown-menu').html(template('dropdownTpl', info))
      }
    })
  })

  // 下拉菜单点击按钮事件
  $('.dropdown-menu').on('click', 'a', function () {
    // console.log($(this).data('id'));
    // console.log($(this).text());
    // 设置下拉菜单文字
    $('#dropdownTxt').text($(this).text());
    // 在隐藏域传入id
    $('[name="brandId"]').val($(this).data('id'));
    // 手动重置表单校验
    $('#form').data('bootstrapValidator').updateStatus('brandId', 'VALID')
  })

  // 配置文件上传
  // 申明一个数组，用来存储用户上传的图片
  var picArr = []
  $('#fileupload').fileupload({
    dataType: 'json',
    done: function (e, data) {
      // console.log(data.result);
      var picUrl = data.result.picAddr
      picArr.unshift(data.result);
      $('#imgBox').append('<img src="' + picUrl + '" width="100" height="100">');
      // 最多存储3张图片
      if (picArr.length > 3) {
        // 从数组中删除原有数据
        picArr.pop();
        // 删除图片
        // img:last-of-type 最后一个 img 类型的标签
        $('#imgBox img:last-of-type').remove();
      }
      if (picArr.length === 3) {
        // 重置表单校验状态
        $('#form').data('bootstrapValidator').updateStatus('picStatus', 'VALID')
      }
    }
  })

  // 配置表单校验
  $('#form').bootstrapValidator({
    // 校验包含隐藏域
    excluded: [],
    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },
    // 校验字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: '请选择二级分类'
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: '请输入商品名称'
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: '请输入商品描述'
          }
        }
      },
      /*
       * [1-9]  可以出现 1-9 中的任意一个
       * [^0]   除了0都可以出现, 包括字母
       *
       * \d     数字 [0-9]
       *  + 可以出现 一次 或 多次
       *  * 可以出现 0次 或 的多次
       *  ? 可以出现 0次 或 1次
       *  {n} 可以先 n 次
       * */
      num: {
        validators: {
          notEmpty: {
            message: '库存数不能为空'
          },
          // 必须是非0开头的数字
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: '库存必须是非零开头的数字'
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: '尺码不能为空'
          },
          // 必须是xx-xx的格式，xx为数字
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: '商品尺码必须是 xx-xx 的格式, 例如 32-40'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: '原价不能为空'
          },
          // 必须是数字
          regexp: {
            regexp: /^\d+$/,
            message: '商品尺码必须是 xx-xx 的格式, 例如 32-40'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: '现价不能为空'
          },
          // 必须是数字
          regexp: {
            regexp: /^\d+$/,
            message: '商品尺码必须是 xx-xx 的格式, 例如 32-40'
          }
        }
      },
      picStatus: {
        validators: {
          notEmpty: {
            message: '请上传三张图片'
          }
        }
      },
    }
  });

  // 注册校验完成事件
  $('#form').on('success.form.bv', function (e) {
    // 阻止默认事件
    e.preventDefault();
    var paramsStr = $('#form').serialize();
    // 将三张图片的信息拼接进字符串
    paramsStr += "&picAddr1=" + picArr[0].picAddr + "&picName1=" + picArr[0].picName;
    paramsStr += "&picAddr1=" + picArr[1].picAddr + "&picName1=" + picArr[1].picName;
    paramsStr += "&picAddr1=" + picArr[2].picAddr + "&picName1=" + picArr[2].picName;
    // 发送ajax请求
    $.ajax({
      url: '/product/addProduct',
      type: 'post',
      dataType: 'json',
      data: paramsStr,
      success: function (info) {
        if (info.success) {
          // 关闭模态框
          $('#addModal').modal('hide');
          // 重置表单
          $('#form').data("bootstrapValidator").resetForm(true);
          // 手动重置非表单元素
          $('#dropdownTxt').text("请选择二级分类");
          // 手动重置图片, 找到所有图片, 让所有图片自杀
          $('#imgBox img').remove();
          currentPage = 1;
          render()
        }
      }
    });
  });

});