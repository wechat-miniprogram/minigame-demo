/**
 * readdir rich-config
 * 查看目录内容：点击按钮后递归读取目录并展示文件列表
 */

import * as logic from '../../api/file/readdir/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '查看目录内容',
  apiName: 'readdir',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_text, p_box, p_button } = require('../component/index');
    const underlineBottom = underline ? underline.y + underline.height : 0;
    const container = new PIXI.Container();

    const pathBox = p_box(PIXI, {
      height: 88 * PIXI.ratio,
      border: { width: PIXI.ratio, color: 0xe5e5e5 },
      y: underlineBottom + 61 * PIXI.ratio,
    });

    const readdirButton = p_button(PIXI, {
      width: 580 * PIXI.ratio,
      y: pathBox.y + pathBox.height + 107 * PIXI.ratio,
    });

    pathBox.addChild(
      p_text(PIXI, {
        content: '目录路径',
        fontSize: 34 * PIXI.ratio,
        x: 30 * PIXI.ratio,
        relative_middle: { containerHeight: pathBox.height },
      }),
      p_text(PIXI, {
        content: `${wx.env.USER_DATA_PATH}/fileA`,
        fontSize: 34 * PIXI.ratio,
        relative_middle: {
          containerWidth: pathBox.width,
          containerHeight: pathBox.height,
        },
      }),
    );

    function showListFn(statsArr: any[]) {
      const div_child_arr: any[] = [];

      for (let i = 0; i < statsArr.length; i++) {
        if (statsArr[i].path.length < 2) {
          statsArr.shift();
          i--;
          continue;
        }

        div_child_arr[i] = p_box(PIXI, {
          height: 88 * PIXI.ratio,
          border: {
            width: PIXI.ratio | 0,
            color: 0xe5e5e5,
          },
          y:
            i &&
            div_child_arr[i - 1].height +
              div_child_arr[i - 1].y -
              (PIXI.ratio | 0),
        });

        div_child_arr[i].addChild(
          p_text(PIXI, {
            content: statsArr[i].stats.isFile() ? '文件' : '目录',
            fontSize: 34 * PIXI.ratio,
            x: 30 * PIXI.ratio,
            relative_middle: { containerHeight: div_child_arr[i].height },
          }),
          p_text(PIXI, {
            content: statsArr[i].path.replace('/', ''),
            fontSize: 34 * PIXI.ratio,
            x: 200 * PIXI.ratio,
            relative_middle: {
              containerWidth: div_child_arr[i].width,
              containerHeight: div_child_arr[i].height,
            },
          }),
        );
      }

      const divDeploy = {
        height:
          div_child_arr[div_child_arr.length - 1].y +
          div_child_arr[div_child_arr.length - 1].height,
        border: {
          width: PIXI.ratio | 0,
          color: 0xe5e5e5,
        },
        y: pathBox.y + pathBox.height - PIXI.ratio,
      };
      const div = p_box(PIXI, divDeploy);
      div.addChild(...div_child_arr);
      container.addChild(div);
    }

    readdirButton.myAddChildFn(
      p_text(PIXI, {
        content: '点击查看',
        fontSize: 36 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: readdirButton.width,
          containerHeight: readdirButton.height,
        },
      }),
    );
    readdirButton.onClickFn(() => {
      logic.readdir((dirPath) => {
        logic.statRecursive(dirPath, (stats) => {
          showListFn(stats);
          readdirButton.hideFn();
        });
      });
    });

    container.addChild(pathBox, readdirButton);
    return container;
  },

  actions: [],
  onUnload: () => logic.onUnload(),
};
