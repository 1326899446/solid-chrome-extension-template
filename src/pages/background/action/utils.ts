import { initWebviewContent } from '../constant';

export function extractUrl(url) {
  const regex = /\?(.*)/;
  const match = url.match(regex);

  if (match) {
    const queryParams = match[1]; // 提取查询参数部分
    const queryParamsArray = queryParams.split("&&"); // 将查询参数部分分割成数组

    let urlParam;

    // 遍历查询参数数组，找到包含 url= 的参数
    for (const param of queryParamsArray) {
      if (param.startsWith("url=")) {
        urlParam = param;
        break;
      }
    }

    if (urlParam) {
      const extractedUrl = urlParam.substring(4); // 去掉 url= 前缀
      if (extractedUrl.includes("url%3D")) {
        return extractUrl(decodeURIComponent(extractedUrl));
      } else {
        return extractedUrl;
      }
    } else {
      console.log("URL not found");
      return "";
    }
  } else {
    console.log("No query parameters found");
    return "";
  }
}
export const sendMessageToContent = async ({ action, payload }) => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  chrome.tabs.sendMessage(tab.id, {
    action: "click",
    payload: "i come form popop",
  });
};

export const setTabWebviewParams = (tabId, params)=>{
   chrome.storage.local.get(['webviewParams'],({webviewParams})=>{ 
      chrome.storage.local.set({webviewParams:{
        ...webviewParams,
        [tabId]:{
          ...initWebviewContent,
          ...params,
        }
      }})
    })
}

export const extractUrlParams = (url)=>{
  const regex = /\?(.*)/;
  const match = url.match(regex);

  if (match) {
    const queryParams = match[1]; // 提取查询参数部分
    const queryParamsArray = queryParams.split("&&"); // 将查询参数部分分割成数组
    let params = {};
    queryParamsArray.forEach((p)=>{
      const pArr = p.split("=");
      params[pArr[0]]=pArr[1]
    })
    return params

    
  } else {
    console.log("No query parameters found");
    return "";
  }
}
