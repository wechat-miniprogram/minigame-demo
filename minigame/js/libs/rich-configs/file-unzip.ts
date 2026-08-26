/**
 * unzip rich-config
 * 解压文件：点击按钮将 test.zip 解压到 fileA 目录
 */

import * as logic from '../../api/file/unzip/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '解压文件',
  apiName: 'unzip',

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
      content: `提示：把压缩包的内容解压到\n路径 ${JSON.stringify(wx.env.USER_DATA_PATH + '/fileA')} 下`,
      fontSize: 32 * PIXI.ratio,
      fill: 0xbebebe,
      align: 'center',
      lineHeight: 45 * PIXI.ratio,
      y: pathBox.y + pathBox.height + 24 * PIXI.ratio,
      relative_middle: { containerWidth: obj.width },
    });

    const unzipFileButton = p_button(PIXI, {
      width: 580 * PIXI.ratio,
      y: pathBox.y + pathBox.height + 166 * PIXI.ratio,
    });

    pathBox.addChild(
      p_text(PIXI, {
        content: '压缩包',
        fontSize: 34 * PIXI.ratio,
        x: 30 * PIXI.ratio,
        relative_middle: { containerHeight: pathBox.height },
      }),
      p_text(PIXI, {
        content: 'test.zip',
        fontSize: 34 * PIXI.ratio,
        relative_middle: {
          containerWidth: pathBox.width,
          containerHeight: pathBox.height,
        },
      }),
    );

    unzipFileButton.myAddChildFn(
      p_text(PIXI, {
        content: '解压文件',
        fontSize: 36 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: unzipFileButton.width,
          containerHeight: unzipFileButton.height,
        },
      }),
    );
    unzipFileButton.onClickFn(() => {
      logic.unzipFile();
    });

    container.addChild(pathBox, tipText, unzipFileButton);
    return container;
  },

  actions: [],
  onUnload: () => logic.onUnload(),
};
