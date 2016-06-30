# PIPKerning

#### PIPKerningとは?
JavaScriptを利用した日本語カーニングエンジンです。

カーニングエンジンはこれまで、たくさんの方が取り組まれていました。
実装方法は、下記のすばらしい取り組みを参考にさせていただいてます。

[fladdictさんのカーニングエンジン](http://fladdict.net/blog/2011/02/auto-kerning.html)
[DELTROさんのカーニングエンジン](http://dentsu-ho.com/)


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

#### カーニングデータの作り方
fontディレクトリ内にある書くJavaScriptファイルで定義しています。
基本的には、ハッシュでカーニング処理をしたい組み合わせを作ります。
複数の文字との組み合わせを考えたい場合は、"*"ワイルドカードと組み合わせます。





