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
}

// 自定义
export interface GroupInfo {
  openid?: string;
  groupOpenID?: string;
  roomid?: string;
  chatType?: number;
}
