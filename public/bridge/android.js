window.MyWebView = {
  onJsOverrideUrlLoading: (url) => {
    console.log("发现一个url载入",url);
    chrome.runtime.sendMessage(
      "pbgimoglchphmkaohjmnfaiglfejipeh",
      {
        type: "action",
        params: {
          url,
        },
      },
      (res) => {
        callback(res);
      }
    );
  },
  callHTNativeMethod: () => {
    console.log("hello callHTNativeMethod");
  },
};
if(!window.callback){
  window.callback = (res) => {
   // TODO 完善这的代码
   const { type, jsfuncname, params } = res || {};
   console.log("请求返回结果",res);
   if(type){
    window[type]?.({...res,callback});
   } else if (jsfuncname) {
     if (jsfuncname && typeof window[jsfuncname] === "function") {
       window[jsfuncname](params);
     }
   }
 };
}
window.HTJSBridge = null;
