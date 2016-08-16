/**
 *  <header class="ec-header">
 *		<div class="ec-title">
 *			<ul class="ec-title-list clearfix">
 *				<li data-url="tab_discover_team.html"><h3>头部</h3></li>
 *				<li class="ec-unActive" data-url="tab_discover_ta.html"><h3>Ta</h3></li>
 *			</ul>
 *		</div>
 *		<a class="ec-pull-left" ><i class="ec-icon ec-icon-user"></i></a>
 *		<span class="ec-pull-right" ><i class="ec-icon ec-icon-filter"></i></span>
 *	</header>
 *
 * @example
 *    {
 *      view : [scope],
 *		leftHandler:[{
 *	        className : "className",
 *          title : "文字1",
 *          value : "文字",
 *          event:function(){
 *
 *          }
 *      }],
 *      centerHtml:"html", //横向，纵向. 默认横向
 *      centerHandler:[{
 *			value:"文字1html",
 *          className : "className",
 *          event:function(){}
 *      },{
 *	        value:"文字2html",
 *          className : "className",
 *          event:function(){}
 *      }],
 *      rightHandler:[{
 *			className : "className",
 *			value : "文字",
 *          event:function(){
 *
 *          }
 *      }]
 *    }
 */
define([], function () {
    var HeaderView = Class.extend({
        init: function () {
        },
        set: function (opt) {
            this.data = opt;
            this.parent = { $el: $("#header") }; // 指定父类
            this.$el = $('<div class="headerView"></div>');
            //this.$el.hide();

            if (this.data) {
                this.render();
                this.bindEvent();
                this.headerBindEvent();
            }
        },
        render: function () {
            //移除旧的headerview.
            $("#headerView").remove();
            this.renderLeft();
            this.renderCenter();
            this.renderRight();
            this.parent.$el.html(this.$el);
        },
        renderLeft: function(){
            var leftData = this.data.leftHandler;
            if (!leftData || !leftData.length) return;
            var baseValueTpl = '<a class="ec-pull-left ec-text"><%=value%></a>';
            var baseIconTpl = '<span class="headerRerurn ec-pull-left"><i class="returnIco" ></i></span>';
            var self = this;
            leftData.forEach(function (item) {
                var html = "";
                if (item.value) {
                    html = _.template(baseValueTpl, {
                        value: item.value
                    });
                } else {
                    // if (item.className) {
                    //     html = _.template(baseIconTpl, {
                    //         className: item.className
                    //     });
                    // }
                    html = _.template(baseIconTpl)();
                }
                self.$el.append(html);
            });
        },
        renderCenter: function(){
            var centerData = this.data.centerHandler;
            var centerHtml = this.data.centerHtml;
            if ((!centerData || !centerData.length) && !centerHtml) return;
            var baseTitleTpl = '<h1 class="ec-title"><%=title%></h1>';
            var baseValueTpl = '<div class="ec-title"><h1 class="ec-title-text"><%=value%></h1></div>';
            var baseListTpl = ['<div class="ec-title">',
				'<ul class="ec-title-list clearfix">',
				'<%data.forEach(function(item, idx){%>',
				'<li class="<%=item.className%>" dtaa-index="<%=idx%>"><h3><%=item.value%></h3></li>',
				'<%})%>',
				'</ul>',
				'</div>'
            ].join("");
            var self = this;
            //var baseTwoTpl = ['<h1 class="ec-title-line">回复<p class="ec-title-line-tag">长腿偶吧</p></h1>'].join("");
            if (centerHtml) {
                this.$el.append(centerHtml);
            } else {
                if (centerData.length) {
                    var html = "";
                    switch (centerData.length) {
                        case 1:
                            centerData = centerData[0];
                            if (centerData.title) {
                                html = _.template(baseTitleTpl, {
                                    title: centerData.title
                                });
                            } else {
                                if (centerData.value) {
                                    html = _.template(baseValueTpl, {
                                        value: centerData.value
                                    });
                                }
                            }
                            break;
                        case 2:
                            html = _.template(baseListTpl, {
                                data: centerData
                            });
                            break;
                    }
                    self.$el.append(html);
                }
            }
        },
        renderRight: function(){
            var rightData = this.data.rightHandler;
            if (!rightData || !rightData.length) return;
            var baseValueTpl = '<a class="ec-pull-right ec-text"><%=value%></a>';
            var baseIconTpl = '<span class="ec-pull-right addCar"><i class="<%=className%>"></i></span>';
            var self = this;

            rightData.forEach(function (item) {
                var html = "";
                if (item.value) {
                    html = _.template(baseValueTpl, {
                        value: item.value
                    });
                } else {
                    if (item.className) {
                        html = _.template(baseIconTpl, {
                            className: item.className
                        });
                    }
                }
                self.$el.append(html);
            });
        },
        headerBindEvent: function () {
            var self = this;
            $(document).off("header:left");
            $(document).off("header:center");
            $(document).off("header:right");
            $(document).on("header:left",function(e,data){
                var handler = self.data.leftHandler.length ? self.data.leftHandler[data.index].event : function(){};
                handler && handler();
            });
            $(document).on("header:center", function (e, data) {
                var handler = self.data.centerHandler.length ? self.data.centerHandler[data.index].event : function () { };
                handler && handler(e);
            });
            $(document).on("header:right", function (e, data) {
                var handler = self.data.rightHandler.length ? self.data.rightHandler[data.index].event : function () { };
                handler && handler(e);
            });
        },
        bindEvent: function () {
            var self = this;
            var currentWindow = window;
            var emptyHandler = function () { };
            this.$el.delegate('.ec-pull-left', 'click', function (event) {
                $(document).trigger("header:left", {
                    index: 0
                });
            });
            this.$el.delegate('.ec-title', 'click', function (event) {
                var target = event.target;
                var index = 0;
                if (target.tagName.toLowerCase() === "li") {
                    inedx = $(target).attr("data-index");
                }
                $(document).trigger("header:center", {
                    index: index
                });
            });
            this.$el.delegate('.ec-pull-right', 'click', function (event) {
                $(document).trigger("header:right", {
                    index: 0
                });
            });
        },
        updateHeader: function (data) {
            this.data = _.extend(this.data);
        },
        show: function () {
            this.$el.show();
        }
    });

    return HeaderView;
});