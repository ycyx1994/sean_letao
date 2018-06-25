// 表单校验功能
// 校验规则：
// 1. 用户名不能为空
// 2. 用户密码不能为空
// 3. 用户密码长度为6-12位
$(function () {
  // 表单校验 初始化
  $('#form').bootstrapValidator({

    //设置小图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', 
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    // 校验字段
    fields: {
      username: {
        // 配置校验规则
        validators: {
          // 配置非空规则
          notEmpty: {
            message: '用户名不能为空'
          },
          // 配置长度规则
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2-6位'
          },
          callback: {
            message: '用户名不存在'
          }
        }
      },
      password: {
        validators: {
          // 配置非空规则
          notEmpty: {
            message: '密码不能为空'
          },
          // 配置长度规则
          stringLength: {
            min: 2,
            max: 6,
            message: '密码长度必须在2-6位'
          },
          callback: {
            message: '密码错误'
          }
        }
      }
    }
  });

  // 注册表单校验成功实践
  $('#form').on('success.form.bv', function (e) {
    e.preventDefault();
    $.ajax({
      type: 'post',
      url: '/employee/employeeLogin',
      data: $('#form').serialize(),
      dataType: 'json',
      success: function (info) {
        console.log(info)
        if (info.error === 1000) {
          // 用户名不存在
          $('#form').data('bootstrapValidator').updateStatus('username', "INVALID", "callback");
        }
        if (info.erroe === 1001) {
          // 密码错误
          $('#form').data('bootstrapValidator').updateStatus('password', "INVALID", "callback");
        }
      }
    })
  });

  // 点击重置按钮，重置表单和表单校验状态
  $('[type="reset"]').click(function () {
    // 重置校验状态
    $('#form').data('bootstrapValidator').resetForm();
  })
})
