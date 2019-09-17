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
    priceAll: 0, // 总价，初始为0
    // 全选状态
    selectAllStatus: false, // 全选状态，默认全选
    addressList: [],
    addressid: '',
    imgUrl: ''
  },
  onLoad() {
    this.setData({
      imgUrl: app.globalData.imgUrl
    })
  },
  onHide(){
    // let list = this.data.list
    // let data = []
    // let i = 0
    // for (i in list) {
    //   data.push({ "id": list[i].id, "num": list[i].num})
    // }
    // wx.request({
    //   url: `${app.globalData.requestUrl}/Car/updateCar`,
    //   header: {
    //     "Content-Type": "application/x-www-form-urlencoded"
    //   },
    //   method: 'POST',
    //   data: {
    //     update: JSON.stringify(data)
    //   },
    //   success:res=>{
    //   }
    // })
  },
  goback(){
    wx.navigateBack({
      detla:1
    })
  },
  onShow() {
    var that = this;
    wx.request({
      url: `${app.globalData.requestUrl}/Car/Car`,
      method: 'POST',
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
      url: `${app.globalData.requestUrl}/defaultAddress`,
      method: 'POST',
      data: {
        uid: app.globalData.userInfo.id
      },
      success: function (res) {
        if (res.data.code == 1) {
          that.setData({
            addressList: res.data.data,
            addressid: res.data.data.id
          })
        }
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
            url: `${app.globalData.requestUrl}/Car/outCar`,
            method: 'POST',
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
            url: `${app.globalData.requestUrl}/Car/cleanCar`,
            method: 'POST',
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


  // 提交订单
  btn_submit_order: function () {
    if (this.data.addressid == '') {
      wx.showToast({
        title: '请先新增收货地址',
        icon: 'none'
      });
      return false
    }
    var that = this
    var goodsArr = JSON.stringify(this.data.list)
    var upData = { "uid": app.globalData.userInfo.id, "aid": this.data.addressid, "car": goodsArr }
    wx.request({
      url: `${app.globalData.requestUrl}/Order/placeOrder`,
      method: 'POST',
      data: upData,
      success: function (res) {
        wx.request({
          url: `${app.globalData.requestUrl}/Car/cleanCar`,
          method: 'POST',
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
    let priceAll = 0;
    // 循环列表得到每个数据
    for (let i = 0; i < list.length; i++) {
      // 所有价格加起来 count_money
      priceAll += list[i].num * Number(list[i].price);
    }

    // 最后赋值到data中渲染到页面
    this.setData({
      priceAll: priceAll.toFixed(2)
    });
  },

  // 减号
  numDown(e) {
    let index = e.currentTarget.dataset.index
    let nodeAll = this.data.list
    let node = nodeAll[index]
    if (node.num == 0) {
      return false
    }
    node['num'] = node.num - 1
    nodeAll[index] = node
    this.setData({
      list: nodeAll
    })
    this.addShopcar(node)
    this.count_price()
  },
  numUp(e) {
    let index = e.currentTarget.dataset.index
    let nodeAll = this.data.list
    let node = nodeAll[index]
    node['num'] = node.num + 1
    nodeAll[index] = node
    this.setData({
      list: nodeAll
    })
    this.addShopcar(node)
    this.count_price()
  },
  getNum(e) {
    let index = e.currentTarget.dataset.index
    let nodeAll = this.data.list
    let node = nodeAll[index]
    let num  = e.detail.value
    node['num'] = num
    nodeAll[index] = node
    this.setData({
      list: nodeAll
    })
    this.addShopcar(node)
    this.count_price()
  },
  addShopcar(node){
    wx.showToast({
      title: '正在更改购物车数据',
      icon: 'loading'
    });
    wx.request({
      url: `${app.globalData.requestUrl}/Car/inCar`,
      method: 'POST',
      data: {
        uid: app.globalData.userInfo.id,
        goods_id: node.good_id,
        num: node.num,
        spec: node.spec,
        price: node.price,
        img: node.img,
      },
      success: res => {
        wx.hideToast()
      }
    })
  }
})