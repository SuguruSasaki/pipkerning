var Delegate = {

    /**
     * 委譲オブジェクトを作成する。
     * @param scope
     * @param method
     * @returns {Function}
     */
    create:function(scope, method){
        var obj =  function(){
            return method.apply(scope, arguments);
        };
        return obj;
    }
};