import { request } from '../../request/index'

Page({
  data: {
    swiperList: [],
    categoryList: [],
    floorList: []
  },

  onLoad () {
    this.getSwiperList();
    this.getCategoryList();
    this.getFloorList();
  },

  getSwiperList () {
    request({url: '/home/swiperdata'})
    .then((result) => {
      result.forEach(v => {
        v.navigator_url = v.navigator_url.replace(/main/, 'goods_detail');
      });
      console.log(result);
      this.setData({
        swiperList: result
      })
    });
  },

  getCategoryList () {
    request({url: '/home/catitems'})
    .then((result) => {
      this.setData({
        categoryList: result
      })
    });
  },

  getFloorList () {
    request({url: '/home/floordata'})
    .then((result) => {
      result.forEach((v, i) => {
        v.product_list.forEach(v => {
          v.navigator_url = v.navigator_url.replace(/\?/, '/goods_list?');
        })
      });
      this.setData({
        floorList: result
      })
    });
  }
})
