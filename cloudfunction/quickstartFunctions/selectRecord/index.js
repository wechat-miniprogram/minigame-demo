const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  try {
    const resp = await db.collection('activity').where({
      activityId: event.activityId
    }).get();

    if (resp.data.length) {
      return {
        success: true,
        activityInfo: resp.data[0],
      }
    } else {
      return {
        success: false,
        errMsg: '未找到活动'
      }
    }
  
  } catch (error) {
    return {
      success: false,
      errMsg: error
    }
  }
};
