# Noah
## プロトタイプ作成支援

アプリケーションのプロトタイプ作成を支援するJavascriptです。
ページ遷移や入力フォームを扱うためのユーティリティやRDB操作を擬似的に行う機能を持ちます。
サーバー環境は不要で、HTMLとJavascript、CSSファイルだけで、
実際に動くプロトタイプを手軽に実装したいなと思い作成しました。


## 機能
### ページ

class="page"を付与することで、個々のページを表現します。

    <div id="pageA" class="page">
      <h1>Page A</h1>
    </div>

    <div id="pageB" class="page">
      <h1>Page A</h1>
    </div>

class="transition"をボタンに付与することで、ページ遷移機能が追加されます。
遷移先のページのIDをdata-targetで指定します。

    <div id="pageA" class="page">
      <h1>Page A</h1>
      <div><a class="btn transition" data-target="pageB">Go to pageB</div>
    </div>

    <div id="pageB" class="page">
      <h1>Page B</h1>
      <div><a class="btn transition" data-target="pageA">Go to pageA</div>
    </div>


### ダイアログ

class="modal dialog"を付与することで、個々のダイアログを表現します。

    <div class="modal dialog" id="dialogA" tabindex="-1" aria-hidden="true">
      <a class="btn" data-dismiss="modal">Close</a>
    </div>

class="open"をボタンに付与することで、モーダルダイアログ表示機能が追加されます。
表示するダイアログのIDをdata-targetで指定します。

    <div><a class="btn open" data-target="dialogA">Open dialog</a></div>

    <div class="modal dialog" id="dialogA" tabindex="-1" aria-hidden="true">
      <a class="btn" data-dismiss="modal">Close</a>
    </div>


### 入力フォーム

jQuery.fn.formは、入力された値の取得、フォームへの値の配布を行う関数です。

    <form id="myForm">
      <p>Name: <input type="text" name="name" /></p>
      <p>Email: <input type="text" name="email" /></p>
    </form>

以下のJavascriptコードでフォームの操作が可能です。

    // set
    $("#myForm").form("set", { name: "John", email: "john@example.com" })

    // get
    $("#myForm").form("get")


### 値の表示

jQuery.fn.distにより、各要素へ値を表示することも可能です。
jQuery.fn.formに似ていますが、jQuery.fn.distはsetのみです。

    <div id="myPanel">
      <div data-name="name"></div>
      <div data-name="email"></div>
    </div>

以下のJavascriptコードで値を表示します。

    $("#myPanel").dist("set", { name: "John", email: "john@example.com" })


### 要素の複製

jQuery.fn.cartridgeにより、テーブルの各行のような要素に対し、まとめて値を表示することも可能です。

    <table id="myTable">
      <tr class="origin">
        <td data-name="name"></td>
        <td data-name="email"></td>
      </tr>
    </table>


以下のJavascriptコードで値を表示します。

    var values = [
      { name: "John", email: "john@example.com" },
      { name: "Paul", email: "paul@example.com" }
    ]
    $("#myTable").cartridge("load", values)

各要素ごとに個別に処理を行いたい場合はコールバックを渡します。

    $("#myTable").cartridge("load", values, function($clone, row, i){
      console.log(i)
    })


## 疑似RDB操作

以下のようなデータを考えます。

    var Members = [
      { id: 1, name: "John", email: "john@example.com" },
      { id: 2, name: "Paul", email: "paul@example.com" },
      { id: 3, name: "George", email: "george@example.com" },
      { id: 4, name: "Ringo", email: "ringo@example.com" }
    ]

    var Birthdays = [
      { member_id: 1, birth: "1940-10-9" },
      { member_id: 2, birth: "1942-6-18" },
      { member_id: 3, birth: "1943-2-25" },
      { member_id: 4, birth: "1940-7-7" }
    ]

    var Parts = [
      { member_id: 1, part: "guitar" },
      { member_id: 1, part: "vocal" },
      { member_id: 1, part: "harmonica" },
      { member_id: 2, part: "base" },
      { member_id: 2, part: "vocal" },
      { member_id: 2, part: "piano" },
      { member_id: 3, part: "guitar" },
      { member_id: 3, part: "vocal" },
      { member_id: 4, part: "drum" },
      { member_id: 4, part: "vocal" },
    ]


### 検索

検索してみます。

    Noah.db(Members).where1(1).get1()
    Noah.db(Members).where1("id", 1).get1()
    Noah.db(Members).where1({ id: 1 }).get1()

関数を渡すこともできます。

    Noah.db(Members).where(function(row){ return row.id < 3 }).get()
    Noah.db(Members).where(function(row){
      return row.email.indexOf("@example.com") >= 0 }).get()

結合してみます。

    Noah.db(Members).join(Birthdays, "member_id", "id").get()
    Noah.db(Members).attach("parts", "member_id", "id").get()

各行ごとに個別の処理を行います。

    Noah.db(Members).each(function(row){
      return $.extend({}, row, { city: "Liverpool" })
    }).get()

### 更新

行の追加、更新、削除が可能です。
これらは破壊的な操作であり元のデータを変更します。

    Noah.db(Members).insert({ id: 5, name: "Pete", email: "pete@example.com" })
    Noah.db(Members).where1("id", 3).update({ email: "george.harrison@example.com" })
    Noah.db(Members).delete("id", 5)


## Dependencies

* [jQuery](http://jquery.com/)
* [Twitter Bootstrap](http://twitter.github.com/bootstrap/)


## License

Copyright (C) 2012 K.Kamitsukasa.
Licensed under the [MIT License](http://www.opensource.org/licenses/mit-license.php).

