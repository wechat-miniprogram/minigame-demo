const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 查询数据库集合云函数入口函数
exports.main = async (event, context) => {
  // 返回数据库查询结果
  const { targetState, activityId } = event

  const resp = await db.collection('activity').where({
    activityId
  }).get();

  if (!resp.data || !resp.data.length) {
    return {
      success: false,
      errMsg: '未找到对应活动'
    }
  }

  const activityInfo = resp.data[0]

  const _ = db.command

  const updateResp = await db.collection('activity').doc(activityInfo._id).update({
    data: {
      targetState,
    }
  })

  return {
    success: true,
  }
};
