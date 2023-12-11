
export const setLocals = (curApp,curAppParams,params:Record<string,string>)=>{
    const newAppLocals = {...curAppParams.locals, ...params};
    curAppParams.locals = newAppLocals;
    chrome.storage.sync.get(['appParams'],({appParams})=>{  
        chrome.storage.sync.set({appParams: {...appParams,[curApp]:curAppParams}});
    });
    
}

export const setFiles = (curApp,curAppParams,params:Record<string,string>)=>{
    const newAppFiles = {...curAppParams.files, ...params};
    curAppParams.files = newAppFiles;
    chrome.storage.sync.get(['appParams'],({appParams})=>{  
        chrome.storage.sync.set({appParams: {...appParams,[curApp]:curAppParams}});
    });
}