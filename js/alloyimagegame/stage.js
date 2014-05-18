/**
 * Stage file
 * Game Stage constructor and methods
 * @author dorsywang
 */
AIDefine('stage', [], function(){
    var Stage = function(width, height, background){
    };

    Stage.prototype = function(){
        ctx: function(){
        },

        show: function(){
        }
    };

    return {
        initStage: function(){
            return new Stage(width, height, background);
        }
    };
});
