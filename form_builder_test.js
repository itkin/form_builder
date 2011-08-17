steal
  .plugins(
	"jquery/class",
	'jquery/controller',
	'jquery/model',
  'jquery/model/associations',
	'funcunit',
  'jquery/dom/form_params',
	'jquery/view',
  'form_builder')
  .then(function(){

    $.Controller.extend('Cntrlr', {
      init : function(){
        this.element.html($.View('form', {blog: blog}))
      }
    });

    $.Model.extend("BlogPost",{
      attributes : {
        title        : 'string',
        lead         : 'text',
        body         : 'text',
        is_published : 'boolean',
        status       : 'string',
        tags         : 'array',
        author       : 'string'
      },
      init: function(){
        this.hasMany('Comment', 'comments')
      }

    }, {});
    $.Model.extend('Comment',{
      attributes: {
        text: "text"
      },
      init: function(){
        this.belongsTo('User', 'user')
      }
    },{});

    $.Model.extend('User', {
      attributes: {
        name: 'string'
      }
    },{})

    blog = new BlogPost({
      title:'my title',
      lead: 'myLead',
      password:"MyPassord",
      is_published: true,
      comments: [{id:1, text:"myComment", user: {name: 'nicolas'} }]
    });

    module("form_builder test", {
      setup: function(){
        $('<div id="content"></div>').appendTo($("#qunit-test-area"));
        $('#content').cntrlr();
      }
    });

    test("fields helpers", function(){
      equals($("form input:eq(0)").val(), blog.title,"text_field value is not properly defined");
      equals($("form input:eq(0)").attr('name'), 'blog_post[title]', "input names are properly set")
      equals($("form .comments input:first").attr('name'), 'blog_post[comments][id]', "basename is incremented as expected")
      equals($("form .comments input:last").attr('name'), 'blog_post[comments][user_attributes][name]', "fields_for allow custom basename")
    });

    test('wrapper templates', function(){
      equals($("form input:eq(0)").parent().attr('class'),'field', "default builder wrapper is output")
      equals($('form input[type="checkbox"]:first').next()[0].tagName, 'LABEL', "alternate test wrapper is output")
    })


})