// 获取用户的基本信息
(function() {
    function getUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            // headers 就是请求头 配置对象
            success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('获取用户信息失败！')
                    }
                    // 调用 renderAvatar 渲染用户的头像
                    renderAvatar(res.data)
                }
                // 即使没有登录 但是直接在网址输入 url 地址 还是能直接访问 所以不能让其直接访问
                // 不论成功还是 失败，最终都会调用 complete 回调函数
        })
    }

    // 渲染用户头像
    function renderAvatar(user) {
        // 1. 获取用户的名称
        var name = user.nickname || user.username
            // 2. 设置欢迎的文本
        $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
            // 3. 按需渲染用户的头像
        if (user.user_pic !== null) {
            // 3.1 按需渲染用户的头像
            $('.layui-nav-img').attr('src', user.user_pic).show()
            $('.text-avatar').hide()
        } else {
            // 渲染文本头像
            $('.layui-nav-img').hide()
            var first = name[0].toUpperCase()
            $('.text-avatar').html(first).show()
        }
    }
    getUserInfo()

    // 实现退出功能
    var layer = layui.layer
        // 点击按钮，实现退出功能
    $('#btnLogout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            //do something
            // 1. 清空本地存储的 token
            localStorage.removeItem('token')
                // 2. 重新跳转到登录页面
            location.href = '/login.html'
            layer.close(index);
        });
    })



})();