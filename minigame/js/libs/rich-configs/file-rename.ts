/**
 * rename rich-config
 * 重命名：点击按钮将 fileA 重命名为 newTestFile，再次点击则交换回来
 */

import * as logic from '../../api/file/rename/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '重命名',
  apiName: 'rename',

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
      content: '提示： 可以把文件夹、文件从 oldPath 移动到\nnewPath',
      fontSize: 32 * PIXI.ratio,
      fill: 0xbebebe,
      align: 'center',
      lineHeight: 45 * PIXI.ratio,
      y: pathBox.y + pathBox.height + 37 * PIXI.ratio,
      relative_middle: { containerWidth: obj.width },
    });

    const renameButton = p_button(PIXI, {
      width: 580 * PIXI.ratio,
      y: pathBox.y + pathBox.height + 187 * PIXI.ratio,
    });

    let pathArr = [
      `${wx.env.USER_DATA_PATH}/fileA`,
      `${wx.env.USER_DATA_PATH}/newTestFile`,
    ];

    let path: any;
    pathBox.addChild(
      p_text(PIXI, {
        content: '目录路径',
        fontSize: 34 * PIXI.ratio,
        x: 30 * PIXI.ratio,
        relative_middle: { containerHeight: pathBox.height },
      }),
      (path = p_text(PIXI, {
        content: pathArr[0],
        fontSize: 34 * PIXI.ratio,
        relative_middle: {
          containerWidth: pathBox.width,
          containerHeight: pathBox.height,
        },
      })),
    );

    renameButton.myAddChildFn(
      p_text(PIXI, {
        content: '重命名',
        fontSize: 36 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: renameButton.width,
          containerHeight: renameButton.height,
        },
      }),
    );
    renameButton.onClickFn(() => {
      logic.renameFile(pathArr[0], pathArr[1], () => {
        pathArr = [pathArr[1], pathArr[0]];
        path.turnText(pathArr[0]);
      });
    });

    container.addChild(pathBox, tipText, renameButton);
    return container;
  },

  actions: [],
  onUnload: () => logic.onUnload(),
};
