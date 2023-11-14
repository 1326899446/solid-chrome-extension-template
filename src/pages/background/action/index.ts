import { webviewParamsList } from '../constant';
import { extractUrl, extractUrlParams, setTabWebviewParams } from "./utils";

export const handleAction = (action, url, initiator) => {
  return new Promise((resolve, reject) => {
    switch (action) {
      case "10061": {
        // 如果有url= 则优先尝试在新标签页打开此url的开发环境页面/xxx.htm或者/xxx.html
      
        if (url.includes("url=")) {

          console.log("新标签页面跳转：", url);
          const htmlUrl = extractUrl(url);
          const params = extractUrlParams(url)
          const webviewParams = {}
          webviewParamsList.forEach((p)=>{
            if(params[p]){
              webviewParams[p]=params[p];
            }
          })
          if (htmlUrl.includes("html")) {
            // .html的页面直接是origin+页面名称
            const arr = htmlUrl.split("/");
            const last = arr[arr.length - 1];
            
            chrome.tabs.create({ url: `${initiator}/${last}` },(tab)=>{
              setTabWebviewParams(tab.id,webviewParams)
            });
          } else {
            // svn页面直接跳完整路径
            chrome.tabs.create({ url: `${initiator}/${htmlUrl}` },(tab)=>{
              setTabWebviewParams(tab.id,webviewParams)
            });
          }
        } else {
          console.log("拦截页面跳转：", url);
        }
        
        resolve('');
        break
      }
      case "10090": {
        resolve({
          jsfuncname: "",
          params: "aa",
        });
        break
      }
      case "10091": {
        resolve({
          jsfuncname: "",
          params: "aa",
        });
        break
      }
      default: {
        const qIndex = url.indexOf("?");
        const search = url.slice(qIndex);
        const searchParams = search.slice(1).split("&");
        const jsfuncname = searchParams
          .filter((p) => {
            return p.split("=")[0] === "jsfuncname";
          })[0]
          .split("=")[1];
        chrome.storage.sync.get(["actions"], ({ actions }) => {
          try {
            const res = JSON.parse(actions[action]?.data)
            resolve({
              jsfuncname,
              params:  res,
            });
          } catch (error) {
            resolve({
              jsfuncname,
              params:  actions[action]?.data,
            });
          }
          
        });
      }
    }
  });
};

// 网页中通过 message 向浏览器插件发送消息，用于实现 action 功能
// message 结构
/**
 * type:'action',
 * params:{
 *   url:'',
 * }
 */
chrome.runtime.onMessageExternal.addListener(async (message, sender, sendResponse) => {
  const { type, params } = message;
  console.log("type",type,"message",message,"params",params,"sender",sender);
  switch (type) {
    case "action": {
      let { url } = params || {}
      url = decodeURIComponent(url)
      const reg = /action:(\d+)/gi;
      const action = reg.exec(url)?.[1];
      const res = await handleAction(action, url, sender.origin)
      if(res) sendResponse(res)
      break;
    }
    default: {
      sendResponse("aa")
    }
  }
});
