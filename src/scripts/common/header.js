;; (function ($) {
    /**
     * header 部分
     */
    class Header {
        constructor() { }
        // 初始化
        init(bannerObj) {
            // 获取cookie数据
            this.cookie_user = getCookie("username");
            this.cookie_pass = getCookie("password");
            this.bannerObj = bannerObj ? bannerObj : "";
            if (bannerObj) {
                $(".topNav>.leftNav>li.active").css({
                    background: this.bannerObj.bannerArr[0].bg
                })
            } else {
                $(".topNav>.leftNav>li").removeClass("active");
                $(".topNav>.leftNav>li>ul").hide();
                $(".topNav>.leftNav>li>ul").css({
                    border: "1px solid #62a727"
                });

            }
            this.getCarts("carts");
            this.setCookieToHeader();
            this.bindEvent();
        }
        // 绑定定位位置事件
        bindEvent() {
            $(".header .placeText").hover(this.startHover, this.endHover);
            $(".header .tab").on("click", "li", this.changeTab);
            if (this.bannerObj) {
                $(".topNav>.leftNav>li").on("mouseenter", this.changeNavCon.bind(this));
            } else { 
                $(".topNav>.leftNav>li").hover(this.changeNavCon.bind(this), () => {
                    $(".topNav>.leftNav>li>ul").hide();
                    $(".topNav>.leftNav>li").css({
                        background: "#fff"
                    })
                    $(".topNav>.leftNav>li").removeClass("active");
                });
            }
        }
		
        // 鼠标移入时左边导航切换内容
        changeNavCon(evt) {
            let e = evt || window.event;
            let target = $(e.currentTarget);
            target.addClass("active").css({
                background: this.bannerObj ? this.bannerObj.bannerArr[this.bannerObj.index].bg : "#46ab50"
            }).siblings().removeClass("active").css({
                background: "#fff"
            });
            target.find(".parentUl").show().end().siblings().find(".parentUl").hide();
        }
		
		
        // 如果有cookie则不需要登录
        setCookieToHeader() {
            if (this.cookie_user && this.cookie_pass) {
                $(".headerLoginBtn").detach();
                $(".headerRegisterBtn").detach();
                let userId = $(`<li>铲屎官 0_0 ${this.cookie_user}</li>`);
                let signOut = $("<li><a href='#' class='headersignOutBtn'>[退出]</a></li>");
                $(".headerRight").prepend(signOut);
                $(".headerRight").prepend(userId);
                $(".headersignOutBtn").on("click", () => {
					
                    let headerLoginBtn = $(`<li><a href="#" class="headerLoginBtn">[登录]</a></li>`);
                    let headerRegisterBtn = $(`<li><a href="#" class="headerRegisterBtn">[注册]</a></li>`);
                    $(".headerRight").prepend(headerRegisterBtn);
                    $(".headerRight").prepend(headerLoginBtn);
                    userId.detach();
                    signOut.detach();
					this.removeCookie('username');
					this.removeCookie('password');
                })
            }
        }
		
		removeCookie(key) {
			this.setCookie(key, '', -1);
		}
		setCookie(c_name, value, expiredays) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expiredays);
			document.cookie = c_name + "=" + escape(value) +
				((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
		}
        // 鼠标移入事件
        startHover() {
            $(".header .place").show();
			
            let index = $(".header .tab").children(".active").index();
            let showDiv = $(".header .tabContent").children().eq(index);
            showDiv.show().siblings().hide();
        }
		
        // 鼠标移出事件
        endHover() {
            $(".header .place").hide();
        }
		
        // 切换地点选择tab页
        changeTab(evt) {
            let e = evt || window.event;
            let currentLi = $(e.currentTarget);
            let index = currentLi.index();
            currentLi.addClass("active").siblings().removeClass("active");
            let showDiv = $(".header .tabContent").children().eq(index);
            showDiv.show().siblings().hide();
        }
        // 初始化获取购物车缓存数据；
        getCarts() {
            if (localStorage.getItem("carts")) {
                let totalCount = 0;
                let carts = JSON.parse(localStorage.getItem("carts"));
                carts.forEach(element => {
                    totalCount += parseInt(element.count);
                });
                $(".headerCartCount").html(totalCount);
            }
        }
    }
    window.Header = Header;
})(jQuery)