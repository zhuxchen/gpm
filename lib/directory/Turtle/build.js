({
    baseUrl: "javascript",
	paths:{
		"R": "libs/require",
		//"$": "libs/zepto",
		"jquery": "libs/jquery-1.12.1",
		//"F": "libs/fastclick",
		"_": "libs/underscore",
		"Class": "libs/class",
		"text": "libs/require.text",

		"Storage": "framework/storage",
		"ajax": "framework/ajax",
		"model": "framework/model",
		"Turtle": "framework/turtle",

		"HeaderView": "framework/headerView",
		"BaseView": "framework/baseView",

		"Widget": "widget/widget",
		"UIMask": "widget/ui.mask",
		"UILayer": "widget/ui.layer",
		"UIToast": "widget/ui.toast",
		"UIDialog": "widget/ui.dialog",
		"UISlide": "widget/ui.slide"
	},
	shim:{
		"R": {
	        exports: "require"
	    },
		"_": {
	        exports: "_"
		},
		"Class": {
	        exports: "Class"
		},
		"Turtle": {
	        exports: "Turtle"
	    }
	},
    name: "main",
    optimize: "none", //uglify
    //out: "../dev/exiuyang/resource/javascript/turtle.js"
    out: "../public/javascript/Turtle.js"
})