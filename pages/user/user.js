Page({
  data: {
    userinfo: {},
    collectNums: 0
  },

  onShow () {
    const userinfo = wx.getStorageSync('userinfo'),
          collect = wx.getStorageSync('collect') || [];
    this.setData({
      userinfo,
      collectNums: collect.length
    });
  }
})