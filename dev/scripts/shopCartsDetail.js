;; !function ($) {
    /**
     * 加入购物车
     */
    function AddCart() { }
    $.extend(AddCart.prototype, {
        // 初始化
        init: function () {
            this.value = $(".countInput").val();
            this.carts = this.getCarts("carts");
            this.bindEvent();
        },
        // 绑定事件
        bindEvent: function () {
            $(".reduceBtn").on("click", this.reduceOperate.bind(this));
            $(".addBtn").on("click", this.addOperate.bind(this));
            $(".addCartsBtn").on("click", this.addGoodsToCart.bind(this));
        },
        stopPro: function (evt) {
            let e = evt || window.event;
            let target = e.currentTarget;
            target.ondragstart = target.onselectstart = function () { return false; };

        },
        // 减少数量
        reduceOperate: function (evt) {
            this.stopPro(evt);
            if (this.value == 1) {
                alert("主人不能再减少了哦");
                return;
            }
            $(".countInput").val(--this.value);
        },
        // 增加数量
        addOperate: function (evt) {
            this.stopPro(evt);
            $(".countInput").val(++this.value);
        },
        // 加入购物车
        addGoodsToCart: function () {
            // 获取cookie数据
            this.cookie_user = getCookie("username");
            this.cookie_pass = getCookie("token");
           
            let totalCount = 0;
            let goodsList = {
                img: $(".magnifierBox .options ul>li:first>img")[0].src,
                title: $(".addCarts .title").html(),
                ePrice: $(".addCarts .ePrice").html(),
                count: $(".countInput").val(),
                id: $(".addCartsBtn").attr("data-id"),
                url: window.location.pathname,
            }
            this.carts = this.getCarts("carts");
            if (!this.judgeLocalStorage(goodsList)) {
                this.carts.push(goodsList);;
            }
            this.saveData("carts", this.carts);
            this.showPopBox();
            // alert("加入购物车成功！");
            this.carts.forEach(element => {
                totalCount += parseInt(element.count);
            });
            $(".headerCartCount").html(totalCount);
        },
        showPopBox: function () {
            let html = `<div class="addCartPopBox">
                        <div class="addCartMask"></div>
                        <div class="addCartPopCon">
                            <img src="./images/shopping-popCart.gif" alt="">
                            <div>
                                <p>恭喜小主 ,成功添加到购物车咯~</p>
                                <a href="#" class="goOnShop">继续购物</a>
                                <a href="./shopCarts.html" class="toPay">立即结算</a>
                            </div>
                        </div>
                        </div>`;
            $("body").prepend(html);
            $(".goOnShop").on("click",()=>{
                $(".addCartPopBox").remove();
            })
        },
        // 判断缓存中是否有该商品
        judgeLocalStorage: function (goodsList) {
            if (this.carts.length === 0) return false;
            let flag = false;
            flag = this.carts.some(item => {
                if (item.id == goodsList.id) {
                    item.count = parseInt(item.count);
                    item.count += parseInt(goodsList.count);
                    return true;
                }
            })
            return flag;
        },
        // 设置缓存保存数据;
        saveData: function (type, json) {
            localStorage.setItem(type, JSON.stringify(json));
        },

        // 初始化获取购物车缓存数据；
        getCarts: function (data) {
            if (localStorage.getItem(data)) {
                return JSON.parse(localStorage.getItem(data));
            } else {
                return []
            }
        }
    })
    window.AddCart = AddCart;
}(jQuery)
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
;; !function ($) {
    /**
     * 购物车详情页面渲染
     */
    class RenderCartDetail {
        constructor() { }
        init() {
            this.goodData = this.getGood("goodData");
            this.renderDetailPage();
        }
        // 初始化获取商品详情缓存数据
        getGood(data) {
            if (localStorage.getItem(data)) {
                return JSON.parse(localStorage.getItem(data));
            }
        }
        renderDetailPage() {
            let html = `<div class="fl magnifierBox">
                        <div class="leftBox">
                            <img class="imgBox"
                                src="${this.goodData.contentImg}"
                                alt="">
                            <div class="clipBox"></div>
                            <div class="patch">
                                <!-- 其实这就是个贴膜 -->
                            </div>
                        </div>
                        <div class="clear options">
                            <div>
                                <ul>
                                    ${this.getImgTab(this.goodData.imgTab)}
                                </ul>
                            </div>
                            <p class="prevArrow"></p>
                            <p class="nextArrow"></p>
                        </div>
                        <div class="rightBox">
                            <img src="${this.goodData.contentImg}" alt="">
                        </div>
                    </div>
                    <div class="fl addCarts">
                        <h1 class="title">${this.goodData.des}</h1>
                        <p class="des">小精包装 3+1突破配方 全面营养</p>
                        <div class="price">
                            <p>市场价：<span class="del">${this.goodData.marketPrice}</span></p>
                            <p>
                                E宠价：
                                <span>¥</span>
                                <span class="ePrice">${this.goodData.price.substring(1)}</span>
                            </p>
                        </div>
                        <div class="m_4">
                            <div class="clear">
                                <span>
                                    <span>已售：</span>
                                    <span>${this.goodData.sale.substring(2, this.goodData.sale.length - 2)}</span>
                                    盒
                                </span>
                                <span class="comment">
                                    <span>评价：</span>
                                    <a href="#">(1547)</a>
                                    <span>咨询：</span>
                                    <a href="#">(${this.goodData.interaction.substring(2, this.goodData.interaction.length - 4)})</a>
                                </span>
                                <span>
                                    <span>赠送：</span>
                                    最多
                                    <span>17</span>
                                    E宠币
                                </span>
                            </div>
                            <ul class="clear">
                                <li><img src="https://static.epetbar.com/static_wap/appmall/lib/goods/qualityassurance.png"
                                        alt="">正品保证</li>
                                <li><img src="https://static.epetbar.com/static_wap/appmall/lib/goods/freeshipping.png"
                                        alt="">99元包邮</li>
                                <li><img src="https://static.epetbar.com/static_wap/appmall/lib/goods/thirtydays.png"
                                        alt="">30天退货</li>
                            </ul>
                        </div>
                        <div class="myBuy clear">
                            <span class="fl">我要买：</span>
                            <div class="fl">
                                <span class="fl">
                                    <span class="reduceBtn">-</span>
                                    <input class="countInput" type="text" value="1">
                                    <span class="addBtn">+</span>
                                </span>
                                盒
                            </div>
                        </div>
                        <p class="express">
                            E宠快递15点前下单，其他快递16点前下单，当天发货。
                        </p>
                        <div class="addCartsBtn" data-id="${this.goodData.id}">
                            加入购物车
                        </div>
                    </div>`;
            $(".magnifier_addCarts").html(html);
            $(".options ul li:first").addClass("active");
        }
        getImgTab(imgTab) {
            let html = "";
            imgTab.forEach(item => {
                html+=`<li><img src="${item}"
                data-src="${item}" alt=""></li>`
            })
            return html;
        }
    }
    window.RenderCartDetail = RenderCartDetail;
}(jQuery)
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
     * 购物车详情页面实例调用
     */
    let renderCartDetail = new RenderCartDetail();
    renderCartDetail.init();

    /**
     * 放大镜实例调用
     */
    let magnifier = new Magnifier();
    magnifier.init();

    /**
     * 加入购物车实例调用
     */
    let addCart = new AddCart();
    addCart.init();

})