import { globalState } from './global';

export const setLocals = (params:Record<string,string>)=>{
    const curAppParams = globalState.appParams;
    const curApp = curAppParams[globalState.app];
    const newAppLocals = {...curApp.locals, ...params};
    curApp.locals= newAppLocals;
    globalState.appParams = {...curAppParams, [globalState.app]: curApp};    
    chrome.storage.sync.set({appParams: globalState.appParams});
}

export const setFiles = (params:Record<string,string>)=>{
    const curAppParams = globalState.appParams;
    const curApp = curAppParams[globalState.app];
    const newAppFiles = {...curApp.files, ...params};
    curApp.files= newAppFiles;
    globalState.appParams = {...curAppParams, [globalState.app]: curApp};
    chrome.storage.sync.set({appParams: globalState.appParams});
}