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
