const getOpenId = require('./getOpenId/index');
const getMiniProgramCode = require('./getMiniProgramCode/index');
const createCollection = require('./createCollection/index');
const fetchGoodsList = require('./fetchGoodsList/index');
const genMpQrcode = require('./genMpQrcode/index');
const getGroupEnterInfo = require('./getGroupEnterInfo/index')
const addRecord = require('./addRecord')
const selectRecord = require('./selectRecord/index');
const signIn = require('./signIn/index');
const fetchActivityList = require('./fetchActivityList')
const clearCollection = require('./clearCollection/index')
const updateRecord = require('./updateRecord/index')

// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.type) {
    case 'getOpenId':
      return await getOpenId.main(event, context);
    case 'getMiniProgramCode':
      return await getMiniProgramCode.main(event, context);
    case 'createCollection':
      return await createCollection.main(event, context);
    case 'updateRecord':
      return await updateRecord.main(event, context);
    case 'fetchGoodsList':
      return await fetchGoodsList.main(event, context);
    case 'genMpQrcode':
      return await genMpQrcode.main(event, context);
    case 'getGroupEnterInfo':
      return await getGroupEnterInfo.main(event, context);
    case 'addRecord': 
      return await addRecord.main(event, context)
    case 'fetchActivityList':
      return await fetchActivityList.main(event, context)
    case 'selectRecord':
      return await selectRecord.main(event, context);
    case 'signIn': 
      return await signIn.main(event, context)
    case 'clearCollection':
      return await clearCollection.main(event, context)
    case 'updateRecord':
      return await updateRecord.main(event, context)
  }
};
        
