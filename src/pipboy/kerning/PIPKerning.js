/**
 * PIPKerningクラス
 *
 * JavaScriptを利用した日本語カーニングエンジンです。
 * 事前にカーニングテーブルJSが必要です。
 *
 * @usage
 * カーニングをかけるDOMに「js-pip-kerning」クラスを指定してください。
 * カーニング値のデータを持つ別ファイル(js)をあらかじめ読み込むようにしてください。
 *
 * ex) PIPKerningHiragino.js ヒラギノフォントのカーニング設定
 *
 * @constructor
 */


(function(global){
    "use strict";

    // モジュール設定
    global["pipboy"] = global.pipboy || {};
    var module = global.pipboy;

    // カーニングテーブル
    var PIPKerningTable = module.PIPKerningTable;

    module.PIPKerning = function(){
        if(!this.listeners) this.listeners = "";
    };
    ////////////////////////////////////////////////////////////
    // Header
    ////////////////////////////////////////////////////////////

    /**
     * セットアップメソッド
     *
     * @param str       テキスト
     * @param $element DOM要素
     * @type {PIPKerning_setup}
     */
    module.PIPKerning.prototype['setup'] = PIPKerning_setup;

    /**
     * [private] テキストからカーニング設定
     *
     * @param   str カーニング対象文字列
     * @type {PIPKerning_define}
     */
    module.PIPKerning.prototype['__define'] = PIPKerning_define;



    function PIPKerning_setup(str, $element){
        var dom  = this.__define(str);
        $element.innerHTML = dom;

        // 行頭処理
        var $childs = $element.getElementsByTagName("span");
        var rowWidth = $element.clientWidth;
        var currentRowWidth = 0;

        for(var j = 0; j < $childs.length; ++j){
            // カーニング値を取得
             var spacing = parseFloat($childs[j].style.letterSpacing, 10);

            //$childs[j].style.letterSpacing = 0;
            currentRowWidth += $childs[j].clientWidth;
            //$childs[j].style.letterSpacing = spacing + "em";

            //trace($childs[j].innerHTML,  $childs[j].clientWidth, currentRowWidth + " / " + rowWidth);
            //trace($childs[j].innerHTML, currentRowWidth, rowWidth);

            var bol = "";
            if(j == 0) {
                bol = PIPKerningTable.BOL[$childs[j].innerHTML];
                if(bol) {
                    $childs[j].style.marginLeft = bol + 'em';
                    currentRowWidth += 16 * bol;
                }
            } else if(currentRowWidth >= rowWidth) {
                bol = PIPKerningTable.BOL[$childs[j].innerHTML] + 'em';

                if(bol) $childs[j].style.marginLeft = bol;
                currentRowWidth = 0;

                // 開業前の文字のletter-spacingを解除
                $childs[j-1].style.letterSpacing = 0;

                trace($childs[j].innerHTML);
            }

        }
    }

    function PIPKerning_define(str){
        var characters = str.split('');
        var table = PIPKerningTable.table;
        var len = characters.length - 1; // 最後の文字は何も指定しない。
        var output = "";
        for(var i = 0; i < len; ++i){

            // 次の文字ワイルドカードのペアを調べる
            var pair   = characters[i] + '*';
            var result = table[pair];

            // ワイルドカードと次の文字
            if(!result) {
                pair  = '*'+characters[i+1];
                result = table[pair];
            }

            // 文字のペア
            pair = characters[i] + characters[i+1];
            if(table[pair]) result = table[pair];

            if(!result) result = 0;
            output += '<span style="display: inline-block; letter-spacing: '+ result +'em;">' + characters[i] + '</span>';
        }

        // 最後の文字
        output += '<span style="display: inline-block; ">' + characters[len] + '</span>';
        return output;
    }


    ////////////////////////////////////////////////////////////
    // execute
    ////////////////////////////////////////////////////////////

    var headingList = []; // カーニング対象の各テキストを格納します。

    var $elements = document.getElementsByClassName('js-pip-kerning');
    var len = $elements.length;
    for(var i = 0; i < len; ++i){
        var str = $elements[i].innerHTML;
        headingList.push(str);
        var pipKerning = new module.PIPKerning();
        pipKerning.setup(str, $elements[i]);
    }


    var resizeTimer;
    var interval = Math.floor(1000 / 60 * 10);

    window.addEventListener('resize', function (event) {
        //console.log('resizing');
        if (resizeTimer !== false) {
            clearTimeout(resizeTimer);
        }
        resizeTimer = setTimeout(function () {

            /*
            var $elements = document.getElementsByClassName('pip-kerning');
            var len = $elements.length;
            for(var i = 0; i < len; ++i){
                var str = headingList[i];
                var pipKerning = new module.PIPKerning();
                pipKerning.setup(str, $elements[i]);
            }

*/

        }, interval);
    });






})((this || 0).self || global);





