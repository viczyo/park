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