
/**
 * 
 * @param {年份} year 
 * @param {月份} month 
 * @param {日期} date 
 * @param {小时} hour 
 * @param {分钟} minute 
 * @param {秒} second 
 * 
 * @return [hour,minute,second] 
 * 
 * countDown 计算输入时间和倒计时关系的方法;
 * 
 */

function countDown(year, month, date, hour, minute, second) {
      // 1. 用户传递了 三个参数还是六个参数;
      var end = null;
      if (arguments.length > 3) {
            // 精确时间;
            end = new Date(year, month - 1, date, hour, minute, second);
      } else {
            end = new Date(year, month - 1, date);
      }

      // 2. 获取当前时间;
      var now = Date.now();
      // 3. 获取时间差并且返回计算结果;
      var reduce = end.getTime() - now;

      var hours = parseInt(reduce / 1000 / 3600);
      var minutes = parseInt(reduce / 1000 / 60 % 60);
      var seconds = parseInt(reduce / 1000 % 60);

      return [hours, minutes, seconds]
}

/**
 * 
 * 事件委托的封装
 * 
 */

function delegate(callback, selector, parentNode) {
      return function (evt) {
            var e = evt || window.event;
            var target = e.target || e.srcElement;

            if (target.nodeName.toLowerCase() === selector) {
                  callback();
            } else {
                  for (var i = 0; i < e.path.length; i++) {
                        if (e.path[i].nodeName.toLowerCase() === selector) {
                              callback();
                              break;
                        }
                        if (e.path[i] === (parentNode ? parentNode : document.body)) {
                              break;
                        }
                  }
            }
      }
}

/**
 * 
 *    运动框架 
 *    move(eleNode,targe,attr)
 * 
 * 
 */
function move(eleNode, target, attr) {
      var g = getComputedStyle;
      clearInterval(eleNode.timer);
      eleNode.timer = setInterval(function () {
            var iNow = attr === "opacity" ? g(eleNode)[attr] * 100 : parseInt(g(eleNode)[attr]);
            var speed = (target - iNow) / 8;
            speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
            iNow += speed;
            eleNode.style[attr] = attr === "opacity" ? iNow / 100 : iNow + "px";
            // 单if 不带 return的这样的情况都可以简写成三目运算符;
            iNow === target ? clearInterval(eleNode.timer) : "";
      }, 50)
}

/**
 * @param {运动元素}   eleNode
 * @param {多属性对象} options
 * @param {回调函数}   callback
 *  
 * moveAttr 多属性运动框架
 * 
 */
function moveAttr(eleNode, options, callback) {
      clearInterval(eleNode.timer);
      eleNode.timer = setInterval(function () {
            for (var attr in options) {
                  var result = attrToTarget(eleNode, attr, options[attr]);
                  if (result) {
                        delete options[attr];
                  }
            }
            if (JSON.stringify(options) == "{}") {//当对象为{}时，清除定时器
                  clearInterval(eleNode.timer);
                  if (typeof callback === "function")
                        callback();
            }
      }, 50)
      moveAttr.timer = eleNode.timer;
}

/**
 * 
 * @param {运动元素} eleNode 
 * @param {运动属性} attr 
 * @param {运动目标点} target 
 * 
 * attrToTarget 移动属性到目标点
 * 
 */
function attrToTarget(eleNode, attr, target) {
      var gs = getComputedStyle;
      if (attr === "opacity") {
            var iNow = gs(eleNode)[attr] * 100
      } else {
            var iNow = parseInt(gs(eleNode)[attr]);
      }
      var speed = (target - iNow) / 8;
      speed = speed > 0 ? Math.ceil(speed) : Math.floor(speed);
      iNow += speed;
      if (attr === "opacity") {
            eleNode.style[attr] = iNow / 100;
      } else {
            eleNode.style[attr] = iNow + "px";
      }
      return iNow === target;
}
/**
 * stop 停止运动
 */
function stop() {
      clearInterval(moveAttr.timer);
}

