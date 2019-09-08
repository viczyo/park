
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