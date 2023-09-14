// 网页中通过 message 向浏览器插件发送消息，用于实现 action 功能
// message 结构

import { handleAction } from '../action';


/**
 * type:'action',
 * params:{
 *   url:'',
 * }
 */
chrome.runtime.onMessageExternal.addListener(async (message, sender, sendResponse) => {
  const { type, params } = message;
  console.log("type",type,"message",message,"params",params);
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

  return "aa"
});