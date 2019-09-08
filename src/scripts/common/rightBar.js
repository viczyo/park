;; !function ($) {
    class RightBar {
        constructor() { }
        // 初始化
        init(shopCartsLists) {
            this.shopCartsLists = shopCartsLists ? shopCartsLists : null;
            this.bindEvent();
            this.carts = this.getCarts();
            this.renderRightCart();
        }
        // 绑定事件
        bindEvent() {
            this.toTopInit();
            $(".scart>a").hover(() => {
                this.carts = this.getCarts();
                this.renderRightCart();
            }, () => { });
            $(".rightBar .toTop").on("click", this.toTop.bind(this));
            $(".rightBar .toTop>a").hover(() => {
                $(".rightBar .toTopTip").show().animate({
                    right: "35px",
                    opacity: 1
                })
            }, () => {
                $(".rightBar .toTopTip").animate({
                    right: "55px",
                    opacity: 0
                }).queue(function (next) {
                    $(this).hide();
                    next();
                });
            });
        }
        // 回到顶部初始化
        toTopInit() {
            $(".rightBar .toTop>a").hide();//隐藏to top按钮
            $(window).scroll(function () {
                //当window的scrolltop距离大于1时，go to 
                if ($(this).scrollTop() > 100) {
                    $(".rightBar .toTop>a").show();
                } else {
                    $(".rightBar .toTop>a").hide();
                }

            });
        }
        // 回到顶部
        toTop() {
            $('html,body').stop().animate({
                scrollTop: 0
            }, "fast");
        }
        // 渲染购物车列表
        renderRightCart() {
            if (this.carts.length === 0) {
                this.clearRtCart();
                return;
            } else {
                $(".cartsLists").removeClass("cartTip");
            }
            let html = "";
            let totalPrice = 0;
            let totalCount = 0;
            this.carts.forEach(element => {
                html += `<li class="clear" data-id="${element.id}">
                <a class="fl imgBox" href="${element.url}"><img
                        src="${element.img}" alt=""></a>
                <div class="fl">
                    <p class="des"><a href="#">${element.title}</a></p>
                    <p class="price">￥${element.ePrice} × ${element.count}</p>
                    <span class="fr delBtn">[删除]</span>
                </div>
            </li>`
                totalPrice += +(element.ePrice * element.count).toFixed(2);
                totalCount += parseInt(element.count);
            });
            $(".cartsLists").html(html);
            let html1 = `<p class="fl">
                            共
                            <span class="cartCount">${this.carts.length}</span>
                            件商品 合计:
                            <span class="totalPrice">￥${totalPrice}</span>
                        </p>
                        <div class="fr">
                            <a href="#" class="clearRtCart">清空</a>
                            <a href="./shopCarts.html" target="_blank" class="active">去结算</a>
                        </div>`
            $(".cart_bt").html(html1);
            $(".headerCartCount").html(totalCount);
            $(".clearRtCart").on("click", this.clearRtCart.bind(this));
            $(".delBtn").on("click", this.deleteGoods.bind(this));
        }
        // 删除商品
        deleteGoods(evt) {
            let e = evt || window.event;
            let target = $(e.currentTarget);
            let id = target.parent().parent().attr("data-id");
            target.parent().parent().remove();
            this.carts.some((element, index) => {
                if (element.id == id) {
                    this.carts.splice(index, 1);
                    return true;
                }
            });
            alert("删除成功!");
            this.renderRightCart();
            this.saveData("carts", this.carts);
            if (this.shopCartsLists)
                this.shopCartsLists.init();
        }
        // 清空购物车
        clearRtCart(evt) {
            if (evt) {
                alert("清空购物车成功！");
            }
            localStorage.removeItem('carts');
            $(".cartsLists").addClass("cartTip");
            $(".cartsLists").html("您的购物车中暂无商品，赶快选择心爱的商品吧！");
            $(".cart_bt").html("");
            $(".headerCartCount").html(0);
            if (this.shopCartsLists)
                this.shopCartsLists.init();
        }
        // 设置缓存保存数据;
        saveData(type, json) {
            localStorage.setItem(type, JSON.stringify(json));
        }
        // 初始化获取购物车缓存数据；
        getCarts() {
            if (localStorage.getItem("carts")) {
                return JSON.parse(localStorage.getItem("carts"))
            } else {
                this.clearRtCart();
                return []
            }
        }
    }
    window.RightBar = RightBar;
}(jQuery)