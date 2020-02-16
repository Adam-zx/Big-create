//app.js
App({
  onLaunch: function () {
   //云环境初始化
   wx.cloud.init({
     env: "minicloud-mekco"
   })
  },
  globalData:{
    usrInfo:null
  }
})