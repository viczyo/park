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
     * 懒加载图片
     */
    let lazyload = new LazyLoad();

    /**
     * 渲染列表实例调用
     */
    let renderLists = new RenderLists();
    renderLists.init(lazyload);
    /**
     * 分页实例调用
     */
    // 分页模块实例化对象
    let pg = new Pagination();
    pg.init(40, renderLists.load.bind(renderLists));
})