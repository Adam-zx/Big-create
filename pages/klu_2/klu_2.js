const DB = wx.cloud.database().collection("hobby")

Page({
  data: {
    pa:[],    //存放点的数组
    pc_o:[],  //存放中心的数组—老
    pc_n:[],   //新的
    dis:0,
    time:0,
    biao:0
  },

  point(){
    this.XL = 0;
    this.hobby = 0;
    this.music = 0;
    this.sport = 0;
    this.flage = 0;

  },
  getData(){
    DB.get({
      success(res){
        //console.log("success",res)
        this.setData({
          pa: res.data
        })
      },

    })
  },
  get_pc_o: function(){
    const length = this.data.pa.length - 1;
    var time = 0;
    for(let i = 0; i < 3 ; i++){
      const x = Math.round(Math.random() * length);
      //console.log(x);
      const temp = this.data.pa[x];
      if(temp.flage == 0){
        temp.flage = i + 1;
        this.data.pc_o[i] = temp;
        this.setData({})
      }else if(time < 20){
        time++;
        i--;
      }
    }
  },
  distence: function (x,y) {
    let m = (Math.sqrt(Math.pow((x.XL - y.XL),2) + 
                        Math.pow((x.hobby - y.hobby),2) + 
                        Math.pow((x.music - y.music),2) + 
                        Math.pow((x.sport - y.sport),2)) / 4).toFixed(5); //保留五位小数
    return m;
  },

  //为点打上标签
  mark: function(){
    let that = this;
    let pa = this.data.pa;
    let pc_o = this.data.pc_o;

    for (let i = 0; i < pa.length; i++) {
      let dis_a_b = 9999;
      for (let j = 0; j < pc_o.length; j++) {
        let temp = that.distence(this.data.pa[i],this.data.pc_o[j]);
        //console.log(temp);
        if(temp < dis_a_b){
          dis_a_b = temp;
          pa[i].flage = j + 1;
        }
      }
    }
/*    wx.cloud.callFunction({
      name:"distence",
      data:{
        x:this.data.pa[0],
        y:this.data.pc_o[0]
      },
      success(res){
        console.log("success",res)
        that.setData({
          dis: res.result
        })
      },
      fail(res){
        console.log("fail",res)
      },
    });
    */
  },
  //计算质心
  caculate: function(){
    let that = this;
    let pa = this.data.pa;
    let pc_o = this.data.pc_o;
    let pc_n = this.data.pc_n;

    for (let i = 0; i < pc_o.length; i++) {
      var m = 0; //计算每类的数量
      var tempPoint = new this.point();
      for (let j = 0; j < pa.length; j++) {
        //console.log(tempPoint)
        if(pa[j].flage == i + 1){
          tempPoint.XL += Number(pa[j].XL);
          tempPoint.hobby += Number(pa[j].hobby);
          tempPoint.music += Number(pa[j].music);
          tempPoint.sport += Number(pa[j].sport);
          m++;
        }
        //console.log(tempPoint);
      }
      pc_n[i] = new this.point();
      pc_n[i].XL = tempPoint.XL / m ;
      pc_n[i].hobby = tempPoint.hobby / m ;
      pc_n[i].music = tempPoint.music / m ;
      pc_n[i].sport = tempPoint.sport / m ;
      pc_n[i].flage = i + 1;
    }
  },
  
  //新旧中心转换
  change_old_to_new: function(old,news){
    for (var i = 0; i < 3; i++) {
			old[i].XL = news[i].XL;
      old[i].hobby = news[i].hobby;
      old[i].music = news[i].music;
      old[i].sport = news[i].sport;
			old[i].flage = news[i].flage;// 表示为聚类中心的标志。
		}
  },
  move: function (){
    let pa = this.data.pa;
    let pc_o = this.data.pc_o;
    let pc_n = this.data.pc_n;
    
    this.mark();
    this.caculate();
  
    var move_distence = 0;
    for (var i = 0; i < pc_o.length; i++) {
      move_distence = this.distence(pc_o[i],pc_n[i]);
      if (move_distence < 0.01 || this.data.time > 15) {
        this.data.biao = 1;
        break;
      }else{
        this.data.time++;
        this.change_old_to_new(pc_o,pc_n);
        this.move();
      }
      //if(this.data.biao == 1){
      //  console.log("迭代完成！")
      //}
    }
  },
  updata: function () {
          //将数据更新到数据库
          for (let i = 0; i < this.data.pa.length; i++) {
            wx.cloud.callFunction({
              name: "DBupdata",
              data:{
                id: this.data.pa[i].id,
                flage: this.data.pa[i].flage
              },
              success(res){
                //console.log("success",res)
              },
              fail(res){
                //console.log("fail",res)
              }
            })
            
          }
  },
  klu: function(){
    this.point();
    this.get_pc_o();
    this.mark();
    this.caculate();
    this.move();
    this.updata();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {  
    wx.cloud.callFunction({
      name:"DB_init",
      success(res){
        //console.log("初始化成功",res)
      },
      fail(res){
        //console.log("初始化失败",res)
      }
    });
    DB.get({
      success:res=>{
        this.setData({
          pa: res.data
        })
      }

    });
  },

})