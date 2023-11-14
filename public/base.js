(function(exports){
    // 创建一个对话框，参数为提示信息和两个函数
    exports.createDialog = function(message, ok, cancel){
        const fragment = document.createDocumentFragment();
        const div = document.createElement('div');
        div.classList.add('dialog');
        const p = document.createElement('p');
        p.innerText = message;
        div.appendChild(p);
        const button = document.createElement('button');
        button.innerText = '确定';
        button.addEventListener('click', ok);
        div.appendChild(button);
        const button2 = document.createElement('button');
        button2.innerText = '取消';
        button2.addEventListener('click', cancel);
        div.appendChild(button2);
        fragment.appendChild(div);
        document.body.appendChild(fragment);
    }
    // 重写appendChild方法，拦截埋点的上报，之所以这样，是因为 talkingdata:xxx 形式的链接不会被插件所拦截，也可能是我的境界不够。。。
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