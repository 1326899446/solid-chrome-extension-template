// 获取当前激活的tab
chrome.tabs.query({ active: true, currentWindow: true });

// storage

// local
chrome.storage.local.set({ key: value }).then(() => {
    console.log("Value is set");
  });
  
  chrome.storage.local.get(["key"]).then((result) => {
    console.log("Value currently is " + result.key);
  });
  
  //sync
  chrome.storage.sync.set({ key: value }).then(() => {
    console.log("Value is set");
  });
  
  chrome.storage.sync.get(["key"]).then((result) => {
    console.log("Value currently is " + result.key);
  });
  
  //session
  chrome.storage.session.set({ key: value }).then(() => {
    console.log("Value was set");
  });
  
  chrome.storage.session.get(["key"]).then((result) => {
    console.log("Value currently is " + result.key);
  });

  chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(
        ` "${namespace}" 区域 有一个属性"${key}" 发生了变化`,
        `旧值为 "${oldValue}",新值为"${newValue}".`
      );
    }
  });
  

  // tabs
  chrome.tabs.create({
    url: "newtab.html"  // 相对于background脚本的路径下需要有一个newtab.html文件
  });

  async function getCurrentTab() {
    // 会有多个浏览器的情况吗，就会有多个激活的窗口，currentWindow可以选中当前window
    let queryOptions = { active: true , currentWindow:true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab;
  }
  chrome.tabs.sendMessage(  
    tabId,  // 目标tab的id
    message,  // 发送信息
    options, // 其他配置项
    callback,  // 回调函数
)
chrome.tabs.update(  
    tabId,
    updateProperties,  
    callback,  
  ) 
// 缩放比
chrome.tabs.setZoom(  
    tabId,  
    zoomFactor,  // 缩放比例
    callback,  
  )

  

  
