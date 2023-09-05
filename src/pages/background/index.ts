import "./action";
import "./message";

// 监听 storage 变化
chrome.storage.onChanged.addListener((changes, namespace) => {
  console.log(changes, namespace);

  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    console.log(
      ` "${namespace}" 区域 有一个属性"${key}" 发生了变化`,
      `旧值为 "${oldValue}",新值为"${newValue}".`
    );
  }
});
//

chrome.runtime.onInstalled.addListener(({ reason }) => {
  console.log(reason);

  if (reason === "install") {
  }
});
// chrome.declarativeNetRequest.
// webRequest 在v3中弃用了
// chrome.webRequest.onBeforeRequest.addListener(
//   function (details) {
//     console.log("-------------",details);

//     // alert("aaa")
//     const {url, initiator} = details;
//     console.log(url);

//     // console.log(url,initiator);

//     // chrome.tabs.create({ url: 'http://www.aa.com' });

//     return { cancel: true };
//   },
//   { urls: ["<all_urls>"] },

//   // ["blocking"]
// );
// chrome.webNavigation.onBeforeNavigate.addListener((v) => {
//   console.log(v);
//   v.url = "javascript:;";
//   // chrome.tabs.create({ url: 'http://www.aa.com' });
//   return { redirectUrl: "javascript:;" };
// });
