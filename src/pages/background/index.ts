import "./action";
import { initedMode, initedNativeParams, initedSwitchStatus } from "./constant";
import "./message";
import "./request";
// 初始化，如果 switch 为空
chrome.storage.sync.get(['switch','mode','nativeParams'],({switch:data,mode,nativeParams})=>{ 
    if(typeof data !== 'boolean'){
        chrome.storage.sync.set({switch:initedSwitchStatus});
    }
    if(mode){
        chrome.storage.sync.set({mode:initedMode})
    }
    if(!nativeParams){
        chrome.storage.sync.set({nativeParams:initedNativeParams})
    }
})
