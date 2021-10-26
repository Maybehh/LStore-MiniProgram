import { request } from '../../request/index';
// 引入facebook async包，在小程序中即可使用async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    goodsObj: {},
    isCollect: false
  },

  GoodsInfo: {},

  onShow: function () {
    const pages =  getCurrentPages(),
          { options } = pages[pages.length - 1],
          { goods_id } = options;

    this.getGoodsDetail(goods_id);
  },

  async getGoodsDetail (goods_id) {
    const goodsObj = await request({ url: '/goods/detail', data: { goods_id } });
    this.GoodsInfo = goodsObj;
    let collect = wx.getStorageSync('collect') || [];
    const isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone部分不支持webp，手动临时修改一下，不过最终的方案是让后台把图片格式改对了
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    });
  },

  handlePreviewImage (e) {
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid),
          current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },

  handleCartAdd () {
    const cart = wx.getStorageSync('cart') || [],
          index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    // 第一次添加
    if (index === -1) {
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      cart[index].num++;
    }
    wx.setStorageSync('cart', cart);
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      // 设为true，等1.5秒后用户才能继续和页面交互
      mask: true
    });
  },

  handleCollect () {
    let isCollect;
    let collect = wx.getStorageSync('collect') || [];
    const index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index !== -1) {
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      });
    } else {
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    wx.setStorageSync('collect', collect);
    this.setData({
      isCollect
    });
  }
})