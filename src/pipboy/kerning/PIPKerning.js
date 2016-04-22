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


    module.PIPKerning = function(){
        this.kerning    = module.PIPKerningTable;
        this.listeners  = [];
    };
    ////////////////////////////////////////////////////////////
    // Header
    ////////////////////////////////////////////////////////////
    module.PIPKerning.prototype['setup']                    = setup;
    module.PIPKerning.prototype['defineKerning']            = defineKerning;
    module.PIPKerning.prototype['defineBeginningOfLine']    = defineBeginningOfLine;
    module.PIPKerning.prototype['checkWildcardBefore']      = checkWildcardBefore;
    module.PIPKerning.prototype['checkSpecifiedCharacter']  = checkSpecifiedCharacter;

    module.PIPKerning.prototype['setWindowResize']          = setWindowResize;
    module.PIPKerning.prototype['onResizeListener']         = onResizeListener;



    function setup(){
        var $elem = document.getElementsByClassName('js-pip-kerning');
        var len   = $elem.length;

        for(var i = 0; i < len; ++i){
            var str  = $elem[i].innerText;
            this.listeners.push($elem[i]);
            $elem[i].innerHTML = this.defineKerning(str);
            this.defineBeginningOfLine($elem[i]);
        }
    }

    function setWindowResize(){
        window.addEventListener('resize', Delegate.create(this, this.onResizeListener) );
    }

    function onResizeListener(e){
        var len = this.listeners.length;
        for(var i = 0; i < len; ++i){
            this.defineBeginningOfLine(this.listeners[i]);
        }
    }


    function defineKerning(str) {
        var characters  = str.split('');
        var output      = '';
        var len         = characters.length - 1; // 最後の文字は何も指定しない。

        for(var i = 0; i < len; ++i) {
            var chara       = characters[i];
            var charaNext   = characters[i + 1];
            var result      = 0;
            result = this.checkWildcardBefore(chara + '*', result);             // 1.ワイルドカードのペアを調べる
            result = this.checkSpecifiedCharacter( chara + charaNext , result); // 2.指定文字のペアを調べる
            output += createCharacterTag(chara, result);                        // 3.HTMLタグを作成
        }

        // 最後の文字
        output += createCharacterTag(characters[len], 0);
        return output;
    }

    function defineBeginningOfLine($element){
        var $childs = $element.getElementsByTagName("span");
        var rowWidth = $element.clientWidth;
        var currentRowWidth = 0;
        var len = $childs.length;

        for(var i = 0; i < len; ++i){
            var $spanTag = $childs[i];
            var kerningValue = parseFloat($spanTag.style.letterSpacing, 10);
            if(currentRowWidth == 0) {
                var value = this.kerning.BOL[$spanTag.innerHTML];
                if(value) {
                    $spanTag.style.marginLeft = value + 'em';
                    var fontSize = window.getComputedStyle($spanTag, null).getPropertyValue('font-size');
                    fontSize = Number( fontSize.replace(/px/, '') );
                    currentRowWidth += fontSize * value;
                }
                currentRowWidth += $childs[i].clientWidth;
            }
            else {
                currentRowWidth += $childs[i].clientWidth;
                if(currentRowWidth >= rowWidth) {
                    var value = this.kerning.BOL[$spanTag.innerHTML];
                    if(value) {
                        $spanTag.style.marginLeft = value + 'em';
                        var fontSize = window.getComputedStyle($spanTag, null).getPropertyValue('font-size');
                        fontSize = Number( fontSize.replace(/px/, '') );
                        currentRowWidth += fontSize * value;
                    }
                    currentRowWidth = 0;
                }
                else {
                    if($spanTag.style.marginLeft) $spanTag.style.marginLeft = 0 + 'em';

                }
            }


        }

    }



    function checkWildcardBefore(str, result){
        return this.kerning.table[str] ? this.kerning.table[str] : result;
    }

    function checkSpecifiedCharacter(str, result){
        return this.kerning.table[str] ? this.kerning.table[str] : result;
    }

    function createCharacterTag(s, margin){
        return '<span style="display: inline-block; letter-spacing: '+ margin +'em;">' + s + '</span>';
    }



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


    ////////////////////////////////////////////////////////////
    // execute
    ////////////////////////////////////////////////////////////

    var kerning = new module.PIPKerning();
    kerning.setup();
    kerning.setWindowResize();



})((this || 0).self || global);





