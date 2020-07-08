// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();

    try {
        if (event.type === "send"){
            const result = await cloud.openapi.miniprogramMessage.send({
                msg_type: event.msg_type,
                content: '体验一下小游戏示例的发送小程序消息功能！',
                page_path: event.page_path,
                openid: wxContext.OPENID,
            });
            return result;
        }
       
    } catch (err) {
        return err;
    }
};
