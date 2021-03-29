$(function() {
    // 点击去注册页面
    $('#link_reg').on('click', function() {
            $('.login-box').hide();
            $('.reg-box').show();
        })
        //点击去登录页面
    $('#link_login').on('click', function() {
            $('.login-box').show();
            $('.reg-box').hide();
        })
        // 预先验证输入的信息
    var form = layui.form;

    form.verify({
            psw: [
                /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
            ],
            repsw: function(value) {
                // 通过形参拿到的是确认密码框中的内容
                // 还需要拿到密码框中的内容
                // 然后进行一次等于的判断
                // 如果判断失败,则return一个提示消息即可
                var psw = $('#fristPsw').val()
                if (psw !== value) {
                    return '两次密码不一致'
                }
            }
        })
        // 提交注册表单的信息
    var layer = layui.layer;
    $('#reg_form').on('submit', function(e) {
            e.preventDefault();
            var data = {
                username: $('#reg_form [name=username]').val(),
                password: $('#reg_form [name=password]').val()
            }
            $.post('/api/reguser', data, function(res) {
                if (res.status !== 0) { return layer.msg(res.message) } else {
                    layer.msg('注册成功，请登录！');
                    //跳转到登录页面
                    $('#link_login').click();
                }

            })
        })
        // 提交登录表单
    $('#login_form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $('#login_form').serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                } else {
                    layer.msg('登录成功！')
                        // 将登录成功得到的 token 字符串，保存到 localStorage 中
                    localStorage.setItem('token', res.token)
                        // 跳转到后台主页
                    location.href = 'http://127.0.0.1:5500/3-%E5%A4%A7%E4%BA%8B%E4%BB%B6%E9%A1%B9%E7%9B%AE/day%2001/%E6%A1%88%E4%BE%8B/index.html';
                    console.log(res);
                }
            }
        })
    })
})