/**
 * @function xhrGet 
 *  
 * 利用xhr发送get请求;
 * 
 * xhrGet(url[,data],callback)  
 * 
 * url : 必选
 * data : 可选  => object 
 * callback : 必选
 * 
 */

function xhrGet(url, data) {
      return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            if (typeof data !== "function" && data instanceof Object) {
                  // 拼接字符串; 
                  var _arr = [];
                  for (var key in data) {
                        _arr.push(`${key}=${data[key]}`)
                  }
                  var _symbol = /\?/.test(url) ? "&" : "?";
                  url += _symbol + _arr.join("&")
            }
            xhr.open("GET", url);
            xhr.send(null);
            xhr.onreadystatechange = function () {
                  if (xhr.readyState === 4 && xhr.status === 200)
                        resolve(xhr.responseText);
            }
      })
}
/**
 * @function xhrPost
 */

function xhrPost(url, data) {
      return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open("POST", url);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            var _data = [];
            for (let key in data) {
                  _data.push(`${key}=${data[key]}`);
            }
            xhr.send(_data.join("&"));
            xhr.onload = function () {
                  xhr.status === 200 ? resolve(xhr.responseText) : reject(xhr.status);
            }
      })
}
/**
 * 
 * @param {*地址 } url 
 * @param {*可选参数 ，回调函数名，默认为 callback} cb_key 
 * @param {*传输数据，传输类型仅限于 GET} data 
 */
function jsonp(url, cb_key, data) {
      cb_key = !cb_key ? "callback" : cb_key;
      data = !data ? {} : data;
      return new Promise((resove, reject) => {
            var cb_name = "gp10" + Date.now();
            window[cb_name] = function (res) {
                  resove(res);
            }
            var script = document.createElement("script");
            url += /\?/.test(url) ? "&" : "?";
            url += cb_key + "=" + cb_name;
            for (let key in data) {
                  url += `&${key}=${data[key]}`;
            }
            script.src = url;
            document.body.appendChild(script);
            script.onload = function () {
                  this.remove();
            }
      })
}
/*
jsonp后端配合的部分xxx.php
后端返回给你的数据永远都是字符串，
如果字符串符合了JavaScript规则，那么前端会当成js执行。
<?php 
      $callback = @$_GET["cb_key"];
      $data = "...";
      echo "$callback($data)";
?>
*/

/**
 * @function cookie 设置cookie功能;
 * 
 * 
 * @param {*} key 
 * @param {*} value 
 * @param {*} options 
 * 
 */

function cookie(key, value, options) {
      typeof options === "object" ? Object.assign({}, options) : options = {};

      var res = "";
      res += key + "=" + encodeURI(value);
      // 有没有过期时间;
      if (typeof options.expires === "number") {
            var d = new Date()
            d.setDate(d.getDate() + options.expires);
            res += ";expires=" + d;
      }
      res += options.path ? ";path=" + options.path : "";
      res += options.domain ? ";domain=" + options.domain : "";

      document.cookie = res;
}
// path不同也代表两条不同的cookie;
function removeCookie(key, options) {
      // 确保options一定是对象类型,同时可以配置默认参数;
      var default_options = {
            expires: -1
      };
      options = typeof options == "object" ? Object.assign(default_options, options) : default_options;
      cookie(key, null, options)
}

