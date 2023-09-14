chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    // 现在拦截请求，实现返回，主要拦截获取 弱账号，获取强账号请求
    // 对 占位符 形式的进行补充（未登录时置空
    // 但在这里似乎获取不到请求体
    const { url: oriUrl, initiator } = details;
    const url = decodeURIComponent(oriUrl);
    // console.log(url, initiator);

    if (url.includes("reqxml")) {
    //   console.log(details,new URL(url));
      const qIndex = url.indexOf("?");
    }

    //
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
chrome.webRequest.onResponseStarted.addListener(
  (details) => {
    console.log(details);
    
  },
  { urls: ["<all_urls>"] },
//   ["blocking"]
);
