const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
exports.main = async (event, context) => {
  return {
    dataList: [
      { _id: '1', title: '微信气泡徽章', price: 1800 },
      { _id: '2', title: '微信地球鼠标垫', price: 5800 },
      { _id: '3', title: '微信黄脸大贴纸', price: 500 }
    ],
  }
};

// const cloud = require('wx-server-sdk');
// cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// const db = cloud.database();

// exports.main = async (event, context) => {
//   const result = await db.collection('goods')
//     .skip(0)
//     .limit(10)
//     .get();
//   return {
//     dataList: result?.data,
//   };
// };
        