function getCookie(key) {
      var _cookie = document.cookie;
      // "key=value; key2=value; key3=value";
      var _cookie_item = _cookie.split("; ");
      var _key = [];
      var _value = _cookie_item.map(item => {
            var _temp = item.split("=");
            _key.push(_temp[0]);
            return _temp[1];
      })
      var index = _key.indexOf(key);
      if (index !== -1) {
            return _value[index];
      }
      return "";
}
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
;; ~function () {
      /**
       * 懒加载插件
       */
      class LazyLoad {
            constructor() { }
            init(selector) {
                  this.timer = null;
                  this.cHeight = document.documentElement.clientHeight;
                  this.selector = selector;
                  this.lazyload();
            }
            lazyload() {
                  let imgList = $(this.selector);
                  let itemArray = Array.from(imgList).map(item => {
                        return {
                              img: item,
                              top: item.y,
                              src: item.getAttribute("data-src")
                        }
                  })
                  this.load(itemArray);
                  window.addEventListener("scroll", this.load.bind(this, itemArray));
            }
            load(itemArray) {
                  if (this.timer !== null) return;
                  this.timer = setTimeout(() => {
                        //比对;
                        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
                        var min = scrollTop + this.cHeight;
                        itemArray.forEach(item => {
                              if (item.top < min + 200) {
                                    item.img.src = item.src;
                              }
                        })
                        this.timer = null;
                  }, 500)
            }
      }
      window.LazyLoad = LazyLoad;
}(jQuery)
;;
(function($) {
	/**
	 *登录js部分 
	 */

	class Login {
		constructor() {}
		// 初始化绑定事件
		init() {
			this.loginObj = $.Callbacks();
			// 获取cookie数据
			this.cookie_user = getCookie("username");
			this.cookie_pass = getCookie("password");
			// 该变量表示是否已经发送了请求;
			this.loading = false;
			this.bindEvent();
		}
		// 绑定事件
		bindEvent() {
			this.loginObj.add(() => {
				$(".loginWrap .mask").on("click", this.hideLogin);
				$(".loginBtn").on("click", this.submitForm.bind(this));
				$("#username").on("blur", this.judgeInput.bind(this, $("#username"), "请输入手机号或者账号"));
				$("#password").on("blur", this.judgeInput.bind(this, $("#password"), "请输入密码"));
				$(".input-group").on("blur", "input", this.changeLoginBg);
				$(".toRegister").on("click", this.toRegister.bind(this));
				// 阻止表单默认事件;
				$("#login_form").submit(function(evt) {
					var e = evt || window.event;
					e.preventDefault();
				})
			})
			this.loginObj.add(this.setCookieToInput.bind(this));
			$(".headerLoginBtn").on("click", this.showLogin.bind(this));
		}
		// 点击手机快速注册时弹出注册框
		toRegister() {
			this.hideLogin();
			$(".headerRegisterBtn").trigger("click");
		}
		// 验证成功时改变登录按钮的背景颜色
		changeLoginBg() {
			if ($("#username").val() && $("#password").val()) {
				$(".loginBtn").css("background", "#f03e3e");
			}
		}
		// 判断输入的内容是否为空
		judgeInput(ele, tip) {
			if (ele.val()) {
				ele.next().html("");
			} else {
				ele.next().html(tip);
			}

		}
		// 将cookie设置到登录输入框中
		setCookieToInput() {
			if (this.cookie_user && this.cookie_pass) {
				$("#username").val(this.cookie_user);
				$("#password").val(this.cookie_pass);
			}
		}
		// 点击登录按钮时发送请求
		submitForm() {
			if (this.loading) return false;
			let username = $("#username").val();
			let password = $("#password").val();
			let flag = 0;
			$(".usrTip").html("");
			$(".passTip").html("");
			// 如果账号和密码位空则提示并退出
			if (!username) {
				$(".usrTip").html("请输入手机号或者账号");
				flag = 1;
			}
			if (!password) {
				$(".passTip").html("请输入密码");
				flag = 1;
			}
			if (flag) return false;
			this.loading = true;
			$(".loginBtn").html("loading");
			$(".registerBtn").html("loading");

			this.showInfo("! 开启我的宠物乐园之旅 Q");
			this.setCookie("username", username, 365);
			this.setCookie("password", password, 365);
			
			setTimeout(() => {

				this.hideLogin();
				$(".headerLoginBtn").detach();
				$(".headerRegisterBtn").detach();
				let userId = $(`<li>铲屎官  0_0  ${username}</li>`);
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

					let register = new Register();
					register.init();
					this.init();
				})
			}, 2000);
		}
		showInfo(text) {
			// 显示内容
			$(".totalTip").html(text);
			$(".totalTip").css({
				"display": "block",
				"color": "purple",
				"font-size": "14px",
				"text-align": "center"
			});
		}

		// 点击登录按钮时显示登录弹出框
		showLogin() {
			let loginHtml =
				`<div class="loginWrap">
                        <div class="mask"></div>
                        <div class="loginDiv">
                            <h2>账户登录</h2>
                            <span class="totalTip"></span>
                            <form class="login-form" id="login_form">
                                <div class="input-group userDiv">
                                    <span class="icon"></span>
                                    <input type="text" class="form-control" autocomplete="off" id="username" placeholder="请输入手机号/账号">
                                    <span class="usrTip"></span>
                                </div>
                                <div class="input-group passDiv">
                                    <span class="icon"></span>
                                    <input type="password" class="form-control" id="password" placeholder="请输入密码">
                                    <span class="passTip"></span>
                                </div>
                                <button type="submit" class="loginBtn">登录</button>
                            </form>
                            <div class="loginMode clear">
                                <span class="fl">
                                    <a href="#" class="zfb"></a>
                                    <a href="#" class="wx"></a>
                                    <a href="#" class="qq"></a>
                                </span>
                                <span class="fr">
                                    <a href="#" class="toRegister">手机快速注册</a>
                                    <a href="#">遇到问题?</a>
                                </span>
                            </div>
                        </div>
                        </div>`
			$("body").prepend(loginHtml);
			this.loginObj.fire();
		}
		// 点击遮罩框和表单登录按钮时移除注册弹出框
		hideLogin(e) {
			$(".loginWrap").remove();
		}

		setCookie(c_name, value, expiredays) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expiredays);
			document.cookie = c_name + "=" + escape(value) +
				((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
		}

		getCookie(key) {
			var arr1 = document.cookie.split(';');
			for (var i = 0; i < arr1.length; i++) {
				var arr2 = arr1[i].split('=');
				if (arr2[0] == key) {
					return arr2[1];
				}
			}
		}
		
	}
	
	window.Login = Login;

})(jQuery)

