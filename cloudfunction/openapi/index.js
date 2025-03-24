// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

async function sendTemplateMessage(event) {
  const {OPENID} = cloud.getWXContext()

  // 接下来将新增模板、发送模板消息、然后删除模板
  // 注意：新增模板然后再删除并不是建议的做法，此处只是为了演示，模板 ID 应在添加后保存起来后续使用
  const addResult = await cloud.openapi.templateMessage.addTemplate({
    id: 'AT0002',
    keywordIdList: [3, 4, 5]
  })

  const templateId = addResult.result.templateId

  const sendResult = await cloud.openapi.templateMessage.send({
    touser: OPENID,
    templateId,
    formId: event.formId,
    page: 'page/cloud/pages/scf-openapi/scf-openapi',
    data: {
      keyword1: {
        value: '未名咖啡屋',
      },
      keyword2: {
        value: '2019 年 1 月 1 日',
      },
      keyword3: {
        value: '拿铁',
      },
    }
  })

  await cloud.openapi.templateMessage.deleteTemplate({
    templateId,
  })

  return sendResult
}

async function updateChatToolMsg(event) {
  const { activityId, targetState } = event

  if (targetState === 3) {
    const db = cloud.database();
    const resp = await db.collection('activity').where({
      activityId
    }).get();
  
    if (!resp.data || !resp.data.length) {
      return {
        success: false,
        errMsg: '未找到对应活动'
      }
    }
    const activityInfo = resp.data[0]
  
    const updateResp = await db.collection('activity').doc(activityInfo._id).update({
      data: {
        isFinished: true
      }
    })
  }

  const parameterList = event.parameterList
  const infoList = parameterList.map(item => ({
    group_openid: item.groupOpenID,
    state: item.state
  }))

  const args = {
    activity_id: event.activityId,
    target_state: event.targetState,
    template_id: event.templateId,
    participator_info_list: infoList,
    version_type: event.versionType
  }
  const result = await cloud.openapi.chattoolmsg.send(args)

  return result
}

async function getWXACode() {
  const {result} = await cloud.openapi.wxacode.getUnlimited({
    scene: 'x=1',
  })

  // 此处返回 Base64 图片仅作为演示用，在实际开发中，
  // 应上传图片至云文件存储，然后在小程序中通过云文件 ID 使用
  return `data:${result.contentType};base64,${result.buffer.toString('base64')}`
}

async function createActivityId(event) {
  const result = await cloud.openapi.updatableMessage.createActivityId({})
  return result
}


// 云函数入口函数
// eslint-disable-next-line
exports.main = async (event) => {
  switch (event.action) {
    case 'sendTemplateMessage': {
      return sendTemplateMessage(event)
    }
    case 'getWXACode': {
      return getWXACode(event)
    }
    case 'sendSubscribeMessage': {
      return sendSubscribeMessage(event)
    }
    case 'createActivityId': {
      return createActivityId(event)
    }
    case 'updateChatToolMsg': {
      return updateChatToolMsg(event)
    }
    default: break
  }
}

// 下发订阅消息
async function sendSubscribeMessage(event) {
  const { OPENID } = cloud.getWXContext()

  // const templateId = addResult.result.templateId
  const templateId = 'y1bXHAg_oDuvrQ3pHgcODcMPl-2hZHenWugsqdB2CXY'

  const sendResult = await cloud.openapi.subscribeMessage.send({
    touser: OPENID,
    template_id: templateId,
    data: {
      thing1: {
        value: '订阅消息示例',
      },
      thing2: {
        value: '手动触发',
      }
    }
  })

  // await cloud.openapi.templateMessage.deleteTemplate({
  //   templateId,
  // })

  return sendResult
}