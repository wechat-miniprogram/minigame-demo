// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async () => {
    try {
        // 此处返回 Base64 图片仅作为演示用，在实际开发中，
        // 应上传图片至云文件存储，然后在小程序中通过云文件 ID 使用
        const result = await cloud.openapi.wxacode.getUnlimited({ scene: 'a=1' });
        let base64 = `data:${result.contentType};base64,${result.buffer.toString('base64')}`;
        return {
            errMsg: result.errMsg,
            errCode: result.errCode,
            base64
        };
    } catch (err) {
        console.log(err);
        return err;
    }
};
