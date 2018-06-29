  // 配置localstorage假数据
  // var arr = [ "耐克", "阿迪", "阿迪王", "耐克王" ];
  // var str = JSON.stringify( arr );
  // localStorage.setItem( "search_list", str );

  $(function () {
    // 封装获取localstorage数据函数
    function getHistory() {
      var history = localStorage.getItem('search_list') || '[]'
      var arr = JSON.parse(history);
      // console.log(arr)
      return arr;
    };
    // getHistory();

    // 渲染页面
    function render() {
      var arr = getHistory();
      var htmlStr = template('history_tpl', {
        arr: arr
      });
      $('.lt_history').html(htmlStr);
    };
    render();


    // 清空历史记录
    $('.lt_history').on('click', '.icon_empty', function () {
      // console.log('done');
      // 显示模态框
      mui.confirm('您是否要清空所有的历史记录', '温馨提示', ['取消', '确认'], function (e) {
        // 如果点击确认
        if (e.index === 1) {
          localStorage.removeItem('search_list');
          render();
        }
      })
    })

    // 点击删除历史记录
    $('.lt_history').on('click', '.icon_delete', function () {
      var that = this;
      mui.confirm('您是否要删除这条历史记录', '温馨提示', ['取消', '确认'], function (e) {
        if (e.index === 1) {
          // 通过data-index 获取点击的index值
          var index = $(this).data('index');
          console.log(index);
          // 获取localstorage数组
          var arr = getHistory();
          // console.log(arr);
          // 删除索引值的那一项
          arr.splice(index, 1);
          // console.log(arr);
          localStorage.setItem('search_list', JSON.stringify(arr));
          render();
        }
      })

    })




  })