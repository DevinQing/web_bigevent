$(function() {
    var form = layui.form

    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                var htmlStr = template('tpl-table', res.data);
                $('tbody').html(htmlStr)
            }
        })
    }
    initArtCateList()
    var layer = layui.layer
    var indexAdd = null
    $('#btnAddCate').on('click', function() {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            content: $('#dialog-add').html(),
            //这里content是一个普通的String
            title: '添加文章分类',
        });
    })

    // 通过代理的形式， 为 form-add 表单 绑定 submit事件
    $('body').on('submit', '#form-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                initArtCateList()
                layer.close(indexAdd)
            }
        })

    })


    // 更新分类
    // 通过代理的方式绑定编辑事件
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function() {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
            // 发起请求获取数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                form.val('form-edit', res.data)
            }
        })
    })
    $('body').on('submit', '#form-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) return layer.msg('更新分类失败！')
                layer.msg('更新分类成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 删除文章分类
    // 点击删除 拿到该数据的 id
    $('tbody').on('click', '.btn-delete', function() {
        var id = $(this).attr('data-id')
        console.log(id);
        layer.confirm('确认删除', { icon: 3, title: '提示' }, function(index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initArtCateList()
                }
            })
        })
    })
})