/**
 * 
 * 轮播图插件
 * 
 */
;; !function ($) {
    class Banner {
        constructor() { }
        /**
         * 初始化轮播图
         */
        init(bannerArr, options, activeClass) {
            this.bannerArr = bannerArr;
            this.options = options;
            this.length = this.bannerArr.length;
            this.index = 0;
            this.timer = null;
            this.activeClass = activeClass;
            this.bindEvent();
        }
        /**
         * 绑定事件
         */
        bindEvent() {
            // 给左右箭头添加点击事件
            this.options.$leftArrow.on("click", $.proxy(this.toPrev, this));
            this.options.$rightArrow.on("click", $.proxy(this.toNext, this));
            this.options.$buttons.on("mouseenter", function (evt) {
                let e = evt || window.event;
                let target = e.target;
                this.index = $(target).index();
                this.animate();
            }.bind(this));
            // 开启自动播放
            this.timer = setInterval(this.toNext.bind(this), 3000);
            // 鼠标移入轮播图时停止自动播放，移出时恢复自动播放
            this.options.$centerDiv.on("mouseenter", function () {
                this.autoPlay("off");
            }.bind(this));
            this.options.$centerDiv.on("mouseleave", function () {
                this.autoPlay("on");
            }.bind(this));
        }
        /**
         * 轮播图动画
         */
        animate() {
            this.changeButton();
            this.options.$bannerImg[0].src = this.bannerArr[this.index].imgSrc;
            this.options.$bannerImg.on("load", () => {
                this.options.$banner.css({
                    background: this.bannerArr[this.index].bg
                })
                $(".topNav>.leftNav>li.active").css({
                    background: this.bannerArr[this.index].bg
                })
            })
            this.options.$banner.fadeTo("fast", 1);
        }
        /**
         * 播放下一张
         */
        toNext() {
            if (this.index === this.length - 1) {
                this.index = 0;
            } else {
                this.index++;
            }
            this.animate();
        }
        /**
         * 播放上一张
         */
        toPrev() {
            if (this.index === 0) {
                this.index = this.length - 1;
            } else {
                this.index--;
            }
            this.animate();
        }

        /**
         * 改变索引按钮样式
         */
        changeButton() {
            $(this.options.$buttons[this.index]).addClass(this.activeClass).siblings().removeClass(this.activeClass);
        }
        /**
         * 判定是否停止和开启播放
         */
        autoPlay(arg) {
            if (arg === "off") {
                return clearInterval(this.timer);
            }
            this.timer = setInterval(this.toNext.bind(this), 3000);
        }
    }
    window.Banner = Banner;
}(jQuery)

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
//DOM加载完成后执行的回调函数，只执行一次

