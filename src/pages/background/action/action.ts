import { extractUrl } from "./utils";

export const handleAction = (action, url, initiator) => {
  switch (action) {
    case "10061": {
      // 如果有url= 则优先尝试在新标签页打开此url的开发环境页面/xxx.htm或者/xxx.html
      if (url.includes("url=")) {
        console.log("新标签页面跳转：", url);
        const htmlUrl = extractUrl(url);
        if (htmlUrl.includes("html")) {
          // .html的页面直接是origin+页面名称
          const arr = htmlUrl.split("/");
          const last = arr[arr.length - 1];
          chrome.tabs.create({ url: `${initiator}/${last}` });
          return { redirectUrl: "javascript:" };
        } else {
          // svn页面直接跳完整路径
          chrome.tabs.create({ url: `${initiator}/${htmlUrl}` });
          return { redirectUrl: "www.baiduaaa.com" };
        }
      } else {
        console.log("拦截页面跳转：", url);
        return { redirectUrl: "javascript:" };
      }
    }
  }
};
