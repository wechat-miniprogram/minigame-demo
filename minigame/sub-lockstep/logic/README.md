# lockstep logic 层 —— 帧同步 API 使用样本

本目录是**微信小游戏帧同步 API 的完整使用示例**，与渲染分离。
想了解 `wx.getGameServerManager()` 怎么用，只需要读这几个文件就够了。

## 推荐阅读顺序

```
1. gameserver.js   ★ 核心（500 行）：wx.getGameServerManager 全套 API 封装
                   - 登录 / 断线重连
                   - 房间生命周期
                   - 帧同步核心（onSyncFrame / uploadFrame）
                   - 匹配 / 广播

2. home.js         快速匹配 vs 创建房间 两种进房方式

3. room.js         准备 / 开始游戏 / 邀请 / 离开 的 API 调用

4. battle.js       帧同步指令上传的 3 种类型（MOVE / SHOOT / STOP）

5. result.js       结算与清理（最简单）
```

## 核心流程图

```
首页 Home
  ├─ quickStart()        → gameServer.createMatchRoom → startMatch
  │                                                     ↓ 匹配成功
  │                                                    onMatch → joinRoom
  └─ createRoom()        → gameServer.createRoom       → 建房成功
                                                         ↓ 分享
                                                         shareAppMessage

房间 Room
  ├─ toggleReady         → updateReadyStatus
  ├─ startGame           → broadcastInRoom({msg:'START'})
  │                         ↓ 每个客户端 onBroadcast
  │                         gameServer.startGame()
  │                         ↓ server 回调 onGameStart
  │                         切到 Battle
  └─ leaveRoom           → ownerLeaveRoom / memberLeaveRoom

战斗 Battle
  ├─ sendMoveDirection   → uploadFrame([{e:MOVE_DIRECTION, n:clientId, d:度数}])
  ├─ sendMoveStop        → uploadFrame([{e:MOVE_STOP, n:clientId}])
  ├─ sendShoot           → uploadFrame([{e:SHOOT, n:clientId}])
  │
  │         每 33ms 服务端广播 onSyncFrame({frameId, actionList})
  │         gameServer 缓冲到 frames[] 并每帧派发给 view 层
  │
  └─ confirmLeaveGame    → endGame / leaveRoom

结算 Result
  └─ backToHome          → gameServer.clear() → event.emit('backHome')
```

## 设计原则：logic 与 view 如何通信？

**logic → view** 用 setter 注入：
```js
// view 层
import * as battleLogic from '../logic/battle';
battleLogic.setOnOpponentLeave((memberList) => {
    this.showModal('对方已离开！');
});

// logic 层
let _onOpponentLeave = null;
export function setOnOpponentLeave(fn) { _onOpponentLeave = fn; }
// 触发时：
_onOpponentLeave && _onOpponentLeave(memberList);
```

**view → logic** 直接调函数：
```js
// view 层
this.joystick.onChange = (e) => battleLogic.sendMoveDirection(e.degree);
```

**全局事件用 gameServer.event**（进出场景等跨 scene 的事件）：
```js
gameServer.event.on('onGameStart', () => runScene(Battle));
```

## 配置参数

- `config.msg.*`：指令类型枚举（SHOOT/MOVE_DIRECTION/MOVE_STOP/STAT）
- `config.roomState.*`：房间状态枚举（inTeam/gameStart/gameEnd/roomDestroy）
- `config.roleMap.*`：角色枚举（owner=1 / partner=0）

## 配套配置（不在代码里）

1. `game.json` 里需要 `lockStepOptions` 和 `resizable:true`
2. 快速匹配需要在**小游戏管理后台**配置对局匹配规则，拿到 `match_id` 替换 `gameserver.js` 里的硬编码值。
