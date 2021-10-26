import { requestPayment, showToast } from '../../utils/asyncWx';
// 引入facebook async包，在小程序中即可使用async语法
import regeneratorRuntime from '../../lib/runtime/runtime';
import { request } from '../../request/index';

Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  // 当去设置地址时，原页面没有卸载，所以当回到原页面时不会执行onload，因此得放在onShow中执行
  onShow () {
    const address = wx.getStorageSync('address'),
          cart = wx.getStorageSync('cart') || [],
          checkedCart = cart.filter(v => v.checked);
    this.setCart(checkedCart);
    this.setData({
      address
    });
  },

  setCart (cart) {
    let totalPrice = 0,
        totalNum = 0;

    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      cart,
      totalNum,
      totalPrice
    });
  },

  async handleOrderPay () {
    try {
      // 1、判断是否有token
      const token = wx.getStorageSync('token');
      // 2 获取token
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/auth'
        });
        return;
      }
      // 3 创建订单
      // 3.1 准备请求头
      // 3.2 准备请求体参数
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      const cart = this.data.cart;
      let goods = [];
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }));
      const orderParams = { order_price, consignee_addr, goods };
      // 4 发送请求 创建订单 获取订单编号
      const { order_number } = await request({ url: '/my/orders/create', method: 'POST', data: orderParams });
      // 5 发起 预支付接口
      const { pay } = await request({ url: '/my/orders/req_unifiedorder', method: 'POST', data: { order_number } });
      // 6 发起 微信支付
      await requestPayment(pay);
      // 7 查询后台 订单状态
      const res = await request({ url: '/my/orders/chkOrder', method: 'POST', data: { order_number } });
      await showToast({ title: '支付成功' });
      // 8 修改购物车缓存
      let newCart = wx.getStorageSync('cart');
      newCart = newCart.filter(v => !v.checked);
      wx.setStorageSync('cart', newCart);
      // 9 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/order'
      });
    } catch (err) {
      await showToast({ title: '支付失败' });
      console.log(err);
    }
  }
})