(function(global){
    "use strict";

    // モジュール設定
    global["pipboy"] = global.pipboy || {};
    var module = global.pipboy;


    /**
     * PIPKerningTable
     *
     * カーニング値を保持するテーブル
     *
     * @type {{}}
     */
    module.PIPKerningTable = function(){

    };
    ////////////////////////////////////////////////
    // Header
    ////////////////////////////////////////////////

    // カーニングテーブル
    // * ワイルドカード
    module.PIPKerningTable.table = {
        '、*' : -0.4,
        '*「' : -0.5,
        '「*' : 0.2,
        '*」' : 0.2,
        '」*' : -0.5,
        '*（' : -0.5,
        '。*' : -0.5,
        '）*' : -0.5,
        'ちょ' : -0.1,
        'ょっ' : -0.1
    };

    // Beginning of Line (行頭)
    module.PIPKerningTable.BOL = {
        '（': '-0.5',
        '「': '-0.5'
    }




})((this || 0).self || global);