;;
(function($) {
	/**
	 * 注册js部分
	 */
	class Register {
		constructor() {}
		// 初始化绑定事件
		init() {
			this.registerObj = $.Callbacks();
			this.cookie_user = getCookie("username");
			this.cookie_pass = getCookie("token");
			// 正则
			this.regList = {
				"usrReg": /^[a-z\u2E80-\u9FFF\-_0-9]{4,20}$/i,
				"pureNumber": /^\d+$/i,
				"phoneNum": /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/,
				"maxlength4": /^.{0,4}$/,
				"hasNumber": /\d/,
				"hasLetter": /[a-zA-Z]/,
				"hasSC": /[\!\@\#\$\%\^]/,
				"minlength6": /^.{0,6}$/,
				"email": /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[0-9a-z]{2,9}\.[a-z]{2,6}(\.[a-z]{2,3})?$/i
			}

			this.bindEvent();
		}
		// 绑定事件
		bindEvent() {
			this.registerObj.add(() => {
				this.validArr = [$("#username"), $("#password"), $("#confirmPass"), $("#email")];
				$(".registerWrap .mask").on("click", this.hideRegister.bind(this));
				$(".registerBtn").on("click", this.submitForm.bind(this));
				$(".input-group").on("blur", "input", this.judgeInput.bind(this));
				$(".input-group").on("focus", "input", this.showTip.bind(this));
				$(".agreeBtn").on("click", this.agreeChange.bind(this));
				$(".toLogin").on("click", this.toLogin.bind(this));
				// 阻止表单默认事件;
				$("#register_form").submit(function() {
					return false;
				})
			})
			this.registerObj.add(this.setCookieToInput.bind(this));
			$(".headerRegisterBtn").on("click", this.showRegister.bind(this));
		}
		// 点击直接登录时弹出登录框
		toLogin() {
			this.hideRegister();
			$(".headerLoginBtn").trigger("click");
		}
		// 是否选择同意E宠用户协议
		agreeChange() {
			$(".agreeBtn").toggleClass("disagree");
			if (this.validateSuccess() && !$(".agreeBtn").hasClass("disagree")) {
				$(".registerBtn").css("background", "#f03e3e");
			} else {
				$(".registerBtn").css("background", "#999");
			}
		}
		// 判断是验证哪一个输入框
		judgeInput(evt) {
			let e = evt || window.event;
			let target = e.currentTarget;
			switch (target.id) {
				case "username":
					this.validUsr();
					break;
				case "password":
					this.validPass();
					break;
				case "confirmPass":
					this.validConfirmPass();
					break;
				case "email":
					this.validEmail();
					break;
			}
			if (this.validateSuccess() && !$(".agreeBtn").hasClass("disagree")) {
				$(".registerBtn").css("background", "#f03e3e");
			} else {
				$(".registerBtn").css("background", "#999");
			}
		}
		showTip(evt) {
			let e = evt || window.event;
			let target = e.currentTarget;
			$(target).next().css("display", "block");
		}
		// 验证成功
		success(input, tipEle) {
			input.addClass("success");
			tipEle.html("");
			input.next().css("display", "none");

		}
		//验证失败
		error(tip, input, tipEle) {
			tipEle.css({
				display: "block",
				color: "red"
			});
			input.removeClass("success");
			tipEle.html(tip);
		}
		// 验证正则成功与否;
		validateReg(str, reg) {
			return reg.test(str);
		}
		// 验证用户名
		validUsr() {
			let usrValue = $("#username").val();
			if (this.validateReg(usrValue, this.regList.phoneNum)) {
				this.regSuccessFlag++;
				return this.success($("#username"), $(".usrTip"));
			}
			if (this.validateReg(usrValue, this.regList.maxlength4)) {
				return this.error("请输入4位以上的账号或者11位手机号", $("#username"), $(".usrTip"));

			}
			if (this.validateReg(usrValue, this.regList.pureNumber)) {
				return this.error("用户名不能为除了手机号的纯数字", $("#username"), $(".usrTip"));
			}
			if (this.validateReg(usrValue, this.regList.usrReg)) {
				this.regSuccessFlag++;
				return this.success($("#username"), $(".usrTip"));
			}
			return this.error("支持中文，英文，数字，字母，-，_ 的4~20位字符", $("#username"), $(".usrTip"));
		}
		// 验证密码
		validPass() {
			let passValue = $("#password").val();
			let strength = 0;
			if (this.validateReg(passValue, this.regList.hasNumber)) {
				strength++;
			}
			if (this.validateReg(passValue, this.regList.hasLetter)) {
				strength++;
			}
			if (this.validateReg(passValue, this.regList.hasSC)) {
				strength++;
			}
			if (this.validateReg(passValue, this.regList.minlength6)) {
				return this.error("请输入6位以上的密码", $("#password"), $(".passTip"));
			}
			if (strength === 3) {
				this.regSuccessFlag++;
				this.success($("#password"), $(".passTip"));
			} else if (strength === 2) {
				this.error("密码强度不足，建议升级密码", $("#password"), $(".passTip"));
			} else if (strength === 1) {
				this.error("密码强度严重不足，强烈建议升级密码", $("#password"), $(".passTip"));
			}
		}
		// 验证再次输入密码
		validConfirmPass() {
			let confirmPassValue = $("#confirmPass").val();
			let passValue = $("#password").val();
			if (confirmPassValue === "") {
				return this.error("请再次输入密码", $("#confirmPass"), $(".confirmPassTip"));
			}
			if (confirmPassValue != passValue) {
				return this.error("输入的密码与设置的密码不符", $("#confirmPass"), $(".confirmPassTip"));
			} else {
				this.regSuccessFlag++;
				return this.success($("#confirmPass"), $(".confirmPassTip"));
			}
		}
		// 验证邮箱
		validEmail() {
			let emailValue = $("#email").val();
			if (this.validateReg(emailValue, this.regList.email)) {
				this.regSuccessFlag++;
				return this.success($("#email"), $(".emailTip"));
			} else {
				return this.error("请输入正确的邮箱", $("#email"), $(".emailTip"));
			}
		}
		// 验证是否通过所有验证
		validateSuccess(arg) {
			for (let i = 0, ele; ele = this.validArr[i++];) {
				if (!ele.hasClass("success")) {
					// 如果点击的是注册按钮让未验证成功的元素聚焦
					if (arg) ele.focus();
					return false;
				}
			}
			return true;
		}
		// 点击注册按钮时发送请求
		submitForm() {
			if (this.loading || $(".agreeBtn").hasClass("disagree") || !this.validateSuccess("submit")) return false;
			let username = $("#username").val();
			let password = $("#password").val();
			let confirmPass = $("#confirmPass").val();
			let email = $("#email").val();
			this.loading = true;
			$(".registerBtn").html("loading");
			this.showInfo("! 开启我的宠物乐园之旅 Q");
			setTimeout(() => {

				this.hideRegister();
				$(".headerLoginBtn").detach();
				$(".headerRegisterBtn").detach();
				let userId = $(`<li>铲屎官  0_0  ${username}</li>`);
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

					let login = new Login();
					login.init();
					this.init();
				})
			}, 2000);
		}
		showInfo(text) {
			// 显示内容
			$(".totalTip").html(text);
			$(".totalTip").css({
				"display": "block",
				"color": "purple",
				"font-size": "14px",
				"text-align": "center"
			});
		}
		
		setCookieToInput() {
		    if (this.cookie_user && this.cookie_pass) {
		        $("#username").val(this.cookie_user);
		        $("#password").val(this.cookie_pass);
		    }
		}
		
		// 点击注册按钮时显示注册弹出框
		showRegister() {
			let registerHtml =
				`<div class="loginWrap registerWrap">
                                <div class="mask"></div>
                                <div class="loginDiv registerDiv">
                                    <div class="title">
                                        <h2>新用户注册</h2>
                                        <span class="line"></span>
                                        <h2 class="toLogin">直接登录</h2>
                                    </div>
                                    <span class="totalTip"></span>
                                    <form class="login-form register-form" id="register_form">
                                        <div class="input-group phoneDiv">
                                            <span class="icon"></span>
                                            <input type="text" class="form-control" id="username" placeholder="请输入手机号/账号">
                                            <span class="usrTip">支持中文、英文、数字、“-”、“_”的组合，4-20个字符</span>
                                        </div>
                                        <div class="input-group passDiv">
                                            <span class="icon"></span>
                                            <input type="password" class="form-control" id="password" placeholder="请输入密码">
                                            <span class="passTip">建议使用字母、数字和符号两种以上的组合，6-20个字符</span>
                                        </div>
                                        <div class="input-group passDiv">
                                            <span class="icon"></span>
                                            <input type="password" class="form-control" id="confirmPass" placeholder="请再次输入密码">
                                            <span class="confirmPassTip">请再次输入密码</span>
                                        </div>
                                        <div class="input-group emailDiv">
                                            <span class="icon fa fa-envelope fa-lg"></span>
                                            <input type="email" class="form-control" id="email" placeholder="请输入邮箱">
                                            <span class="emailTip">请输入邮箱</span>
                                        </div>
                                        <button type="submit" class="loginBtn registerBtn">注册</button>
                                    </form>
                                    <div class="registerBottom clear">
                                        <span class="fl">
                                            <span class="agreeBtn"></span>
                                            <span>
                                                我同意E宠
                                                <a href="#">《用户使用协议》</a>
                                            </span>
                                        </span>
                                        <span class="fr">
                                            <a href="#">遇到问题?</a>
                                        </span>
                                    </div>
                                </div>
                            </div>`
			$("body").prepend(registerHtml);
			this.registerObj.fire();
		}
		// 点击遮罩框和表单登录按钮时移除注册弹出框
		hideRegister(e) {
			$(".registerWrap").remove();
		}
		
	}
	window.Register = Register;
})(jQuery)

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
;; (function ($) {
    
	class Login{
		constructor(){
			
		}
		init(){
			
		}
	}
	
})(jQuery)