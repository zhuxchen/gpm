工程目录结构

-- bin           项目的启动文件，也可以放其他脚本

-- client        前端
    controllers  控制器
    resoure      插件、共用组件

-- server        服务端
    models       数据模型
    rotues       路由控制器
    views        视图
      main.html  入口文件

-- template      模版
    client       前端模版
    server       后端模版
    common       前后端共用模版

-- public        用来存放静态文件
    images       图片
    css          样式
    javascript   脚本

-- dist          打包应用输出目录
-- example       静态文件例子
-- node_modules  用来存放项目的依赖库

-- Turtle        前端 mvc 框架

-- app.js        项目入口及程序启动文件
-- config.js     配置信息
-- package.json  包描述文件及开发者信息
-- README.md     项目说明文件

命令：
npm run start 启动服务
DEBUG=express:* npm run start debug模式

node app.js