function injectScript(file) {
  var s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  // s.innerHTML="window.a=222"
  s.setAttribute("src", file);
  document.documentElement.appendChild(s);
}
function injectIOSBridge() {
  injectScript(chrome.runtime.getURL("bridge/ios.js"));
}
function injectAndroidBridge() {
  injectScript(chrome.runtime.getURL("bridge/android.js"));
}
function injectBridge(mode) {
  if (mode === "Android") {
    injectAndroidBridge();
  } else if (mode === "IOS") {
    injectIOSBridge();
  }
}

 // 注入工具脚本
 injectScript(chrome.runtime.getURL("base.js"));
// 初始获取开关状态和系统选择，加载对应的文件
chrome.storage.sync.get(["switch"], ({ switch: data }) => {
  if (data) {
    chrome.storage.sync.get(["mode"], ({ mode }) => {
      injectBridge(mode);
    });
  }
});
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    switch (key) {
      case "switch": {
        if (newValue) {
          chrome.storage.sync.get(["mode"], ({ mode }) => {
            injectBridge(mode);
          });
        } else {
          var th = document.getElementsByTagName("body")[0];
          var s = document.createElement("script");
          s.setAttribute("type", "text/javascript");
          // s.innerHTML="window.a=222"
          s.innerText = "window.MyWebView=null;window.HTJSBridge=null";
          // s.setAttribute('src', file);
          th.appendChild(s);
          // 删除 bridge
        }
        break;
      }
      case "mode": {
        injectBridge(newValue);
      }
    }
  }
});
