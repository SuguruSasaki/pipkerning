/**
 * trace
 *
 * console.logの代わりに
 * warn error info debugが利用できます。
 *
 * @author  suguru.sasaki@quad.co.jp
 * @date    2015.11.01
 * @version 1.0.0
 *
 */

(function () {
    if (typeof window.console === "undefined") {
        window.console = {}
    }
    if (typeof window.console.log !== "function") {
        window.console.log = function () {}
    }
})();


var methods = ['trace', 'warn', 'error', 'info', 'debug'];
for(var i in methods){
    (function(m){
        if(console[m]){
            window[m] = console[m].bind(console);
        }
        else {
            window[m] = trace;
        }
    })(methods[i])
}

