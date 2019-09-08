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
     * 楼梯实例调用
     */
    let stairs = new Stairs();
    stairs.init(".stairs li",[0,700,1817,2817,3817,4817]);

})
; !function ($) {
      function Stairs() { }
      $.extend(Stairs.prototype, {
            init: function (selector, options) {
                  this.ele = null;
                  this.options = options;
                  if (typeof selector !== "string" || (this.ele = $(selector)).length === 0 || !(options instanceof Array) || options.length === 0) {
                        console.warn("请输入正确的选择内容")
                  }
                  this.floor_timer = null;
                  this.bindEvent();
            },
            bindEvent: function () {
                  this.ele.on("click", this.changeFloor.bind(this));
                  $(window).on("scroll", this.findFloor.bind(this));
            },
            changeFloor: function (evt) {
                  var target = evt.currentTarget;
                  var index = $(target).index();
                  $(target).addClass("active").siblings().removeClass("active");
                  $("html,body")
                        .stop()
                        .animate({
                              scrollTop: this.options[index] + 100
                        })
            },
            findFloor: function () {
                  clearTimeout(this.floor_timer);
                  this.floor_timer = setTimeout(function () {
                        var st = $("html,body").scrollTop();
                        if (st > 700) {
                              $(".stairs").show(500);
                        } else {
                              $(".stairs").hide(500);
                        }
                        this.options.some((item, index) => {
                              if (st > item && st < item + 700) {
                                    this.index = index;
                                    return true;
                              }
                        })
                        this.ele.eq(this.index).addClass("active").siblings().removeClass("active");
                  }.bind(this), 80)
            }
      })
      window.Stairs = Stairs;
}(jQuery);