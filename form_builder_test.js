steal.plugins('funcunit').then(function(){

    module("form_builder test", {
      setup: function(){
        S.open('//form_builder/form_builder.html')
      }
    });

    test("fields helpers", function(){
      equals(S("form input:eq(0)").val(), "my title", "text_field value is not properly defined");
      equals(S("form input:eq(0)").attr('name'), 'blog_post[title]', "input names are properly set")
      equals(S("form .comments input:first").attr('name'), 'blog_post[comments][id]', "basename is incremented as expected")
      equals(S("form .comments input:last").attr('name'), 'blog_post[comments][user_attributes][name]', "fields_for allow custom basename")
    });

    test('wrapper templates', function(){
      ok(S("form .field").exists(), "default builder wrapper is output")
      ok(S('form .field.checkbox').exists(), "alternate test wrapper is output")
    })


})