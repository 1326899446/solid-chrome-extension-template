import { global } from "../data/data";
import { reqFile, reqLocal, reqMemory } from "./read";
import {
  parseData,
  replaceNativeParams,
  returnScriptResult,
  returnXHRResult,
  sendRequestAgain,
} from "./utils";
import { writeFile, writeLocal, writeMemory } from './write';

const pageList = ["localhost"];
const judgeIsFetchRequest = (url) => {
  return pageList.some((str) => {
    return url.includes(str);
  });
};
chrome.debugger.onEvent.addListener(async (source, method, params) => {
  console.log("请求信息", source, method, params);
  const { tabId } = source;
  const resourceType = (params as any).resourceType;
  const {
    url,
    headers,
    postData,
    method: requestMethod,
  } = (params as any).request;
  if (resourceType === "Script" && url.includes("/common/")) {
    // 表示请求静态资源，js文件
    sendRequestAgain({
      method: requestMethod,
      url,
      data: postData,
      headers,
    })
      .then((response) => response.text())
      .then((result) => {
        returnScriptResult(tabId, (params as any).requestId, result);
      });
  } else if (url.includes("reqxml")) {
    sendRequestAgain({
      method: requestMethod,
      url,
      data: replaceNativeParams(parseData(postData)),
      headers,
    })
      .then((response) => response.text())
      .then((result) => {
        returnXHRResult(tabId, (params as any).requestId, result);
      })
      .catch((err) => {
        console.log(err);
      });
  } else if (url.includes("reqlocal")) {
    // 变量读取
    const res = reqLocal(url);
    returnXHRResult(tabId, (params as any).requestId, res);
  } else if (url.includes("reqreadfile")) {
    const res = reqFile(url);
    returnXHRResult(tabId, (params as any).requestId, res);
  } else if (url.includes("reqreadmap")) {
    const res = reqMemory(url);
    returnXHRResult(tabId, (params as any).requestId, res);
  } else if(url.includes("reqsofttodo")){
    writeLocal(url);
    returnXHRResult(tabId, (params as any).requestId,"");
  }else if(url.includes("reqsavemap")){
    writeMemory(url);
    returnXHRResult(tabId, (params as any).requestId,"");
  }else if(url.includes("reqsavefile")){
    writeFile(url, postData)
    returnXHRResult(tabId, (params as any).requestId,"");
  }else {
    await chrome.debugger.sendCommand(
      { tabId },
      "Fetch.continueRequest",
      params
    );
  }
});
chrome.debugger.onDetach.addListener((source, reason) => {
  console.log("断开连接", source, reason);
  const { tabId } = source;
  chrome.debugger.detach({ tabId }, async () => {
    await chrome.debugger.sendCommand(
      { tabId: tabId },
      "Fetch.disable",
      {},
      () => {
        console.log("关闭拦截页面请求");
      }
    );
  });
});
function init() {
  chrome.debugger.getTargets((lists) => {
    console.log(lists);
    lists.forEach((tab) => {
      if (judgeIsFetchRequest(tab.url) && tab.tabId) {
        const tabId = tab.tabId;
        chrome.debugger.attach({ tabId }, "1.3", async () => {
          await chrome.debugger.sendCommand(
            { tabId },
            "Fetch.enable",
            {},
            () => {
              console.log("开启拦截页面请求");
            }
          );
        });
      }
    });
  });
}
function cancelListenNetwork() {
  chrome.debugger.getTargets((lists) => {
    console.log("list", lists);

    lists.forEach((tab) => {
      if (judgeIsFetchRequest(tab.url) && tab.attached) {
        const tabId = tab.tabId;
        chrome.debugger.detach({ tabId }, async () => {
          await chrome.debugger.sendCommand(
            { tabId: tabId },
            "Fetch.disable",
            {},
            () => {
              console.log("关闭拦截页面请求");
            }
          );
        });
      }
    });
  });
}
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(["switch"], ({ switch: data }) => {
    if (data) {
      init();
    }
  });
});
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  chrome.debugger.getTargets((lists) => {
    console.log(lists);
    lists.forEach((tab1) => {
      if (tab1.tabId && tab1.tabId === tab.id && !tab1.attached && global.switch) {
        if (judgeIsFetchRequest(tab.url) && tab.id) {
          const tabId = tab.id;
          chrome.debugger.attach({ tabId }, "1.3", async () => {
            await chrome.debugger.sendCommand(
              { tabId },
              "Fetch.enable",
              {},
              () => {
                console.log("开启拦截页面请求");
                 chrome.tabs.reload(tabId)
              }
            );
          });
         
        }
      }
    });
  });
  
});

// 开关状态改变时要 取消监听 网络请求
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    switch (key) {
      case "switch": {
        let queryOptions = { active: true, currentWindow: true };

        if (newValue) {
          // 打开开关
          init();
        } else {
          //关闭开关
          cancelListenNetwork();
        }
        break;
      }
    }
  }
});
