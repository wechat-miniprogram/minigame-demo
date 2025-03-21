import { GroupInfo } from "./types";

export function getChatToolInfo(): Promise<GroupInfo> {
  return new Promise((resolve, reject) => {
    // @ts-ignore 声明未更新临时处理
    wx.getChatToolInfo({
      success(res) {
        console.info('getChatToolInfo success: ', res)
        const cloudID = res.cloudID
        wx.cloud.callFunction({
          name: 'quickstartFunctions',
          data: {
            type: 'getGroupEnterInfo',
            groupInfo: wx.cloud.CloudID(cloudID)
          }
        }).then((resp: any) => {
          console.info('getGroupEnterInfo resp: ', resp)
          const groupInfo = resp.result.groupInfo
          if (groupInfo && groupInfo.data) {
            const openid = resp.result.openid
            const opengid = groupInfo.data.opengid
            const openSingleRoomID = groupInfo.data.open_single_roomid
            const groupOpenID = groupInfo.data.group_openid
            const data = {
              openid,
              groupOpenID,
              roomid: opengid || openSingleRoomID,
              chatType: groupInfo.data.chat_type
            }
            resolve(data)
          } else {
            reject()
          }
        }).catch(err => {
          console.info('getGroupEnterInfo fail: ', err)
          reject(err)
        })
      },
      fail(res) {
        console.error('getChatToolInfo fail: ', res)
        reject(res)
      },
    })
  })
}

export function getGroupTaskDetailPath(activityId: string) {
  return `?pathName=groupTaskDetail&activityId=${activityId}`
}
