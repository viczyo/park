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
