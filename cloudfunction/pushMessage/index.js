// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async event => {
    try {
        const result = await cloud.openapi.subscribeMessage.send({
            touser: cloud.getWXContext().OPENID, // 通过 getWXContext 获取 OPENID
            page: event.page,
            data: {
                time1: {
                    value: '2020年1月9日'
                },
                thing2: {
                    value: '体验订阅消息推送'
                }
            },
            templateId: 'wAniOv_NUi6TXiQWX74_1LD5E4_6EfqvaeSxUxhqllg'
        });

        return result;
    } catch (err) {
        return err;
    }
};
