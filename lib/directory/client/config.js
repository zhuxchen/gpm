(function(){

	var baseUrl = Turtle.baseUrl;
    var isDebug = false;

	var config = {
        paths: {
            'TemplatesBreadcrumb': baseUrl + 'common/tpl_breadcrumb.html'
        }
    };

    if (isDebug) {
        config.urlArgs = "v=" + Date.now();
    }

    require.config(config);
})();
