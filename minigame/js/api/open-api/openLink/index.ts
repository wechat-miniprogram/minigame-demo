/**
 * OPENLINK / PageManager
 * wx.createPageManager
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/open-api/openlink/wx.createPageManager.html
 *
 * 每个组件使用独立的 pageManager 实例（load + show 两步式）。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮触发对应 openlink 模板，事件日志将在此区域实时展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'openLink';

// ============== openlink 值 ==============

const RECOMMEND_OPENLINK =
  'TWFRCqV5WeM2AkMXhKwJ03MhfPOieJfAsvXKUbWvQFQtLyyA5etMPabBehga950uzfZcH3Vi3QeEh41xRGEVFw';

const WECARE_LIKE_OPENLINK =
  'wCIJpZM7N0rsMbYlKH03Z1uFI2G6Nr1nUhPqMc9lC4pqchc4G-s-zfU09baSzQWeztheB0DEF1KC8hbqI2ST31oGgGeJBipmVSO1trYCNmQ';

const CHARITY_FUND_OPENLINK =
  'X5TclDH7CWVKbF8uUysD_Qgj93ixPLYkuY57VTjGQ9797nwh9kT-rCy3fqSLsjW50BsiioV8OBPuXw4-vFG92Ge1PJHiXduZ5ilVE6rlURICbL35bMPxm68lGNhy1fK5';

const CPS_OPENLINK =
  'wFFX1cDJnwJCet72QGUJJvBpa9z9lfAob-7EYHwzFENHJ_tNECj5LquvJqnbm82RktAcRyg7gORaUSh0yRSiuYF21JvF84j7-SgazajvTW-ScbwFiQccq8FWsrzHVPox1dr90HHv_CTrgRJD4HOdiRJFeLNRrDu0Pj3vsIGuonI';

// ============== 各实例（每个按钮独立） ==============

let recommendPM: any = null;
let likePM: any = null;
let charityPM: any = null;
let cpsSingleGame1PM: any = null;
let cpsSingleGame2PM: any = null;
let cpsMultiGame1PM: any = null;
let cpsMultiGame2PM: any = null;
let cpsShowcasePM: any = null;

// ============== 推荐组件 ==============

/** 推荐组件 */
export function recommendComponent() {
  if (!(wx as any).createPageManager) {
    setInfo('当前基础库版本暂不支持 createPageManager');
    return;
  }

  const doShow = () => {
    recommendPM.show()
      .then(() => setInfo('[推荐组件] show success'))
      .catch((e: any) => setInfo(`[推荐组件] show fail: ${JSON.stringify(e)}`));
  };

  if (recommendPM) {
    doShow();
    return;
  }

  const pm: any = (wx as any).createPageManager();
  pm.on('onClose', () => setInfo('[推荐组件] onClose — 半屏已关闭'));
  pm.on('error', (res: any) => setInfo(`[推荐组件] error: ${JSON.stringify(res)}`));

  setInfo('[推荐组件] loading...');
  pm.load({ openlink: RECOMMEND_OPENLINK })
    .then(() => {
      recommendPM = pm;
      setInfo('[推荐组件] load success，正在拉起半屏...');
      doShow();
    })
    .catch((err: any) => {
      setInfo(`[推荐组件] load fail: ${JSON.stringify(err)}`);
    });
}

// ============== WeCare 点赞活动 ==============

/** WeCare 点赞活动 */
export function wecareLikeActivity() {
  if (!(wx as any).createPageManager) {
    setInfo('当前基础库版本暂不支持 createPageManager');
    return;
  }

  const doShow = () => {
    likePM.show()
      .then(() => setInfo('[WeCare点赞] show success'))
      .catch((e: any) => setInfo(`[WeCare点赞] show fail: ${JSON.stringify(e)}`));
  };

  if (likePM) {
    doShow();
    return;
  }

  const pm: any = (wx as any).createPageManager();
  pm.on('onClose', () => setInfo('[WeCare点赞] onClose — 半屏已关闭'));
  pm.on('error', (res: any) => setInfo(`[WeCare点赞] error: ${JSON.stringify(res)}`));

  setInfo('[WeCare点赞] loading...');
  pm.load({ openlink: WECARE_LIKE_OPENLINK })
    .then(() => {
      likePM = pm;
      setInfo('[WeCare点赞] load success，正在拉起半屏...');
      doShow();
    })
    .catch((err: any) => {
      setInfo(`[WeCare点赞] load fail: ${JSON.stringify(err)}`);
    });
}

// ============== 公益金 ==============

