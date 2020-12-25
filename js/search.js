$(function () {
    // 1. 定义延时器的Id
    var timer = null
    // 定义全局缓存对象
    var cacheObj = {}

    // 2. 定义防抖的函数
    function debounceSearch(kw) {
        timer = setTimeout(function () {
            getSuggestList(kw)
        }, 500)
    }

    // 为输入框绑定 keyup 事件
    $('#ipt').on('keyup', function () {
        // 3. 清空 timer
        clearTimeout(timer)
        var keywords = $(this).val().trim()
        if (keywords.length <= 0) {
            return $('#suggest-list').empty().hide()
        }

        // 先判断缓存中是否有数据
        if (cacheObj[keywords]) {
            return renderSuggestList(cacheObj[keywords])
        }

        // TODO:获取搜索建议列表
        // console.log(keywords)
        // getSuggestList(keywords)
        debounceSearch(keywords)
    })

    function getSuggestList(kw) {
        $.ajax({
            url: 'https://suggest.taobao.com/sug?q=' + kw,
            dataType: 'jsonp',
            success: function (res) {
                // console.log(res)
                renderSuggestList(res)
            }
        })
    }

    // 渲染UI结构
    function renderSuggestList(res) {
        if (res.result.length <= 0) {
            return $('#suggest-list').empty().hide()
        }
        var htmlStr = template('tpl-suggestList', res)
        $('#suggest-list').html(htmlStr).show()

        // 1. 获取到用户输入的内容，当做键
        var k = $('#ipt').val().trim()
        // 2. 需要将数据作为值，进行缓存
        cacheObj[k] = res
    }
})