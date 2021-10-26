import { getSetting, openSetting, chooseAddress, showModal, showToast } from '../../utils/asyncWx';
// 引入facebook async包，在小程序中即可使用async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },

  // 当去设置地址时，原页面没有卸载，所以当回到原页面时不会执行onload，因此得放在onShow中执行
  onShow () {
    const address = wx.getStorageSync('address'),
          cart = wx.getStorageSync('cart') || [];
    this.setCart(cart);
    this.setData({
      address
    });
  },

  async handleChooseAddress () {
    try {
      const setting = await getSetting(),
      scopeAddress = setting.authSetting['scope.address'];

      if (scopeAddress === false) {
        await openSetting();
      }
      let choiceAddress = await chooseAddress();
      choiceAddress.all = choiceAddress.provinceName + choiceAddress.cityName + choiceAddress.countyName + choiceAddress.detailInfo;
      wx.setStorageSync('address', choiceAddress);
    } catch (error) {
      console.log(error);
    }
  },

  handleItemChange (e) {
    const goods_id = e.currentTarget.dataset.id,
          { cart } = this.data,
          index = cart.findIndex(v => v.goods_id === goods_id);
    
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },

  setCart (cart) {
    let totalPrice = 0,
        totalNum = 0,
        allChecked = true;

    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // cart空数组时不会执行函数因此为true，需要修正
    allChecked = cart.length ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    });
    wx.setStorageSync('cart', cart);
  },

  handleItemAllChange () {
    let { cart, allChecked } = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },

  async handleItemNumEdit (e) {
    const { operation, id } = e.currentTarget.dataset,
          { cart } = this.data,
          index = cart.findIndex(v => v.goods_id === id);

    if (cart[index].num === 1 && operation === -1) {
      const res = await showModal({ content: '您是否要删除？' });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }
  },

  async handlePay () {
    const { address, totalNum } = this.data;
    if (!address.userName) {
      await showToast({ title: '您还没有选择收货地址' });
      return;
    }
    if (totalNum === 0) {
      await showToast({ title: '您还没有选购商品' });
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/pay'
    });
  }
})