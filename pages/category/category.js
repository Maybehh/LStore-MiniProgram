import { request } from '../../request/index';
// 引入facebook async包，在小程序中即可使用async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    leftMenuList: [],
    rightContent: [],
    currentIndex: 0,
    scrollTop: 0
  },

  Cates: [],

  onLoad: function () {
    const Cates = wx.getStorageSync('cates');

    if (!Cates) {
      this.getCate();
    } else {
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCate();
      } else {
        this.Cates = Cates.data;
        this.initCate();
      }
    }
  },

  // 初始化cate选中
  initCate () {
    const leftMenuList = this.Cates.map(v => v.cat_name);
    const rightContent = this.Cates[0].children;

    this.setData({
      leftMenuList,
      rightContent
    });
  },

  // 获取分类数据
  // getCate () {
  //   request({ url: '/categories' })
  //   .then(res => {
  //     this.Cates = res.data.message;
  //     wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
  //     this.initCate();
  //   });
  // },
  async getCate () {
    const res = await request({ url: '/categories' });
    this.Cates = res;
    wx.setStorageSync('cates', { time: Date.now(), data: this.Cates });
    this.initCate();
  },

  // 点击切换
  handleItemTap (e) {
    const { index } = e.currentTarget.dataset,
          rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      // 滚动置顶
      scrollTop: 0
    });
  }
})