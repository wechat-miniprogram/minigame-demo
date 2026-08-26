/**
 * 虚拟支付（米大师）
 * wx.requestMidasPayment / wx.requestMidasPaymentGameItem
 * wx.requestMidasFriendPayment / wx.checkIsSupportMidasPayment
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/midas-payment/wx.requestMidasPayment.html
 *
 * 注意：本演示需要小游戏配置虚拟支付能力、且必须正式版/体验版才能真正下单。
 * 这里只演示 API 调用形态，下单数据请按业务实际填充。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮发起米大师支付或查询订单，支付结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'midas';
const TIP = '参数皆为虚拟，用户可下载demo后自行填入可用参数查看效果';
const TIP_DURATION = 1500;

/** 检测是否支持米大师支付，不支持则 toast 提示并返回 false */
function checkMidasSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    (wx as any).checkIsSupportMidasPayment({
      success(res: any) {
        if (res?.data?.allow_pay) {
          resolve(true);
        } else {
          wx.showToast({
            title: '当前不支持米大师支付',
            icon: 'none',
            duration: 1000,
          });
          resolve(false);
        }
      },
      fail(err: any) {
        wx.showToast({
          title: `检测支付能力失败：${err?.errMsg || '未知错误'}`,
          icon: 'none',
          duration: 1000,
        });
        resolve(false);
      },
    });
  });
}

/** 检查是否支持米大师支付 */
export function checkIsSupportMidasPayment() {
  (wx as any).checkIsSupportMidasPayment({
    success(res: any) {
      wx.showToast({
        title: `查询成功，support: ${res.data.allow_pay}`,
        icon: 'none',
        duration: 1000,
      });
    },
    fail(err: any) {
      wx.showToast({
        title: `查询失败：${err?.errMsg || '未知错误'}`,
        icon: 'none',
        duration: 1000,
      });
    },
  });
}

/** 发起米大师支付（按金额买货币） */
export async function requestMidasPayment() {
  const supported = await checkMidasSupport();
  if (!supported) return;
  wx.showToast({ title: TIP, icon: 'none', duration: TIP_DURATION });
  setTimeout(() => {
    wx.requestMidasPayment({
      mode: 'game',
      env: 1,
      offerId: '1450000000',
      currencyType: 'CNY',
      platform: 'android',
      buyQuantity: 10,
      outTradeNo: 'demo_' + Date.now(),
      success(res: any) {
        wx.showToast({ title: '支付成功', icon: 'none', duration: 1000 });
      },
      fail(err: any) {
        setInfo(
          formatObj({
            状态: '支付失败',
            原因: err?.errMsg || '未知错误',
          })
        );
      },
    } as any);
  }, TIP_DURATION);
}

/** 发起米大师道具直购 */
export async function requestMidasPaymentGameItem() {
  const supported = await checkMidasSupport();
  if (!supported) return;
  wx.showToast({ title: TIP, icon: 'none', duration: TIP_DURATION });
  setTimeout(() => {
    (wx as any).requestMidasPaymentGameItem({
      mode: 'short_series_game',
      env: 0,
      offerId: '1450000000',
      signData: '{}',
      paySig: 'placeholder',
      signature: 'placeholder',
      success(res: any) {
        wx.showToast({ title: '道具购买成功', icon: 'none', duration: 1000 });
      },
      fail(err: any) {
        setInfo(
          formatObj({
            状态: '道具购买失败',
            原因: err?.errMsg || '未知错误',
          })
        );
      },
    });
  }, TIP_DURATION);
}

/** 好友代付 */
export async function requestMidasFriendPayment() {
  const supported = await checkMidasSupport();
  if (!supported) return;
  wx.showToast({ title: TIP, icon: 'none', duration: TIP_DURATION });
  setTimeout(() => {
    (wx as any).requestMidasFriendPayment({
      mode: 'game',
      env: 0,
      offerId: '1450000000',
      currencyType: 'CNY',
      platform: 'android',
      buyQuantity: 10,
      outTradeNo: 'demo_friend_' + Date.now(),
      success(res: any) {
        wx.showToast({ title: '好友代付成功', icon: 'none', duration: 1000 });
      },
      fail(err: any) {
        setInfo(
          formatObj({
            状态: '好友代付失败',
            原因: err?.errMsg || '未知错误',
          })
        );
      },
    });
  }, TIP_DURATION);
}
