/**
 * savedFile rich-config
 * 本地缓存文件：获取列表按钮 → scroll 渲染文件信息 → 清空按钮
 */

import * as logic from '../../api/file/savedFile/index';
import type { RichConfig } from '../rich-renderer';

export const config: RichConfig = {
  title: '本地缓存文件',
  apiName: 'savedFile',

  buildTopView(PIXI: any, _app: any, obj: any, underline: any) {
    const { p_text, p_box, p_button, p_scroll } = require('../component/index');
    const dateFormat = require('../dateFormat');
    const underlineBottom = underline ? underline.y + underline.height : 0;
    const container = new PIXI.Container();

    // 获取本地缓存文件列表按钮
    const getSavedFileListButton = p_button(PIXI, {
      width: 580 * PIXI.ratio,
      y: underlineBottom + 89 * PIXI.ratio,
    });
    getSavedFileListButton.myAddChildFn(
      p_text(PIXI, {
        content: '获取本地缓存文件列表',
        fontSize: 36 * PIXI.ratio,
        fill: 0xffffff,
        relative_middle: {
          containerWidth: getSavedFileListButton.width,
          containerHeight: getSavedFileListButton.height,
        },
      }),
    );

    let currentFileList: any[] = [];

    function showListFn(paperFile: any[]) {
      currentFileList = paperFile;

      const scroll = p_scroll(PIXI, {
        height: 700 * PIXI.ratio,
        y: underlineBottom + 78 * PIXI.ratio,
      });

      const infoMapping: Record<
        string,
        { name: string; func: (val: any, arr: any[]) => void }
      > = {
        filePath: {
          name: '文件路径',
          func(path: string, arr: any[]) {
            const textEl = p_text(PIXI, {
              content: path,
              fontSize: 30 * PIXI.ratio,
              lineHeight: 40 * PIXI.ratio,
              x: 200 * PIXI.ratio,
              y: arr[arr.length - 1].y,
            });
            const boxWidth = 500 * PIXI.ratio;
            const textWidth = textEl.width;
            if (textWidth > boxWidth) {
              const textArr: string[] = [];
              const text = textEl.text;
              const len = textEl.text.length;
              textEl.text = text[0];
              const fontWidth = textEl.width;
              let startValue = 0;
              let endValue = 0;
              for (
                let i = 0, num = ~~(textWidth / boxWidth);
                i <= num;
                i++
              ) {
                let width = 0;
                while (width < boxWidth) {
                  endValue += ~~((boxWidth - width) / fontWidth) || 1;
                  if (len <= endValue) {
                    endValue++;
                    break;
                  }
                  textEl.text = text.slice(startValue, endValue);
                  width = textEl.width;
                }
                endValue--;
                textArr.push(text.slice(startValue, endValue));
                if (len <= endValue) break;
                startValue = endValue;
              }
              textEl.turnText(textArr.join('\n'));
            }
            arr.push(textEl);
          },
        },
        size: {
          name: '文件大小',
          func(size: number, arr: any[]) {
            arr.push(
              p_text(PIXI, {
                content: `${size}B`,
                fontSize: 30 * PIXI.ratio,
                lineHeight: 40 * PIXI.ratio,
                x: 200 * PIXI.ratio,
                y: arr[arr.length - 1].y,
              }),
            );
          },
        },
        createTime: {
          name: '储存时间',
          func(time: number, arr: any[]) {
            arr.push(
              p_text(PIXI, {
                content: dateFormat(
                  new Date(time * 1000),
                  'yyyy-MM-dd hh:mm:ss',
                ),
                fontSize: 30 * PIXI.ratio,
                lineHeight: 40 * PIXI.ratio,
                x: 200 * PIXI.ratio,
                y: arr[arr.length - 1].y,
              }),
            );
          },
        },
      };

      const div_child_arr: any[] = [];
      for (let i = 0, len = paperFile.length; i < len; i++) {
        const storageTextArr: any[] = [];
        const lineHeight = 15 * PIXI.ratio;
        const keys = Object.keys(paperFile[i]);
        for (let j = 0; j < keys.length; j++) {
          const index = j && j * 2 - 1;
          storageTextArr.push(
            p_text(PIXI, {
              content: infoMapping[keys[j]].name,
              fontSize: 30 * PIXI.ratio,
              x: 30 * PIXI.ratio,
              y: j
                ? storageTextArr[index].y +
                  storageTextArr[index].height +
                  lineHeight
                : lineHeight,
            }),
          );
          infoMapping[keys[j]].func(paperFile[i][keys[j]], storageTextArr);
        }
        const lastOne = storageTextArr[storageTextArr.length - 1];
        div_child_arr[i] = p_box(PIXI, {
          height: lastOne.height + lastOne.y + lineHeight / 2,
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

        div_child_arr[i].addChild(...storageTextArr);
      }

      const divDeploy = {
        height:
          div_child_arr[div_child_arr.length - 1].y +
          div_child_arr[div_child_arr.length - 1].height,
        border: { width: PIXI.ratio | 0, color: 0xe5e5e5 },
      };
      const div = p_box(PIXI, divDeploy);
      div.addChild(...div_child_arr);
      scroll.myAddChildFn(div);
      const whoHigh = div.height > scroll.height;
      scroll.isTouchable(whoHigh);

      // 清空本地缓存文件列表按钮
      const removeSavedFileButton = p_button(PIXI, {
        width: 576 * PIXI.ratio,
        height: 90 * PIXI.ratio,
        border: { width: 2 * PIXI.ratio, color: 0xd1d1d1 },
        alpha: 0,
        y:
          (whoHigh ? scroll : div).height + scroll.y + 69 * PIXI.ratio,
      });
      removeSavedFileButton.myAddChildFn(
        p_text(PIXI, {
          content: '清空本地缓存文件列表',
          fontSize: 36 * PIXI.ratio,
          fill: 0x53535f,
          relative_middle: {
            containerWidth: removeSavedFileButton.width,
            containerHeight: removeSavedFileButton.height,
          },
        }),
      );
      removeSavedFileButton.onClickFn(() => {
        logic.removeSavedFile(currentFileList, () => {
          container.removeChild(scroll);
          container.removeChild(removeSavedFileButton);
          getSavedFileListButton.showFn();
        });
      });

      container.addChild(scroll, removeSavedFileButton);
    }

    getSavedFileListButton.onClickFn(() => {
      logic.getSavedFileList((fileList) => {
        showListFn(fileList);
        getSavedFileListButton.hideFn();
      });
    });

    container.addChild(getSavedFileListButton);
    return container;
  },

  actions: [],
  onUnload: () => logic.onUnload(),
};
