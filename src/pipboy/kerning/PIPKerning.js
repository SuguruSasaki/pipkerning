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

    module.PIPKerning.prototype['calcFontSize']             = calcFontSize;

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
        var $childs = $element.getElementsByTagName('span');
        var rowWidth = $element.clientWidth;
        var currentRowWidth = 0;
        var len = $childs.length;
        trace(rowWidth);

        for(var i = 0; i < len; ++i ){
            var $spanTag     = $childs[i];
            var kerningValue = parseFloat($spanTag.style.letterSpacing, 10);
            var fontSize     = 0;
            var valueBOL     = 0;

            if(currentRowWidth == 0) {
                valueBOL = this.kerning.BOL[$spanTag.innerHTML];
                fontSize = calcFontSize($spanTag);
                if(valueBOL){
                    $spanTag.style.marginLeft = valueBOL + 'em';
                    currentRowWidth += fontSize * valueBOL + (fontSize * kerningValue);
                }
                else {
                    currentRowWidth += fontSize + (fontSize * kerningValue);
                }
            }
            else {
                valueBOL = this.kerning.BOL[$spanTag.innerHTML];
                if(!valueBOL) valueBOL = 0;
                fontSize = calcFontSize($spanTag);

                var clientWidth = (fontSize - $childs[i].clientWidth) + $childs[i].clientWidth;
                var addSize = clientWidth  + ( fontSize * kerningValue );
                currentRowWidth += addSize;

                if(currentRowWidth >= rowWidth) {
                    currentRowWidth += $childs[i].clientWidth;
                    if(valueBOL){
                        $spanTag.style.marginLeft = valueBOL + 'em';
                        fontSize = calcFontSize($spanTag);
                        currentRowWidth += fontSize * valueBOL  + (fontSize * kerningValue);
                    }
                    else {
                        currentRowWidth = 0;
                        currentRowWidth += addSize;
                    }
                }
                trace($childs[i].innerHTML, currentRowWidth, addSize, clientWidth,  fontSize, fontSize * kerningValue);
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

    function calcFontSize($tag){
        var fontSize = window.getComputedStyle($tag, null).getPropertyValue('font-size');
        return Number( fontSize.replace(/px/, '') );
    }

    function onResizeListener(e){
        var len = this.listeners.length;
        for(var i = 0; i < len; ++i){
            this.defineBeginningOfLine(this.listeners[i]);
        }
    }


    ////////////////////////////////////////////////////////////
    // execute
    ////////////////////////////////////////////////////////////

    var kerning = new module.PIPKerning();
    kerning.setup();
    kerning.setWindowResize();



})((this || 0).self || global);





