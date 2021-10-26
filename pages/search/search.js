import { request } from '../../request/index';
// 引入facebook async包，在小程序中即可使用async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    goods: [],
    isFocus: false,
    inpValue: ''
  },

  TimeId: -1,

  handleInput (e) {
    const { value } = e.detail;
    clearTimeout(this.TimeId);
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      });
      return;
    }
    this.setData({
      isFocus: true
    });
    this.TimeId = setTimeout(() => {
      this.qsearch(value);
    }, 1000);
  },

  async qsearch (query) {
    const goods = await request({ url: '/goods/qsearch', data: { query }});
    this.setData({
      goods
    });
  },

  handleCancel () {
    this.setData({
      inpValue: '',
      goods: [],
      isFocus: false
    });
  }
})