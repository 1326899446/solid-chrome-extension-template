import {
  Button,
  HopeProvider,
  Input,
  Radio,
  RadioGroup,
  Switch,
} from "@hope-ui/solid";
import { setFiles, setLocals } from "@src/modules/data/utils";
import "@src/styles/index.css";
import { createSignal, onMount } from "solid-js";
import styles from "./Popup.module.css";
import { AppMap } from "./constant";

const Popup = () => {
  const [switchStatus, setSwitchStatus] = createSignal<boolean>(true);
  const [mode, setMode] = createSignal<string>("Android");
  const [webviewParams, setWebviewParams] = createSignal({});
  const [weakAccountStatus, setWeakAccountStatus] = createSignal<boolean>(true);
  const [accountStatus, setAccountStatus] = createSignal<boolean>(true);
  const [app, setApp] = createSignal("");
  const [jumpDirection, setJumpDirection] = createSignal("");

  const [curAppParams, setCurAppParams] =
    createSignal<
      Record<"locals" | "files" | "memory", Record<string, string>>
    >();
  const handleSwitchChange = async () => {
    setSwitchStatus(!switchStatus());
    chrome.storage.sync.set({ status: switchStatus() }, () => {
      console.log("开关状态改变");
    });
  };

  const handleChange = (e) => {
    setMode(e);
    chrome.storage.sync.set({ os: e }, () => {
      console.log("系统选择改变");
    });
  };
  const handleJumpDirectionChange = (e) => {
    setJumpDirection(e);
    chrome.storage.sync.set({ jumpDirection: e }, () => {
      console.log("跳转方式改变");
    });
  };
  const jumpActionManager = () => {
    // 跳转到专门的action管理页面
    // chrome.runtime.openOptionsPage(() => {
    //   console.log("aaaaaaaaa");
    // });
    alert(JSON.stringify(curAppParams().actions));
  };
  const handleWeakAccountChange = () => {
    setWeakAccountStatus(!weakAccountStatus());
    chrome.storage.sync.set({ weakLoginStatus: weakAccountStatus() }, () => {
      console.log("弱账号状态改变");
    });
  };
  const handleAccountChange = () => {
    setAccountStatus(!accountStatus());
    chrome.storage.sync.set({ loginStatus: accountStatus() }, () => {
      console.log("强账号状态改变");
    });
  };

  onMount(() => {
    setTimeout(() => {
      // 可以获取全局变量
      chrome.storage.sync.get(
        [
          "app",
          "status",
          "os",
          "weakLoginStatus",
          "loginStatus",
          "appParams",
          "jumpDirection",
        ],
        ({
          app,
          status,
          os,
          weakLoginStatus,
          loginStatus,
          appParams,
          jumpDirection,
        }) => {
          console.log("当前APP及其参数", app, appParams);

          setMode(os);
          setSwitchStatus(status);
          setAccountStatus(loginStatus);
          setWeakAccountStatus(weakLoginStatus);
          setApp(app);
          setCurAppParams(appParams[app]);
          setJumpDirection(jumpDirection);
        }
      );
      chrome.storage.local.get(["webviewParams"], ({ webviewParams }) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tab) => {
          setWebviewParams(webviewParams[tab[0].id] || {});
        });
      });
    }, 0);
  });
  return (
    <HopeProvider>
      <div class={styles.App}>
        <div class={styles.operateBtn}>
          <div class={styles.switch}>
            <Switch checked={switchStatus()} onchange={handleSwitchChange}>
              开启状态
            </Switch>
          </div>
          <div class={styles.radio}>
            <RadioGroup value={mode()} onChange={handleChange}>
              <Radio value="Android">Android</Radio>
              <Radio value="IOS">IOS</Radio>
            </RadioGroup>
          </div>
          <div class={styles.radio}>
            <RadioGroup
              value={jumpDirection()}
              onChange={handleJumpDirectionChange}
            >
              <Radio value="dev">开发页面</Radio>
              <Radio value="production">线上页面</Radio>
            </RadioGroup>
          </div>
        </div>
        <div class={styles.app}>当前APP：{AppMap[app()]}</div>
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
          <Switch
            checked={weakAccountStatus()}
            onchange={handleWeakAccountChange}
          >
            弱账号
          </Switch>
          <Switch checked={accountStatus()} onchange={handleAccountChange}>
            强账号
          </Switch>
        </section>
        <section class={styles.router}></section>
        <section class={styles.local}>
          <div>原生Local</div>
          {curAppParams() &&
            Object.keys(curAppParams().locals).map((key) => {
              return (
                <div class={styles.localItem}>
                  {key}:
                  <Input
                    value={curAppParams().locals[key]}
                    class={styles.input}
                    onInput={(e) =>
                      setLocals(app(), curAppParams(), {
                        [key]: e.target.value,
                      })
                    }
                  />
                </div>
              );
            })}
        </section>
        <section class={styles.files}>
          <div>原生File</div>
          {curAppParams() &&
            Object.keys(curAppParams().files).map((key) => {
              return (
                <div class={styles.filesItem}>
                  {key}:
                  <Input
                    value={curAppParams().files[key]}
                    class={styles.input}
                    onInput={(e) =>
                      setFiles(app(), curAppParams, { [key]: e.target.value })
                    }
                  />
                </div>
              );
            })}
        </section>
        <Button onClick={jumpActionManager} class={styles.action}>
          Action管理
        </Button>
      </div>
    </HopeProvider>
  );
};

export default Popup;
