// 全局Ajax开始，开始进度条
$(document).ajaxStart(function () {
  NProgress.start();
});

// 全局Ajax完成，进度条完成
$(document).ajaxStop(function () {
  setTimeout(function() {
    NProgress.done();
  }, 500)
});

// 配置禁用小圆环
NProgress.configure({ showSpinner: false });