/** 公益金 */
export function wecareCharityFund() {
  if (!(wx as any).createPageManager) {
    setInfo('当前基础库版本暂不支持 createPageManager');
    return;
  }

  const doShow = () => {
    charityPM.show()
      .then(() => setInfo('[公益金] show success'))
      .catch((e: any) => setInfo(`[公益金] show fail: ${JSON.stringify(e)}`));
  };

  if (charityPM) {
    doShow();
    return;
  }

  const pm: any = (wx as any).createPageManager();
  pm.on('onClose', () => setInfo('[公益金] onClose — 半屏已关闭'));
  pm.on('error', (res: any) => setInfo(`[公益金] error: ${JSON.stringify(res)}`));

  setInfo('[公益金] loading...');
  pm.load({ openlink: CHARITY_FUND_OPENLINK })
    .then(() => {
      charityPM = pm;
      setInfo('[公益金] load success，正在拉起半屏...');
      doShow();
    })
    .catch((err: any) => {
      setInfo(`[公益金] load fail: ${JSON.stringify(err)}`);
    });
}

// ============== CPS 单游戏组件1（指定游戏、未指定位置） ==============

/** CPS 单游戏组件1 */
export function cpsSingleGame1() {
  if (!(wx as any).createPageManager) {
    setInfo('当前基础库版本暂不支持 createPageManager');
    return;
  }

  const doShow = () => {
    cpsSingleGame1PM.show({
      openlink: CPS_OPENLINK,
      query: { id: 'CpsCBgAAoXkpQY8NWzzP0cJO' },
    })
      .then(() => setInfo('[CPS单游戏1] show success'))
      .catch((e: any) => setInfo(`[CPS单游戏1] show fail: ${JSON.stringify(e)}`));
  };

  if (cpsSingleGame1PM) {
    doShow();
    return;
  }

  const pm: any = (wx as any).createPageManager();
  pm.on('show', () => setInfo('[CPS单游戏1] show'));
  pm.on('destroy', () => setInfo('[CPS单游戏1] destroy'));
  pm.on('ready', () => setInfo('[CPS单游戏1] ready'));
  pm.on('click', (res: any) => setInfo(`[CPS单游戏1] click: ${JSON.stringify(res)}`));
  pm.on('error', (res: any) => setInfo(`[CPS单游戏1] error: ${JSON.stringify(res)}`));

  cpsSingleGame1PM = pm;
  doShow();
}

// ============== CPS 单游戏组件2（未指定游戏、指定位置） ==============

/** CPS 单游戏组件2 */
export function cpsSingleGame2() {
  if (!(wx as any).createPageManager) {
    setInfo('当前基础库版本暂不支持 createPageManager');
    return;
  }

  const doShow = () => {
    cpsSingleGame2PM.show({
      openlink: CPS_OPENLINK,
      query: { id: 'CpsCBgAAoXkpQY8NWzzP0cJO', top: 200, left: 100 },
    })
      .then(() => setInfo('[CPS单游戏2] show success'))
      .catch((e: any) => setInfo(`[CPS单游戏2] show fail: ${JSON.stringify(e)}`));
  };

  if (cpsSingleGame2PM) {
    doShow();
    return;
  }

  const pm: any = (wx as any).createPageManager();
  pm.on('show', () => setInfo('[CPS单游戏2] show'));
  pm.on('destroy', () => setInfo('[CPS单游戏2] destroy'));
  pm.on('ready', () => setInfo('[CPS单游戏2] ready'));
  pm.on('click', (res: any) => setInfo(`[CPS单游戏2] click: ${JSON.stringify(res)}`));
  pm.on('error', (res: any) => setInfo(`[CPS单游戏2] error: ${JSON.stringify(res)}`));

  cpsSingleGame2PM = pm;
  doShow();
}

// ============== CPS 多游戏组件1（指定游戏、未指定位置、横版） ==============

/** CPS 多游戏组件1（横版） */
export function cpsMultiGame1() {
  if (!(wx as any).createPageManager) {
    setInfo('当前基础库版本暂不支持 createPageManager');
    return;
  }

  const doShow = () => {
    cpsMultiGame1PM.show({
      openlink: CPS_OPENLINK,
      query: { id: 'CpsCBgAAoXkpQY8NWzzP0cJN' },
    })
      .then(() => setInfo('[CPS多游戏1-横版] show success'))
      .catch((e: any) => setInfo(`[CPS多游戏1-横版] show fail: ${JSON.stringify(e)}`));
  };

  if (cpsMultiGame1PM) {
    doShow();
    return;
  }

  const pm: any = (wx as any).createPageManager();
  pm.on('show', () => setInfo('[CPS多游戏1-横版] show'));
  pm.on('destroy', () => setInfo('[CPS多游戏1-横版] destroy'));
  pm.on('ready', () => setInfo('[CPS多游戏1-横版] ready'));
  pm.on('click', (res: any) => setInfo(`[CPS多游戏1-横版] click: ${JSON.stringify(res)}`));
  pm.on('error', (res: any) => setInfo(`[CPS多游戏1-横版] error: ${JSON.stringify(res)}`));

  cpsMultiGame1PM = pm;
  doShow();
}

