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
  finished?: boolean;
  useAssigner?: boolean;
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
  isOwner: boolean,
  useAssigner: boolean,
  participantCnt: number,
  taskCnt: number,
  totalTaskNum: number,
  finished: boolean,
  signInStatus: boolean,
  taskTitle: string,
  isParticipant: boolean
}
