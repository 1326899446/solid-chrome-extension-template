(function (exports) {
  var HTJSBridge = {
    invoke: function (api, params, callback) {
      console.log("执行了ios bridge的 invoke", api, params);
      var self = this;
      self.setup(function (bridge) {
        bridge.callHandler(api, params, function (response) {
          if (typeof callback === "object") {
            self.handler(api, response, callback);
          } else {
            callback.call(this, response);
          }
        });
      });
    },
    setup: function (callback) {
      if (window.WebViewJavascriptBridge) {
        return callback(WebViewJavascriptBridge);
      }
      // if (window.WVJBCallbacks) {
      //   return window.WVJBCallbacks.push(callback);
      // }
      // window.WVJBCallbacks = [callback];
      // var WVJBIframe = document.createElement("iframe");
      // WVJBIframe.style.display = "none";
      // WVJBIframe.src = "https://__bridge_loaded__";
      // document.documentElement.appendChild(WVJBIframe);
      // setTimeout(function () {
      //   document.documentElement.removeChild(WVJBIframe);
      // }, 0);
    },
    handler: function (api, response, callback) {
      var msg = response.errMsg;
      var index = msg.indexOf(":");
      var res = msg.substring(index + 1);
      switch (res) {
        case "ok":
          callback.success(response);
          break;
        case "cancel":
          callback.cancel(response);
          break;
        default:
          callback.fail(response);
      }
      callback.complete(response);
    },
  };
  exports.MyWebView = null;
  exports.HTJSBridge = HTJSBridge;
})(window);

Object.defineProperty(window.navigator, "platform", {
  get: () => {
    return "iPhone";
  },
});
Object.defineProperty(window.navigator, "appVersion", {
  get: () => {
    return "5.0 (iPhone; CPU iPhone OS 12_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148";
  },
});
function resolve_send_data(data) {
  const { action, path, funcId, ...biz_params } =
    Object.prototype.toString.call(data) === "[object Object]" ? data : {};

  Object.entries(biz_params).forEach(([key, value]) => {
    biz_params[key] = value === null || value === undefined ? "" : value;
  });

  const path_entries = Object.entries({ action, path, funcId })
    // 路径参数需要过滤掉不需要的字段
    .filter(([_, value]) => !!value)
    .sort(function sort_params(a, b) {
      return a[0] > b[0] ? 1 : -1;
    });

  const path_query = path_entries.map((entry) => entry.join("=")).join("&");

  return {
    path_entries,
    api_path: ["/reqxml", path_query].filter(Boolean).join("?"),
    biz_params,
  };
}
async function call_app_android(api, params, callback) {
  const req_data = {
    apiPath: "",
    params: {},
    start_time: 0,
  };
  let send_data;
  if (api === "reqxml") {
    // 记录请求开始时间
    req_data.start_time = Date.now();
    // reqxml分拆出路径参数和业务参数
    const { api_path, biz_params } = resolve_send_data(params);
    req_data.apiPath = api_path;
    // 删除了增加 traceId的操作
    req_data.params = biz_params;

    // 为了兼容老的逻辑
    // 帮助业务代码stringify内容
    Object.entries(biz_params).forEach(([key, value]) => {
      if (Object.prototype.toString.call(value) === "[object Object]") {
        biz_params[key] = JSON.stringify(value);
      }
    });
    send_data = new URLSearchParams(biz_params).toString();
  } else if (api === "reqsavefile" || api === "reqreadfile") {
    req_data.apiPath = `/${api}?filename=${params.filename}`;
    req_data.contentType = "text/plain;charset=UTF-8";
    send_data = api === "reqsavefile" ? String(params.content) : undefined;
  } else {
    req_data.apiPath = `/${api}?${
      typeof params === "string"
        ? params
        : new URLSearchParams(params).toString()
    }`;
  }
  const xhr = new XMLHttpRequest();
  xhr.open("POST", req_data.apiPath, true);
  xhr.setRequestHeader(
    "Content-Type",
    req_data.contentType || "application/x-www-form-urlencoded"
  );
  xhr.send(send_data);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      // android老版本webview有可能返回空响应
      let res;
      console.log(xhr.responseText);
      try {
        res = JSON.parse(xhr.responseText);
      } catch (e) {
        console.log(xhr.responseText, api, params, e);
      }
      if (res) {
        callback({ errMsg: "ok", ...res });
      } else {
        callback({ errMsg: "fail", ...res });
      }
    }
  };
}
window.WebViewJavascriptBridge = {
  callHandler: (api, params, callback) => {
    switch (api) {
      case "hrefWithMsgUrl": {
        console.log("ios的页面跳转", params);
        const { url } = params;
        // params 为 {url:""}
        chrome.runtime.sendMessage(
          "eidkoplpehhpomkpccndgedopkbninin",
          {
            type: "action",
            params: {
              url,
            },
          },
          (res) => {
            // TODO 完善这的代码
            const { type, jsfuncname, params } = res;
            console.log(res);
            if (type === "openDialog") {
              const { text = "", accountType } = res;
              const success = ()=>{
                chrome.runtime.sendMessage(
                  "eidkoplpehhpomkpccndgedopkbninin",{
                    type:"login",
                    params:{
                      accountType
                    }
                  })
                console.log(window.GoBackOnLoad());
                window.GoBackOnLoad()
              }
              const fail = ()=>{
                window.GoBackOnLoad()
              }
              window.createDialog(text, success, fail);
            } else if (jsfuncname) {
              if (jsfuncname && typeof window[jsfuncname] === "function") {
                window[jsfuncname](params);
              }
            }
          }
        );
        break;
      }
      case "callHTNativeMethod": {
        chrome.runtime.sendMessage();
      }
      case "reqlocal": {
        // 读取storage内容然后返回？
        call_app_android(api, params, callback);
        break;
      }
      case "reqsofttodo": {
        // 读取storage内容然后返回？
        call_app_android(api, params, callback);
        break;
      }
      case "reqreadmap": {
        // 读取storage内容然后返回？
        call_app_android(api, params, callback);
        break;
      }
      case "reqsavemap": {
        // 读取storage内容然后返回？
        call_app_android(api, params, callback);
        break;
      }
      case "reqreadfile": {
        // 读取storage内容然后返回？
        call_app_android(api, params, callback);
        break;
      }
      case "reqsavefile": {
        // 读取storage内容然后返回？
        call_app_android(api, params, callback);
        break;
      }
      case "reqxml": {
        console.log("接受一个reqxml请求");
        call_app_android(api, params, callback);
        break;
      }
    }
  },
};
