// (function (exports) {
//   "use strict";
//   var HTJSBridge = {
//     isHtjsbridge: function () {
//       if (navigator.userAgent.indexOf("kHTXWeb") >= 0) {
//         return true;
//       } else {
//         return false;
//       }
//     },
//     handles: function () {},
//     on: function (type, handle) {
//       if (!this.handles[type]) {
//         this.handles[type] = [];
//       }
//       this.handles[type].push(handle);
//     },
//     emit: function () {
//       var type = Array.prototype.shift.call(arguments);
//       if (!this.handles[type]) {
//         return false;
//       }
//       for (var i = 0; i < this.handles[type].length; i++) {
//         var handle = this.handles[type][i];
//         handle.apply(this, arguments);
//       }
//     },
//     invoke: function (api, params, callback) {
//       var self = this;
//       self.setup(function (bridge) {
//         bridge.callHandler(api, params, function (response) {
//           if (typeof callback === "object") {
//             self.handler(api, response, callback);
//           } else {
//             callback.call(this, response);
//           }
//         });
//       });
//     },
//     evil: function (fn) {
//       var Fn = Function;
//       return new Fn("return " + fn)();
//     },
//     setup: function (callback) {
//       if (window.WebViewJavascriptBridge) {
//         return callback(WebViewJavascriptBridge);
//       }
//       if (window.WVJBCallbacks) {
//         return window.WVJBCallbacks.push(callback);
//       }
//       window.WVJBCallbacks = [callback];
//       var WVJBIframe = document.createElement("iframe");
//       WVJBIframe.style.display = "none";
//       WVJBIframe.src = "https://__bridge_loaded__";
//       document.documentElement.appendChild(WVJBIframe);
//       setTimeout(function () {
//         document.documentElement.removeChild(WVJBIframe);
//       }, 0);
//     },
//     connectJsBridge: function (callback) {
//       if (window.WebViewJavascriptBridge) {
//         callback(WebViewJavascriptBridge);
//       } else {
//         document.addEventListener(
//           "WebViewJavascriptBridgeReady",
//           function () {
//             callback(WebViewJavascriptBridge);
//           },
//           false
//         );
//       }
//     },
//     handler: function (api, response, callback) {
//       var msg = response.errMsg;
//       var index = msg.indexOf(":");
//       var res = msg.substring(index + 1);
//       switch (res) {
//         case "ok":
//           callback.success(response);
//           break;
//         case "cancel":
//           callback.cancel(response);
//           break;
//         default:
//           callback.fail(response);
//       }
//       callback.complete(response);
//     },
//     error: function (callback) {
//       var self = this;
//       self.on("error", function (res) {
//         callback.call(self, res);
//       });
//     },
//     hrefWithMsgUrl: function (url) {
//       this.invoke("hrefWithMsgUrl", { url: url });
//     },
//     reqsignatureRequest: function (params, callback) {
//       this.invoke("reqsignature", params, callback);
//     },
//     setWebViewHeightF10Request: function (height) {
//       this.invoke("setWebViewHeightF10", { height: height });
//     },
//     onScrollTopOffsetRequest: function (x, y, z) {
//       this.invoke("onScrollTopOffset", {
//         bgAlpha: x,
//         buttonAlpha: y,
//         titleAlpha: z ? z : 0,
//       });
//     },
//     onUpdateTitleAndSubTitleRequest: function (titile, subTitle) {
//       this.invoke("onUpdateTitleAndSubTitle", {
//         title: titile,
//         subTitle: subTitle,
//       });
//     },
//     onWebdataEncrypt: function (info, callback) {
//       var infoJson = { info: info };
//       this.invoke("onWebdataEncrypt", infoJson, callback);
//     },
//     ajaxPathParse: function (ajaxdata) {
//       var url = ajaxdata.url && ajaxdata.url;
//       var data = ajaxdata.data && ajaxdata.data;
//       var onSuccess = ajaxdata.success && ajaxdata.success;
//       var onError = ajaxdata.error && ajaxdata.error;
//       var urlObj = this.parseUrl(url);
//       var api = urlObj.api;
//       this.ajaxPathRequest(
//         api,
//         { htxwebhturl: url, htxwebhtdata: ajaxdata.data },
//         onSuccess,
//         onError
//       );
//     },
//     ajaxPathRequest: function (api, params, onSuccess, onError) {
//       this.invoke(api, params, {
//         success: function (data) {
//           if (api == "reqreadfile") {
//             var oData = data.content || "";
//             onSuccess(oData);
//           } else {
//             onSuccess(data);
//           }
//         },
//         fail: function (data) {
//           onError(data);
//         },
//         complete: function () {},
//       });
//     },
//     parseUrl: function (url) {
//       var api = "";
//       var params = {};
//       var urlList = url.split(/[?&]/);
//       api = urlList[0].slice(1);
//       if (urlList.length > 1) {
//         for (var i = 1; i < urlList.length; i++) {
//           var objStrList = urlList[i].split("=");
//           if (objStrList.length == 2) {
//             params[objStrList[0]] = objStrList[1];
//           } else if (objStrList.length > 2) {
//             let newObjStrList = objStrList.slice(1, objStrList.length);
//             params[objStrList[0]] = newObjStrList.join("=");
//           }
//         }
//       }
//       return { api: api, params: params };
//     },
//     mergeJson: function (target, source) {
//       for (var obj in source) {
//         target[obj] = source[obj];
//       }
//       return target;
//     },
//   };
//   exports.HTJSBridge = HTJSBridge;
//   if (typeof define === "function" && define.amd) {
//     define([], function () {
//       return HTJSBridge;
//     });
//   }
// })(window);
// (function (exports) {
//   "use strict";
//   var HTMsgRouter = {
//     hrefWithMsgUrl: function (url) {
//       HTJSBridge.hrefWithMsgUrl(url);
//     },
//   };
//   exports.HTMsgRouter = HTMsgRouter;
//   if (typeof define === "function" && define.amd) {
//     define([], function () {
//       return HTMsgRouter;
//     });
//   }
// })(window);
// window.onUpdateTitleAndSubTitle = function (titile, subTitle) {
//   HTJSBridge.onUpdateTitleAndSubTitleRequest(titile, subTitle);
// };
// window.setWebViewHeightF10 = function (height) {
//   HTJSBridge.setWebViewHeightF10Request(height);
// };
// window.onScrollTopOffset = function (x, y, z) {
//   HTJSBridge.onScrollTopOffsetRequest(x, y, z);
// };
