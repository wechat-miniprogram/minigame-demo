const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});
const db = cloud.database();

// 修改数据库信息云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext();
    await db.collection('activity').add({
      data: {
        creator: wxContext.OPENID,
        activityId: event.activityId,
        roomid: event.roomid,
        chatType: event.chatType,
        // title: event.title,
        // coverImage: event.coverImage,
        // startTime: event.startTime,
        // endTime: event.endTime,
        participant: event.participant,
        signIn: event.signIn,
        // targetState: event.targetState,
        useAssigner: event.useAssigner,
        finished: event.finished,
        createTime: Date.now()
      }
    })
    return {
      success: true,
    };
  } catch (e) {
    return {
      success: false,
      errMsg: e
    };
  }
};
