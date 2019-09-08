;; ~function ($) {
    class HomeModules {
        constructor() { }
        // 初始化
        init(options) {
            this.$modules = options.$selector;
            this.$listTabs = $(`${options.$selector} .dogStapleFoodTab>ul>li`);
            this.jsonUrl = options.jsonUrl;//json文件
            this.data = null;//接收json数据
            this.index = 0;//选项卡索引
            this.pageSize = 8;//每个选项卡内容显示8条数据
            this.observer = $.Callbacks();//观察数据是否加载完成
            this.load();//加载数据
            this.bindEvent();
        }
        // 绑定事件
        bindEvent() {
            this.observer.add(() => {
                this.$listTabs.on("mouseenter", this.changeContent.bind(this));
            });
        }
        // 鼠标移动到tab选项卡上时切换选项卡内容
        changeContent(evt) {
            let e = evt || window.event;
            this.index = $(e.currentTarget).index();
            $(e.currentTarget).addClass("active").siblings().removeClass("active");
            if (this.index === 0) {
                $(`${this.$modules} .popular`).css({
                    display: "block"
                })
                $(`${this.$modules} .otherTab`).css({
                    display: "none"
                })
            } else {
                $(`${this.$modules} .popular`).css({
                    display: "none"
                })
                $(`${this.$modules} .otherTab`).css({
                    display: "block"
                }).siblings().css({
                    display: "none"
                })
                this.renderPage();
            }
        }
        // 加载数据
        load() {
            if ($(`${this.$modules} .otherTab`).html()) return false;
            xhrGet(this.jsonUrl).then((res) => {
                this.data = JSON.parse(res);
                this.observer.fire();
            });
        }
        // 渲染选项卡内容
        renderPage() {
            let html = "";
            for (let i = (this.index - 1) * this.pageSize; i < this.index * this.pageSize; i++) {
                html += `<li>
                            <a href="#">
                                <img src="${this.data[i].photo}" alt="">
                                <p>${this.data[i].subject}</p>
                                <p>￥${this.data[i].sale_price}</p> 
                            </a>
                        </li>`
            }
            $(`${this.$modules} .otherTab`).html(html);
        }
    }
    window.HomeModules = HomeModules;
}(jQuery)