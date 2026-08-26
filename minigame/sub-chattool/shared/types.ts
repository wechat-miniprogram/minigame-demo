/** 数据库中的活动信息 */
export interface ActivityInfo {
  activityId?: string;
  chatType?: number;
  createTime?: number;
  creator?: string;
  participant?: string[];
  roomid?: string;
  signIn?: string[];
  _id?: string;
  isFinished?: boolean;
  isUsingSpecify?: boolean;
  taskTitle?: string;
}

/** 群组信息 */
export interface GroupInfo {
  openid?: string;
  groupOpenID?: string;
  roomid?: string;
  chatType?: number;
}

/** 群任务详情页面的绘制选项 */
export interface DrawGroupTaskDetailOption {
  isOwner: boolean;
  isUsingSpecify: boolean;
  isFinished: boolean;
  isParticipated: boolean;
  isParticipant: boolean;
  participantCnt: number;
  taskCnt: number;
  targetTaskNum: number;
  taskTitle: string;
}

/** 创建任务列表按钮选项 */
export interface CreateTaskButtonOption {
  buttonNumber: number;
  activityId: string;
  roomid: string;
  chatType: number;
  taskTitle: string;
}

/** 创建分享画布选项 */
export interface CreateShareCanvasOption {
  width: number;
  height: number;
  x: number;
  y: number;
  pixelRatio: number;
  scale?: number;
}

/** 分享消息到群聊选项 */
export interface ShareAppMessageToGroupOption {
  activityId: string;
  participant: string[];
  chooseType: number; // 1: 指定人, 2: 所有人
  taskTitle: string;
  success?: (res: any) => void;
  fail?: (err: any) => void;
}

/** 打开聊天工具选项 */
export interface OpenChatToolOption {
  roomid?: string;
  chatType?: number;
  success?: (res: any) => void;
  fail?: (err: any) => void;
}
