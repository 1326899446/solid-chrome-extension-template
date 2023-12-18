# 后台运行的插件主线程


插件功能实现的核心部分

入口为index.html，其中声明了一个module类型的script，以实现动态import plugin

监听页面发来的消息，并调用对应的plugin处理
