;; !function ($) {
    // 放大镜
    class Magnifier {
        // 构造函数
        constructor() { }
        // 初始化
        init(eleOptions) {
            this.indexTab = 0;
            this.leftBox = $(".leftBox");
            this.imgBox = $(".imgBox");
            this.clipBox = $(".clipBox");
            this.rightBox = $(".rightBox");
            this.rightImg = this.rightBox.children();
            this.options = $(".options>div>ul");
            this.optionsChildren = this.options.children();
            $(".options ul").width(this.optionsChildren.length * 84);
            this.scale = (this.rightBox.width() / this.clipBox.width()).toFixed(2);
            console.log(this.scale);
            this.rightImg.width(this.scale * this.imgBox[0].offsetWidth);
            this.rightImg.height(this.scale * this.imgBox[0].offsetHeight);
            this.bindEvent();
        }
        // 绑定事件
        bindEvent() {
            this.leftBox.on("mouseenter", this.showEle.bind(this));
            this.leftBox.on("mousemove", this.follow.bind(this));
            this.leftBox.on("mouseleave", this.hideEle.bind(this));
            this.optionsChildren.on("mouseenter", this.changeImg.bind(this));
            if (this.optionsChildren.length > 4) {
                $(".options .prevArrow").on("click", this.prevTab.bind(this));
                $(".options .nextArrow").on("click", this.nextTab.bind(this));
            }

        }
        // 向前移动tab
        prevTab() {
            if (this.indexTab === 0) return;
            $(".options ul").animate({
                left: "+=84px"
            });
            this.indexTab--;
        }
        // 向后移动tab
        nextTab() {
            if (this.indexTab === this.optionsChildren.length - 4) return;
            $(".options ul").animate({
                left: "-=84px"
            });
            this.indexTab++;
        }
        // 点击图片选项卡时切换图片
        changeImg(evt) {
            let e = evt || window.event;
            let target = $(e.currentTarget);
            this.imgBox[0].src = target.find("img")[0].src;
            this.rightImg[0].src = target.find("img")[0].dataset.src;
            target.addClass("active").siblings().removeClass("active");
        }
        // 鼠标移入时显示裁切小框和右边放大框以及图片变透明
        showEle() {
            this.clipBox.fadeIn("fast");
            this.rightBox.fadeIn("fast");
        }
        // 鼠标移出时隐藏元素
        hideEle() {
            this.clipBox.fadeOut("fast");
            this.rightBox.fadeOut("fast");
        }
        // 裁剪小框跟随鼠标移动
        follow(evt) {
            let e = evt || window.event;
            // let gs = getComputedStyle;
            let [nLeft, nTop, lmax, tmax] = [
                e.offsetX - this.clipBox[0].offsetWidth / 2,
                e.offsetY - this.clipBox[0].offsetHeight / 2,
                this.leftBox[0].clientWidth - this.clipBox[0].clientWidth,
                this.leftBox[0].clientHeight - this.clipBox[0].clientHeight
            ];
            // 边界处理
            nLeft = nLeft <= 0 ? 0 : nLeft;
            nTop = nTop <= 0 ? 0 : nTop;
            nLeft = nLeft >= lmax ? lmax : nLeft;
            nTop = nTop >= tmax ? tmax : nTop;
            // 设置裁切框位置
            this.clipBox.css({
                left: nLeft + "px",
                top: nTop + "px"
            });
            // this.clipBox.style.backgroundPosition = `-${nLeft}px -${nTop}px`;
            this.rightImg.css({
                left: -nLeft * this.scale + "px",
                top: -nTop * this.scale + "px"
            });
        }
    }
    window.Magnifier = Magnifier;
}(jQuery)