$(function () {
    /**
     * 加载header公共部分
     */
    $(".totalHeader").load("./header.html", () => {
        /**
         * header 部分实例调用
         */
        let header = new Header();
        header.init(bannerObj);

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
     * 首页遮罩层实例调用
     */
    let mc = new MaskChoice();
    mc.init();

    /**
     * banner图实例调用
     */
    let bannerArr = [
        {
            imgSrc: "./images/homeBanner1.jpg",
            bg: "rgb(21, 91, 132)"
        },
        {
            imgSrc: "./images/homeBanner2.jpg",
            bg: "rgb(137, 88, 239)"
        },
        {
            imgSrc: "./images/homeBanner3.jpg",
            bg: "rgb(32, 31, 36)"
        },
        {
            imgSrc: "./images/homeBanner4.jpg",
            bg: "rgb(255, 191, 149)"
        },
        {
            imgSrc: "./images/homeBanner5.jpg",
            bg: "rgb(244, 218, 177)"
        },
        {
            imgSrc: "./images/homeBanner6.jpg",
            bg: "rgb(255, 191, 67)"
        }];
    let bannerObj = new Banner();
    let options = {
        $bannerImg: $(".banner .bannerImg"),
        $leftArrow: $(".banner .leftArrow"),
        $rightArrow: $(".banner .rightArrow"),
        $banner: $(".banner"),
        $buttons: $(".banner .circleTab li"),
        $centerDiv: $(".banner .centerDiv")
    }
    bannerObj.init(bannerArr, options, "active");

    /**
     * 秒杀左侧实例调用
     */
    let spikeLeft = new SpikeLeft();
    spikeLeft.init();

    /**
     * 秒杀右侧实例调用
     */
    let spikeRight = new SpikeRight();
    spikeRight.init();

    /**
     * 狗狗主粮模块实例调用
     */
    let dogStapleFood = new HomeModules();
    let dogStapleFoodData = {
        jsonUrl: "./json/dogStapleFood.json",
        $selector: ".dogStapleFood",
    }
    dogStapleFood.init(dogStapleFoodData);

    /**
     * 狗狗零食模块实例调用
     */
    let dogSnacks = new HomeModules();
    let dogSnacksData = {
        jsonUrl: "./json/dogSnacks.json",
        $selector: ".dogSnacks",
    }
    dogSnacks.init(dogSnacksData);
    /**
     * 狗狗保健&医疗模块实例调用
     */
    let dogHealthMedical = new HomeModules();
    let dogHealthMedicalData = {
        jsonUrl: "./json/dogHealthMedical.json",
        $selector: ".dogHealthMedical",
    }
    dogHealthMedical.init(dogHealthMedicalData);
    /**
     * 狗狗日用模块实例调用
     */
    let dogDailyUse = new HomeModules();
    let dogDailyUseData = {
        jsonUrl: "./json/dogDailyUse.json",
        $selector: ".dogDailyUse",
    }
    dogDailyUse.init(dogDailyUseData);
    /**
     * 狗狗牵引&服饰&玩具模块实例调用
     */
    let dogTractionClothingToys = new HomeModules();
    let dogTractionClothingToysData = {
        jsonUrl: "./json/dogTractionClothingToys.json",
        $selector: ".dogTractionClothingToys",
    }
    dogTractionClothingToys.init(dogTractionClothingToysData);
    /**
     * 懒加载图片
     */
    let lazyload = new LazyLoad();
    lazyload.init(".dogModules img");
})
;; (function ($) {
    /**
     * 
     * 遮罩层构造函数
     * 
     */
    function MaskChoice() { }
    $.extend(MaskChoice.prototype, {
        // 初始化创建遮罩层
        init: function () {
            this.maskHtml = `<div class="chooseBigCatOrDog">
                                <div class="mask"></div>
                                    <div class="chooseBigContent">
                                    <div class="listDiv">
                                        <h5>选择我的宠物类型</h5>
                                        <ul class="maskUl">
                                            <li class="bigDog">
                                                <a href="#" class="bigDogTitle">
                                                    <span class="immediateAccess">
                                                        <div>
                                                            立即进入
                                                        </div>
                                                    </span>
                                                    <span>狗狗</span>
                                                </a>
                                                <div class="bigDogDetails details">
                                                    <img src="images/bigdog.png" alt="" class="bigImg">
                                                    <div class="center">
                                                        <img src="images/dogtext.png" alt="" class="topImg">
                                                        <div class="dogTotalNum totalNum">
                                                            <p>
                                                                <span></span>
                                                            </p>
                                                            <p>
                                                                <span></span>
                                                            </p>
                                                            <p>
                                                                <span></span>
                                                            </p>
                                                            <p>
                                                                <span></span>
                                                            </p>
                                                            <p>
                                                                <span></span>
                                                            </p>
                                                        </div>
                                                        <img src="images/realtext.png" alt="" class="bottomImg">
                                                    </div>
                                                </div>
                                            </li>
                                            <li class="bigCat">
                                                <a href="#" class="bigCatTitle">
                                                    <span class="immediateAccess">
                                                        <div>
                                                            立即进入
                                                        </div>
                                                    </span>
                                                    <span>猫猫</span>
                                                </a>
                                                <div class="bigCatDetails details">
                                                    <img src="images/bigcat.png" alt="" class="bigImg">
                                                    <div class="center">
                                                        <img src="images/cattext.png" alt="" class="topImg">
                                                        <div class="catTotalNum totalNum">
                                                            <p>
                                                                <span></span>
                                                            </p>
                                                            <p>
                                                                <span></span>
                                                            </p>
                                                            <p>
                                                                <span></span>
                                                            </p>
                                                            <p>
                                                                <span></span>
                                                            </p>
                                                            <p>
                                                                <span></span>
                                                            </p>
                                                        </div>
                                                        <img src="images/realtext.png" alt="" class="bottomImg">
                                                    </div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>`;
            $("body").prepend(this.maskHtml);
            this.createNum();
            this.bindEvent();
        },
        // 绑定事件
        bindEvent: function () {
            $(".chooseBigCatOrDog .maskUl").on("mouseenter", "li", $.proxy(this.changeShow, this));
            $(".chooseBigCatOrDog .maskUl li>a").on("click", this.enterHome);
        },
        // 创建移动数字
        createNum: function () {
            for (let i = 0; i < 10; i++) {
                let sp = $(`<span>${i}</span>`);
                $(".chooseBigCatOrDog .totalNum p>span").append(sp);
            }
            this.moveNum([8, 7, 6, 4, 5], ".dogTotalNum");
        },
        // 切换猫狗显示不同内容
        changeShow: function (evt) {
            let e = evt || window.event;
            let target = e.currentTarget;
            let index = $(target).index();
            $(target).children(".details").fadeIn("fast", function () {
                if (index === 0) {
                    $(target).find(".immediateAccess").css({
                        backgroundPosition: "0 0"
                    }).end().siblings().find(".immediateAccess").css({
                        backgroundPosition: "0 -320px"
                    })
                    if ($(target).find(".totalNum p>span").css("top") === "0px")
                        this.moveNum([8, 7, 6, 4, 5], ".dogTotalNum");
                } else {
                    $(target).find(".immediateAccess").css({
                        backgroundPosition: "0 -80px"
                    }).end().siblings().find(".immediateAccess").css({
                        backgroundPosition: "0 -240px"
                    })
                    if ($(target).find(".totalNum p>span").css("top") === "0px")
                        this.moveNum([0, 9, 6, 6, 5], ".catTotalNum");
                }
            }.bind(this)).end().siblings().children(".details").fadeOut("fast");
        },
        // 移动数字动画
        moveNum: function (arr, selector) {
            let sp = $(`.chooseBigCatOrDog ${selector} p>span`);
            $(`.chooseBigCatOrDog .totalNum p>span`).css({
                top: 0
            })
            $(arr).each((index, item) => {
                $(sp[index]).stop(true).animate({
                    top: -67 * (item)
                })
            })
        },
        // 选择猫狗进入首页后移出遮罩层
        enterHome: function () {
            $(".chooseBigCatOrDog").remove();
        }
    })
    window.MaskChoice = MaskChoice;
})(jQuery)
;; ~function ($) {
    /**
     * 秒杀js部分
     */
    class SpikeLeft {
        constructor() { }
        // 初始化
        init() {
            this.$leftRollingAD = $(".spike .rollingAD ul");
            this.leftRollingADCL = $(".spike .rollingAD ul").children().length;
            this.leftRollingADCount = 0;
            this.leftRollingADTime = null;
            this.timeNow = new Date().getHours();
            if (this.timeNow <= 22 && this.timeNow >= 10) {
                $(".dailyScrambleTime").html(this.timeNow + ":00");
            }
            this.bindEvent();
        }
        bindEvent() {
            this.leftRollingADTime = setInterval(this.marquee.bind(this), 2000);
            $(".rollingAD").hover(() => {
                clearInterval(this.leftRollingADTime);
            }, () => {
                this.leftRollingADTime = setInterval(this.marquee.bind(this), 2000);
            })
        }
        marquee() {
            this.leftRollingADCount++;
            this.$leftRollingAD.animate({
                top: "-=32px"
            }, () => {
                if (this.leftRollingADCount === this.leftRollingADCL - 1) {
                    this.$leftRollingAD.css({
                        top: 0
                    });
                    this.leftRollingADCount = 0;
                }
            })
        }
    }
    window.SpikeLeft = SpikeLeft;
}(jQuery)
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