/**
 * AlloyImage Game Engine
 * Just Like AlloyImage, It's Powerful and Easily to use!
 * Another competitive products by Dorsywang from Tencent AlloyTeam;
 */
;(function(){
    //define modules
    var mainPort = 'AIGame';
    var __definePools__ = {};

    //checking if modules ready;
    var checkReady = function(name){
        if(__definePools__[name]){
            var modules = __definePools__[name].modules;

            var readyModule = [];
            modules.map(function(item, index){
                var itemObject = checkReady(item);
                if(itemObject){
                    readyModule.push(itemObject);
                }else{
                }
            });

            if(readyModule.length == modules.length){
                return __definePools__[name].func.apply(null, readyModule);
            }
        }else{
        }

    };

    //AI define method, just like common define method;
    var AIDefine = function(name, modules, func){
        __definePools__[name] = {
            func: func,
            modules: modules
        };

        checkReady(mainPort);
    };

    //Global Object: AIGame;
    window.AIGame = AIGame = {};

    //AI export method, just like common export method;
    var AIExport = {
        put: function(name, obj){
            if(name === ""){
                for(var i in  obj){
                    AIGame[i] = obj[i];
                }
            }else{
                AIGame[name] = obj;
            }
        }
    };

    //define the main module: AIGame;
    AIDefine('AIGame', ['stage'], function(Stage){
        var AIGame = {};

        AIGame.info = {
            VERSION: "1.0.0",
            AUTHOR: "dorsywang",
            EMAIL: "314416946@qq.com",
            BLOG: "http://www.dorsywang.com",
            TEAM: "Tencent.AlloyTeam",
            TEAM_BLOG: "http://www.alloyteam.com"
        };

        //out put API of AI Game Engine;
        AIExport.put('', AIGame);

        //out put Stage API of AI Game Engine;
        AIExport.put('', Stage);
    });


})();
