!function($){

  "use strict";

  var Page = function (element, options) {
    this.options = options
    this.$element = $(element)
  }

  Page.prototype = {

    constructor: Page

    , show: function(){
      var e = $.Event('show')

      this.$element.trigger(e)

      if (this.isShown || e.isDefaultPrevented()) return

      this.isShown = true
      this.$element.show()
    }

    , hide: function(){
      var e = $.Event('hide')

      this.$element.trigger(e)

      if (!this.isShown || e.isDefaultPrevented()) return

      this.isShown = false
      this.$element.hide()
    }

  };


  $.fn.extend({
      page: function(option){
        return this.each(function(){
            var $this = $(this)
            , data = $this.data('page')
            , options = $.extend({}, $.fn.page.defaults, $this.data(), typeof option == 'object' && option)
            if (!data) $this.data('page', (data = new Page(this, options)))
            if (typeof option == 'string') data[option]()
            else if (options.show) data.show()
        })
      }
  })

  $.fn.page.defaults = {
    show: true,
  }

  $.fn.page.Constructor = Page

}(window.jQuery);


!function($){

  "use strict";

  var Form = function(element, options){
    this.options = options
    this.$element = $(element)
  }

  Form.prototype = {

    constructor: Form

    , get: function(){
      var values = {}

      $("input[type=text],input[type=password],input[type=checkbox],input[type=radio]:checked,select,textarea"
        , this.$element).each(function(){
          var $this = $(this)
          , name = $this.attr("name")
          , type = ($this.attr("type") || "").toLowerCase()
          , value = $this.val()

          if(type === "checkbox")
            value = $this.prop("checked")

          if(name) values[name] = value
      })

      return values
    }

    , set: function(values){

      $("input[type=text],input[type=password],input[type=checkbox],input[type=radio],select,textarea"
        , this.$element).each(function(){
          var $this = $(this)
          , name = $this.attr("name")
          , type = ($this.attr("type") || "").toLowerCase()

          if(name){
            if(type === "checkbox")
              $this.prop("checked", values[name])
            else if(type == "radio"){
              var val = $this.val()
              $this.prop("checked", val == values[name])
            }
            else
              $this.val(values[name])
          }
      })

    }

  };


  $.fn.extend({
      form: function(option, args){
        var $this = $(this)
        , data = $this.data('form')
        , options = $.extend({}, $.fn.form.defaults, $this.data(), typeof option == 'object' && option)
        , retVal
        if (!data) $this.data('form', (data = new Form(this, options)))
        if (typeof option == 'string') retVal = data[option](args)
        return retVal || this
      }
  });

  $.fn.form.defaults = {}

  $.fn.form.Constructor = Form

}(window.jQuery);


!function($){

  "use strict";

  var Dist = function (element, options){
    this.options = options
    this.$element = $(element)
  }

  Dist.prototype = {

    constructor: Dist

    , set: function (map) {

      var $element = this.$element

      var thisname = $element.attr("data-name")
      if(thisname && map[thisname]){
        $element.text(map[thisname])
      }

      for(var key in map){
        $("[data-name='"+key+"']", $element).text(map[key])
      }

    }

  };


  $.fn.extend({
      dist: function(option, args){
        var $this = $(this)
        , data = $this.data('dist')
        , options = $.extend({}, $.fn.dist.defaults, $this.data(), typeof option == 'object' && option)
        , retVal
        if (!data) $this.data('dist', (data = new Dist(this, options)))
        if (typeof option == 'string') retVal = data[option](args)
        return retVal || this
      }
  });

  $.fn.dist.defaults = {}

  $.fn.dist.Constructor = Dist

}(window.jQuery);


