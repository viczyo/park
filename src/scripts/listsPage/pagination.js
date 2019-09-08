
;; !function ($) {
    function Pagination() { }
    $.extend(Pagination.prototype, {
        // 初始化
        init: function (showData, cb) {
            this.cb = cb;// 渲染页面模块的回调函数
            this.showData = showData;//每页显示个数
            this.pageCount = 1;//当前页码
            this.totalData = 0;//加载数据的总长度
            this.data = [];//加载回来的数据
            this.currentData = [];//当前页面显示的数据
            this.dataLoaded = $.Callbacks();
            this.loadData();
            this.dataLoaded.add($.proxy(this.getData, this));
            this.dataLoaded.add($.proxy(this.renderBtn, this));
            this.dataLoaded.add($.proxy(this.renderPage, this));
        },
        // 加载数据
        loadData: function () {
            $.ajax("./json/listsPage.json", {
                dataType: "json"
            }).then(this.dataLoaded.fire)
        },
        // 得到所有数据
        getData: function (res) {
            this.data = res;
            this.totalData = this.data.length;
        },
        // 加载完渲染第一页页面数据
        renderPage: function () {
            this.currentData = this.data.slice(this.pageCount - 1, this.showData);
            this.cb(this.currentData);
        },
        // 渲染分页按钮
        renderBtn: function (res) {
            $('.pagination-box').pagination({
                coping: true,
                totalData: this.totalData,
                showData: this.showData,
                callback: function (api) {
                    //重新渲染页面;
                    this.pageCount = api.getCurrent();
                    this.currentData = this.data.slice(this.showData * (this.pageCount - 1), this.showData * this.pageCount);
                    this.cb(this.currentData);
                    $('html,body').stop().animate({
                        scrollTop: 0
                    }, "fast");
                }.bind(this)
            });
        }
    })
    window.Pagination = Pagination;
}(jQuery);