// pages/add/add.js
Page({
  qiuhe(){
    wx.cloud.callFunction({
      name: "add",
      data:{
        a:1,
        b:3
      },
      success(res){
        console.log("lalala",res)
      }
    })
  },
  
})