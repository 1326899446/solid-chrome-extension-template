import { global } from "../data/data";
import { getQueryParams } from "./utils";
export const reqLocal = (url: string) => {
    console.log("获取local",url,global);
    
  const queryParams = getQueryParams(url);
  const keyArr = Object.keys(queryParams).map((key) => {
    return {
      key: key.toLocaleLowerCase(),
      originKey: key,
    };
  });
  // 从 nativeParams 获取对应 key 的 value然后修改
  for (let key in queryParams) {
    queryParams[key] = global?.nativeParams[key.toLocaleLowerCase()] || "";
  }
  // 处理弱账号相关信息
  const weakAccountStatus = global?.weakAccountStatus || false;

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
  // 处理弱账号相关信息
  const accountStatus = global?.accountStatus || false;
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
  console.log(queryParams);
  
  return JSON.stringify(queryParams);
};
export const reqFile = (url: string) => {
  const queryParams = getQueryParams(url);
  const res = {};
  for (let key in queryParams) {
    res[queryParams[key]] = global?.nativeFileContent[queryParams[key].toLocaleLowerCase()] || "";
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
