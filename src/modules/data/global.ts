export interface GlobalState {
  app: string; // app
  os: string; // 操作系统
  status: boolean; // 插件状态
  weakLoginStatus: boolean; // 弱账号登录状态
  loginStatus: boolean; // 强账号登录状态
  appParams: {
    [key: string]: {
      actions: {
        [action: string | number]: {
          description: string;
          resultData?: any;
          func?: (data: any) => void;
        };
      };
      locals: Record<string, string>;
      files: Record<string, string>;
      memory: Record<string, string>;
    };
  };
}

export let globalState: GlobalState = {} as GlobalState;

export const setGlobal = (key, value) => {
  globalState[key] = value;
};
