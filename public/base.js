(function(exports){
    // 创建一个对话框，参数为提示信息和两个函数
    const createDialog = function(message, ok, cancel){
        const fragment = document.createDocumentFragment();
        const div = document.createElement('div');
        div.id="dialog";
        div.style.position = 'fixed';
        div.style.left = '0';
        div.style.top = '40%';
        div.style.width = '100%';
        div.style.height = '150px';
        div.style.zIndex="9999";
        div.style.backgroundColor = '#ffffff';
        const p = document.createElement('p');
        p.style.textAlign = 'center';
        p.style.fontSize = '24px';
        p.innerText = message;
        p.style.height='100px';
        div.appendChild(p);
        const buttonDiv = document.createElement('div');
        buttonDiv.style.textAlign = 'center';
        const button = document.createElement('button');
        button.innerText = '确定';
        button.addEventListener('click', ()=>{
            ok();
            document.getElementById('dialog').remove();
        });
        buttonDiv.appendChild(button)
        buttonDiv.style.height='50px';
        const button2 = document.createElement('button');
        button2.innerText = '取消';
        button2.addEventListener('click', ()=>{
            cancel();
            document.getElementById('dialog').remove();
        });
        buttonDiv.appendChild(button2)
        div.appendChild(buttonDiv);
        fragment.appendChild(div);
        document.body.appendChild(fragment);
    }
    exports.createDialogLogin = function({
        accountType,url,callback,text
    }){
        const success = () => {
            chrome.runtime.sendMessage(
              "eidkoplpehhpomkpccndgedopkbninin",
              {
                type: "login",
                params: {
                  accountType,
                  url,
                },
              },
              (res) => {
                callback(res);
              }
            );
            window?.GoBackOnLoad?.();
          };
          const fail = () => {
            window?.GoBackOnLoad?.();
          };
          createDialog(text, success, fail);
    }
    // 重写appendChild方法，拦截埋点的上报，之所以这样，是因为 talkingdata:xxx 形式的链接不会被插件所拦截，也可能是我的境界不够。。。
    // 现在的重写会导致云桌面无法打开
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