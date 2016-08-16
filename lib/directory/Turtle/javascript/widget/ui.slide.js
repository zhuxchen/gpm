define(['UILayer'], function (UILayer) {

	var UISlide = UILayer.extend({
        initDefauleConfig: function(){
            this.attrs = {
				template: '<div class="ui-silder-wrap">' +
							'<ul class="ui-silder">'+
								'<% if (model.interval > 0) { %>' +
									'<li data-index="<%= model.items.length -1 %>" data-label="<%= model.items[model.items.length -1].label%>"><img src="<%= model.items[model.items.length -1].src %>" delay-src="<%= model.items[model.items.length -1].src %>"  /></li>' +
								'<% } %>' +
								'<% _.each(model.items, function(item, i) { %>' +
									'<li data-index="<%= i %>" data-label="<%= item.label%>"><img src="<%= item.src %>" delay-src="<%= item.src %>" /></li>' +
								'<% }) %>' +
								'<% if (model.interval > 0) { %>' +
									'<li data-index="0" data-label="<%= model.items[0].label %>"><img src="<%= model.items[0].src %>" delay-src="<%= model.items[0].src %>" /></li>' +
								'<% } %>' +
							'</ul>'+
							'<div class="ui-silder-remark">'+
								'<% if (model.isLabel) { %>' +
									'<p class="ui-silder-label"><%= model.items[model.index].label %></p>' +
								'<% } %>' +
								'<% if(model.items.length > 1) { %>' +
                                '<ul class="ui-silder-indicator">' +
                                    '<% _.each(model.items, function(item, i) { %>' +
                                        '<li data-index="<%= i %>" class="<%= i == model.index ? "ui-silder-active" : "" %>"></li>' +
                                    '<% }) %>' +
                                '</ul>' +
                                '<% } %>' +
							'</div>'+
					  '</div>',
				model:{
					index: 0,
					interval: 0,
					preinstalled: '',
					isLabel: false,
					indicatorClass: 'ui-silder-active',
					items:[]
				},
				parentNode: document.body,
		        needReposition: false,
		        maskParam: {
		            needMask: false,
		            maskToHide: false
		        }
			};
            this.events = {
            	'touchstart .ui-silder-wrap': 'start',
            	'touchmove .ui-silder-wrap': 'move',
            	'touchend .ui-silder-wrap': 'end'
            };
        },
        setOption: function () {
            var slideParam = this.attrs.slideParam;

            for (var k in slideParam) {
                this[k] = slideParam[k];
            }
        },
        setup: function () {
        	this.render();
            this.setOption();
            this.initSilder();
            this.initLayout();
        },
        initLayout: function (){
        	// 重写父类布局
        	var width = this.$el.parent().width();

        	this.elWidth = width;
        	this.$elSilder.css({width: width * this.sum, left: this.interval > 0 ? -width : 0});
        	this.$el.find('.ui-silder li').css({width: width});
        },
        initSilder: function(){
        	var interval = this.attrs.model.interval,
        		index = this.attrs.model.index;

        	this.$elSilder = this.$el.find('.ui-silder');
        	this.$elSilderLi = this.$elSilder.find('li');
        	this.$elLabel = this.$el.find('.ui-silder-label');
        	this.$elIndicatorLi = this.$el.find('.ui-silder-indicator li');

        	this.sum = this.$elSilderLi.length;
        	this.interval = interval;
        	this.startIndex = interval > 0 ? index + 1 : index;
        	this.endIndex = interval > 0 ? this.sum - 2 : this.sum;
        	this.index = this.startIndex;
        },
        start: function (event) {
        	event.preventDefault(); // 阻止触摸事件的默认动作,即阻止滚屏
        	var touch = event.touches[0];

        	this.startPos = {    // 取第一个touch的坐标值
                x: touch.pageX,
                y: touch.pageY,
                time: +new Date
            };
        },
        move: function (event) {
        	event.preventDefault();
        	// 当屏幕有多个touch或者页面被缩放过，就不执行move操作
            if (event.touches.length > 1 || event.scale && event.scale !== 1) return;
            var touch = event.touches[0];

            this.endPos = {
                x: touch.pageX - this.startPos.x,
                y: touch.pageY - this.startPos.y
            };

            // 执行操作，使元素移动
            this.$elSilder.css({left: -this.index * this.elWidth + this.endPos.x});
        },
        end: function (event){
        	event.preventDefault();
        	if(!this.endPos){return;}
        	var duration = +new Date - this.startPos.time,   // 滑动的持续时间
        		endPos = this.endPos,
        		model = this.attrs.model,
        		isLabel = model.isLabel,
        		CLASS_ACTIVE = model.indicatorClass;


         	this.$elIndicatorLi.removeClass(CLASS_ACTIVE);
            if (Number(duration) > 100) {
                // 判断是左移还是右移，当偏移量大于50时执行
                if (endPos.x > 50) {
                    if(this.index !==0){
                    	this.index -= 1;
                    } 
                } else if(endPos.x < -50) {
                    if (this.index !== (this.sum - 1)){
                    	this.index += 1;
                    } 
                }
            }

            this.$elSilder.animate({left: -this.index * this.elWidth}, 200);
            if(this.index < this.startIndex) {
            	this.$elSilder.animate({left: -this.endIndex * this.elWidth}, 200);
            	this.index = this.endIndex;
            }
            if(this.index > this.endIndex) {
            	this.$elSilder.animate({left: -this.startIndex * this.elWidth}, 200);
            	this.index = this.startIndex;
            }
            if(isLabel){
            	this.$elLabel.html(model.items[this.index].label);
            }
         	this.$elIndicatorLi.eq(this.index).addClass(CLASS_ACTIVE);
        }
	});

	return UISlide;
});