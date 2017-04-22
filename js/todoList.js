/*
 **auther :chenxuan
 **date : 2017-4-22
 */
(function($) {
    $.fn.todoList = function() {
        var n = 0,
            timer,
            $style = $('#style'),
            $content = $('#content');
        var txt = `/*
* Inspired by http://strml.net/
* 大家好，我是新点装逼王赵阳 
* 四月了，好多人都在装逼，我也好想装逼。
* 说做就做，我就先来装一个b！
* 说到到css3实现正方形
*/
/*先普及下基础*/
/* 首先给content元素加上过渡效果 */
#content {
    transition: all .3s;
    /* 背景太单调了，和字体颜色太单调 */
    color: rgb(222, 222, 222);
    background: rgb(0, 43, 54);
    /* 字也太大了缩小点 */
    font-size: 0.7rem;
}

/* 文字离边框太近了 */
.styleEditor {
    padding: .5em;
    border: 1px solid;
    margin: .5em;
    overflow: auto;
    width: 92vw;
    height: 95vh;
}

/* 在stage4上加点3D效果 */
.stage4 {
    /*视角*/
    perspective: 1000px;
}
/*文字边框定位*/
.styleEditor {
    position: fixed;
    left: 0;
    top: 0;
    transition: none;
    transform: rotateY(8deg) translateZ(-100px);
    /*偏转了 啦远了模糊 回正*/
    transform: rotateY(0) translateZ(0);
}

/* 接下来我给自己准备一个编辑器 
因为正方形较小我置于右上角 */
.resumeEditor {
    position: fixed;
    right: 0;
    top: 0;
    padding: .5rem;
    margin: .5rem;
    width: 34vw;
    height: 25vh;
    border: 1px solid #000;
    background: white;
}


/* 好了，我开始装逼了 */
.showDemo {
    display: block;
    width: 4.5rem;
    height: 4.5rem;
    position: relative;
    margin: 2rem auto;
    border: 1px solid .cc;
    perspective: 1200px;
}

.cube {
    width: 100%;
    height: 100%;
    position: absolute;
    transform-style: preserve-3d;
    transform: translateZ( 2.25rem) rotateX( 0deg) rotateY(45deg) rotateZ(-20deg);
}
/*给每个正方形设置点样式*/
.cube div {
    position: absolute;
    width: 4.45rem;
    height: 4.45rem;
    border: 1px solid rgb(111, 111, 111);
    line-height: 4.4rem;
    font-size: 3rem;
    font-weight: bold;
    color: red;
    text-align: center;
    margin: 0;
}

.cube .front {
    transform: translateZ( 2.25rem);
    background-color: rgba(219, 224, 235, 0.5);
}

.cube .right {
    transform: rotateY( 90deg) translateZ( 2.25rem);
    background-color: rgba(219, 224, 235, 0.5);
}

.cube .back {
    transform: rotateX( -180deg) translateZ( 2.25rem);
    background-color: rgba(219, 224, 235, 0.5);
}

.cube .left {
    transform: rotateY( -90deg) translateZ( 2.25rem);
    background-color: rgba(219, 224, 235, 0.5);
}

.cube .top {
    transform: rotateX( 90deg) translateZ( 2.25rem);
    background-color: rgba(219, 224, 235, 0.5);
}

.cube .bottom {
    transform: rotateX( -90deg) translateZ( 2.25rem);
    background-color: rgba(219, 224, 235, 0.5);
}

.cube .midTop {
    transform: rotateX( 90deg) rotateY( -45deg) rotateZ( 90deg) translateZ( 2.25rem);
    background-color: rgba(219, 224, 235, 0.5);
}
/*自定义个旋转动画*/
@keyframes spining {
    0% {
        transform: translateZ( 2.25rem) rotateX( 0deg) rotateY( 45deg) rotateZ(-20deg);
    }
    100% {
        transform: translateZ( 2.25rem) rotateX( 0deg) rotateY( -315deg) rotateZ(-20deg);
    }
}
/*启动动画 匀速 周期6s 无限循环*/
.cube {
    animation: spining 6s linear infinite;
}
`;

        timer = setInterval(function() {
            $style.html(txt.substring(0, n));
            $content.html(txt.substring(0, n));
            if (n === txt.length) {
                clearInterval(timer);
            }
            $content.scrollTop(10000);
            n++;
        }, 50)
    };

})(jQuery);
