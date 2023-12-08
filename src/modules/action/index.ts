import { getAction, parseUrl } from "@src/tools/utils";
import { handleAction } from "./actionList";
chrome.runtime.onMessageExternal.addListener(
  async (message, sender, sendResponse) => {
    const { type, params } = message;
    console.log(
      "type",
      type,
      "message",
      message,
      "params",
      params,
      "sender",
      sender
    );
    switch (type) {
      case "action": {
        let { url } = params || {};
        // url = decodeURIComponent(url);
        const action = getAction(url);
        console.log("action",action);
        
        const res = await handleAction(action, url, sender);
        if (res) sendResponse(res);
        break;
      }
      case "login": {
        const { accountType,url, } = params;
        chrome.storage.sync.set({
          [accountType ? "weakLoginStatus" : "loginStatus"]: true,
        });
        // 直接跳转且执行回调
        const searchParams = parseUrl(url);
        const jsfuncname = searchParams?.jsfuncname?.endsWith("()")
          ? searchParams.jsfuncname.slice(0, -2)
          : searchParams.jsfuncname;
        const htmlurl = decodeURIComponent(searchParams.url ||'');  
        if(htmlurl){
          const htmlAction = getAction(htmlurl);
          handleAction(htmlAction, htmlurl, sender)
        }
        console.log("jsfuncname",jsfuncname);
        
        sendResponse({
          jsfuncname,
          params:null ,
        });
        break;
      }
      default: {
        console.log("得到一个其他类型命令", type, params);
      }
    }
  }
);
