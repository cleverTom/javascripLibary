/*
* Document
* 基于flexible组件开发,请先引入fleible.js;
* param
* 1.target:滑动元素id;
* 2.flag:切换图点父级id;
* 3.autoplay:是否自动轮播
* 4.touchByMistake:是否开启防止a标签误触,boolean;如果开启 请去掉a标签身上的href属性,改为data-href;
* */
/*
 * Document
 * param
 * 1.target:滑动元素id;
 * 2.flag:切换图点父级id;
 * 3.autoplay:是否自动轮播
 * */
function swipe(target,flag,autoplay,touchByMistake)
{
    var oPicList=document.getElementById(target);
    var aSpan=document.getElementById(flag).children;
    autoplay=autoplay||false;
    var iNow=0;//记录初始flag值;
    var iTranslate=0;//记录translate的位移值;
    var iStartX=0;//初始时候的X位置;
    var iStartTranslate=0;//初始时候的translate值;
    var iDis=0;//鼠标位移的差值//为了计算用户是向左侧还是右侧放到全局变量了;
    var startTime= 0,endTime=0;//计算用户拖放速度;
    var aLink=oPicList.querySelectorAll("a");//获取a标签;
    var allTime=0;
    var timer=null;
    var flexible=lib.flexible;
    var px2rem=flexible.px2rem;
    var dpr=flexible.dpr;
    touchByMistake=touchByMistake||false;//防止误触
    if(touchByMistake)
    {
        for(var i=0;i<aLink.length;i++)
        {//防止a链接误触;
            aLink[i].addEventListener("touchmove",function(){
                this.s=1;
            },false);
            aLink[i].addEventListener("touchend",function(){
                if(this.s!=1)
                {
                    window.open(this.dataset.href);
                }
            },false);
        }
    }
    oPicList.innerHTML+=oPicList.innerHTML;//单份没法做无缝;
    oPicList.style.width=px2rem(oPicList.clientWidth*2)+"rem";
    function autoPlay()//自动播放函数;
    {
        timer=setInterval(function(){
            iNow++;
            next();
        },2000);
    }
    if(autoplay)autoPlay();
    oPicList.addEventListener("touchstart",fnStart,false);
    function fnStart(e)
    {
        if(autoplay)
        {
            clearInterval(timer);
            clearInterval(oPicList.timer);
        }
        var touches= e.changedTouches[0];
        if(iNow<=0)//从第0张向左拖拽就跳跃到第5张;
        {
            iNow+=aSpan.length;
            iTranslate=-iNow*(window.screen.width*dpr);
            /*让它运动会第一张*/
            css(oPicList,"translateX",px2rem(iTranslate));
        }
        iStartTranslate=iTranslate;
        iStartX= touches.pageX;
        iDis=0;//手指滑动距离清零;
        allTime=0;//总时间清零;
        startTime=Date.now();//记录初始时间;
        oPicList.addEventListener("touchmove",fnMove,false);
        oPicList.addEventListener("touchend",fnEnd,false);
        function fnMove(e)
        {
            console.log(1);
            var touches= e.changedTouches[0];
            iDis= touches.pageX-iStartX;//手指滑动距离;
            iTranslate=iStartTranslate+iDis;//记录当前要走到的位置;
            css(oPicList,"translateX",px2rem(iTranslate));
            e.stopPropagation();
            e.preventDefault();
        }
        function fnEnd()
        {
            endTime=Date.now();
            allTime=endTime-startTime;
            iNow=-iTranslate/(window.screen.width*dpr);//这里可能大于1因为可能变换了好几次;
            if(iNow<0)
            {
                iNow=iNow%1<-0.3?Math.floor(iNow):Math.ceil(iNow);
            }
            else
            {
                /*判断用户拖动方向*/
                if(iDis<0)//向左拖动
                {
                    /*速度快或者超过0.3就换页数*/
                    if(iNow%1<0.3&&allTime>100)
                    {
                        iNow=Math.floor(iNow);
                    }
                    else if((iNow%1>0.01&&allTime<100)||iNow%1>0.3)
                    {
                        iNow=Math.ceil(iNow);
                    }

                }
                else//向右拖动
                {

                    if(iNow%1<0.7||(iNow%1<0.99&&allTime<100))
                    {
                        iNow=Math.floor(iNow);
                    }
                    else if(iNow%1>0.7&&allTime>100)
                    {
                        iNow=Math.ceil(iNow);
                    }
                }

            }
            next();
            autoplay&&autoPlay();
            oPicList.removeEventListener("touchmove",fnMove,false);
            oPicList.removeEventListener("touchend",fnEnd,false);
        }

        return false;
    }
    function next()
    {
        iTranslate=-iNow*(window.screen.width*dpr);
        for(var i=0;i<aSpan.length;i++)
        {
            if(i!=iNow)
            {
                aSpan[i].className="";//修改flag的颜色;
            }
        }
        /*span溢出取模处理*/
        aSpan[iNow%aSpan.length].className="active";
        if(iNow>=aSpan.length)
        {
            tweenMove(oPicList,{"translateX":px2rem(iTranslate)},400,"easeOut",function(){
                iNow=iNow%aSpan.length;//防止左拉动出错;
                iTranslate=-iNow*(window.screen.width*dpr);
                /*让它运动会第一张*/
                css(oPicList,"translateX",px2rem(iTranslate));
            });//进行缓冲动画效果;
        }
        else
        {
            tweenMove(oPicList,{"translateX":px2rem(iTranslate)},400,"easeOut");//进行缓冲动画效果;
        }
    }
    var tween = {
        easeOut: function(t, b, c, d){
            return -c *(t/=d)*(t-2) + b;
        },
        backOut: function(t, b, c, d, s){
            if (typeof s == 'undefined') {
                s = 3.70158;  //回缩的距离
            }
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        }
    };
    function tweenMove(obj,oTarget,iTime,iType,fnEnd,fnDuring)
    {
        var fn=tween[iType];
        var t=0;
        var b={};
        var c={};
        var d=iTime/24;
        var sAttr="";
        clearInterval(obj.timer);
        for(sAttr in oTarget)
        {
            b[sAttr]=css(obj,sAttr);
            c[sAttr]=oTarget[sAttr]-b[sAttr];
        }
        if(iTime<30)
        {
            for(sAttr in oTarget)
            {
                css(obj,sAttr,oTarget[sAttr]);
            }
        }
        else
        {
            obj.timer=setInterval(
                function()
                {
                    if(t<d)
                    {
                        t++;
                        for(sAttr in oTarget)
                        {
                            css(obj,sAttr,fn(t,b[sAttr],c[sAttr],d));
                        }
                    }
                    else
                    {
                        for(sAttr in oTarget)
                        {
                            css(obj,sAttr,oTarget[sAttr]);
                        }
                        clearInterval(obj.timer);
                        if(fnEnd)
                        {
                            fnEnd.call(obj);
                        }
                    }
                    if(fnDuring)
                    {
                        fnDuring.call(obj);
                    }
                },24);
        }
    }
    function css(obj, attr, value){
        if(arguments.length==2){
            if(attr=='scale'|| attr=='rotate'|| attr=='rotateX'||attr=='rotateY'||attr=='scaleX'||attr=='scaleY'||attr=='translateY'||attr=='translateX')
            {
                if(! obj.$Transform)
                {
                    obj.$Transform={};
                }
                switch(attr)
                {
                    case 'scale':
                    case 'scaleX':
                    case 'scaleY':
                        return typeof(obj.$Transform[attr])=='number'?obj.$Transform[attr]:100;
                        break;
                    default:
                        return obj.$Transform[attr]?obj.$Transform[attr]:0;
                }
            }
            var sCur=obj.currentStyle?obj.currentStyle[attr]:document.defaultView.getComputedStyle(obj, false)[attr];
            if(attr=='opacity'){
                return Math.round((parseFloat(sCur)*100));
            }
            else{
                return parseInt(sCur);
            }
        }
        else if(arguments.length==3)
        {
            switch(attr){
                case 'scale':
                case 'scaleX':
                case 'scaleY':
                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                case 'translateZ':
                case 'translateX':
                case 'translateY':
                    setCss3(obj, attr, value);
                    break;
                case 'width':
                case 'height':
                case 'paddingLeft':
                case 'paddingTop':
                case 'paddingRight':
                case 'paddingBottom':
                    value=Math.max(value,0);
                case 'left':
                case 'top':
                case 'marginLeft':
                case 'marginTop':
                case 'marginRight':
                case 'marginBottom':
                    if(typeof value=="string")
                    {
                        obj.style[attr]=value;
                    }
                    else
                    {
                        obj.style[attr]=value+'px';
                    }
                    break;
                case 'opacity':
                    obj.style.filter="alpha(opacity:"+value+")";
                    obj.style.opacity=value/100;
                    break;
                default:
                    obj.style[attr]=value;
            }
        }
        return function (attr_in, value_in){css(obj, attr_in, value_in)};
    }
    function setCss3(obj, attr, value){
        var sTr="";
        var sVal="";
        var arr=["Webkit","Moz","O","ms",""];
        if(! obj["$Transform"])
        {
            obj["$Transform"]={};
        }
        obj["$Transform"][attr]=parseFloat(value);
        for( sTr in obj["$Transform"])
        {
            switch(sTr)
            {
                case 'scale':
                case 'scaleX':
                case 'scaleY':
                    sVal+=sTr+"("+(obj["$Transform"][sTr]/100)+") ";
                    break;
                case 'rotate':
                case 'rotateX':
                case 'rotateY':
                    sVal+=sTr+"("+(obj["$Transform"][sTr])+"deg) ";
                    break;
                case 'translateX':
                case 'translateY':
                case 'translateZ':
                    sVal+=sTr+"("+(obj["$Transform"][sTr])+"rem) ";
                    break;
            }
        }
        for(var i=0;i<arr.length;i++)
        {
            obj.style[arr[i]+"Transform"]=sVal;
        }
    }

}
/*
* example:
*
*
<nav id="nav">
     <section id="tab">
         <a href="javascript:void(0);">
            <img src="img/1.jpg" alt="">
         </a>
         <a href="javascript:void(0);">
            <img src="img/2.jpg" alt="">
         </a>
         <a href="javascript:void(0);">
            <img src="img/3.jpg" alt="">
         </a>
         <a href="javascript:void(0);">
            <img src="img/4.jpg" alt="">
         </a>
         <a href="javascript:void(0);">
            <img src="img/5.jpg" alt="">
         </a>
         <a href="javascript:void(0);">
            <img src="img/6.jpg" alt="">
         </a>
         <a href="javascript:void(0);">
            <img src="img/7.png" alt="">
         </a>
     </section>
     <div class="tabLine" id="tabLine">
         <span class="active"></span>
         <span></span>
         <span></span>
         <span></span>
         <span></span>
         <span></span>
         <span></span>
     </div>
 </nav>
* */