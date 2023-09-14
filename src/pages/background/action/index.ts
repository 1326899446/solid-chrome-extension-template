// import { handleAction } from "./action";
// import { sendMessageToContent } from "./utils";
// let index = true;
// chrome.webRequest.onBeforeRequest.addListener(
//   function (details) {
//     const { url: oriUrl, initiator } = details;
//     const url = decodeURIComponent(oriUrl);

import { extractUrl } from './utils';

//     console.log(url, initiator);
//     if (url === "https://www.baidu.com/" && index) {
//       index = false;
//       chrome.tabs.create({ url: `https://www.baidu.com` });
//       return { redirectUrl: "https://www.baiduaaa.com" };
//     }

//     return { cancel: true };
//     if (url.includes("http://action") || url.includes("action:")) {
//       const reg = /action:(\d+)/gi;
//       const action = reg.exec(url)?.[1];
//       handleAction(action, url, initiator);
//     } else if (url === "https://__bridge_loaded__/") {
//       // 向 content 发送加载 script消息
//       sendMessageToContent({
//         action: "load",
//         payload: "bridge/ios_bridge.js",
//       });
//       return { redirectUrl: "javascript:" };
//       // 应该是 ios 特有的，是bridge的真正执行脚本，会在window上挂载 WebViewJavascriptBridge
//     }
//     console.log("wwwwwwwwwwwwwwwwww");

//     //
//   },
//   { urls: ["<all_urls>"] }
// );

export const handleAction = (action, url, initiator) => {
    switch (action) {
      case "10061": {
        // 如果有url= 则优先尝试在新标签页打开此url的开发环境页面/xxx.htm或者/xxx.html
        if (url.includes("url=")) {
          console.log("新标签页面跳转：", url);
          const htmlUrl = extractUrl(url);
          if (htmlUrl.includes("html")) {
            // .html的页面直接是origin+页面名称
            const arr = htmlUrl.split("/");
            const last = arr[arr.length - 1];
            chrome.tabs.create({ url: `${initiator}/${last}` });
          } else {
            // svn页面直接跳完整路径
            chrome.tabs.create({ url: `${initiator}/${htmlUrl}` });
          }
        } else {
          console.log("拦截页面跳转：", url);
        }
        return ;
      }
      case "10090":{
        return {
            jsfuncname:"",
            params:"aa"
        }
      }
      default :{
        return ;
      }
    }
  };