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