;; ~function ($) {
    /**
     * 列表渲染
     */
    class RenderLists {
        constructor() { }
        //初始化
        init(lazyload) {
            this.data = null;
            this.index = 0;
            this.pageCount = 20;
            this.scrollTimer = null;
            this.maxLoad = 0;
            this.cHeight = $("html")[0].clientHeight;
            this.lazyload = lazyload;
            // this.load();
        }
        // 加载数据
        load(data) {
            this.data = data;
            this.index = 0;
            this.maxLoad = 0;
            this.renderPage();
            // this.lazyload.init(".imgDiv img");
            this.scroll();
        }
        // 选项卡切换图片
        changeTabImg(evt) {
            let e = evt || window.event;
            let target = $(e.currentTarget);
            target.addClass("active").siblings().removeClass("active");
            target.parents("li").find(".imgDiv img").attr('src', target.find("img")[0].src);
        }
        // 监听滚动事件实现瀑布流列表渲染
        scroll() {
            $(window).scroll(() => {
                if (this.maxLoad === 1) return;
                clearTimeout(this.scrollTimer);
                this.scrollTimer = setTimeout(() => {
                    let st = $("html, body").scrollTop();
                    let min = $(".listsUl>li:last")[0].offsetTop;
                    if (min < st + this.cHeight + 200) {
                        this.index++;
                        this.maxLoad++;
                        this.renderPage();
                    }
                }, 500);
            })
        }
        // 渲染列表
        renderPage() {
            if (this.index === 0) $(".listsUl").html("");
            let html = $(".listsUl").html();
            let template = `
            <ul class="clear">
            <% for(let j=0; j < data.imgTab.length; j++) { %>
                <li class=<%= j===0?"active":"" %>>
                <a href="#"><img
                            src="<%= data.imgTab[j] %>"
                            alt=""></a>
                </li>
            <% } %>
            </ul>`;
            var parse = eval(this.compile(template));
            for (let i = this.index * this.pageCount; i < (this.index + 1) * this.pageCount; i++) {
                if (!this.data[i]) break;
                html += `<li data-id="${this.data[i].id}">
                <div class="country">
                    <img src="${this.data[i].countryImg}"
                        alt="">
                </div>
                <div class="imgDiv">
                    <a class="toDetail" href="./shopCartsDetail.html" target="_blank"><img src="./images/loading.png"
                            data-src="${this.data[i].contentImg}"
                            alt=""></a>
                </div>
                <div class="imgTab">
                    ${parse({ imgTab: this.data[i].imgTab })}
                </div>
                <a class="des toDetail" href="./shopCartsDetail.html" target="_blank">
                    ${this.data[i].des}
                </a>
                <p class="gprice">
                    <span class="marketPrice">${this.data[i].marketPrice}</span>
                    <span class="price">${this.data[i].price}</span>
                    <span class="dprice">${this.data[i].dprice}</span>
                </p>
                <p class="bottomP">
                    <span>${this.data[i].sale}</span>
                    <span>${this.data[i].interaction}</span>
                </p>
            </li>`
            }
            $(".listsUl").html(html);
            this.lazyload.init(".imgDiv img");
            $(".imgTab>ul").on("mouseenter", "li", this.changeTabImg.bind(this));
            $(".toDetail").on("click", this.setGoodData.bind(this));
        }
        // 设置点击的列表中的哪一条数据到缓存中
        setGoodData(evt) {
            let e = evt || window.event;
            let target = $(e.currentTarget);
            let parent = target.parentsUntil(".listsUl");
            parent = $(parent[parent.length - 1]);
            console.log($(target.parentsUntil(".listsUl")));
            let id = parent.attr("data-id");
            let goodData = null;
            this.data.some(item => {
                if (item.id === id) {
                    goodData = item;
                    return true;
                }
            })
            this.saveData("goodData", goodData);
        }
        // 设置缓存保存数据;
        saveData(type, json) {
            localStorage.setItem(type, JSON.stringify(json));
        }
        // 模板编译
        compile(template) {
            var evalExpr = /<%=(.+?)%>/g;
            var expr = /<%([\s\S]+?)%>/g;
            template = template
                .replace(evalExpr, '`); \n  echo( $1 ); \n  echo(`')
                .replace(expr, '`); \n $1 \n  echo(`');
            template = 'echo(`' + template + '`);';
            var script =
                `(function parse(data){
              var output = "";
              function echo(html){
                output += html;
              }
              ${ template}
              return output;
            })`;
            return script;
        }
    }
    window.RenderLists = RenderLists;
}(jQuery)