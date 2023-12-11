import { globalState } from "../data/global";
import { getQueryParams } from "./utils";

export const reqLocal = (url: string) => {
  const queryParams = getQueryParams(url);
  const keyArr = Object.keys(queryParams).map((key) => {
    return {
      key: key.toLocaleLowerCase(),
      originKey: key,
    };
  });
  // 从 appParams[globalState.app 获取对应 key 的 value然后修改
  for (let key in queryParams) {
    queryParams[key] =
      globalState?.appParams[globalState.app].locals[key.toLocaleLowerCase()] ||
      "";
  }
  // 处理弱账号相关信息
  const weakAccountStatus = globalState?.weakLoginStatus || false;

  if (!weakAccountStatus) {
    [
      "weakaccount",
      "weaktoken",
      "weakmobilecode",
      "weakname",
      "weakiconid",
    ].forEach((key) => {
      const keyIndex = keyArr.findIndex((item) => {
        return item.key === key;
      });
      if (keyIndex !== -1) {
        queryParams[keyArr[keyIndex].originKey] = "";
      }
    });
  }
  // 处理强账号相关信息
  const accountStatus = globalState?.loginStatus || false;
  if (!accountStatus) {
    ["account", "jyloginflag"].forEach((key) => {
      const keyIndex = keyArr.findIndex((item) => {
        return item.key === key;
      });
      if (keyIndex !== -1) {
        queryParams[keyArr[keyIndex].originKey] = "";
      }
    });
  }
  const res ={} 
  Object.keys(queryParams).forEach((key)=>{
    res[key.toLocaleUpperCase()]=queryParams[key]
  })
  console.log(res);

  return JSON.stringify(res);
};
// 这里理解错了，readFile时其实只能一个一个读，直接返回文件内容即可，不要一个对象
export const reqFile = (url: string) => {
  const queryParams = getQueryParams(url);
  const res = {};
  for (let key in queryParams) {
    return globalState?.appParams[globalState.app].files[
      queryParams[key].toLocaleLowerCase()
    ] || "";
    // res[queryParams[key]] =
      
  }
  return JSON.stringify(res);
};
export const reqMemory = (url: string) => {
  const queryParams = getQueryParams(url);
  for (let key in queryParams) {
    queryParams[key] = "";
  }
  return JSON.stringify(queryParams);
};
