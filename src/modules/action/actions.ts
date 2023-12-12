import { webviewParamsList } from '@src/pages/background/constant';
import { parseUrl } from '@src/tools/utils';
import { globalState } from '../data/global';
import { HQAddress } from '../network/constant';


const svnOrigin = "http://localhost:3004"
 
export const action10061=(url:string,initiator:string)=>{
    // 如果有url= 则优先尝试在新标签页打开此url的开发环境页面/xxx.htm或者/xxx.html
    if (url.includes("url=")) {
        const params = parseUrl(url, "&&");
        let htmlUrl = decodeURIComponent(params.url);
        if (htmlUrl.includes("url%3D")) {
          htmlUrl = decodeURIComponent(htmlUrl);
          htmlUrl = parseUrl(htmlUrl, "&&").url;
        }
        const webviewParams = {};
        webviewParamsList.forEach((p) => {
          if (params[p]) {
            webviewParams[p] = params[p];
          }
        });
        // 这些都是跳转本地的情况
        // svn 跳转线上没啥问题，毕竟也不会有新的
        if (htmlUrl.includes("html")) {
          // .html的页面直接是origin+页面名称
          
          
        } else {
          // svn页面直接跳完整路径
          chrome.tabs.create({ url: `${HQAddress}/${htmlUrl}` }, (tab) => {
            setTabWebviewParams(tab.id, webviewParams);
          });
        }
      } else {
        console.log("拦截页面跳转：", url);
      }
}