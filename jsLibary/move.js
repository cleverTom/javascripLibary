function startMove(obj,json,fn){
    clearInterval(obj.timer);
    var iSpeed=0;
    obj.timer=setInterval(function(){
        var onOff=true;
        for(var attr in json){
            var iCu=0;
            var iTarget=json[attr];//对于传送进来的json对象进行处理；
            if(attr=="opacity"){
                iCu=Math.round(getStyle(obj,"opacity")*100);//相当于运动的offsetleft；
            }else
                iCu=parseInt(getStyle(obj,attr));{//去掉单位；只要数值；
            }
            iSpeed=(iTarget-iCu)/8;//加入缓冲运动，对于运动框架，只要运动算法不同，基本上整体就会变化;
            iSpeed=iSpeed>0?Math.ceil(iSpeed):Math.floor(iSpeed);//对于大于0向上取整小于0向下取整
            if(iCu!=iTarget){//如果不等于就继续运动为了后期的运动进行判断停止定时器；
                onOff=false;//通过加入开关就判断定时器最后一个属性到达再去停止定时器；
                if(attr=="opacity"){
                    obj.style.opacity=(iCu+iSpeed)/100;//对于透明度进行一个特殊的处理；
                    obj.style.filter="alpha(opacity="+(iCu+iSpeed)+")";
                }else{
                    obj.style[attr]=iCu+iSpeed+"px";
                }
            }
        }
        if(onOff==true){//如果运动结束就会范围onOff=true就停止定时器；
            clearInterval(obj.timer);
            fn && fn.call(obj);
        }
    },30);
}
function timeMove(obj,json,times,fx,fn){
    var iCur={};
    for(var attr in json){
        iCur[attr]=0;
        if(attr=="opacity"){
            iCur[attr]=Math.round(getStyle(obj,attr)*100);
        }else{
            iCur[attr]=parseInt(getStyle(obj,attr));
        }
    }
    var startTime=now();
    clearInterval(obj.timer);
    obj.timer=setInterval(function(){
        for(var attr in json){
            var changeTime=now();
            var t=times-Math.max(0,startTime-changeTime+times);
            var value=Tween[fx](t,iCur[attr],json[attr]-iCur[attr],times);
            if(attr=="opacity"){
                obj.style.opacity=value/100;
                obj.style.filter="alpha(opacity="+value+")";
            }else{
                obj.style[attr]=value+"px";
            }
            if(t==times){
                clearInterval(obj.timer);
                fn && fn.call(obj);
            }
        }
    },13);

    function now(){
        return new Date().getTime();
    }
}
function getStyle(obj,attr){
    if(obj.currentStyle){
        return obj.currentStyle[attr];
    }else{
        return getComputedStyle(obj,false)[attr];
    }
}
var Tween = {
    linear: function (t, b, c, d){  //匀速
        return c*t/d + b;
    },
    easeIn: function(t, b, c, d){  //加速曲线
        return c*(t/=d)*t + b;
    },
    easeOut: function(t, b, c, d){  //减速曲线
        return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function(t, b, c, d){  //加速减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function(t, b, c, d){  //加加速曲线
        return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function(t, b, c, d){  //减减速曲线
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function(t, b, c, d){  //加加速减减速曲线
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    elasticIn: function(t, b, c, d, a, p){  //正弦衰减曲线（弹动渐入）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p/4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function(t, b, c, d, a, p){    //正弦增强曲线（弹动渐出）
        if (t === 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*0.3;
        }
        if (!a || a < Math.abs(c)) {
            a = c;
            var s = p / 4;
        } else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    elasticBoth: function(t, b, c, d, a, p){
        if (t === 0) {
            return b;
        }
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        if (!p) {
            p = d*(0.3*1.5);
        }
        if ( !a || a < Math.abs(c) ) {
            a = c;
            var s = p/4;
        }
        else {
            var s = p/(2*Math.PI) * Math.asin (c/a);
        }
        if (t < 1) {
            return - 0.5*(a*Math.pow(2,10*(t-=1)) *
                Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) *
            Math.sin( (t*d-s)*(2*Math.PI)/p )*0.5 + c + b;
    },
    backIn: function(t, b, c, d, s){     //回退加速（回退渐入）
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 3.70158;  //回缩的距离
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    backBoth: function(t, b, c, d, s){
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    bounceIn: function(t, b, c, d){    //弹球减振（弹球渐出）
        return c - Tween['bounceOut'](d-t, 0, c, d) + b;
    },
    bounceOut: function(t, b, c, d){
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
    },
    bounceBoth: function(t, b, c, d){
        if (t < d/2) {
            return Tween['bounceIn'](t*2, 0, c, d) * 0.5 + b;
        }
        return Tween['bounceOut'](t*2-d, 0, c, d) * 0.5 + c*0.5 + b;
    }
}

