export function getGroupMembersInfo(members: string[]): Promise<any> {
  console.log('[WX OpenData] getGroupMembersInfo with members: ', members);
  return new Promise((resolve, reject) => {
    // @ts-ignore 声明未更新临时处理
    wx.getGroupMembersInfo({
      members,
      success: (res: any) => {
        console.log('[WX OpenData] getGroupMembersInfo success: ', res);
        resolve(res); // 成功时返回 res
      },
      fail: (err: any) => {
        console.error('[WX OpenData] getGroupMembersInfo fail: ', err);
        reject(err); // 失败时返回 err
      },
    });
  });
}
