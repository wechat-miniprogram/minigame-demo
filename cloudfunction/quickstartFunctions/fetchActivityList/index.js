const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  try {
    const wxContext = cloud.getWXContext();
    const resp = await db.collection('activity').where({
      creator: wxContext.OPENID 
    }).get();
  
    return {
      success: true,
      dataList: resp.data,
    }
  } catch (error) {
    return {
      success: false,
      errMsg: error
    }
  }
};
