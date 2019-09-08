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
