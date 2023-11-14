window.MyWebView = {
  onJsOverrideUrlLoading: (url) => {
    console.log(url);
    chrome.runtime.sendMessage(
      "eidkoplpehhpomkpccndgedopkbninin",
      {
        type: "action",
        params: {
          url,
        },
      },
      (res) => {
        // TODO 完善这的代码
        const { type, jsfuncname, params } = res;
        console.log(res);
        if (type === "openDialog") {
          const { text = "", accountType } = res;
          const success = () => {
            chrome.runtime.sendMessage("eidkoplpehhpomkpccndgedopkbninin", {
              type: "login",
              params: {
                accountType,
              },
            });
            console.log(window.GoBackOnLoad());
            window.GoBackOnLoad();
          };
          const fail = () => {
            window.GoBackOnLoad();
          };
          window.createDialog(text, success, fail);
        } else if (jsfuncname) {
          if (jsfuncname && typeof window[jsfuncname] === "function") {
            window[jsfuncname](params);
          }
        }
      }
    );
  },
  callHTNativeMethod: () => {
    console.log("hello");
  },
};
window.HTJSBridge = null;
