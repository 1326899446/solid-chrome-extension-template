(function(exports){
    const parent = window.document.head || window.document.body;
    const appendChildPre = parent.__proto__.appendChild;
    parent.appendChild=(child)=>{
        if(child.tagName.toLowerCase() === "iframe" && child.src.includes('talkingdata')){
            console.log("发现一个埋点上报，修改上报地址",`${child.src.replace(/:/g,'*')}`);
            child.src = `${child.src.replace(/:/g,'*')}`
        }
        appendChildPre.call(parent, child)
    }
})(window)