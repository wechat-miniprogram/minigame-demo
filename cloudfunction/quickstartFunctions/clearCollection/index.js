const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  const _ = db.command

  try {
    return await db.collection('activity').where({
      createTime: _.gt(0)
    }).remove()
  } catch(e) {
    console.error(e)
  }
};
