// database
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

// 自定义
export interface GroupInfo {
  openid?: string;
  groupOpenID?: string;
  roomid?: string;
  chatType?: number;
}

// 函数参数
export interface DrawGroupTaskDetailOption {
  isOwner: boolean, // 是否为创建者
  isUsingSpecify: boolean, // 是否使用指定参与者
  isFinished: boolean, // 任务是否已结束
  isParticipated: boolean, // 是否已经参与
  isParticipant: boolean, // 是否为参与者
  participantCnt: number, // 参与人数
  taskCnt: number, // 已做任务次数
  targetTaskNum: number, // 目标任务次数
  taskTitle: string, // 任务标题
}

export interface CreateTaskButtonOption {
  buttonNumber: number,
  activityId: string,
  roomid: string,
  chatType: number,
  taskTitle: string
}

export interface CreateShareCanvasOption {
  width: number,
  height: number,
  x: number,
  y: number,
  pixelRatio: number,
  scale?: number
}
