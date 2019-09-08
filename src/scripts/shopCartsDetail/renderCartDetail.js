;; !function ($) {
    /**
     * 购物车详情页面渲染
     */
    class RenderCartDetail {
        constructor() { }
        init() {
            this.goodData = this.getGood("goodData");
            this.renderDetailPage();
        }
        // 初始化获取商品详情缓存数据
        getGood(data) {
            if (localStorage.getItem(data)) {
                return JSON.parse(localStorage.getItem(data));
            }
        }
        renderDetailPage() {
            let html = `<div class="fl magnifierBox">
                        <div class="leftBox">
                            <img class="imgBox"
                                src="${this.goodData.contentImg}"
                                alt="">
                            <div class="clipBox"></div>
                            <div class="patch">
                                <!-- 其实这就是个贴膜 -->
                            </div>
                        </div>
                        <div class="clear options">
                            <div>
                                <ul>
                                    ${this.getImgTab(this.goodData.imgTab)}
                                </ul>
                            </div>
                            <p class="prevArrow"></p>
                            <p class="nextArrow"></p>
                        </div>
                        <div class="rightBox">
                            <img src="${this.goodData.contentImg}" alt="">
                        </div>
                    </div>
                    <div class="fl addCarts">
                        <h1 class="title">${this.goodData.des}</h1>
                        <p class="des">小精包装 3+1突破配方 全面营养</p>
                        <div class="price">
                            <p>市场价：<span class="del">${this.goodData.marketPrice}</span></p>
                            <p>
                                E宠价：
                                <span>¥</span>
                                <span class="ePrice">${this.goodData.price.substring(1)}</span>
                            </p>
                        </div>
                        <div class="m_4">
                            <div class="clear">
                                <span>
                                    <span>已售：</span>
                                    <span>${this.goodData.sale.substring(2, this.goodData.sale.length - 2)}</span>
                                    盒
                                </span>
                                <span class="comment">
                                    <span>评价：</span>
                                    <a href="#">(1547)</a>
                                    <span>咨询：</span>
                                    <a href="#">(${this.goodData.interaction.substring(2, this.goodData.interaction.length - 4)})</a>
                                </span>
                                <span>
                                    <span>赠送：</span>
                                    最多
                                    <span>17</span>
                                    E宠币
                                </span>
                            </div>
                            <ul class="clear">
                                <li><img src="https://static.epetbar.com/static_wap/appmall/lib/goods/qualityassurance.png"
                                        alt="">正品保证</li>
                                <li><img src="https://static.epetbar.com/static_wap/appmall/lib/goods/freeshipping.png"
                                        alt="">99元包邮</li>
                                <li><img src="https://static.epetbar.com/static_wap/appmall/lib/goods/thirtydays.png"
                                        alt="">30天退货</li>
                            </ul>
                        </div>
                        <div class="myBuy clear">
                            <span class="fl">我要买：</span>
                            <div class="fl">
                                <span class="fl">
                                    <span class="reduceBtn">-</span>
                                    <input class="countInput" type="text" value="1">
                                    <span class="addBtn">+</span>
                                </span>
                                盒
                            </div>
                        </div>
                        <p class="express">
                            E宠快递15点前下单，其他快递16点前下单，当天发货。
                        </p>
                        <div class="addCartsBtn" data-id="${this.goodData.id}">
                            加入购物车
                        </div>
                    </div>`;
            $(".magnifier_addCarts").html(html);
            $(".options ul li:first").addClass("active");
        }
        getImgTab(imgTab) {
            let html = "";
            imgTab.forEach(item => {
                html+=`<li><img src="${item}"
                data-src="${item}" alt=""></li>`
            })
            return html;
        }
    }
    window.RenderCartDetail = RenderCartDetail;
}(jQuery)