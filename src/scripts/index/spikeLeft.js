;; ~function ($) {
    /**
     * 秒杀js部分
     */
    class SpikeLeft {
        constructor() { }
        // 初始化
        init() {
            this.$leftRollingAD = $(".spike .rollingAD ul");
            this.leftRollingADCL = $(".spike .rollingAD ul").children().length;
            this.leftRollingADCount = 0;
            this.leftRollingADTime = null;
            this.timeNow = new Date().getHours();
            if (this.timeNow <= 22 && this.timeNow >= 10) {
                $(".dailyScrambleTime").html(this.timeNow + ":00");
            }
            this.bindEvent();
        }
        bindEvent() {
            this.leftRollingADTime = setInterval(this.marquee.bind(this), 2000);
            $(".rollingAD").hover(() => {
                clearInterval(this.leftRollingADTime);
            }, () => {
                this.leftRollingADTime = setInterval(this.marquee.bind(this), 2000);
            })
        }
        marquee() {
            this.leftRollingADCount++;
            this.$leftRollingAD.animate({
                top: "-=32px"
            }, () => {
                if (this.leftRollingADCount === this.leftRollingADCL - 1) {
                    this.$leftRollingAD.css({
                        top: 0
                    });
                    this.leftRollingADCount = 0;
                }
            })
        }
    }
    window.SpikeLeft = SpikeLeft;
}(jQuery)