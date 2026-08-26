/**
 * access rich-config
 * 判断文件/目录是否存在：两个可点击列表项 + 底部提示
 */

import * as logic from '../../api/file/access/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '判断文件/目录是否存在',
  apiName: 'access',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_text, p_line, p_box, p_button } = require('../component/index');
    const underlineBottom = underline ? underline.y + underline.height : 0;
    const container = new PIXI.Container();

    const pathArr = [
      `${wx.env.USER_DATA_PATH}/fileA`,
      `${wx.env.USER_DATA_PATH}/fileA/test.txt`,
    ];

    const div_child_arr: any[] = [];
    for (let i = 0, len = pathArr.length; i < len; i++) {
      if (i) {
        div_child_arr.push(
          p_line(
            PIXI,
            {
              width: PIXI.ratio | 0,
              color: 0xe5e5e5,
            },
            [30 * PIXI.ratio, i * div_child_arr[0].height],
            [obj.width, 0],
          ),
        );
      }

      const num = div_child_arr.length;
      div_child_arr[num] = p_button(PIXI, {
        width: obj.width,
        height: 88 * PIXI.ratio,
        color: 0xffffff,
        radius: 0,
        y: num && div_child_arr[num - 1].height + div_child_arr[num - 1].y,
      });

      div_child_arr[num].myAddChildFn(
        p_text(PIXI, {
          content: pathArr[i],
          fontSize: 34 * PIXI.ratio,
          x: 30 * PIXI.ratio,
          relative_middle: {
            containerWidth: div_child_arr[num].width,
            containerHeight: div_child_arr[num].height,
          },
        }),
      );
      const idx = i;
      div_child_arr[num].onClickFn(() => {
        logic.accessFile(idx);
      });
    }

    const divDeploy = {
      height:
        div_child_arr[div_child_arr.length - 1].y +
        div_child_arr[div_child_arr.length - 1].height,
      border: {
        width: PIXI.ratio | 0,
        color: 0xe5e5e5,
      },
      y: underlineBottom + 98 * PIXI.ratio,
    };
    const div = p_box(PIXI, divDeploy);
    div.addChild(...div_child_arr);

    const tipText = p_text(PIXI, {
      content: '点击查询目录是否存在',
      fontSize: 32 * PIXI.ratio,
      fill: 0xbebebe,
      y: underlineBottom + 295 * PIXI.ratio,
      relative_middle: { containerWidth: obj.width },
    });

    container.addChild(div, tipText);
    return container;
  },

  actions: [],
  onUnload: () => logic.onUnload(),
};
