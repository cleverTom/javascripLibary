/*
* param:
*
* 1.目标元素id(滑动元素)
* 2.父级元素id(滑动元素父级)
* 3.scrollBar(是否出现滚动条)
*
* method:
*
* mobileSlide.startSlide(fn)//滑动开始出发的事件;
* mobileSlide.moveSlide(fn)//滑动中出发的事件;
* mobileSlide.endSlide(fn)//滑动结束出发的事件;
* */
function mobileSlide(target,parent,scrollBar)
{
    var obj=document.getElementById(target);
    var oParent=document.getElementById(parent);
    var downY=0;//按下的鼠标坐标;
    var downTop=0;//按下的top值;
    var prevY=0;//出手前的位置;
    var speedY=0;//出手时候的速度;
    var timer=null;//定时器
    obj.addEventListener("touchstart",fnStart,false);
    if(scrollBar)//是否创建滚动条
    {
        var oBar=document.createElement("div");
        oBar.id="scrollBar"+Math.floor(Math.random()*1000);
        var oBarId=oBar.id;
        var barHeight=(oParent.offsetHeight*oParent.offsetHeight/obj.offsetHeight);//设定滚动条的高度;
        if(barHeight<40)
        {
            barHeight=40;
        }
        else if(barHeight>oParent.offsetHeight)
        {
            barHeight=0;
        }
        var oStyle=document.createElement("style");
        oStyle.innerHTML="#"+oBarId+"{display:none;" +
            "position: absolute;"+
            "top:0;"+
            "right:2px;"+
            "width: 5px;"+
            "height: "+barHeight+"px;"+//设置滚动条的高度
            "background: rgba(0,0,0,0.5);"+
            "border-radius:2px;}";
        oParent.appendChild(oBar);
        document.head.appendChild(oStyle);
    }
    function fnStart(e)
    {
        var touches= e.changedTouches[0];
        downY=touches.pageY;//存放按下的鼠标坐标;
        downTop=this.offsetTop;//按下时候的top值;
        prevY=touches.pageY;//记录出手时候的位置;
        obj.addEventListener("touchmove",fnMove,false);
        obj.addEventListener("touchend",fnEnd,false);
        var bBtn=true;
        mobileSlide.startFn&&mobileSlide.startFn();
        function fnMove(e)
        {
            var touches= e.changedTouches[0];
            speedY=touches.pageY-prevY;//记录出手时候的位置;
            prevY=touches.pageY;//重置上一次的出手前位置;
            if(scrollBar)
            {//默认滑动的时候显示滚动条
                oBar.style.opacity=1;
                oBar.style.display="block";

            }
            if(obj.offsetTop>=0)
            {
                /*这里进行拖拽的时候会有跳跃感因为downY有一段的距离 直接变化就有跳跃感*/
                if(bBtn)
                {//解决跳跃感,先向下拖拽再向上拖拽的跳跃感
                    bBtn=false;
                    downY=touches.pageY;//
                }
                /*头部的尾部要进行放慢处理*/
                this.style.top=(touches.pageY-downY)/3+"px";
                if(scrollBar)//判断滚动条存在否
                {
                    oBar.style.top=0;
                    oBar.style.height=(1-(this.offsetTop/oParent.offsetHeight))*barHeight+"px";
                }
            }
            else if(obj.offsetTop<oParent.offsetHeight-obj.offsetHeight)
            {
                if(bBtn)
                {//解决跳跃感
                    bBtn=false;
                    downY=touches.pageY;
                }
                /*尾部的改变要加上当前位置的top值最大值;*/
                this.style.top=(touches.pageY-downY)/3+oParent.offsetHeight-obj.offsetHeight+"px";
                if(scrollBar)//判断滚动条存在否
                {
                    /*下方滚动条的高度变化*/
                    oBar.style.top=oParent.offsetHeight-oBar.offsetHeight+"px";
                    oBar.style.height=(1-Math.abs((this.offsetTop-(oParent.offsetHeight-obj.offsetHeight)))/oParent.offsetHeight)*barHeight+"px";
                }
            }
            else
            {
                /*正常位置下的拖拽值*/
                /*拖拽的位移值 =当前top值+鼠标移动的位置*/
                this.style.top=touches.pageY-downY+downTop+"px";
                if(scrollBar)
                {
                    var scaleY=this.offsetTop/(oParent.offsetHeight-obj.offsetHeight);//滚动条的比值
                    /* 滚动条运动*/
                    oBar.style.top=scaleY*(oParent.offsetHeight-oBar.offsetHeight)+"px";
                }

            }
            mobileSlide.moveFn&&mobileSlide.moveFn();//自定义事件执行;

        }
        function fnEnd()
        {
            obj.removeEventListener("touchmove",fnMove,false);
            obj.removeEventListener("touchend",fnEnd,false);
            clearInterval(timer);//清掉缓冲运动的定时;
            var self=this;//改变定时器this指向;
            timer=setInterval(function(){
                /*开启缓冲运动的定时器*/
                if(Math.abs(speedY)<=1||self.offsetTop>50||self.offsetTop<(oParent.offsetHeight-obj.offsetHeight)-50)
                {
                    clearInterval(timer);//当速度小于1停止运动;
                    /*判断是否零点超出,并且出可视区一定范围就业回来*/
                    if(self.offsetTop>=0)
                    {
                        /*超出0点就缓冲回来*/
                        startMove(self,{top:0},400,"easeOut");
                        if(scrollBar)
                        {//滚动条高度还原
                            startMove(oBar,{height:barHeight},400,"easeOut",function(){
                                startMove(oBar,{opacity:0},400,"easeOut",function(){
                                    this.style.display="none";
                                });
                            });
                        }
                    }
                    else if(self.offsetTop<=(oParent.offsetHeight-obj.offsetHeight))//如果底部滑出范围,也要进行返回操作;
                    {
                        startMove(self,{top:oParent.offsetHeight-obj.offsetHeight},400,"easeOut");
                        if(scrollBar)
                        {
                            startMove(oBar,{height:barHeight,top:oParent.offsetHeight-barHeight},400,"easeOut",function(){
                                startMove(oBar,{opacity:0},400,"easeOut",function(){
                                    this.style.display="none";
                                });
                            });
                        }
                    }
                    else
                    {
                        if(scrollBar)
                        {
                            startMove(oBar,{opacity:0},400,"easeOut",function(){
                                this.style.display="none";
                            });
                        }
                    }
                }
                else
                {
                    speedY*=0.95;//做缓冲加速运动;
                    /*定义缓冲运动的值*/
                    self.style.top=self.offsetTop+speedY+"px";//并不知道终点在哪;
                    if(scrollBar)
                    {
                        //滚动条各种高度变化的缓冲运动形式
                        if(obj.offsetTop>=0)
                        {

                            oBar.style.top=0;
                            oBar.style.height=(1-(self.offsetTop/oParent.offsetHeight))*barHeight+"px";
                        }
                        else if(obj.offsetTop<oParent.offsetHeight-obj.offsetHeight)
                        {
                            /*下方滚动条的高度变化*/
                            oBar.style.top=oParent.offsetHeight-oBar.offsetHeight+"px";
                            oBar.style.height=(1-Math.abs((self.offsetTop-(oParent.offsetHeight-obj.offsetHeight)))/oParent.offsetHeight)*barHeight+"px";
                        }
                        else
                        {
                            var scaleY=self.offsetTop/(oParent.offsetHeight-obj.offsetHeight);//滚动条的比值
                            /* 滚动条缓冲运动*/
                            oBar.style.top=scaleY*(oParent.offsetHeight-oBar.offsetHeight)+"px";
                        }
                    }
                }
            },13);
            mobileSlide.endFn&&mobileSlide.endFn();//自定义事件执行;

        }
        return false;//阻止默认事件
    }
    mobileSlide.endSlide=function(fn)
    {//滑动结束触发的函数
        mobileSlide.endFn=fn;
    };
    mobileSlide.moveSlide=function(fn)
    {//滑动中触发的函数
        mobileSlide.moveFn=fn;
    };
    mobileSlide.startSlide=function(fn)
    {//滑动开始触发的函数
        mobileSlide.startFn=fn;
    };
}
