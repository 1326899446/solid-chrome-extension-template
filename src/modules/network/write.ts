import { globalState } from "../data/global";
import { getQueryParams } from "./utils";

export const writeLocal = (url: string) => {
  const queryParams = getQueryParams(url);
  const curAppParams = globalState.appParams[globalState.app].locals
  const newLocal = {
    ...curAppParams,
    ...queryParams,
  };
  globalState.appParams[globalState.app].locals = newLocal;
  chrome.storage.sync.set({ appParams: {...globalState.appParams} });
};
export const writeMemory = (url: string) => {
  const queryParams = getQueryParams(url);
  const curAppParams = globalState.appParams[globalState.app].memory
  const newMemory = {
    ...curAppParams,
    ...queryParams,
  };
  globalState.appParams[globalState.app].memory = newMemory;
  chrome.storage.sync.set({ appParams: {...globalState.appParams} });
};
export const writeFile = (url: string, data: string) => {
  const queryParams = getQueryParams(url);
  const curAppParams = globalState.appParams[globalState.app].files
  const newFile = {
    ...curAppParams,
    ...queryParams,
  };
  globalState.appParams[globalState.app].files = newFile;
  chrome.storage.sync.set({ appParams: {...globalState.appParams} });
};
