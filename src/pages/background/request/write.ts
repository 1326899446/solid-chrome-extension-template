import { global } from "../data/data";
import { getQueryParams } from "./utils";

export const writeLocal = (url: string) => {
  const queryParams = getQueryParams(url);
  const newNativeParams = {
    ...global?.nativeParams,
    ...queryParams,
  };
  chrome.storage.sync.set({ nativeParams: newNativeParams });
};
export const writeMemory = (url: string) => {
  //   const queryParams = getQueryParams(url);
  //   const newNativeParams = {
  //     ...global?.nativeParams,
  //     ...queryParams,
  //   };
  //   chrome.storage.sync.set({ nativeParams: newNativeParams });
  console.log("写入内存，敬请期待");
};
export const writeFile = (url: string, data: string) => {
  const queryParams = getQueryParams(url);
  const newNativeFileContent = {
    ...global?.nativeFileContent,
    [queryParams.filename]:data
  };
  chrome.storage.sync.set({ nativeFileContent: newNativeFileContent });
};
