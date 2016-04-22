# PIPKerning

#### PIPKerningとは?
JavaScriptを利用した日本語カーニングエンジンです。


#### 利用方法
カーニング値のデータを持つ別ファイル(js)をあらかじめ読み込むようにしてください。
カーニングをかけるDOMに「js-pip-kerning」クラスを指定してください。

```html
<h1 class="js-pip-kerning">サンプル見出し</h1>
```

あとは、カーニングデータを記述したJSとPIPKerning.jsを追加します。

```html
<script src="pipboy/logger/trace.js"></script>
<script src="pipboy/utils/delegate.js"></script>
<script src="pipboy/kerning/font/PIPKerningHiragino.js"></script>
<script src="pipboy/kerning/PIPKerning.js"></script>
```




