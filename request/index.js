let ajaxTimes = 0;
export const request = (params) => {
  // 判断url中是否带有/my/ 请求的是私有的路径，带上header token
  let header = { ...params.header };
  if (params.url.includes('/my/')) {
    header['Authorization'] = wx.getStorageSync('token');
  }
  ajaxTimes++;
  wx.showLoading({
    title: '加载中',
    mask: true
  });
  const baseUrl = 'https://api-hmugo-web.itheima.net/api/public/v1';
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTimes--;
        // 有多个异步加载的情况下，等最后一个完成时再关闭toast
        if (ajaxTimes === 0) {
          wx.hideLoading();
        }
      }
    });
  });
};