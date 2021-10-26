import { request } from '../../request/index';
// 引入facebook async包，在小程序中即可使用async语法
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({
  data: {
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    chooseImgs: [],
    textVal: ''
  },

  UploadImgs: [],

  handleTabsItemChange (e) {
    const { index } = e.detail,
          { tabs } = this.data;

    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    this.setData({
      tabs
    });
  },

  handleChooseImg () {
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album','camera'],
      success: (result)=>{
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        });
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },

  handleRemoveImg (e) {
    const { index } = e.currentTarget.dataset;
    let { chooseImgs } = this.data;
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    });
  },

  handleTextInput (e) {
    this.setData({
      textVal: e.detail.value
    });
  },

  handleFormSubmit () {
    const { textVal, chooseImgs } = this.data;
    if (!textVal.trim()) {
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        mask: true
      });
      return;
    }
    wx.showLoading({
      title: '正在上传中',
      mask: true
    });

    if (chooseImgs.length !== 0) {
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          url: 'https://img.coolcr.cn/api/upload',
          filePath: v,
          name: "image",
          formData: {},
          success: (result)=>{
            const url = JSON.parse(result.data).data.url;
            this.UploadImgs.push(url);
  
            if (i === chooseImgs.length - 1) {
              // 把文本内容和外网的图片数组提交到后台（这一步没有接口地址，不写了）
              // 提交成功后
              wx.hideLoading();
              this.setData({
                textVal: '',
                chooseImgs: []
              });
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      });
    } else {
      // 只提交文本
      wx.hideLoading();
      wx.navigateBack({
        delta: 1
      });
    }
  }
})