!function($){

  "use strict";

  var Cartridge = function(element, options){
    this.options = options
    this.$element = $(element)
  }

  Cartridge.prototype = {

    constructor: Cartridge

    , _load: function(ary, cb, distfn){

      var $element = this.$element, $origin = $("> .origin", $element), $clone, data

      $("> .clone", $element).remove()

      for(var i=0,l=ary.length; i<l; ++i){
        $clone = $origin.clone().removeClass("origin").addClass("clone").appendTo($element)
        data = ary[i]
        distfn($clone, data)
        cb && cb($clone, data, i)
      }

    }

    , load: function(ary, cb){

      this._load(ary, cb, function($clone, data){
          $clone.dist("set", data)
      })

    }

    , loadForm: function(ary, cb){

      this._load(ary, cb, function($clone, data){
          $clone.form("set", data)
      })

    }

  };


  $.fn.extend({
      cartridge: function(option){
        var $this = $(this)
        , data = $this.data('cartridge')
        , options = $.extend({}, $.fn.cartridge.defaults, $this.data(), typeof option == 'object' && option)
        , retVal
        if (!data) $this.data('cartridge', (data = new Cartridge(this, options)))
        if (typeof option == 'string'){
          var args = Array.prototype.slice.call(arguments, 1)
          retVal = data[option].apply(data, args)
        }
        return retVal || this
      }
  });

  $.fn.cartridge.defaults = {}

  $.fn.cartridge.Constructor = Cartridge

}(window.jQuery);


var Noah;

