steal.plugins(
  'jquery/class',
  'jquery/view',
  'jquery/view/ejs',
  'jquery/view/helpers',
  'form_helper')
  .then(function(){

    var underscore = $.String.underscore

    $.Class.extend('FormBuilder',{
      getFormBuilder: function(modelInstance, options){
        return new FormBuilder({model: modelInstance, viewContext: this, wrapper: options.wrapper})
      }
    },{
      init: function(options){
        this.viewContext= options.viewContext
        this.model = options.model
        this.basename = options.hasOwnProperty('basename') ? options.basename : underscore(this.model.Class.shortName)
        this.wrapper = options.wrapper
        return this
      },

      fields_for: function(basename, assoc, proc){
        // cas 1 - on cherche a retrouver le shortname de l'assoc (string ou instance(s))
        if (proc == undefined){
          proc = assoc ;
          assoc = basename ;
          if (typeof assoc == 'string'){
            assoc = this.model.attr(assoc);
            // on garde le basename en l'état
          } else if ($.isArray(assoc) && assoc.length > 0){
            basename = assoc[0].Class.shortName
          } else {
            basename = assoc.Class.shortName
          }
        }
        basename = this.basename + '['+ basename+']';

        if($.isArray(assoc)){
          var self = this;
          for(var i = 0; i < assoc.length; i++){
            this._renderFieldsFor(assoc[i],basename, proc, i)
          }
        } else {
          this._renderFieldsFor(assoc,basename, proc)
        }
      },

      // internal render the fields_for proc on the new instance with the basename provided as argument
      _renderFieldsFor: function(instance, basename, proc, index){
        var builder = new FormBuilder({model: instance, basename: basename, viewContext: this.viewContext, wrapper: this.wrapper })
        return proc.call(this.viewContext, builder, index)
      },

      // proxy the attr model function
      attr: function(name){
        return this.model.attr(name)
      }

    })



    $.each(['select','hidden_field','check_box','text_field', 'password_field', 'text_area',''], function(i,fn){
      FormBuilder.prototype[fn] = function(){
        var args = $.makeArray(arguments),
            wrapper;

        if (args[args.length-1].constructor == Object && args[args.length-1].hasOwnProperty('wrapper')){
          wrapper = args[args.length-1]['wrapper'];
          delete args[args.length-1]['wrapper'];
        } else if (this.wrapper){
          wrapper = this.wrapper
        }

        if (wrapper && fn != 'hidden_field'){
          return $.View(wrapper, {
            input: this.viewContext[fn].apply(this.viewContext, [this].concat(args)),
            builder: this,
            model: this.model,
            property: args[0],
            options: (args[args.length-1].constructor == Object) ? args[args.length-1] : {}
          })
        }else{
          return this.viewContext[fn].apply(this.viewContext, [this].concat(args))
        }


      }
    });

    $.extend($.EJS.Helpers.prototype, {getFormBuilder: FormBuilder.getFormBuilder});
  });