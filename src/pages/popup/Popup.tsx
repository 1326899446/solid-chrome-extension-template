import { Button, HopeProvider, Radio, RadioGroup, Switch } from "@hope-ui/solid";
import "@src/styles/index.css";
import { createSignal, onMount } from "solid-js";
import { initWebviewContent } from "../background/constant";
import styles from "./Popup.module.css";

const Popup = () => {
  const [switchStatus, setSwitchStatus] = createSignal<boolean>(true);
  const [mode, setMode] = createSignal<string>("Android");
  const [webviewParams, setWebviewParams] = createSignal({});
  const [weakAccountStatus,setWeakAccountStatus] = createSignal<boolean>(true)
  const [accountStatus,setAccountStatus] = createSignal<boolean>(true)
  const handleSwitchChange = async () => {
    setSwitchStatus(!switchStatus());
    chrome.storage.sync.set({ switch: switchStatus() }, () => {
      console.log("开关状态改变");
    });
  };

  const handleChange = (e) => {
    setMode(e);
    chrome.storage.sync.set({ mode: e }, () => {
      console.log("系统选择改变");
    });
  };
  const jumpActionManager = () => {
    // 跳转到专门的action管理页面
    chrome.runtime.openOptionsPage(()=>{
      console.log("aaaaaaaaa");
      
    })
  };
  const handleWeakAccountChange = ()=>{
    setWeakAccountStatus(!weakAccountStatus());
    chrome.storage.sync.set({ nativeParams: {weakAccountStatus:weakAccountStatus(),accountStatus:accountStatus()} }, () => {
      console.log("弱账号状态改变");
    });
  }
  const handleAccountChange = ()=>{
    setAccountStatus(!accountStatus());
    chrome.storage.sync.set({ nativeParams: {weakAccountStatus:weakAccountStatus(),accountStatus:accountStatus()} }, () => {
      console.log("强账号状态改变");
    });
  }
  const test = ()=>{
    chrome.storage.local.get(['webviewParams'],({webviewParams})=>{ 
      console.log(webviewParams);     
    })
  }
  onMount(() => {
    setTimeout(()=>{
      chrome.storage.sync.get(
        ["switch", "mode", "nativeParams"],
        ({ switch: data, mode, nativeParams }) => {
          const {weakAccountStatus,accountStatus} = nativeParams;
          setMode(mode);
          setSwitchStatus(data);
          setAccountStatus(accountStatus)
          setWeakAccountStatus(weakAccountStatus)
        }
      );
      chrome.storage.local.get(["webviewParams"], ({webviewParams}) => {
        chrome.tabs.getSelected(null, function (tab) {
          // 先获取当前页面的tabID
          let curWebviewParams = webviewParams[tab.id];
          setWebviewParams(curWebviewParams || initWebviewContent);
          if(!curWebviewParams){ 
            chrome.storage.local.set({webviewParams:{
              ...webviewParams,
              [tab.id]:initWebviewContent
            }})
          }
        });
      });
    },0)
    chrome.storage.onChanged.addListener((changes)=>{
      console.log("changes",changes);
      
    })
  });
  return (
    <HopeProvider>
      <div class={styles.App}>
        <div class={styles.operateBtn}>
          <div class={styles.switch}>
            <Switch checked={switchStatus()} onchange={handleSwitchChange}>开启状态</Switch>
            {/* <RadioGroup value={switchStatus()} onChange={}>
              <Radio value={true}>开启</Radio>
              <Radio value={false}>关闭</Radio>
            </RadioGroup> */}
          </div>
          <div class={styles.radio}>
            <RadioGroup value={mode()} onChange={handleChange}>
              <Radio value="Android">Android</Radio>
              <Radio value="IOS">IOS</Radio>
            </RadioGroup>
          </div>
        </div>
        <section class={styles.webview}>
          <div class={styles.title}>webview参数</div>
          <div class={styles.webviewParams}>
            {Object.keys(webviewParams()).map((key) => {
              return (
                <div>
                  {key}:{webviewParams()[key]}
                </div>
              );
            })}
          </div>
        </section>
        <section class={styles.login}>
          <Switch checked={weakAccountStatus()} onchange={handleWeakAccountChange}>弱账号</Switch>
          <Switch checked={accountStatus()} onchange={handleAccountChange}>强账号</Switch>
        </section>
        <Button onClick={jumpActionManager} class={styles.action}>Action管理</Button>
        <Button onClick={test} class={styles.action}>Test</Button>
      </div>
    </HopeProvider>
  );
};

export default Popup;
