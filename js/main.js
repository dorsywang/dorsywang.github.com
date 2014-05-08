(function(){
    var $ = $ || function(selector){
        return  document.querySelectorAll(selector);
    };

    var View = {
        renderContent: function(){
            Model.getContentData(function(data){
                Utils.renderTmpl("content", data);
            });
        },

        init: function(){
            this.renderContent();

            this.hashHandler();
        },

        renderArticle: function(aName){
            Model.getArticle(aName, function(data){
                Utils.renderTmpl("article", data, 0);;

                View.getArticle().show();
            });
        },

        getArticle: function(){
            return {
                hide: function(){
                    $(".articlePage")[0].style.display = "none";
                },

                show: function(){
                    $(".articlePage")[0].style.display = "block";
                }
            };
        },

        hashHandler: function(){
            var aName = Utils.getHash("article");
            if(aName){
                View.renderArticle(aName);
            }else{
                View.getArticle().hide();
            }
        }
    };

    var Model = {
        getContentData: function(callback){
            Utils.request({
                url: "data/content.json",
                method: "GET",
                success: function(res){
                    var data = JSON.parse(res);

                    callback && callback(data);
                }
            });
        },

        getArticle: function(aName, callback){
            Utils.request({
                url: "data/" + aName + ".json",
                method: "GET",
                success: function(res){
                    var data = JSON.parse(res);

                    callback && callback(data);
                }
            });
        }
    };

    var Event = {
        init: function(){
            this.commonBind();
        },

        commonBind: function(){
            window.onhashchange = View.hashHandler;

            window.onclick = function(e){
                var target = e.target;
                if(Utils.parentIs(target, ".articlePage")){
                }else{
                    document.location = "#index";
                    //View.getArticle().hide();
                }

            };
        }
    };

    View.init();
    Event.init();

})();
