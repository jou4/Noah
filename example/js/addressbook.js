var Addresses = [
  { id: 1, name: "Taro", email: "taro@example.com", tel: "09011112222" }
  , { id: 2, name: "Jiro", email: "jiro@example.com", tel: "09033334444" }
  , { id: 3, name: "Saburo", email: "saburo@example.com", tel: "" }
  , { id: 4, name: "Shiro", email: "shiro@example.com", tel: "09055556666" }
  , { id: 5, name: "Goro", email: "goro@example.com", tel: "" }
]


!function($){

  $(function(){

      $("#pageList").on("show", function(e){

          var addresses = Noah.db(Addresses).get()

          $("#tableBody").cartridge("load", addresses, function($clone, row){
              $(".transition", $clone).on("click", function(e){
                  Noah.send("pageDetail", "id", row.id)
              })
          })

      }).page()

      $("#newButton").on("click", function(e){
          Noah.send("pageDetail", "id", null)
      })

      $("#pageDetail").on("show", function(e){

          var id = Noah.context("id"), address

          if(id)
            address = Noah.db(Addresses).where1(id).get1()
          else
            address = { name: "", email: "", tel: "" }

          $("#formDetail").form("set", address)
      })

      $("#formDetail").on("submit", function(e){

          var id = Noah.context("id")
          , address = $("#formDetail").form("get")
          , db = Noah.db(Addresses)

          if(id)
            db.where1(id).update(address)
          else{
            address.id = db.max("id") + 1
            db.insert(address)
          }

          Noah.transition("pageList")

          return false

      })

  })

}(window.jQuery)
