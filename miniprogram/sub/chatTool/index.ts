import { getInteractUI } from "./render";

export function renderGroupTaskMembersInfo(data: any) {
  console.log('!!! renderGroupTaskMembersInfo', data);
  const { screenWidth, screenHeight } = wx.getSystemInfoSync();
  // let groupMembersInfo = [];
  // @ts-ignore 声明未更新临时处理
  wx.getGroupMembersInfo({
    members: data.members,
    success: (res: any) => {
      console.log('!!! getGroupMembersInfo success', res);
      // groupMembersInfo = res.groupMembers;
      getInteractUI(res.groupMembers, {
        x: 0,
        y: 0,
        width: screenWidth,
        height: screenHeight,
      });
    },
    fail: (err: any) => {
      console.error(err);
    },
  });
}
