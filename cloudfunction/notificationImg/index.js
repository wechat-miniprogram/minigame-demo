// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async () => {
    const wxContext = cloud.getWXContext();

    await cloud.openapi.customerServiceMessage.send({
        touser: wxContext.OPENID,
        msgtype: 'text',
        text: {
            content: '收到你发来的图片'
        }
    });

    return 'success';
};
