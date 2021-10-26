import { request } from '../../request/index';
// 引入facebook async包，在小程序中即可使用async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },

  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },

  totalPages: 1,

  onLoad: function (options) {
    this.QueryParams.cid = options.cid || '';
    this.QueryParams.query = options.query || '';
    this.getGoodList();
  },

  async getGoodList () {
    const res = await request({ url: '/goods/search', data: this.QueryParams }),
          total = res.total;

    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods]
    });

    // 关闭下拉刷新提示窗口 没有下拉刷新提示窗口情况下也可以去关闭，不会报错的
    wx.stopPullDownRefresh();
  },

  handleTabsItemChange (e) {
    const { index } = e.detail,
          { tabs } = this.data;

    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    });
  },

  // 上拉触底事件
  onReachBottom () {
    // 判断是否有下一页
    if (this.QueryParams.pagenum >= this.totalPages) {
      wx.showToast({
        title: '已经到底啦~'
      });
    } else {
      this.QueryParams.pagenum++;
      this.getGoodList();
    }
  },

  // 下拉刷新事件
  onPullDownRefresh () {
    this.setData({
      goodsList: []
    });
    this.QueryParams.pagenum = 1;
    this.getGoodList();
  }
})