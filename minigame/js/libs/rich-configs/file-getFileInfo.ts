/**
 * getFileInfo rich-config
 * 获取文件信息：路径展示框 + 提示文字 + 获取按钮
 */

import * as logic from '../../api/file/getFileInfo/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '获取文件信息',
  apiName: 'getFileInfo',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_text, p_box, p_button } = require('../component/index');
    const underlineBottom = underline ? underline.y + underline.height : 0;
    const container = new PIXI.Container();

    const pathBox = p_box(PIXI, {
      height: 88 * PIXI.ratio,
      border: { width: PIXI.ratio, color: 0xe5e5e5 },
      y: underlineBottom + 61 * PIXI.ratio,
    });

    const tipText = p_text(PIXI, {
      content: '提示：路径可以是代码包绝对路径、本地临时路\n径、本地路径和本地缓存路径',
      fontSize: 32 * PIXI.ratio,
      fill: 0xbebebe,
      align: 'center',
      lineHeight: 45 * PIXI.ratio,
      y: pathBox.y + pathBox.height + 24 * PIXI.ratio,
      relative_middle: { containerWidth: obj.width },
    });

    const getFileInfoButton = p_button(PIXI, {
      width: 580 * PIXI.ratio,
      y: pathBox.y + pathBox.height + 166 * PIXI.ratio,
    });

    pathBox.addChild(
      p_text(PIXI, {
        content: `路径`,
        fontSize: 34 * PIXI.ratio,
        x: 30 * PIXI.ratio,
        relative_middle: { containerHeight: pathBox.height },
      }),
      p_text(PIXI, {
        content: 'images/weapp.jpg',
        fontSize: 34 * PIXI.ratio,
        relative_middle: {
          containerWidth: pathBox.width,
          containerHeight: pathBox.height,
        },
      }),
    );

    getFileInfoButton.myAddChildFn(
      p_text(PIXI, {
        content: '获取文件信息',
        fontSize: 36 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: getFileInfoButton.width,
          containerHeight: getFileInfoButton.height,
        },
      }),
    );
    getFileInfoButton.onClickFn(() => {
      logic.getFileInfo();
    });

    container.addChild(pathBox, tipText, getFileInfoButton);
    return container;
  },

  actions: [],
  onUnload: () => logic.onUnload(),
};