// ============== CPS 多游戏组件2（指定游戏、未指定位置、竖版） ==============

/** CPS 多游戏组件2（竖版） */
export function cpsMultiGame2() {
  if (!(wx as any).createPageManager) {
    setInfo('当前基础库版本暂不支持 createPageManager');
    return;
  }

  const doShow = () => {
    cpsMultiGame2PM.show({
      openlink: CPS_OPENLINK,
      query: { id: 'CpsCBgAAoXkpQY8NWzzP0cJN', isVertical: true },
    })
      .then(() => setInfo('[CPS多游戏2-竖版] show success'))
      .catch((e: any) => setInfo(`[CPS多游戏2-竖版] show fail: ${JSON.stringify(e)}`));
  };

  if (cpsMultiGame2PM) {
    doShow();
    return;
  }

  const pm: any = (wx as any).createPageManager();
  pm.on('show', () => setInfo('[CPS多游戏2-竖版] show'));
  pm.on('destroy', () => setInfo('[CPS多游戏2-竖版] destroy'));
  pm.on('ready', () => setInfo('[CPS多游戏2-竖版] ready'));
  pm.on('click', (res: any) => setInfo(`[CPS多游戏2-竖版] click: ${JSON.stringify(res)}`));
  pm.on('error', (res: any) => setInfo(`[CPS多游戏2-竖版] error: ${JSON.stringify(res)}`));

  cpsMultiGame2PM = pm;
  doShow();
}

// ============== CPS 橱窗组件（指定游戏） ==============

/** CPS 橱窗组件 */
export function cpsShowcase() {
  if (!(wx as any).createPageManager) {
    setInfo('当前基础库版本暂不支持 createPageManager');
    return;
  }

  const doShow = () => {
    cpsShowcasePM.show()
      .then(() => setInfo('[CPS橱窗] show success'))
      .catch((e: any) => setInfo(`[CPS橱窗] show fail: ${JSON.stringify(e)}`));
  };

  if (cpsShowcasePM) {
    doShow();
    return;
  }

  const pm: any = (wx as any).createPageManager();
  pm.on('show', () => setInfo('[CPS橱窗] show'));
  pm.on('destroy', () => setInfo('[CPS橱窗] destroy'));
  pm.on('ready', () => setInfo('[CPS橱窗] ready'));
  pm.on('click', (res: any) => setInfo(`[CPS橱窗] click: ${JSON.stringify(res)}`));
  pm.on('error', (res: any) => setInfo(`[CPS橱窗] error: ${JSON.stringify(res)}`));

  setInfo('[CPS橱窗] loading...');
  pm.load({
    openlink: CPS_OPENLINK,
    query: { id: 'CpsCBgAAoXkpQY8NWzzP0cJM' },
  })
    .then(() => {
      cpsShowcasePM = pm;
      setInfo('[CPS橱窗] load success，正在拉起半屏...');
      doShow();
    })
    .catch((err: any) => {
      setInfo(`[CPS橱窗] load fail: ${JSON.stringify(err)}`);
    });
}

// ============== 页面卸载清理 ==============

export function onUnload() {
  if (recommendPM) {
    recommendPM.destroy?.();
    recommendPM = null;
  }
  if (likePM) {
    likePM.destroy?.();
    likePM = null;
  }
  if (charityPM) {
    charityPM.destroy?.();
    charityPM = null;
  }
  if (cpsSingleGame1PM) {
    cpsSingleGame1PM.destroy?.();
    cpsSingleGame1PM = null;
  }
  if (cpsSingleGame2PM) {
    cpsSingleGame2PM.destroy?.();
    cpsSingleGame2PM = null;
  }
  if (cpsMultiGame1PM) {
    cpsMultiGame1PM.destroy?.();
    cpsMultiGame1PM = null;
  }
  if (cpsMultiGame2PM) {
    cpsMultiGame2PM.destroy?.();
    cpsMultiGame2PM = null;
  }
  if (cpsShowcasePM) {
    cpsShowcasePM.destroy?.();
    cpsShowcasePM = null;
  }
}
