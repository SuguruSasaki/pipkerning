/**
 * 委譲オブジェクトを作成する。
 * @param scope
 * @param method
 * @returns {Function}
 */
var Delegate = {
    create:function(scope, method){
        var obj =  function(){
            return method.apply(scope, arguments);
        };
        return obj;
    }
};