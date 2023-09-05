import "@src/styles/index.css";
import { onMount } from 'solid-js';

const App = () => {
  function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    // s.innerHTML="window.a=222"
    s.setAttribute('src', file);
    th.appendChild(s);
}
const handleClick=()=>{
  console.log("aaa");
  
}
  onMount(()=>{
    // 初始化注入 bridge 脚本 
    injectScript(chrome.runtime.getURL('webview.js'), 'body');
    // 
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log('我在content',message, sender);
    });
  })
  return (
    <div class="fixed left-0 top-0 h-20 z-[2000] w-80 rounded-xl bg-red">
      <a href="http://www.baidu.com">wwwwwwwwwww</a>
      sssssssssssss
      <div class='w-100 h-50 bg-red color-yellow' onClick={handleClick}>aaaaaaaa</div>
    </div>
  );
};

export default App;
