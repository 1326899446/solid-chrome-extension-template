<div align="center">
<h1> 涨乐开发环境模拟插件 </h1>
</div>


## Intro
针对涨乐业务开发中环境与标准浏览器不一致的问题提供的模拟插件，目前支持的功能有：
- 模拟站内环境
  - Android
  - iOS
- 模拟三方展业环境（待开发）

## Features 
- [站内Bridge模拟]
  - [Android]()
  - [iOS]()
- [站内action模拟]()
- [站内读写能力模拟]()

## Installation 
chrome或edge浏览器通过开发者模式加载插件包
firefox未经测试

### Procedure
1. 打开浏览器扩展程序页面
2. 配置启用插件的url匹配规则，或者套用我们提供的预设规则
3. 插件会自动加载预设的action plugins，如果需要自定义action plugin，可以在插件配置页面进行配置
4. 配置需要使用的本地变量
5. 检查当前window对象是否有`window.HTJSBridge`(iOS)或`window.MyWebView`(Android)变量，如果有代表插件已经正常工作


### Development
1. clone本项目
2. Yarn安装依赖
3. yarn dev启动调试模式
4. 通过浏览器扩展程序页面加载本项目的dist目录

   <img src="./readme/如何手动加载插件.png" width="400"/>

5. 修改代码之后在浏览器扩展程序页面重新加载插件即可

   <img src="./readme/重新加载插件.png" width="400"/>

#### Project Structure
- public
  - 图标、manifest.json等无需打包的资源
- src
  - assets
    - img 会被打包的图片资源
    - style 会被打包的样式资源
  - modules
    - 功能模块
  - pages
    - 插件自身的页面
  - tools
    - 工具函数

#### Execution Flow

浏览器插件被加载之后会自动执行background.html、content.js
点开插件图标会加载popup.html，点击插件配置会跳转options.html

1. background.html（类似于service worker）
   - 插件安装之后会自动执行的脚本，用于初始化插件
   - 下载配置文件，包含以下配置项
     - 需要工作的url匹配规则
     - 需要加载的action plugins
     - 需要加载的本地变量
   - 拦截请求，根据插件是否启用规则判断是否需要拦截
   - 执行其他模块传来的msg消息

2. content.js
   - 注入bridge到当前页面DOM对象

3. bridge
   - 被调用的时候发送msg到background.html
   - 拦截location.href以实现action调用

4. options.html
   - 独立tab的插件配置页面

5. popup.html
   - 弹窗式插件配置页面

## Release
1. yarn build
2. 上传到git服务器
