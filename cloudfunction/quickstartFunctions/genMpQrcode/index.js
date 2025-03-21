const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const pagePath = event.pagePath;
  // 获取小程序二维码的buffer
  const resp = await cloud.openapi.wxacode.get({
    path: pagePath,
  });
  const { buffer } = resp;
  // 将图片上传云存储空间
  const upload = await cloud.uploadFile({
    cloudPath: String(pagePath).replace(/\//g, '_') + '.png',
    fileContent: buffer
  });
  return upload.fileID;
};
        