import Vue from "vue";
import App from "./App";
import globalVariable from "@/common/js/global_variable";

import QQMapWX from "@/utils/map";

Vue.prototype.GLOBAL = globalVariable;
Vue.config.productionTip = false;
App.mpType = "app";

const app = new Vue(App);
app.$mount();

Vue.prototype.getLocation = function() {
  var qqmapsdk;
  qqmapsdk = new QQMapWX({
    key: "DHNBZ-2ZLKK-T7IJJ-AXSQW-WX5L6-A6FJZ"
  });
  wx.getLocation({
    type: "gcj02",
    success: res => {
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: res.latitude,
          longitude: res.longitude
        },
        success: res => {
          this.GLOBAL.location = res.result.formatted_addresses.recommend;
          console.log("main.js", this.GLOBAL.location);
        }
      });
    }
  });
};

Vue.prototype.getList = function() {
  wx.showLoading({
    title: "加载中"
  });
  this.$http
    .get("Phone/GetFavoriteStores",{
      m:1,
      a:1,
      c:this.GLOBAL.location,
      strName:'',
      fromOpenId:'',
      lt:'',
      pageSize:30,
      pageIndex:1,
      tagId:-1,
      iScollect:false
    })
    .then(res => {
      if(res){
        // console.log(res)
        this.restaurant = res.data.msg;
        // this.goods = res.data.data.goods;
        // this.seller = res.data.data.seller;
        // this.ratings = res.data.data.ratings;
      }
      
      wx.hideLoading()
    })
    .catch(e => {
      // console.log(e)
    });
};

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: [
      "pages/logs/main",
      "^pages/home/main",
      "pages/order/main",
      "pages/my/main",
      "pages/index/main",
      "pages/pay/main"
    ],
    window: {
      backgroundTextStyle: "light",
      navigationBarBackgroundColor: "#fff",
      navigationBarTitleText: "美团外卖",
      navigationBarTextStyle: "black"
    },
    tabBar: {
      color: "#272636",
      selectedColor: "#FFD161",
      backgroundColor: "#fff",
      borderStyle: "#a8a8a8",
      list: [
        {
          pagePath: "pages/home/main",
          iconPath: "static/images/home.png",
          selectedIconPath: "static/images/home-selected.png",
          color: "white",
          text: "首页"
        },
        {
          pagePath: "pages/order/main",
          iconPath: "static/images/order.png",
          selectedIconPath: "static/images/order-selected.png",
          text: "订单"
        },
        {
          pagePath: "pages/my/main",
          iconPath: "static/images/my.png",
          selectedIconPath: "static/images/my-selected.png",
          text: "我的"
        }
      ]
    }
  }
};
