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
        }
    };

    View.init();

})();
