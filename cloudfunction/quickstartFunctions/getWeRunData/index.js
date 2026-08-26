const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

/**
 * 云函数：解密微信运动数据
 * 前端通过 wx.cloud.CloudID(cloudID) 传入，云函数会自动解密
 * event.weRunData 即为解密后的明文数据
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();

  return {
    weRunData: event.weRunData,
    openid: wxContext.OPENID,
  }
};