Noah = (function($){

  "use strict";

  var $$ = $.extend({}, {

      currentPageId: null
      , _context: {}

      , pages: function(){
        var pages = []

        $(".page").each(function(i, elem){
            var $this = $(this)
            , id = $(this).prop("id")
            , name = $(this).attr("data-name") || id

            pages.push({ id: id, name: name })
        })

        return pages
      }

      , transition: function(id, options){
        $("#"+id).page()
      }

      , open: function(id){
        $("#"+id).modal()
      }

      , send: function(pageId, k, v){
        if(!$$._context[pageId]) $$._context[pageId] = {}
        $$._context[pageId][k] = v
      }

      , context: function(k, v){
        if(v === undefined){
          if(!$$._context[$$.currentPageId]) return null
          return $$._context[$$.currentPageId][k]
        }
        $$.send($$.currentPageId, k, v)
      }

      , db: function(coll){
        return new Collection(coll)
      }

  })


  var Collection = function(coll){
    this._coll = coll
  }
  Collection.prototype = {

    _match: function(row, conds){
      var m = true
      for(var i=0,l=conds.length; i<l; ++i){
        var cond = conds[i]
        m &= cond(row)
      }
      return m
    }

    , _makeConds: function(a, b){
      var conds = []

      if(typeof a === "function") conds.push(a)
      else if(typeof b === "function") conds.push(function(row){ return b(row[a]) })
      else if(b !== undefined) conds.push(function(row){ return row[a] === b })
      else if(typeof a === "object") {
        for(var k in a){
          var v = a[k]
          if(typeof v === "function")
            conds.push(function(row){ return v(row[k]) })
          else
            conds.push(function(row){ return row[k] === v })
        }
      }
      else if(a !== undefined) conds.push(function(row){ return row.id === a })

      return conds
    }

    , getN: function(n){
      var coll = this._coll, ret = []

      n = n || coll.length
      for(var i=0,l=coll.length; (i<l) && (i<n); ++i){
        ret.push($.extend({}, coll[i]))
      }
      return ret
    }

    , get1: function(){
      return (this._coll.length > 0) ? $.extend({}, this._coll[0]) : null
    }

    , get: function(){
      return this.getN()
    }

    , whereN: function(n, k, v){
      var conds = this._makeConds(k, v)
      var coll = this._coll, newColl = []

      for(var i=0,acc=0,l=coll.length; (i<l) && (acc<n); ++i){
        var row = coll[i]
        if(this._match(row, conds)){
          newColl.push(row)
          ++acc
        }
      }

      this._coll = newColl

      return this
    }

    , where1: function(k, v){
      return this.whereN(1, k, v)
    }

    , where: function(k, v){
      var conds = this._makeConds(k, v)
      var coll = this._coll
      var that = this

      this._coll = coll.filter(function(row){
          return that._match(row, conds)
      })

      return this;
    }

    , join: function(coll2, f, foreginKey){
      var coll = this._coll

      if(foreginKey !== undefined){
        var key = f
        f = function(row1, row2){ return row1[key] == row2[foreginKey] }
      }

      if(typeof f !== "function"){
        var key = f
        f = function(row1, row2){ return row1[key] == row2[key] }
      }

      this._coll = coll.map(function(row){
        return $.extend({}, row, $$.db(coll2).where1(function(row1){
          return f(row1, row)
        }).get1())
      })

      return this
    }

    , attach: function(name, coll2, f, foreginKey){
      var coll = this._coll

      if(foreginKey !== undefined){
        var key = f
        f = function(row1, row2){ return row1[key] == row2[foreginKey] }
      }

      if(typeof f !== "function"){
        var key = f
        f = function(row1, row2){ return row1[key] == row2[key] }
      }

      this._coll = coll.map(function(row){
        var attachment = {}
        attachment[name] = $$.db(coll2).where(function(row1){
          return f(row1, row)
        }).get()
        return $.extend({}, row, attachment)
      })

      return this
    }

    , each: function(f){
      var coll = this._coll, newColl = []

      for(var i=0,l=coll.length; i<l; ++i){
        newColl.push(f(coll[i]))
      }

      this._coll = newColl

      return this
    }

    , fold: function(f, acc){
      var coll = this._coll

      for(var i=0,l=coll.length; i<l; ++i){
        acc = f(coll[i], acc)
      }

      return acc
    }

    , max: function(key){
      return this.fold(function(row, acc){
          if(acc === undefined) return row[key]
          return (acc > row[key]) ? acc : row[key]
      })
    }

    , min: function(key){
      return this.fold(function(row, acc){
          if(acc === undefined) return row[key]
          return (acc < row[key]) ? acc : row[key]
      })
    }

    , sum: function(key){
      return this.fold(function(row, acc){
          return acc + row[key]
      }, 0)
    }

    , select: function(k){
      var coll = this._coll
      if(!(k instanceof Array)) k = [k]
      var newColl = []

      for(var i=0,l=coll.length; i<l; ++i){
        var row = coll[i]
        var newRow = {}
        for(var j=0,m=k.length; j<m; ++j){
          var key = k[j]
          newRow[key] = row[key]
        }
        newColl.push(newRow)
      }

      this._coll = newColl
      return this
    }

    , insert: function(row){
      this._coll.push(row)
      return this
    }

    , update: function(row){
      var coll = this._coll
      for(var i=0,l=coll.length; i<l; ++i){
        $.extend(coll[i], row)
      }
      return this
    }

    , _delete: function(coll, conds){

      var m = this._match

      function d(coll, begin){
        var i = begin, l=coll.length
        for( ; i<l; ++i){
          if(m(coll[i], conds)){
            coll.splice(i, 1)
            return i
          }
        }
        return -1
      }

      var begin = 0
      while((begin = d(coll, begin, conds)) >= 0)
        ;

    }

    , delete: function(k, v){
      this._delete(this._coll, this._makeConds(k, v))
      return this
    }

  }

  $(function(){

      $(".page").on("show", function(e){
          var currentPageId = $$.currentPageId
          var $this = $(this), id = $this.attr("id")
          if(currentPageId === id){
            return
          }
          if(currentPageId) $("#"+currentPageId).page("hide")
          $$.currentPageId = $(this).attr("id")
      })

      $(".transition").live("click", function(e){
          e.preventDefault()
          e.stopPropagation()
          $$.transition($(this).attr("data-target"))
      })

      $(".open").live("click", function(e){
          e.preventDefault()
          e.stopPropagation()
          $$.open($(this).attr("data-target"))
      })

      $(".page:first").page()

  })

  return $$;

})(window.jQuery);
