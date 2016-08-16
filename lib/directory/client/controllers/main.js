define(['BaseView', 'text!TemplatesBreadcrumb'],
	function(BaseView, tplBreadcrumb){

	var CLASS_ACTIVE = 'active';
	var CLASS_OPEN = 'open';
	var height = $(window).height();
	var menuHeight = height - 46;
	var contentHeight = height - 87;

	var View = BaseView.extend({
		events: {
			'click #js_nav > li': 'menu',
			'click .js_submenu li': 'submenu',
			'click #js_light': 'light'
		},
		menu: function(e){
			var $el = $(e.currentTarget);
			var $parent = $el.parent();
			var $elBreadcrumbs = $('#js_breadcrumbs');
			var isSubmenu = $el.data('issubmenu');
			var title = $el.data('title');
			var list = [title];

			if(!isSubmenu) {
				$parent.find('li').removeClass(CLASS_ACTIVE).removeClass(CLASS_OPEN);
				$el.addClass(CLASS_ACTIVE);
				$elBreadcrumbs.html(_.template(tplBreadcrumb)({'list': list}));
				this.createIframe($el.data('url'));
			} else {
				if($el.hasClass(CLASS_OPEN)){
					$el.removeClass(CLASS_OPEN);
				} else {
					$el.addClass(CLASS_OPEN);
				}
			}
		},
		submenu: function(e){
			e.stopPropagation(); // 阻止事件冒泡
			var $el = $(e.currentTarget);
			var $parent = $el.parents('li');
			var $parents = $el.parents('#js_sidebar');
			var $elBreadcrumbs = $('#js_breadcrumbs');
			var title = $parent.data('title');
			var subTitle = $el.data('title');
			var url = $el.data('url');
			var list = [title, subTitle];

			$parents.find('li').removeClass(CLASS_ACTIVE).removeClass(CLASS_OPEN);
			$parent.addClass(CLASS_ACTIVE).addClass(CLASS_OPEN);
			$el.addClass(CLASS_ACTIVE);
			$elBreadcrumbs.html(_.template(tplBreadcrumb)({'list': list}));
			this.createIframe(url);
		},
		light: function(e){
			var $el = $(e.currentTarget);

			if($el.hasClass(CLASS_OPEN)){
				$el.removeClass(CLASS_OPEN);
			} else {
				$el.addClass(CLASS_OPEN)
			}
		},
		createIframe: function(url){
			var self = this;
			// 创建内容页
			var iframe = $('<iframe id="js_iframe" scrolling="auto" frameborder="0" marginwidth="0" marginheight="0" width="100%" height="'+ contentHeight +'" allowTransparency="true"></iframe>');

            // 开始请求iframe
            iframe.attr("src", url);
            // iframe.one("load", function () {
            // 	var height = Math.max(this.contentWindow.document.body.scrollHeight, this.contentWindow.document.documentElement.scrollHeight);

            // 	$(this).css({
            // 		'height': height
            // 	});
            // });
            $('#js_page_content').html(iframe);
		},
		render: function(html) {
            this.$el.html(html);
        },
        execAjax: function(){
        },
        setStyle: function(){
        	var $elBody = $('body');
        	var $elMenu  = $('#js_sidebar');

        	$elBody.css({
        		'height': height
        	});
        	$elMenu.css({
        		'height': menuHeight
        	});
        },
		onShow: function(){
			this.setStyle();
		}
	});

	new View();
});
