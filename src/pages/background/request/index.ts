import { nativeFileContent, nativeParams } from '../constant';
import { getQueryParams, parseData, replaceNativeParams, returnScriptResult, returnXHRResult, sendRequestAgain } from "./utils";
const pageList = ["localhost"];
const judgeIsFetchRequest = (url) => {
  return pageList.some((str) => {
    return url.includes(str);
  });
};



function bindActiveTab(tabId: number, url: string) {
  if (!judgeIsFetchRequest(url)) {
    return;
  }
  console.log("绑定tab，允许拦截请求，");

  chrome.debugger.getTargets(async (list) => {
    // 获取当前页面的tabId
    // 绑定到想要的tab
    chrome.debugger.attach({ tabId }, "1.3", async () => {
      await chrome.debugger.sendCommand({ tabId }, "Fetch.enable", {}, () => {
        console.log("开启拦截页面请求");
      });
    });
    chrome.debugger.onEvent.addListener(async (source, method, params) => {
      console.log("请求信息",source, method, params);
      const resourceType = (params as any).resourceType;
      const {
        url,
        headers,
        postData,
        method: requestMethod,
      } = (params as any).request;
      if(resourceType === 'Script' && url.includes('/common/')){
        // 表示请求静态资源，js文件
        sendRequestAgain({
          method: requestMethod,
          url,
          data: postData,
          headers,
        })
          .then((response) => response.text())
          .then((result) => {
            returnScriptResult(tabId, (params as any).requestId, result);
          });
      }else if (url.includes("reqxml")) {
        // 接口请求
        sendRequestAgain({
          method: requestMethod,
          url,
          data: replaceNativeParams(parseData(postData)),
          headers,
        })
          .then((response) => response.text())
          .then((result) => {
            returnXHRResult(tabId, (params as any).requestId, result);
          }).catch((err)=>{
            console.log(err);
            
          });
      } else if(url.includes("reqlocal")){
        // 变量读取
        const queryParams =  getQueryParams(url);
        for(let key in queryParams){
          queryParams[key] = nativeParams[key] || '';          
        }
        returnXHRResult(tabId, (params as any).requestId, JSON.stringify(queryParams));
      }else if(url.includes("reqreadfile")){
        const queryParams =  getQueryParams(url);
        const res = {}
        for(let key in queryParams){
          res[queryParams[key]] = nativeFileContent[queryParams[key]] || '';       
        }
        returnXHRResult(tabId, (params as any).requestId, JSON.stringify(res));
      } else {
        await chrome.debugger.sendCommand(
          { tabId },
          "Fetch.continueRequest",
          params
        );
      }
    });
  });
}
chrome.runtime.onInstalled.addListener(async () => {
  // 可以实现拦截页面请求
  let queryOptions = { active: true, currentWindow: true };
  chrome.tabs.query(queryOptions, (tabs) => {
    let [tab] = tabs;
    const tabId = tab.id;
    console.log("当前tab信息", tab);
    bindActiveTab(tabId, tab.url);
  });
});
chrome.tabs.onActivated.addListener(function (activeInfo) {
  if (activeInfo.tabId) {
    chrome.tabs.get(activeInfo.tabId, function (tab) {
      console.log("新打开的tab信息", tab);
      bindActiveTab(tab.id, tab.url);
    });
  }
});
