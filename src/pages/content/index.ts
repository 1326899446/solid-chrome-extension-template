export const whitePages = ["localhost","221.6.6.237"];

export const judgeAuthority = (url) => {
  for (let i = 0; i < whitePages.length; i++) {
    if (url.includes(whitePages[i])) {
      return true;
    }
  }
  return false;
};


function injectScript(file) {
  var s = document.createElement("script");
  s.setAttribute("type", "text/javascript");
  // s.innerHTML="window.a=222"
  s.setAttribute("src", file);
  const head = document.getElementsByTagName("head")[0];
  head.insertBefore(s,head.firstChild);
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
 if(judgeAuthority(location.href)){
  console.log("base");
  chrome.storage.sync.get(["baseUrl"], async ({ baseUrl }) => {
    if (baseUrl) {
      console.log("base",baseUrl);
      injectScript(chrome.runtime.getURL('base.js'))
      await injectScript(baseUrl);
    }
  });
  
 }
 
// 初始获取开关状态和系统选择，加载对应的文件
chrome.storage.sync.get(["status"], ({ status }) => {
  if (status) {
    chrome.storage.sync.get(["os"], ({ os }) => {
      injectBridge(os);
    });
  }
});
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    switch (key) {
      case "status": {
        if (newValue) {
          chrome.storage.sync.get(["os"], ({ os }) => {
            injectBridge(os);
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
      case "os": {
        injectBridge(newValue);
        break;
      }
      case "baseUrl": {
        injectScript(newValue);
      }
    }
  }
});
