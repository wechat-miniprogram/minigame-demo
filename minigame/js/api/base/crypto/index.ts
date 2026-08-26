/**
 * 用户加密
 * wx.getUserCryptoManager
 *   - UserCryptoManager.getLatestUserKey   获取最新用户加密密钥
 *   - UserCryptoManager.getRandomValues    获取密码学安全随机数
 * 官方文档：https://developers.weixin.qq.com/minigame/dev/api/base/crypto/wx.getUserCryptoManager.html
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';
import { formatObj } from '../../../libs/format';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮获取用户加密密钥或安全随机数，结果将在此区域展示。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'crypto';
/** 获取最新的用户加密密钥 */
export function getLatestUserKey() {
  const mgr: any = wx.getUserCryptoManager();
  if (!mgr) { setInfo('获取 CryptoManager 失败'); return; }
  mgr.getLatestUserKey({
    success(res: any) {
      setInfo(
        formatObj({
          encryptKey: shorten(res?.encryptKey),
          iv: shorten(res?.iv),
          version: String(res?.version),
          expireTime: new Date((res?.expireTime || 0) * 1000).toLocaleString(),
        })
      );
    },
    fail(err: any) {
      setInfo(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 获取 6 字节密码学安全随机数 */
export function getRandomValues() {
  const mgr: any = wx.getUserCryptoManager();
  if (!mgr) { setInfo('获取 CryptoManager 失败'); return; }
  mgr.getRandomValues({
    length: 6,
    success(res: any) {
      if (!res?.randomValues) { setInfo('获取随机数失败：randomValues 为空'); return; }
      const bytes = new Uint8Array(res.randomValues);
      setInfo(
        formatObj({
          长度: String(bytes.byteLength),
          十六进制: bufToHex(bytes),
        })
      );
    },
    fail(err: any) {
      setInfo(`获取失败：${err?.errMsg || '未知错误'}`);
    },
  });
}

function shorten(s: string) {
  if (!s) return '-';
  return s.length > 20 ? s.slice(0, 10) + '...' + s.slice(-6) : s;
}

function bufToHex(buf: Uint8Array) {
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join(' ');
}
