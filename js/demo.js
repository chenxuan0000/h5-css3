 /*
  *  author : chenxuan
  * date : 2017-4-22
  */
 (function($) {
     var $wrapper = $("#wrapper"),
         $stage = $wrapper.children('.stage'),
         $curPage = $stage.eq(0),
         $doc = $(document),
         draging = false, //touch开关
         startAtY,
         nowAtY,
         $nextPage,
         $prevPage,
         transitionEndTimer,
         pageHeight;
     // 初始化stage
     $stage.addClass('hidden');
     $curPage.removeClass('hidden');
     // 
     var todoList = function() {
         var txt = `/*
* Inspired by http://strml.net/
* 大家好，我是新点装逼王赵阳 
* 四月了，好多人都在装逼，你是不是也想装逼啊。
* 说做就做，我也来装一个b！
*/
/* 首先给所有元素加上过渡效果 */
* {
  -webkit-transition: all .3s;
  transition: all .3s;
}
/* 背景太单调了，我们来点背景,字也太大了缩小点 */
#content {
    font-size : 0.5rem;
    color: rgb(222,222,222); background: rgb(0,43,54); 
}

/* 文字离边框太近了 */
.styleEditor {
  padding: .5em;
  border: 1px solid;
  margin: .5em;
  overflow: auto;
  width: 45vw; height: 90vh;
}
/* 代码高亮 */
.token.selector{ color: rgb(133,153,0); }
.token.property{ color: rgb(187,137,0); }
.token.punctuation{ color: yellow; }
.token.function{ color: rgb(42,161,152); }
/* 加点 3D 效果呗 */
html{
  -webkit-perspective: 1000px;
          perspective: 1000px;
}
.styleEditor {
  position: fixed; left: 0; top: 0; 
  -webkit-transition: none; 
  transition: none;
  -webkit-transform: rotateY(10deg) translateZ(-100px) ;
          transform: rotateY(10deg) translateZ(-100px) ;
}
/* 接下来我给自己准备一个编辑器 */
.resumeEditor{
  position: fixed; right: 0; top: 0;
  padding: .5em;  margin: .5em;
  width: 48vw; height: 90vh; 
  border: 1px solid;
  background: white; color: #222;
  overflow: auto;
}
/* 好了，我开始装逼了 */
`;
         var n = 0,
             timer,
             $style = $('#style'),
             $content = $('#content');
         timer = setInterval(function() {
             $style.html(txt.substring(0, n));
             $content.html(txt.substring(0, n));
             if (n === txt.length) {
                 clearInterval(timer);
             }
             $content.scrollTop(1000)
             n++;
         }, 50)
     };
     //定义写常用的函数
     var getNextPage = function() {
         return $curPage.next(".stage");
     };

     var getPrevPage = function() {
         return $curPage.prev(".stage");
     };

     var translateFormat = function(y) {
         return "translateY(" + y + "px)";
     };
     // 封装touch后页面操作
     var pageTouch = function($page, num, delay) {
         if ($page.length) {
             $curPage.css("transform", translateFormat(num * pageHeight));
             $page.css("transform", translateFormat(0))
                 .on("transitionend", transitionEnd);
             transitionEndTimer = setTimeout(function() {
                 if ($page.length) {
                     $page.trigger("transitionend", transitionEnd);
                 }
             }, delay);
             $doc.off('touchstart', touchStart);
         } else {
             $curPage.css("transform", translateFormat(0));
         }
     };
     // 封装mousewheel后页面操作
     var pageMousewheel = function($page, num) {
         if ($page.length) {
             $doc.off('mousewheel', wheels);
             $curPage.addClass('animate')
                 .css("transform", translateFormat(num * pageHeight));
             $page.css("transform", translateFormat(0))
                 .on("transitionend", transWheelsEnd);
             transitionEndTimer = setTimeout(function() {
                 if ($page.length) {
                     $page.trigger("transitionend", transWheelsEnd);
                 }
             }, 500);
             draging = true;
         }
     };
     // 控制页面touch事件的绑定和解绑
     var controTouch = function($dom) {
         $dom.on("touchstart", function() {
             $doc.off('touchstart', touchStart);
         }).on("touchend", function() {
             $doc.on('touchstart', touchStart);
         });
     };
     //在不同scence上做不同操作
     var startScence = function(scenceID) {
         switch (scenceID) {
             case 'scence2':
                 $.fn.css3Slider();
                 controTouch($("#css3Slider"));
                 break;
             case 'scence4':
                 todoList();
                 break;
             default:
                 break;
         }
     };
     var getPageY = function(e) {
         return e.touches[0].pageY;
     };
     //css3动画执行完成后的操作
     var transitionEnd = function() {
         var scence = this.getAttribute('scence'),
             $this = $(this);
         clearTimeout(transitionEndTimer);
         $curPage.removeClass('animate').addClass('hidden');
         $curPage = $this.removeClass('hidden'); //重置当前页
         $this.off("transitionend", transitionEnd);
         $doc.on('touchstart', touchStart);
         wrapper.className = 'wrapper ' + scence;
         startScence(scence); //回调在不同scence上做不同操作
     };
     //touchStart func
     var touchStart = function(e) {
         draging = true; //开启拦截 阻止多次事件触发
         startAtY = getPageY(e);
         $nextPage = getNextPage();
         $prevPage = getPrevPage();
         pageHeight = $(window).height();
     };
     // touchMove func
     var touchMove = function(e) {
         e.preventDefault();
         if (!draging) {
             return;
         }
         nowAtY = getPageY(e);
         $curPage.css("transform", translateFormat(nowAtY - startAtY));
     };
     // touchEnd func
     var touchEnd = function(event) {
         var saveTransitionDelay = 500,
             pageEdge = 50,
             currentMove = nowAtY - startAtY;
         if (!draging) {
             return;
         }
         $curPage.addClass('animate');

         if (currentMove < -1 * pageEdge) {
             // 向下滚动
             pageTouch($nextPage, -1, saveTransitionDelay);
         } else if (currentMove > pageEdge) {
             // 向上滚动
             pageTouch($prevPage, 1, saveTransitionDelay);
         }
         draging = false;
     };

     $doc.on('touchstart', touchStart).on('touchmove', touchMove).on('touchend', touchEnd);

     // mousewheel
     var wheels = function(event) {
         var move = event.originalEvent.wheelDelta;
         var is_mac = /macintosh/.test(navigator.userAgent.toLowerCase());
         var scroll_step = 50;
         if (is_mac) {
             scroll_step = 200;
         }
         if (Math.abs(move) > scroll_step && !draging) {
             pageHeight = $(window).height();
             if (move < 0) {
                 $nextPage = getNextPage();
                 pageMousewheel($nextPage, -1);
             } else {
                 $prevPage = getPrevPage();
                 pageMousewheel($prevPage, 11);
             }
         }
     }

     var transWheelsEnd = function() {
         clearTimeout(transitionEndTimer);
         $curPage.removeClass('animate').addClass("hidden");
         $curPage = $(this).removeClass('hidden'); //重置当前页
         $(this).off("transitionend", transWheelsEnd);
         $doc.on('mousewheel', wheels);
         wrapper.className = 'wrapper ' + this.getAttribute('scence');
         draging = false;
         startScence(this.getAttribute('scence'));
     }
     $(document).on('mousewheel', wheels);
 }(jQuery));
