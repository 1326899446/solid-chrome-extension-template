window.MyWebView={
    onJsOverrideUrlLoading:(url)=>{
        chrome.runtime.sendMessage('eidkoplpehhpomkpccndgedopkbninin', {
            type:'action',
            params:{
                url,
            }
        },(res)=>{
            //对于有数据返回的 action 是通过 jsfuncname 实现调用的
            const { jsfuncname, params} = res
            window[jsfuncname](params)
        })
    },
    callHTNativeMethod:()=>{
        console.log("hello");
    }
}
window.HTJSBridge=null