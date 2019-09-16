var app = getApp();
var bool = true;
Page({
  data: {
    show_edit: "block",
    edit_name: "编辑",
    edit_show: "none",
    list: [], // 购物车列表
    // 默认展示数据
    hasList: true,
    // 金额
    totalPrice: [], // 总价，初始为0
    // 全选状态
    selectAllStatus: false, // 全选状态，默认全选
    addressList: [],
    addressid:[]
  },
  onLoad() {
  },
  onHide(){
    let list = this.data.list
    let data = []
    let i = 0
    for (i in list) {
      data.push({ "id": list[i].id, "num": list[i].num})
    }
    wx.request({
      url: 'https://shu.beaconway.cn/Car/updateCar',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: {
        update: JSON.stringify(data)
      },
      success:res=>{
      }
    })
  },
  goback(){
    wx.navigateBack({
      detla:1
    })
  },
  onShow() {
    var that = this;
    wx.request({
      url: 'https://shu.beaconway.cn/Car/Car',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id
      },
      success: function (res) {
        var goodsArr = res.data.data;
        let i = 0;
        let sum = 0;
        for (i in goodsArr) {
          // goodsArr[i]['num'] = 1
          sum += Number(goodsArr[i]["price"])
        }
        app.globalData.total = sum
        that.setData({
          list: goodsArr,
          totalPrice: sum
        })
        that.count_price();
      }
     
    })
    // 价格方法
    
    app.globalData.total = this.data.totalPrice
    wx.request({
      url: 'https://shu.beaconway.cn/defaultAddress',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: {
        uid: app.globalData.userInfo.id
      },
      success: function (res) {
        that.setData({
          addressList: res.data.data,
          addressid: res.data.data.id
        })
      }
    })
  },
  //删除商品
  delGoods(e) {
    var that = this;
    let list = this.data.list;
    // 获取商品数量
    // let num = list[index].num;
    var index = e.currentTarget.dataset.index
    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      success: function (res) {
        if (res.confirm) {
          // 删除索引从1
          list.splice(index, 1);
          // 后台删除
          wx.request({
            url: 'https://shu.beaconway.cn/Car/outCar',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'post',
            data: {
              id: e.currentTarget.dataset.id
            },
            success: function (res) {
            }
          })
          // 页面渲染数据
          that.setData({
            list: list
          });
          // 如果数据为空
          if (!list.length) {
            that.setData({
              hasList: false
            });
          } else {
            // 调用金额渲染数据
            that.count_price();
          }
        } else {
        }
      },
      fail: function (res) {
      }
    })
  },
  //检测input
  input_num(e) {
    var index = e.currentTarget.dataset.index
    var list = this.data.list
    list[index].num = e.detail.value
    this.count_price();
  },
  // 清空购物车
  btn_edit: function () {
    var that = this
    wx.showModal({
      title: '提示',
      content: '确认清空购物车吗',
      success: function (res) {
        var list = that.data.list;
        if (res.confirm) {
          wx.request({
            url: 'https://shu.beaconway.cn/Car/cleanCar',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            method: 'post',
            data: {
              uid: app.globalData.userInfo.id
            },
            success: function (res) {

              that.setData({
                list: [],
                totalPrice: ''
              });
            }
          })

          // 页面渲染数据

          // 如果数据为空
          if (!list.length) {
            that.setData({
              hasList: false
            });
          } else {
            // 调用金额渲染数据
            that.count_price();
          }
        } else {
        }
      },
      fail: function (res) {
      }
    })
  },
  // 删除
  deletes: function (e) {

  },





  /**
   * 绑定加数量事件
   */
  btn_add(e) {
    // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // 获取商品数据
    let list = this.data.list;
    // 获取商品数量
    let num = this.data.list[index].num;
    // 点击递增
    num++;
    list[index].num = num;
    // 重新渲染 ---显示新的数量
    this.setData({
      list: list
    })
    // 计算金额方法
    this.count_price();
    app.globalData.total = this.data.totalPrice
  },
  /**
   * 绑定减数量事件
   */
  total() {
    app.globalData.total = this.data.totalPrice
  },
  btn_minus(e) {
    //   // 获取点击的索引
    const index = e.currentTarget.dataset.index;
    // 获取商品数据
    let list = this.data.list;
    // 获取商品数量
    let num = list[index].num;
    if (num == 1) {
      return false
    }
    // else  num大于1  点击减按钮  数量--
    num = num - 1;
    list[index].num = num;
    // 渲染页面
    this.setData({
      list: list
    });
    // 调用计算金额方法
    this.count_price();
    app.globalData.total = this.data.totalPrice
  },
  // 提交订单
  btn_submit_order: function () {
    var that = this
    var goodsArr = JSON.stringify(this.data.list)
    var upData = { "uid": app.globalData.userInfo.id, "aid": this.data.addressid, "car": goodsArr }
    wx.request({
      url: 'https://shu.beaconway.cn/Order/placeOrder',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'post',
      data: upData,
      success: function (res) {
        wx.request({
          url: 'https://shu.beaconway.cn/Car/cleanCar',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          method: 'post',
          data: {
            uid: app.globalData.userInfo.id
          },
          success: function (res) {

            that.setData({
              list: [],
              totalPrice: 0.00,
              hasList: false
            });
            wx.showModal({
              title: '',
              content: '下单成功，请进入个人中心查看'
            })
          }
        })
      }
    })
  },
  //选择地址
  goAddress(e) {
    app.globalData.address = 1
    wx.switchTab({
      url: '../person/person',
    })
  },
  /**
   * 计算总价
   */
  count_price() {
    // 获取商品列表数据
    let list = this.data.list;
    // 声明一个变量接收数组列表price
    let total = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < list.length; i++) {
      // 所有价格加起来 count_money
      total += list[i].num * Number(list[i].price);
    }
    app.globalData.total = total
    // 最后赋值到data中渲染到页面
    this.setData({
      list: list,
      totalPrice: total.toFixed(2)
    });
  }
})