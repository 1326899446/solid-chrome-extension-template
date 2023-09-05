import { Button, HopeProvider, Radio, RadioGroup, Switch } from '@hope-ui/solid';
import "@src/styles/index.css";
import { createSignal } from 'solid-js';
import styles from "./Popup.module.css";
import { WEBVIEW_PARAMS } from './constant';
chrome.runtime.sendMessage({ action: "get", params: ["active"] }, (response) => {
  console.log('----------------------',response);
});

const Popup = () => {
  const [switchStatus,setSwitchStatus] = createSignal<boolean>(true);
  const [mode,setMode] = createSignal<string>('Android')
  const handleSwitchChange = async ()=>{
    setSwitchStatus(!switchStatus())
    chrome.storage.local.set({ switch: switchStatus() }).then(() => {
      console.log("开关状态改变");
    });
  }
  
  const handleChange = (e)=>{
    setMode(e)
    chrome.storage.local.set({ mode: e }).then(() => {
      console.log("系统选择改变");
    });
  }
  const jumpActionManager = ()=>{
    // 跳转到专门的action管理页面
  }
  return (
    <HopeProvider>
      <div class={styles.App}>
        <div class={styles.operateBtn}>
          <div class={styles.switch}>
            <Switch defaultChecked colorScheme="primary" onChange={handleSwitchChange}>开启插件</Switch>
          </div>
          <div class={styles.radio}>
            <RadioGroup value={mode()} onChange={handleChange}>
              <Radio value="Android">Android</Radio>
              <Radio value="IOS">IOS</Radio>
            </RadioGroup>
          </div>
        </div>
        <section class={styles.webviewParams}>
          {Object.keys(WEBVIEW_PARAMS).map((key)=>{
            return <div>
              {key}:{WEBVIEW_PARAMS[key]}
            </div>
          })}
        </section>
       <Button onClick={jumpActionManager}>Action管理</Button>
      </div>
    </HopeProvider>
    
  );
};

export default Popup;
