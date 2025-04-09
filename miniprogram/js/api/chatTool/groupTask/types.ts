/**
 * 数据库中的活动信息接口
 */
export interface ActivityInfo {
  activityId?: string; // 活动ID
  chatType?: number; // 聊天类型
  createTime?: number; // 创建时间
  creator?: string; // 创建者ID
  participant?: string[]; // 参与者列表
  roomid?: string; // 群聊ID
  signIn?: string[]; // 签到成员列表
  _id?: string; // 数据库记录ID
  isFinished?: boolean; // 是否已完成
  isUsingSpecify?: boolean; // 是否使用指定参与者
  taskTitle?: string; // 任务标题
}

/**
 * 群组信息接口
 */
export interface GroupInfo {
  openid?: string; // 用户openid
  groupOpenID?: string; // 用户在群组中的openid
  roomid?: string; // 群聊ID
  chatType?: number; // 聊天类型
}

/**
 * 群任务详情页面的绘制选项接口
 */
export interface DrawGroupTaskDetailOption {
  isOwner: boolean; // 是否为创建者
  isUsingSpecify: boolean; // 是否使用指定参与者
  isFinished: boolean; // 任务是否已结束
  isParticipated: boolean; // 是否已经参与
  isParticipant: boolean; // 是否为参与者
  participantCnt: number; // 参与人数
  taskCnt: number; // 已做任务次数
  targetTaskNum: number; // 目标任务次数
  taskTitle: string; // 任务标题
}

/**
 * 创建任务按钮的选项接口
 */
export interface CreateTaskButtonOption {
  buttonNumber: number; // 按钮序号
  activityId: string; // 活动ID
  roomid: string; // 群聊ID
  chatType: number; // 聊天类型
  taskTitle: string; // 任务标题
}

/**
 * 创建分享画布的选项接口
 */
export interface CreateShareCanvasOption {
  width: number; // 画布宽度
  height: number; // 画布高度
  x: number; // x坐标
  y: number; // y坐标
  pixelRatio: number; // 像素比
  scale?: number; // 缩放比例
}

/**
 * 分享消息到群聊的选项接口
 */
export interface shareAppMessageToGroupOption {
  activityId: string; // 活动ID
  participant: string[]; // 参与者列表
  chooseType: number; // 选择类型：1-指定人，2-所有人
  taskTitle: string; // 任务标题
  success?: any; // 成功回调
  fail?: any; // 失败回调
}

/**
 * 打开聊天工具的选项接口
 */
export interface openChatToolOption {
  roomid?: string; // 群聊ID
  chatType?: number; // 聊天类型
  success?: any; // 成功回调
  fail?: any; // 失败回调
}