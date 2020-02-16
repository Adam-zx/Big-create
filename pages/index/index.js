//index.js
//获取应用实例
const app = getApp()
const DB = wx.cloud.database().collection("hobby")
let name = ""
let age = ""
let id = ""
let XL = ""
let hobby = ""
let sport = ""
let music = ""
Page({
  //获取名字
  addName(event){
    name = event.detail.value
  },
  //获取年纪
  addAge(event){
    age = event.detail.value
  },
  //获取id
  addID(event){
    console.log(event.detail.value)
    id = event.detail.value
  },
  //学历
  addXL(event) {
    console.log(event.detail.value)
    let XL = event.detail.value
  },
  //爱好
  addHB(event) {
    console.log(event.detail.value)
    hobby = event.detail.value
  },
  //运动
  addSP(event) {
    console.log(event.detail.value)
    sport = event.detail.value
  },
  //音乐
  addMU(event) {
    console.log(event.detail.value)
    music = event.detail.value
  },
  //添加数据
  addData(){

    DB.add({
      data:{
        name: name,
        age:  age
      },
      success(res){
        console.log("success",res)
      },
      fail(res){
        console.log("faild",res)
      }
    })
  },
  //查询
  getData(){
    wx.cloud.callFunction({
      name:"getdata",
      success(res){
        console.log(res)
      }
    })
  },
  addData_2(){
    DB.add({
      data: {
        id: id,
        XL: XL,
        hobby: hobby,
        sport: sport,
        music: music,
        flage: 0,
      },
      success(res) {
        console.log("success", res)
      },
      fail(res) {
        console.log("faild", res)
      }
    })
  },

  
})
