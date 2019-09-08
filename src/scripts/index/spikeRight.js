;; !function ($) {
    /**
     * 秒杀右边商品选项卡
     */
    class SpikeRight {
        constructor() { }
        // 初始化
        init() {
            this.observer = $.Callbacks();//观察数据是否加载完成
            this.index = 0;//记录选择的哪个时间点索引
            this.tabGoodsCount = 6;//定义每个选项卡内容商品数量
            this.indexTab = 0;//时间选项卡索引
            this.indexGoods = 0;//秒杀商品选项卡索引
            this.$tabLi = $(".timeWrap>ul>li");//时间选项卡列表
            this.$goodsLi = $(".spikeGoodsWrap>ul>li");//秒杀商品选项卡列表
            this.lengthTab = $(".timeWrap>ul>li").length - 7;//确定可以点几次下移按钮
            this.lengthGoods = this.tabGoodsCount - 4;
            this.$ulTab = $(".timeWrap>ul");
            this.$ulGoods = $(".spikeGoodsWrap>ul");
            this.$ulGoods.width(this.tabGoodsCount * 211);
            this.data = null;//接收json数据
            this.timeNow = new Date().getHours();
            this.timeIndex = -1;
            this.timeArr = [10, 11, 12, 14, 16, 18, 20, 22];
            this.load();//加载数据
            this.bindEvent();
        }
        // 加载json数据
        load() {
            xhrGet("./json/spikeGoods.json").then((res) => {
                this.data = JSON.parse(res);
                this.observer.fire();
            })
        }
        // 绑定事件
        bindEvent() {
            this.observer.add(() => {
                this.judgeTimeNow();
                this.renderPage();
                this.$tabLi.on("mouseenter", this.changeContent.bind(this));
            })
            $(".timeTabLeftArrow").on("click", this.toPrevTab.bind(this));
            $(".timeTabRightArrow").on("click", this.toNextTab.bind(this));
            $(".spikeGoodsL").on("click", this.toPrevGoods.bind(this));
            $(".spikeGoodsR").on("click", this.toNextGoods.bind(this));
        }
        // 点击时间选项卡时向后移动
        toNextTab() {
            if (this.indexTab === this.lengthTab)
                return false;
            else this.indexTab++;
            this.animateTab(this.$ulTab, "-=119px");
        }
        // 点击时间选项卡时向前移动
        toPrevTab() {
            if (this.indexTab === 0)
                return false;
            else this.indexTab--;
            this.animateTab(this.$ulTab, "+=119px");
        }
        // 点击秒杀商品选项卡时向后移动
        toNextGoods() {
            if (this.indexGoods === this.lengthGoods)
                return false;
            else this.indexGoods++;
            this.animateTab(this.$ulGoods, "-=211px");
        }
        // 点击秒杀商品选项卡时向前移动
        toPrevGoods() {
            if (this.indexGoods === 0)
                return false;
            else this.indexGoods--;
            this.animateTab(this.$ulGoods, "+=211px");
        }
        // 时间选项卡移动动画
        animateTab(ele, moveLeft) {
            ele.animate({
                left: moveLeft
            })
        }
        // 移入选项卡时改变对于秒杀商品列表内容
        changeContent(evt) {
            let e = evt || window.event;
            let target = $(e.currentTarget);
            this.index = target.index();
            if (this.index < this.timeIndex) {
                target.addClass("activeEnd").siblings().removeClass("activeEnd activeRed");
            } else {
                target.addClass("activeRed").siblings().removeClass("activeEnd activeRed");
            }
            this.renderPage();
        }
        judgeTimeNow() {
            for (let i = 0; i < this.timeArr.length - 1; i++) {
                if (this.timeNow >= this.timeArr[i] && this.timeNow < this.timeArr[i + 1]) {
                    this.timeIndex = i;
                    break;
                }
            }
            if(this.timeIndex === -1) return false;
            this.index = this.timeIndex;
            this.$tabLi.eq(this.timeIndex).addClass("activeRed");
            $(`.timeWrap>ul>li:eq(${this.timeIndex})>div>.p2`).html("进行中");
            $(`.timeWrap>ul>li:eq(${this.timeIndex})>div`).addClass("readyTime");
            $(`.timeWrap>ul>li:gt(${this.timeIndex})>div>.p2`).html("即将开始");
            $(`.timeWrap>ul>li:gt(${this.timeIndex})>div`).addClass("readyTime");
            $(`.timeWrap>ul>li:gt(${this.timeIndex}) div p:last`).html("预告");
        }
        // 渲染秒杀商品数据
        renderPage() {
            let html = "";
            for (let i = this.index * this.tabGoodsCount; i < (this.index + 1) * this.tabGoodsCount; i++) {
                html += `<li>
                            <div class="saveImmediately">
                                <span>${this.data[i].saveImmediately}</span>
                            </div>
                            <a href="#">
                                <img src="${this.data[i].img}" alt="">
                                <p>${this.data[i].des}</p>
                                <div class="price">
                                    ¥
                                    <span>${this.data[i].priceNow}</span>
                                    <span class="del">${this.data[i].priceDel}</span>
                                    <span>${this.data[i].onlyLimitedCount}</span>
                                </div>
                            </a>
                            <div class="rushToBuy"><a href="#">立即抢购</a></div>
                        </li>`
            }
            this.$ulGoods.html(html);
        }
    }
    window.SpikeRight = SpikeRight;
}(jQuery)