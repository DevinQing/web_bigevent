 // 定义一个查询的参数对象，将来请求数据的时候，
 // 需要将请求参数对象提交到服务器
 var layer = layui.layer
 var form = layui.form
 var laypage = layui.laypage

 var q = {
     pagenum: 1, // 页码值 默认请求第一页的数据
     pagesize: 2, // 每页显示几条数据， 默认每页显示 2 条
     cate_id: '', // 文章分类的 Id
     state: '' // 文章的发布状态
 }
 initTable()

 // 获取文章列表数据的方法
 function initTable() {
     $.ajax({
         method: 'GET',
         url: '/my/article/list',
         data: q,
         success: function(res) {
             if (res.status !== 0) return layer.msg('拉取文章列表失败！')
                 //  数据获取成功，就调用模板
             var htmlStr = template('tpl-table', res)
                 //  console.log(res);
             $('tbody').html(htmlStr)
             console.log(res);
             renderPage(res.total)
         }
     })
 }
 // 定义美化时间的过滤器
 template.defaults.imports.dataFormat = function(date) {
     const dt = new Date(date)

     var y = dt.getFullYear()
     var m = padZero(dt.getMonth() + 1)
     var d = padZero(dt.getDate())

     var hh = padZero(dt.getHours())
     var mm = padZero(dt.getMinutes())
     var ss = padZero(dt.getSeconds())

     return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
 }

 // 定义补零的函数
 function padZero(n) {
     return n > 9 ? n : '0' + n
 }

 // 定义 initCate 函数请求文章分类的列表数据
 initCate()
     // 初始化文章分类的方法
 function initCate() {
     $.ajax({
         method: 'GET',
         url: '/my/article/cates',
         success: function(res) {
             console.log(res);

             var htmlStr = template('tpl-cate', res)
             $('[name=cate_id]').html(htmlStr)
                 // 通过 layui重新渲染表单区域的UI结构
             form.render()
         }
     })
 }

 // 实现筛选功能
 $('#form-search').on('submit', function(e) {
     e.preventDefault()
         // 获取表单中的值
     var cate_id = $('[name=cate_id]').val()
     var state = $('[name=state]').val()
         //  var data = $('#form-search').serialize()
         //  console.log(data);
     q.cate_id = cate_id
     q.state = state
     initTable()
 })

 // 定义渲染分页的方法
 function renderPage(total) {
     // 调用 laypage.render() 方法来渲染分页的结构
     laypage.render({
         elem: 'pageBox', // 分页容器的 Id
         count: total, // 总数据条数
         limit: q.pagesize, // 每页显示几条数据
         curr: q.pagenum, // 设置默认被选中的分页
         layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
         limits: [2, 3, 5, 10],
         // 分页发生切换的时候，触发 jump 回调
         // 触发 jump 回调的方式有两种：
         // 1. 点击页码的时候，会触发 jump 回调
         // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
         jump: function(obj, first) {
             // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
             // 如果 first 的值为 true，证明是方式2触发的
             // 否则就是方式1触发的
             // 把最新的页码值，赋值到 q 这个查询参数对象中
             q.pagenum = obj.curr
                 // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
             q.pagesize = obj.limit
                 // 根据最新的 q 获取对应的数据列表，并渲染表格
                 // initTable()
             if (!first) {
                 initTable()
             }
         }
     })
 }
 //  调用 laypage.render方法渲染分页的基本结构

 //  实现删除文章的功能
 $('tbody').on('click', '.btn-delete', function() {
     // 获取到文章的 id
     var id = $(this).attr('data-id')
         // 询问用户是否要删除数据
     var index = layer.confirm('确认删除？', { icon: 3, title: '提示' }, function() {
         $.ajax({
             method: 'GET',
             url: '/my/article/delete/' + id,
             success: function(res) {
                 if (res.status !== 0) return layer.msg('删除文章失败！')
                 layer.msg('删除文章成功')
                     // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                     // 如果没有剩余的数据了,则让页码值 -1 之后,
                     // 再重新调用 initTable 方法
                     // 4
                 if (len === 1) {
                     // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                     // 页码值最小必须是 1
                     q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                 }
                 initTable()
             }
         })
         layer.close(index)
     })
 })