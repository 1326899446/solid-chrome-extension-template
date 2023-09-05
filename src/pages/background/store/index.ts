export const store = {
  activated: false,
};

(function initStore() {
  chrome.storage.sync.get(["activated"], function (result) {
    console.log(`Value currently is ${result.activated}`);
    store.activated = result.activated;
  });
})()

export const getActived = ()=>{
  return store.activated;
}
export const setActived = (value)=>{
  store.activated = value
}