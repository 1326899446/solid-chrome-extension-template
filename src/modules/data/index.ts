import { setGlobal } from './global';
import { initData } from './init';
import(chrome.runtime.getURL("constants.js")).then((data) => {
  const constants = data
  Object.keys(constants.initedGlobal).forEach((key)=>{
      setGlobal(key,constants.initedGlobal[key])
  })
  initData(constants);
})
.catch((error) => console.error("Error:", error));
  
