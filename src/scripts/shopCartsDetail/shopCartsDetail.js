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