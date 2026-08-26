/**
 * 文件系统管理器（综合）
 * 演示 FileSystemManager 的常用操作：读、写、追加、复制、移动、删除、stat、压缩。
 */

import { createDisplay } from '../../../libs/display-slot';
import { createInfoArea } from '../../../libs/info-area';

const display = createDisplay();
export const setDisplay = display.setter;

const { setInfo, onInfoTextReady, infoArea } = createInfoArea(
  '点击按钮执行文件系统操作（读写/复制/删除等）。'
);
export { onInfoTextReady, infoArea };
export const apiName = 'fileSystemManager';
const FS = wx.getFileSystemManager();
const USER = wx.env.USER_DATA_PATH;
const PATH = `${USER}/fs_demo.txt`;
const COPY_PATH = `${USER}/fs_demo_copy.txt`;

function toast(msg: string) {
  wx.showToast({ title: msg, icon: 'none' });
}

/** 写入文本文件 */
export function writeFile() {
  FS.writeFile({
    filePath: PATH,
    data: 'Hello FileSystem!\nLine 2\nLine 3',
    encoding: 'utf8',
    success() {
      toast('写入成功');
    },
    fail(err: any) {
      toast(`写入失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 同步写入 */
export function writeFileSync() {
  try {
    FS.writeFileSync(PATH, 'sync write @ ' + Date.now(), 'utf8');
    toast('同步写入成功');
  } catch (e: any) {
    toast(`同步写入失败: ${e.message}`);
  }
}

/** 读取文本文件 */
export function readFile() {
  FS.readFile({
    filePath: PATH,
    encoding: 'utf8',
    success(res: any) {
      toast(`内容: ${String(res.data).slice(0, 30)}`);
    },
    fail(err: any) {
      toast(`读取失败（请先 writeFile）`);
    },
  });
}

/** 同步读取 */
export function readFileSync() {
  try {
    const data = FS.readFileSync(PATH, 'utf8');
    toast(`内容: ${String(data).slice(0, 30)}`);
  } catch (e: any) {
    toast(`同步读取失败: ${e.message}`);
  }
}

/** 追加内容 */
export function appendFile() {
  FS.appendFile({
    filePath: PATH,
    data: `\nappended @ ${new Date().toLocaleTimeString()}`,
    encoding: 'utf8',
    success() {
      toast('追加成功');
    },
    fail(err: any) {
      toast(`追加失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 复制文件 */
export function copyFile() {
  FS.copyFile({
    srcPath: PATH,
    destPath: COPY_PATH,
    success() {
      toast('复制成功');
    },
    fail(err: any) {
      toast(`复制失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 删除文件 */
export function unlink() {
  FS.unlink({
    filePath: COPY_PATH,
    success() {
      toast('副本已删除');
    },
    fail(err: any) {
      toast(`删除失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 截断文件（保留前 5 字节） */
export function truncate() {
  FS.truncate({
    filePath: PATH,
    length: 5,
    success() {
      toast('已截断到 5 字节');
    },
    fail(err: any) {
      toast(`截断失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 文件描述符 open/close/read */
export function fdReadWrite() {
  FS.open({
    filePath: PATH,
    flag: 'r',
    success(res: any) {
      const fd = res.fd;
      const buf = new ArrayBuffer(64);
      FS.read({
        fd,
        arrayBuffer: buf,
        success(r: any) {
          toast(`读取字节: ${r.bytesRead}`);
          FS.close({ fd });
        },
        fail(err: any) {
          toast(`read 失败: ${err?.errMsg || '未知错误'}`);
          FS.close({ fd });
        },
      });
    },
    fail(err: any) {
      toast(`open 失败（请先 writeFile）`);
    },
  });
}

/** fstat - 通过 fd 查询文件状态 */
export function fstat() {
  FS.open({
    filePath: PATH,
    flag: 'r',
    success(res: any) {
      const fd = res.fd;
      FS.fstat({
        fd,
        success(r: any) {
          toast(`size: ${r.stats.size}`);
          FS.close({ fd });
        },
        fail(err: any) {
          toast(`fstat 失败: ${err?.errMsg || '未知错误'}`);
          FS.close({ fd });
        },
      });
    },
    fail(err: any) {
      toast(`open 失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

/** 读取压缩文件 */
export function readCompressedFile() {
  if (typeof FS.readCompressedFile !== 'function') {
    toast('当前版本不支持 readCompressedFile');
    return;
  }
  FS.readCompressedFile({
    filePath: PATH,
    compressionAlgorithm: 'br',
    success(res: any) {
      toast('压缩文件读取成功，长度 ' + res.data.byteLength);
    },
    fail(err: any) {
      toast(`读取失败: ${err?.errMsg || '未知错误'}`);
    },
  });
}

function bufToText(buf: ArrayBuffer, len: number) {
  const view = new Uint8Array(buf, 0, len);
  return String.fromCharCode.apply(null, Array.from(view));
}
