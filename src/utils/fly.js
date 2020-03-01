import Vue from "vue";

var Fly = require("flyio/dist/npm/wx.js"); // wx.js为flyio的微信小程序入口文件
var fly = new Fly(); // 创建fly实例

var pUserCode = "";

function wxLogin() {
  // 调用登录接口
  return new Promise((resolve, reject) => {
    wx.login({
      success: function(res) {
        if (res.code) {
          resolve(res.code); //成功调用resolve
        } else {
          reject(res); //失败调用reject
        }
      },
      fail: function(res) {
        reject(res);
      }
    });
  });
}

// 添加拦截器
fly.interceptors.request.use((config, promise) => {
  // 给所有请求添加自定义header
  config.headers["X-Tag"] = "flyio";
  config.headers["x-client"] = "wxapp";
  // const token = wx.getStorageSync("pUserCode");
  // if (token) {
  //   config.headers["pUserCode"] = "";
  // }
  return config;
});

var newFly = new Fly();
newFly.config = fly.config;
var log = console.log;
fly.interceptors.request.use(async function(request) {
  // log(`发起请求：path:${request.url}，baseURL:${request.baseURL}`);
  pUserCode = wx.getStorageSync("pUserCode");
  if (!pUserCode) {
    // log("没有token，先请求token...");
    //锁定当天实例，后续请求会在拦截器外排队
    fly.lock();
    let code = await wxLogin();
    // console.log(code);
    return newFly
      .post("WeChatAuth/GetAuthWxApp", {
        t: -1,
        m: 1,
        a: 1,
        code: code
      })
      .then(d => {
        // log('sssss')
        // log(d.data.msg.OpenID)
        request.headers["pUserCode"] = pUserCode = d.data.msg.OpenID;
        // log("token请求成功，值为: " + d.data.msg.OpenID);
        // log(`继续完成请求：path:${request.url}，baseURL:${request.baseURL}`);
        wx.setStorageSync("pUserCode", pUserCode);
        return request;
      })
      .finally(() => fly.unlock()); //解锁后，会继续发起请求队列中的任务
  } else {
    request.headers["pUserCode"] = pUserCode;
  }
});

//  response interceptors
// fly.interceptors.response.use(
//   function(response) {
//     log("interceptors.response", response);
//     //验证失效
//     if (response.data.data.tokenExpired) {
//       log("token失效，重新请求token...");
//       this.lock(); //锁定响应拦截器
//       return newFly
//         .get("/token")
//         .then(d => {
//           pUserCode = d.data.data.token;
//           log("token已更新，值为: " + pUserCode);
//         })
//         .finally(() => this.unlock())
//         .then(() => {
//           log(
//             `重新请求：path:${response.request.url}，baseURL:${response.request.baseURL}`
//           );
//           return fly.request(response.request);
//         });
//     } else {
//       return response.data.data;
//     }
//   },
//   function(err) {
//     log("error-interceptor", err);
//   }
// );

// 配置请求基地址
Vue.prototype.$http = fly;
fly.config.baseURL = "https://m.1fmall.cn/";

export default fly;
