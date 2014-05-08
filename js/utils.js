(function(M){
        var initRequest = function(option){
        console.log("Proxy starts creating Ajax!!");

        var httpRequest = createInstance();
        var success = option.success;
        var url = option.url;
        var method = option.method;
        var data = option.data;

        var dataArr = [];
        for(var i in data){
            dataArr.push(i + "=" + data[i]);
        }

        if(method == "GET"){
            url += "?" + dataArr.join("&");
        }

        if(httpRequest){
            httpRequest.onreadystatechange = function(){
                if(this.readyState == 4){
                    console.log("Proxy Ajax loaded!!");
                    success && success(httpRequest.responseText);
                }
            };

            httpRequest.open(method, url, false);
            //httpRequest.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
            //httpRequest.setRequestHeader("X-Requested-From","_TC_QC_jsProxy_");

            httpRequest.send(JSON.stringify(data));
            console.log("Proxy created Ajax done!!method: " + method + "; data: " + JSON.stringify(data) + "----already send");
        }else{
            console.error("Proxy created Ajax Error!!");
        }
    };

    var createInstance = function(){
        var xmlHttp;

        try{
            // Firefox,Opera 8.0+,Safari
            xmlHttp = new XMLHttpRequest();
        }catch(e){
            // Internet Explorer
            try{
                xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
            }catch(e){
                try{
                    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
                }catch(e){
                    return false;
                }
            }
        }

        return xmlHttp;
    };

    var getTmpl = function(tmplStr, data){
        var result;

        var varHtml = "";
        for(var i in data){
            varHtml += "var " + i + " = data." + i + ";";
        }

        tmplStr = tmplStr.replace(/\s+/g, " ");
        tmplStr = varHtml + "var __result = ''; ?>" + tmplStr + "<?";
        tmplStr += " return __result;";
        tmplStr = tmplStr.replace(/<\?=([^\?]+)\?>/g, "' + $1 + '").replace(/<\?/gi, "';").replace(/\?>/g,"__result += '");

        var str = new Function("data", tmplStr);
        result = str(data);

        return result;
    };

    //保留上次的el地址，便于清除
    var lastRenderEls = {};

    var renderTmpl = function(id, data, isAppend){
        var tmplNode = document.getElementById(id);
        var tmplString = tmplNode.innerHTML;
        var result = getTmpl(tmplString, data);

        if(! lastRenderEls[id]) lastRenderEls[id] = [];

        if(! isAppend){
            //清除上次的渲染
            for(var i = 0; i < lastRenderEls[id].length; i ++){
                var lastItem = lastRenderEls[id][i];

                lastItem.parentNode.removeChild(lastItem);
            }
        }

        lastRenderEls[id] = [];


        var div = document.createElement("div");
        div.innerHTML = result;

        var divChildren = div.childNodes;

        while(divChildren.length > 0){
            lastRenderEls[id].push(divChildren[0]);

            tmplNode.parentNode.insertBefore(divChildren[0], tmplNode);
        }
    };
        var addEvent = function(proxyNode, selector, eventType, func){//为代理节点添加事件监听
                var proName = "",flag = 0;
                if(typeof(selector) == "string"){

                    flag = 1;
                    switch(true){
                        case /^\./.test(selector) :
                            proName = "className";
                            selector = selector.replace(".", "");
                            selector = new RegExp(" *" + selector + " *");
                            break;
                        case /^\#/.test(selector) :
                            proName = "id";
                            selector = new RegExp(selector.replace("#", ""));
                            break;
                        default: 
                            selector = new RegExp(selector);
                            proName = "tagName";
                    }

                }

                var addEvent = window.addEventListener ? "addEventListener" : "attachEvent";
                var eventType = window.addEventListener ? eventType : "on" + eventType;

                proxyNode[addEvent](eventType,function(e){

                        function check(node){

                            if(flag){
                                if(selector.test(node[proName])){

                                    func.call(node, e);
                                    return;
                                };
                            }else{
                                if(selector == node){
                                    func.call(node, e);
                                    return;
                                };
                            }

                            if(node == proxyNode || node.parentNode == proxyNode) return;
                            check(node.parentNode);
                        }

                        check(e.srcElement);
                });
    };

    var query = function (n) { 
            var m = window.location.search.match(new RegExp('(\\?|&)' + n + '=([^&]*)(&|$)'));   
            return !m ? '' : decodeURIComponent(m[2]);  
    };

    var getHash = function (n) {
            var m = window.location.hash.match(new RegExp('(#|&)' + n + '=([^&]*)(&|$)'));
            return !m ? '' : decodeURIComponent(m[2]);
    };
    var parentIs = function(el, parentSelector){
            if(! el) return;
            var parentAttribute = "className";
            var parentValue = parentSelector.replace(/^\./, "");
            if(/^\./.test(parentSelector)){
            }else if(/^#/.test(parentSelector)){
                parentAttribute = "id";
                parentValue = parentSelector.replace(/^#/, "");
            }

            var flag = 0;

            function checkParent(el){
                if(el[parentAttribute] == parentValue){
                    flag = 1;
                    return;
                }else{
                    if(el.parentNode){
                        checkParent(el.parentNode);
                    }else{
                    }
                }
            }

            checkParent(el);
            return flag;
    };

   var utils = {
        request: initRequest,
        getTmpl: getTmpl,
        renderTmpl: renderTmpl,
        getHash: getHash,
        addEvent: addEvent,
        parentIs: parentIs
    };

    window.Utils = utils;
})();
