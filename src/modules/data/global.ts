
export interface GlobalState {
  app: string; // app
  os: string; // 操作系统
  status: boolean; // 插件状态
  weakLoginStatus: boolean; // 弱账号登录状态
  loginStatus: boolean; // 强账号登录状态
  jumpDirection:"dev"|"production",
  appParams: {
    [key: string]: {
      locals: Record<string, string>;
      files: Record<string, string>;
      memory: Record<string, string>;
    };
  };
  actionUrl:string;
  baseUrl:string;
  handleActionRemote:any;
  MapActionToServer:any;
}
// 用 var 为了能让 eval将其修改
export var globalState: GlobalState = {} as GlobalState;

export const setGlobal =async (key, value) => {
  globalState[key] = value;
  // 如果重新设置了 actionUrl 的值，则要重新请求
  if(key === 'actionUrl'){
    // 如果action的Url改变，请求
    const data = await import(value);
    console.log(data);
    
    globalState.handleActionRemote = data.handleActionRemote;
    globalState.MapActionToServer = data.MapActionToServer;
  }
};
