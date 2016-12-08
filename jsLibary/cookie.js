function getCookie(key){
    var arr=document.cookie.split(" ");
    var json={};
    for(var i=0;i<arr.length;i++){
        if(i!=arr.length-1) {
            arr[i] = arr[i].substring(0, arr[i].length - 1);
        }
        json[arr[i].split("=")[0]]=[arr[i].split("=")[1]];
    }
    return json[key];
}
function setCookie(key,value,time){
    var oDate=new　Date();
    oDate.setDate(oDate.getDate()+time);
    document.cookie=key+"="+value+";expires="+oDate.toUTCString();
}
function removeCookie(key){
    setCookie(key,"",-1);
}
