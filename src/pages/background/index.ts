import "./action";
import { initedMode, initedNativeParams, initedSwitchStatus, initedWebviewParams } from "./constant";
import "./message";
import "./request";
// 初始化，如果 switch 为空
chrome.storage.sync.get(['switch','mode','nativeParams','actions'],({switch:data,mode,nativeParams,actions})=>{ 
    if(typeof data !== 'boolean'){
        chrome.storage.sync.set({switch:initedSwitchStatus});
    }
    if(!mode){
        chrome.storage.sync.set({mode:initedMode})
    }
    if(!nativeParams){
        chrome.storage.sync.set({nativeParams:initedNativeParams})
    }
    if(!actions){
        chrome.storage.sync.set({actions:[]})
    }
})
chrome.storage.local.get(['webviewParams'],({webviewParams})=>{
    chrome.storage.local.set({webviewParams:initedWebviewParams})
})
