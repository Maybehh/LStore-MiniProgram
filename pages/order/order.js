import { request } from '../../request/index';
// 引入facebook async包，在小程序中即可使用async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      }
    ],
    orders: []
  },

  onShow () {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/auth'
      });
      return;
    }
    const pages = getCurrentPages(),
          { options } = pages[pages.length - 1],
          type = options.type;

    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
  },

  changeTitleByIndex (index) {
    const { tabs } = this.data;

    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    });
  },

  handleTabsItemChange (e) {
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    this.getOrders(index + 1);
  },

  async getOrders (type) {
    let { orders } = await request({ url: "/my/orders/all", data: { type } });
    orders = orders.map(v => ({ ...v, create_time_cn: new Date(v.create_time * 1000).toLocaleString() }));
    this.setData({ 
      orders
    });
  }
})