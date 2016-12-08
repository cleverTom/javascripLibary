/*
* param:{};
* type:get post default:"get";
* data:{};传入数据;
* async:true false 是否异步,默认异步;
* url:请求地址;
* success:成功后的回调函数;
* cache:get方式下是否缓存;默认缓存;
* dataType:返回数据格式 默认json  支持text;
* */
function ajax(json) {
    var type = json.type || "get";
    var data = serialize(json.data);
    var async = json.async || true;
    var success = json.success;
    var url = json.url;
    var cache=json.cache||false;
    var dataType=json.dataType||"json";
    var xhr = new XMLHttpRequest();
    if (type == "get") {
        if(cache==false)
        {
            xhr.open(type, url + "?"+data,async);
        }
        else
        {
            xhr.open(type, url + "?"+data+"&cache="+Date.now(),async);
            console.log(url + "?"+data+"&cache="+Date.now());
        }
        xhr.send(null);
    }
    else if (type == "post")
    {
        xhr.open(type, url,async);
        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        xhr.send(data);
    }
    xhr.onreadystatechange = function () {
        if (xhr.status == 200 && xhr.readyState == 4) {
            if(dataType=="text")
            {
                success&&success(xhr.responseText);
            }
            else if(dataType=="json")
            {
                success&&success(JSON.parse(xhr.responseText));
            }
        }
    };
    function serialize(data) {
        var str = "";
        for (var attr in data) {
            str += attr + "=" + data[attr] + "&";
        }
        return str.substring(0, str.length - 1);
    }
}