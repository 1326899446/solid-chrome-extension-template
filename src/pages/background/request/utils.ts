import { nativeParams } from '../constant';
import { MapActionToServer } from './constant';

export function parseData(data) {
  // 将 a=1&b=2形式字符串解析为一个object
  if(!data){
    return {}
  }
  console.log("data", data);
  
  const dataArr = data.split("&");
  const dataObj = dataArr.reduce((pre, cur) => {
    const singleDataArr = cur.split("=");
    return {
      ...pre,
      [singleDataArr[0]]: singleDataArr[1] || "",
    };
  }, {});
  return dataObj;
}
export function replaceNativeParams(data){
  console.log(data);
  
  const res = { ...data };
  Object.keys(res).forEach((key)=>{
    const value = decodeURIComponent(data[key]);
    if(value[0]==="(" && value[value.length-1]===")" && value[1]==="$"){
      const str = value.slice(2,value.length-1)
      res[key] = nativeParams[str] || '';
    }
  })
  console.log(res);
  
  return res
}
export function sendRequestAgain({ method, url, headers, data }) {
  // 将收到的请求二次转发出去
  //http://221.6.6.237:18100
  const queryParams = getQueryParams(url);
  const targetAddress = MapActionToServer(queryParams.action || '');
  console.log("targetAddress",targetAddress);
  
  // 获取域名，第三个 / 前的内容
  let count = 0;
  let i=0; 
  for(;i<url.length;i++){
    if(url[i]==="/"){
      count++;
    }
    if(count===3){
      break;
    }
  }
  const origin = url.slice(0,i+1)
  url = url.replace(origin, targetAddress);
  
  
  let str = "";
  if (data) {
    const strArr = Object.keys(data).reduce((pre, cur) => {
      const strTemp = `${cur}=${data[cur]}`;
      return [...pre, strTemp];
    }, []);
    str = strArr.join("&");
    url = url + "&" + str;
  }
  console.log(url);
  return fetch(url, {
    method,
    headers,
    redirect: "follow",
  });
}

// 处理返回结果，将utf-8编码为base64返回
function encode(str) {
  return btoa(unescape(encodeURIComponent(str))); // "%E6%B5%8B%E8%AF%95"
}

export async function returnXHRResult(tabId, requestId, data) {
  await chrome.debugger.sendCommand({ tabId }, "Fetch.fulfillRequest", {
    requestId,
    responseCode: 200,
    responseHeaders: [
      {
        name: "Content-Type",
        value: "application/json;charset=utf-8",
      },
    ],
    // 这里要返回 base64格式的字符串
    body: encode(data),
  });
}
export async function returnScriptResult(tabId, requestId, data) {
  await chrome.debugger.sendCommand({ tabId }, "Fetch.fulfillRequest", {
    requestId,
    responseCode: 200,
    responseHeaders: [
      {
        name: "Content-Type",
        value: "text/javascript;charset=utf-8",
      },
    ],
    // 这里要返回 base64格式的字符串
    body: encode(data),
  });
}

export function getQueryParams(url) {
    const qIndex = url.indexOf("?");
    return parseData(url.slice(qIndex+1))
}