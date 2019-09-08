;; !function ($) {
    /**
     * 渲染购物列表页面
     */
    class ShopCartsLists {
        constructor() { }
        // 初始化
        init() {
            this.carts = this.getCarts();
            this.renderCartLists();
        }
        // 绑定事件
        bindEvent() {
            $(".reduceBtnPage").on("click", this.reduceOperate.bind(this));
            $(".addBtnPage").on("click", this.addOperate.bind(this));
            $(".delCartList").on("click", this.delCartList.bind(this));
            $(".inputCountPage").on("input", this.changeCartCount.bind(this));
        }
        // 渲染购物车列表
        renderCartLists() {
            // if (this.carts.length === 0) return;
            let html = "";
            let totalPrice = 0;
            let totalCount = 0;
            this.carts.forEach(element => {
                html += `<li class="clear" data-id="${element.id}">
                    <div class="g1">
                        <input type="checkbox" checked="checked" autocomplete="off">
                    </div>
                    <div class="g2">
                        <a class="fl" href="${element.url}" target="_blank">
                            <img src="${element.img}" alt="">
                        </a>
                        <a class="fl" href="#">${element.title}</a>
                    </div>
                    <div class="g3">
                        <div>
                            <div>
                                <span class="fl reduceBtnPage">-</span>
                                <input class="fl inputCountPage" type="text" value="${element.count}">
                                <span class="fl addBtnPage">+</span>
                            </div>
                            <p>有货</p>
                        </div>
                    </div>
                    <div class="g4">
                        <div>
                            ￥${(element.ePrice * element.count).toFixed(2)}
                            <p>￥${element.ePrice}/件</p>
                        </div>
        
                    </div>
                    <div class="g5">
                        <a href="#">[收藏]</a>
                        <a href="#" class="delCartList">[删除]</a>
                    </div>
                </li>`
                totalPrice += +(element.ePrice * element.count).toFixed(2);
                totalCount += parseInt(element.count);
            });
            console.log(totalPrice)
            $(".goods_list").html(html);
            $(".pageTotalPrice").html("￥" + totalPrice);
            $(".headerCartCount").html(totalCount);
            this.bindEvent();
        }
        // 阻止默认事件
        stopPro(target) {
            target.ondragstart = target.onselectstart = function () { return false; };
        }
        // 减少数量
        reduceOperate(evt) {
            let e = evt || window.event;
            let target = e.currentTarget;
            this.stopPro(target);
            let parentUl = $(target).parentsUntil("ul");
            let parentLi = $(parentUl[parentUl.length - 1]);
            let id = parentLi.attr("data-id");
            this.carts.some(item => {
                if (item.id == id) {
                    if (item.count == 1) {
                        alert("主人不能再减少了哦");
                        return true;
                    }
                    item.count--;
                    return true;
                }
            })
            this.saveData("carts", this.carts);
            this.renderCartLists();
        }
        // 增加数量
        addOperate(evt) {
            let e = evt || window.event;
            let target = e.currentTarget;
            this.stopPro(target);
            let parentUl = $(target).parentsUntil("ul");
            let parentLi = $(parentUl[parentUl.length - 1]);
            let id = parentLi.attr("data-id");
            this.carts.some(item => {
                if (item.id == id) {
                    item.count++;
                    return true;
                }
            })
            this.saveData("carts", this.carts);
            this.renderCartLists();
        }
        // 删除购物车商品
        delCartList(evt) {
            let e = evt || window.event;
            let target = e.currentTarget;
            let parentUl = $(target).parentsUntil("ul");
            let parentLi = $(parentUl[parentUl.length - 1]);
            let id = parentLi.attr("data-id");
            parentLi.remove();
            this.carts.some((element, index) => {
                if (element.id == id) {
                    this.carts.splice(index, 1);
                    return true;
                }
            });
            alert("删除成功!");
            this.saveData("carts", this.carts);
            this.renderCartLists();
        }
        // 绑定input输入事件改变数量
        changeCartCount(evt) {
            let e = evt || window.event;
            let target = e.currentTarget;
            this.stopPro(target);
            let parentUl = $(target).parentsUntil("ul");
            let parentLi = $(parentUl[parentUl.length - 1]);
            let id = parentLi.attr("data-id");
            let value = $(target).val();
            this.carts.some(item => {
                if (item.id == id) {
                    item.count = value;
                    return true;
                }
            })
            this.saveData("carts", this.carts);
            this.renderCartLists();
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
                return []
            }
        }
    }
    window.ShopCartsLists = ShopCartsLists;
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
        rightBar.init(shopCartsLists);
    });

    /**
     * footer部分加载
     */
    $(".footer").load("./footer.html");

    /**
     * 购物车列表页面实例调用
     */
    let shopCartsLists = new ShopCartsLists();
    shopCartsLists.init();
})