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
                 if ($page) {
                     $page.trigger("transitionend", transitionEnd);
                 }
             }, delay);
             $doc.off('touchstart', touchStart);
         } else {
             $curPage.css("transform", translateFormat(0));
         }
     };
     //在不同scence上做不同操作
     var startScence = function(scenceID) {
         switch (scenceID) {
             case 'scence2':
                 $.fn.css3Slider();
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


 }(jQuery));
