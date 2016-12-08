/*
* Document
* param
* 1.父级id(里面的子元素是span);
* 2.hour 小时
* 3.min 分钟
* 4.sec 秒数
* 5.callback 执行完的回调
* */
function countdown(parent,hour,min,sec,fn)
{
    var oParent=document.getElementById(parent);
    var timer=null;
    var aSpan=oParent.querySelectorAll("span");
    var iHour=aSpan[0];
    var iMin=aSpan[1];
    var iSec=aSpan[2];
    time();
    function count()
    {
        sec--;
        if(sec==-1)
        {
            min--;
            if(min!=-1)
            {
                sec=59;
            }
            else if(min==-1)
            {
                if(hour==0)
                {
                    clearInterval(timer);
                    fn&&fn();
                    return;
                }
                else
                {
                    hour--;
                    min=59;
                    sec=59;
                }
            }

        }
        time();
    }
    timer=setInterval(count,1000);
    function toZero(num)
    {
        if(num<=9)
        {
            return "0"+num;
        }
        else
        {
            return ""+num;
        }
    }
    function time()
    {
        iHour.innerHTML=toZero(hour);
        iMin.innerHTML=toZero(min);
        iSec.innerHTML=toZero(sec);
    }
}