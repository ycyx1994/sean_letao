// 全局Ajax开始，开始进度条
$(document).ajaxStart(function () {
  NProgress.start();
});

// 全局Ajax完成，进度条完成
$(document).ajaxStop(function () {
  // 模拟网络延迟
  setTimeout(function () {
    NProgress.done();
  }, 500)
});

// 配置禁用小圆环
NProgress.configure({
  showSpinner: false
});

// 判断用户有没有登录，未登录的拦截并跳转至登录页
if (location.href.indexOf('login.html') === -1) {
  // 如果indexOf 是-1 表示没有 login.html 关键词
  $.ajax({
    url: '/employee/checkRootLogin',
    type: 'get',
    dataType: 'json',
    success: function (info) {
      if (info.error === 400) {
        // 拦截
        location.href = './login.html';
      }
      if (info.success) {
        // 用户已登录
        console.log('用户已登录');
      }
    },
  })
};

// 侧边栏折叠
$('.lt_topbar .icon_menu').click(function () {
  $('.lt_aside').toggleClass('hidemenu');
  $('.lt_main').toggleClass('hidemenu');
  $('.lt_topbar').toggleClass('hidemenu');
});

// 二级菜单展开
$('.lt_aside .category').click(function () {
  $('.lt_aside .child').stop().slideToggle();
});

// 弹出模态框
$('.lt_topbar .icon_logout').click(function () {
  // console.log('done');
  $('#logoutModal').modal('show');
});

// 退出登录
$('#logoutBtn').click(function () {
  $.ajax({
    type: 'get',
    url: '/employee/employeeLogout',
    dataType: 'json',
    success: function (info) {
      console.log(info);
      if (info.success) {
        location.href = './login.html';
      }
    }
  })
})