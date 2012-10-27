var Customers = [
  { customer_id: 1, customer_name: "Taro" }
  , { customer_id: 2, customer_name: "Jiro" }
  , { customer_id: 3, customer_name: "Saburo" }
]

var Products = [
  { product_id: 1, product_name: "apple", price: 100 }
  , { product_id: 2, product_name: "orange", price: 200 }
  , { product_id: 3, product_name: "banana", price: 150 }
]

var Orders = [
  { order_id: 1, customer_id: 1, date: "2012-09-15" }
  , { order_id: 2, customer_id: 3, date: "2012-10-01" }
  , { order_id: 3, customer_id: 1, date: "2012-10-10" }
  , { order_id: 4, customer_id: 2, date: "2012-10-23" }
]

var Purchases = [
  { order_id: 1, product_id: 1 }
  , { order_id: 1, product_id: 3 }
  , { order_id: 2, product_id: 2 }
  , { order_id: 3, product_id: 1 }
  , { order_id: 3, product_id: 2 }
  , { order_id: 3, product_id: 3 }
  , { order_id: 4, product_id: 3 }
]


!function($){

  $(function(){

      $("#pageOrders").on("show", function(e){

          var orders = Noah.db(Orders).join(Customers, "customer_id").get()

          $("#ordersTableBody").cartridge("load", orders, function($clone, row){
              $(".transition", $clone).on("click", function(e){
                  Noah.send("pagePurchase", "order_id", row.order_id)
              })
          })

      }).page()

      $("#pagePurchase").on("show", function(e){

          var order_id = Noah.context("order_id")
          var order = Noah.db(Orders).where1("order_id", order_id).join(Customers, "customer_id")
          .each(function(row){
              return $.extend({}, row, {
                  purchases: Noah.db(Purchases).where("order_id", row.order_id).join(Products, "product_id").get()
              })
          })
          .get1()

          $("#pagePurchase").dist("set", order)
          $("#purchagesTableBody").cartridge("load", order.purchases)
          Noah.context("customer_id", order.customer_id)

      })

      $("#dialogHistory").on("show", function(e){

          var customer_id = Noah.context("customer_id"),
              orders = Noah.db(Orders).where("customer_id", customer_id).join(Customers, "customer_id").get()

          $("#historyTableBody").cartridge("load", orders, function($clone, row){
              $(".transition", $clone).on("click", function(e){
                  Noah.send("pagePurchase", "order_id", row.order_id)
              })
          })

      })

  })

}(window.jQuery)
