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