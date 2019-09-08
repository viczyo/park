$(function () {
    /**
     * 加载header公共部分
     */
    $(".totalHeader").load("./header.html", () => {
        /**
         * header 部分实例调用
         */
        let header = new Header();
        header.init();

        /**
        * 登录部分实例调用
        */
        let login = new Login();
        login.init();

        /**
         * 注册部分实例调用
         */
        let register = new Register();
        register.init();
    })

    /**
     * 加载右边侧边栏部分
     */
    $(".rightBar").load("./rightBar.html", () => {
        /**
         * 右边侧边栏部分实例调用
         */
        let rightBar = new RightBar();
        rightBar.init();
    });

    /**
     * footer部分加载
     */
    $(".footer").load("./footer.html");

    /**
     * 懒加载图片
     */
    let lazyload = new LazyLoad();

    /**
     * 渲染列表实例调用
     */
    let renderLists = new RenderLists();
    renderLists.init(lazyload);
    /**
     * 分页实例调用
     */
    // 分页模块实例化对象
    let pg = new Pagination();
    pg.init(40, renderLists.load.bind(renderLists));
})

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
;; ~function ($) {
    /**
     * 列表渲染
     */
    class RenderLists {
        constructor() { }
        //初始化
        init(lazyload) {
            this.data = null;
            this.index = 0;
            this.pageCount = 20;
            this.scrollTimer = null;
            this.maxLoad = 0;
            this.cHeight = $("html")[0].clientHeight;
            this.lazyload = lazyload;
            // this.load();
        }
        // 加载数据
        load(data) {
            this.data = data;
            this.index = 0;
            this.maxLoad = 0;
            this.renderPage();
            // this.lazyload.init(".imgDiv img");
            this.scroll();
        }
        // 选项卡切换图片
        changeTabImg(evt) {
            let e = evt || window.event;
            let target = $(e.currentTarget);
            target.addClass("active").siblings().removeClass("active");
            target.parents("li").find(".imgDiv img").attr('src', target.find("img")[0].src);
        }
        // 监听滚动事件实现瀑布流列表渲染
        scroll() {
            $(window).scroll(() => {
                if (this.maxLoad === 1) return;
                clearTimeout(this.scrollTimer);
                this.scrollTimer = setTimeout(() => {
                    let st = $("html, body").scrollTop();
                    let min = $(".listsUl>li:last")[0].offsetTop;
                    if (min < st + this.cHeight + 200) {
                        this.index++;
                        this.maxLoad++;
                        this.renderPage();
                    }
                }, 500);
            })
        }
        // 渲染列表
        renderPage() {
            if (this.index === 0) $(".listsUl").html("");
            let html = $(".listsUl").html();
            let template = `
            <ul class="clear">
            <% for(let j=0; j < data.imgTab.length; j++) { %>
                <li class=<%= j===0?"active":"" %>>
                <a href="#"><img
                            src="<%= data.imgTab[j] %>"
                            alt=""></a>
                </li>
            <% } %>
            </ul>`;
            var parse = eval(this.compile(template));
            for (let i = this.index * this.pageCount; i < (this.index + 1) * this.pageCount; i++) {
                if (!this.data[i]) break;
                html += `<li data-id="${this.data[i].id}">
                <div class="country">
                    <img src="${this.data[i].countryImg}"
                        alt="">
                </div>
                <div class="imgDiv">
                    <a class="toDetail" href="./shopCartsDetail.html" target="_blank"><img src="./images/loading.png"
                            data-src="${this.data[i].contentImg}"
                            alt=""></a>
                </div>
                <div class="imgTab">
                    ${parse({ imgTab: this.data[i].imgTab })}
                </div>
                <a class="des toDetail" href="./shopCartsDetail.html" target="_blank">
                    ${this.data[i].des}
                </a>
                <p class="gprice">
                    <span class="marketPrice">${this.data[i].marketPrice}</span>
                    <span class="price">${this.data[i].price}</span>
                    <span class="dprice">${this.data[i].dprice}</span>
                </p>
                <p class="bottomP">
                    <span>${this.data[i].sale}</span>
                    <span>${this.data[i].interaction}</span>
                </p>
            </li>`
            }
            $(".listsUl").html(html);
            this.lazyload.init(".imgDiv img");
            $(".imgTab>ul").on("mouseenter", "li", this.changeTabImg.bind(this));
            $(".toDetail").on("click", this.setGoodData.bind(this));
        }
        // 设置点击的列表中的哪一条数据到缓存中
        setGoodData(evt) {
            let e = evt || window.event;
            let target = $(e.currentTarget);
            let parent = target.parentsUntil(".listsUl");
            parent = $(parent[parent.length - 1]);
            console.log($(target.parentsUntil(".listsUl")));
            let id = parent.attr("data-id");
            let goodData = null;
            this.data.some(item => {
                if (item.id === id) {
                    goodData = item;
                    return true;
                }
            })
            this.saveData("goodData", goodData);
        }
        // 设置缓存保存数据;
        saveData(type, json) {
            localStorage.setItem(type, JSON.stringify(json));
        }
        // 模板编译
        compile(template) {
            var evalExpr = /<%=(.+?)%>/g;
            var expr = /<%([\s\S]+?)%>/g;
            template = template
                .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
                .replace(expr, '`); \n $1 \n  echo(`');
            template = 'echo(`' + template + '`);';
            var script =
                `(function parse(data){
              var output = "";
              function echo(html){
                output += html;
              }
              ${ template}
              return output;
            })`;
            return script;
        }
    }
    window.RenderLists = RenderLists;
}(jQuery)