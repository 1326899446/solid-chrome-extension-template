(function (exports) {
  var HTJSBridge = {
    invoke: function (api, params, callback) {
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
      if (window.WVJBCallbacks) {
        return window.WVJBCallbacks.push(callback);
      }
      window.WVJBCallbacks = [callback];
      var WVJBIframe = document.createElement("iframe");
      WVJBIframe.style.display = "none";
      WVJBIframe.src = "https://__bridge_loaded__";
      document.documentElement.appendChild(WVJBIframe);
      setTimeout(function () {
        document.documentElement.removeChild(WVJBIframe);
      }, 0);
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
  exports.HTJSBridge = HTJSBridge;
  if (typeof define === "function" && define.amd) {
    define([], function () {
      return HTJSBridge;
    });
  }
})(window);
