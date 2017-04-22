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
         todoListTimes = 1,
         transitionEndTimer,
         pageHeight;
     // 初始化stage
     $stage.addClass('hidden');
     $curPage.removeClass('hidden');

$doc.on('touchstart',function(){
    alert(111)
})
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

         $('.toswitch').show();
         switch (scenceID) {
             case 'scence2':
                 $.fn.css3Slider();
                 controTouch($("#css3Slider"));
                 break;
             case 'scence3':
                 if (todoListTimes) {
                     todoListTimes = 0;
                     $.fn.todoList();
                 }
                 break;
             case 'scence4':
                 imgFly();
                 break;
             case 'scence5':
                 $('.toswitch').hide();
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
         // 手动触发move 防止tap跳转页面
         touchMove(event);
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


     // canvas图片飞爆效果
     function imgFly() {
         const TWO_PI = Math.PI * 2;
         var images = [],
             imageIndex = 0;
         var image, imageWidth = 768,
             imageHeight = 485;
         var vertices = [],
             indices = [],
             fragments = [];
         var container = document.getElementById('container');
         var clickPosition = [
             imageWidth * 0.5,
             imageHeight * 0.5
         ];
         TweenMax.set(container, {
             perspective: 500
         });
         var urls = [
                 'img/fliter1.jpg',
                 'img/fliter2.jpg',
                 'img/fliter3.jpg',
                 'img/fliter4.jpg'
             ],
             image, loaded = 0;
         images[0] = image = new Image();
         image.onload = function() {
             if (++loaded === 1) {
                 imagesLoaded();
                 for (var i = 1; i < 4; i++) {
                     if (window.CP.shouldStopExecution(1)) {
                         break;
                     }
                     images[i] = image = new Image();
                     image.src = urls[i];
                 }
                 window.CP.exitedLoop(1);
             }
         };
         image.src = urls[0];


         function imagesLoaded() {
             placeImage(false);
             triangulate();
             shatter();
         }

         function placeImage(transitionIn) {
             image = images[imageIndex];
             if (++imageIndex === images.length)
                 imageIndex = 0;
              // $(image).on("click", imageClickHandler);
             image.addEventListener('click', imageClickHandler);

             // image.addEventListener('touchstart', imageClickHandler);
             container.appendChild(image);
             if (transitionIn !== false) {
                 TweenMax.fromTo(image, 0.75, {
                     y: -1000
                 }, {
                     y: 0,
                     ease: Elastic.easeOut
                 });
             }
         }

         function imageClickHandler(event) {
             var box = image.getBoundingClientRect(),
                 top = box.top,
                 left = box.left;
             clickPosition[0] = event.clientX - left;
             clickPosition[1] = event.clientY - top;
             triangulate();
             shatter();
         }

         function triangulate() {
             var rings = [{
                     r: 50,
                     c: 12
                 }, {
                     r: 150,
                     c: 12
                 }, {
                     r: 300,
                     c: 12
                 }, {
                     r: 1200,
                     c: 12
                 }],
                 x, y, centerX = clickPosition[0],
                 centerY = clickPosition[1];
             vertices.push([
                 centerX,
                 centerY
             ]);
             rings.forEach(function(ring) {
                 var radius = ring.r,
                     count = ring.c,
                     variance = radius * 0.25;
                 for (var i = 0; i < count; i++) {
                     if (window.CP.shouldStopExecution(2)) {
                         break;
                     }
                     x = Math.cos(i / count * TWO_PI) * radius + centerX + randomRange(-variance, variance);
                     y = Math.sin(i / count * TWO_PI) * radius + centerY + randomRange(-variance, variance);
                     vertices.push([
                         x,
                         y
                     ]);
                 }
                 window.CP.exitedLoop(2);
             });
             vertices.forEach(function(v) {
                 v[0] = clamp(v[0], 0, imageWidth);
                 v[1] = clamp(v[1], 0, imageHeight);
             });
             indices = Delaunay.triangulate(vertices);
         }

         function shatter() {
             var p0, p1, p2, fragment;
             var tl0 = new TimelineMax({
                 onComplete: shatterCompleteHandler
             });
             for (var i = 0; i < indices.length; i += 3) {
                 if (window.CP.shouldStopExecution(3)) {
                     break;
                 }
                 p0 = vertices[indices[i + 0]];
                 p1 = vertices[indices[i + 1]];
                 p2 = vertices[indices[i + 2]];
                 fragment = new Fragment(p0, p1, p2);
                 var dx = fragment.centroid[0] - clickPosition[0],
                     dy = fragment.centroid[1] - clickPosition[1],
                     d = Math.sqrt(dx * dx + dy * dy),
                     rx = 300 * sign(dy),
                     ry = 900 * -sign(dx),
                     delay = d * 0.003 * randomRange(0.1, 0.25);
                 fragment.canvas.style.zIndex = Math.floor(d).toString();
                 var tl1 = new TimelineMax();
                 tl1.to(fragment.canvas, randomRange(0.25, 1), {
                     z: randomRange(-1500, 1500),
                     rotationX: rx,
                     rotationY: ry,
                     x: randomRange(-2000, 2000),
                     y: randomRange(-2000, 2000),
                     ease: Expo.easeIn
                 });
                 tl1.to(fragment.canvas, 0.4, {
                     alpha: 0
                 }, 0.6);
                 tl0.insert(tl1, delay);
                 fragments.push(fragment);
                 container.appendChild(fragment.canvas);
             }
             window.CP.exitedLoop(3);
             container.removeChild(image);
             image.removeEventListener('click', imageClickHandler);
         }

         function shatterCompleteHandler() {
             fragments.forEach(function(f) {
                 container.removeChild(f.canvas);
             });
             fragments.length = 0;
             vertices.length = 0;
             indices.length = 0;
             placeImage();
         }

         function randomRange(min, max) {
             return min + (max - min) * Math.random();
         }

         function clamp(x, min, max) {
             return x < min ? min : x > max ? max : x;
         }

         function sign(x) {
             return x < 0 ? -1 : 1;
         }
         Fragment = function(v0, v1, v2) {
             this.v0 = v0;
             this.v1 = v1;
             this.v2 = v2;
             this.computeBoundingBox();
             this.computeCentroid();
             this.createCanvas();
             this.clip();
         };
         Fragment.prototype = {
             computeBoundingBox: function() {
                 var xMin = Math.min(this.v0[0], this.v1[0], this.v2[0]),
                     xMax = Math.max(this.v0[0], this.v1[0], this.v2[0]),
                     yMin = Math.min(this.v0[1], this.v1[1], this.v2[1]),
                     yMax = Math.max(this.v0[1], this.v1[1], this.v2[1]);
                 this.box = {
                     x: xMin,
                     y: yMin,
                     w: xMax - xMin,
                     h: yMax - yMin
                 };
             },
             computeCentroid: function() {
                 var x = (this.v0[0] + this.v1[0] + this.v2[0]) / 3,
                     y = (this.v0[1] + this.v1[1] + this.v2[1]) / 3;
                 this.centroid = [
                     x,
                     y
                 ];
             },
             createCanvas: function() {
                 this.canvas = document.createElement('canvas');
                 this.canvas.width = this.box.w;
                 this.canvas.height = this.box.h;
                 this.canvas.style.width = this.box.w + 'px';
                 this.canvas.style.height = this.box.h + 'px';
                 this.canvas.style.left = this.box.x + 'px';
                 this.canvas.style.top = this.box.y + 'px';
                 this.ctx = this.canvas.getContext('2d');
             },
             clip: function() {
                 this.ctx.translate(-this.box.x, -this.box.y);
                 this.ctx.beginPath();
                 this.ctx.moveTo(this.v0[0], this.v0[1]);
                 this.ctx.lineTo(this.v1[0], this.v1[1]);
                 this.ctx.lineTo(this.v2[0], this.v2[1]);
                 this.ctx.closePath();
                 this.ctx.clip();
                 this.ctx.drawImage(image, 0, 0);
             }
         };
     }
 }(jQuery));
