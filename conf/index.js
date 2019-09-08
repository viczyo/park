
module.exports = {
      scripts: {
            "index": {
                  src: "./src/scripts/index/"
            },
            "common": {
                  src: "./src/scripts/common/"
            },
            "listsPage": {
                  src: "./src/scripts/listsPage/"
            },
            "shopCartsDetail": {
                  src: "./src/scripts/shopCartsDetail/"
            },
            "shopCarts": {
                  src: "./src/scripts/shopCarts/"
            },
            "activePage": {
                  src: "./src/scripts/activePage/"
            }
      },
      scss: {
            "index": {
                  src: "./src/scss/index/"
            },
            "listsPage": {
                  src: "./src/scss/listsPage/"
            },
            "shopCartsDetail": {
                  src: "./src/scss/shopCartsDetail/"
            },
            "shopCarts": {
                  src: "./src/scss/shopCarts/"
            },
            "activePage": {
                  src: "./src/scss/activePage/"
            }
      },
      // 服务器代理配置;
      proxyList: {
            "/pxx": {
                  url: "https://apiv2.pinduoduo.com/api/fiora/subject/goods/",
                  // 默认重写路径
                  // rewrite : true
            },
            "/dt": {
                  url: "https://www.duitang.com/napi/blog/list/by_filter_id/"
            },
            
            "/ePetSuprise": {
                  url: "https://www.epet.com/share/activitys/suprise.html"
            }
      }
}