// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event) => {
    const { groupId } = event;
    const timestamp = Date.now(),
        nonceStr = Math.random()
            .toString(36)
            .substr(2);

    const result = await cloud.getVoIPSign({
        groupId,
        timestamp,
        nonce: nonceStr
    });

    return {
        signature: result.signature,
        nonceStr,
        timeStamp: timestamp,
        groupId
    };
};
