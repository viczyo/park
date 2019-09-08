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