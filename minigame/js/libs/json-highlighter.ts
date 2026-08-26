/**
 * PixiJS JSON 语法高亮渲染器
 *
 * 纯正则分词 + PixiJS Text 渲染，无 DOM 依赖，适用于微信小游戏环境。
 * 提供亮色（Light+）和暗色（Dark+）两种主题，默认使用暗色主题。
 *
 * 用法：
 *   import { renderHighlightedJSON, isJSONString } from './json-highlighter';
 *   // 在 PIXI Container 中渲染高亮 JSON
 *   const { contentHeight } = renderHighlightedJSON(PIXI, container, jsonStr, opts);
 */

// ============================================================
//  主题配色
// ============================================================

/** 暗色主题（VS Code Dark+） */
const DARK_COLORS = {
  key: 0x9cdcfe,         // 键名 - 浅蓝
  string: 0xce9178,      // 字符串值 - 橙色
  number: 0xb5cea8,      // 数字 - 浅绿
  boolean: 0x569cd6,     // true / false - 蓝色
  null: 0x569cd6,        // null - 蓝色
  punctuation: 0xd4d4d4, // {}[],: - 灰白
  background: 0x1e1e1e,  // 背景 - 深灰
};

/** 亮色主题（VS Code Light+） */
const LIGHT_COLORS = {
  key: 0x0451a5,         // 键名 - 深蓝
  string: 0xa31515,      // 字符串值 - 暗红
  number: 0x098658,      // 数字 - 深绿
  boolean: 0x0000ff,     // true / false - 蓝色
  null: 0x0000ff,        // null - 蓝色
  punctuation: 0x333333, // {}[],: - 深灰
  background: 0xf8f8f8,  // 背景 - 浅灰
};

export type ThemeColors = typeof DARK_COLORS;
export type ThemeName = 'dark' | 'light';

const THEMES: Record<ThemeName, ThemeColors> = {
  dark: DARK_COLORS,
  light: LIGHT_COLORS,
};

// ============================================================
//  Tokenizer（分词器）
// ============================================================

interface Token {
  type: 'key' | 'string' | 'number' | 'boolean' | 'null' | 'punctuation' | 'newline' | 'whitespace';
  value: string;
}

/**
 * 将 JSON 字符串分词为带类型标记的 token 数组
 *
 * 正则分组:
 *   [1] 引号包裹的字符串     [2] 可选冒号（存在 = key，不存在 = value）
 *   [3] 数字（含负数、浮点、科学计数）
 *   [4] true / false / null
 *   [5] 标点 {}[],
 *   [6] 换行符 \n
 *   [7] 行内空白（空格、制表符，不含换行）
 */
const TOKEN_REGEX = /("(?:\\.|[^"\\])*")(\s*:)?|(-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)|(\btrue\b|\bfalse\b|\bnull\b)|([\[\]{},])|(\n)|([^\S\n]+)/g;

export function tokenizeJSON(jsonStr: string): Token[] {
  const tokens: Token[] = [];
  let m: RegExpExecArray | null;

  TOKEN_REGEX.lastIndex = 0;
  while ((m = TOKEN_REGEX.exec(jsonStr)) !== null) {
    if (m[1] !== undefined) {
      if (m[2] !== undefined) {
        // 键名 + 冒号
        tokens.push({ type: 'key', value: m[1] });
        tokens.push({ type: 'punctuation', value: m[2] });
      } else {
        tokens.push({ type: 'string', value: m[1] });
      }
    } else if (m[3] !== undefined) {
      tokens.push({ type: 'number', value: m[3] });
    } else if (m[4] !== undefined) {
      const t = m[4] === 'true' || m[4] === 'false' ? 'boolean' : 'null';
      tokens.push({ type: t, value: m[4] });
    } else if (m[5] !== undefined) {
      tokens.push({ type: 'punctuation', value: m[5] });
    } else if (m[6] !== undefined) {
      tokens.push({ type: 'newline', value: m[6] });
    } else if (m[7] !== undefined) {
      tokens.push({ type: 'whitespace', value: m[7] });
    }
  }
  return tokens;
}

// ============================================================
//  渲染配置
// ============================================================

export interface HighlightOptions {
  /** 起始 X 坐标，默认 0 */
  x?: number;
  /** 起始 Y 坐标，默认 0 */
  y?: number;
  /** 字号（逻辑像素，未乘 ratio），默认 24 */
  fontSize?: number;
  /** 行高倍数，默认 1.5 */
  lineHeight?: number;
  /** 字体，默认系统等宽 */
  fontFamily?: string;
  /** 最大渲染宽度（用于长字符串截断提示），默认不限 */
  maxWidth?: number;
  /** 最大渲染行数，超出显示截断提示，默认 80 */
  maxLines?: number;
  /** 主题名称，默认 'dark' */
  theme?: ThemeName;
  /** 自定义主题色（优先于 theme） */
  colors?: Partial<ThemeColors>;
}

export interface HighlightResult {
  /** 渲染的内容总高度 */
  contentHeight: number;
  /** 渲染的内容总宽度 */
  contentWidth: number;
  /** 实际渲染的行数 */
  lineCount: number;
  /** 是否被截断 */
  truncated: boolean;
}

// ============================================================
//  渲染器
// ============================================================

/**
 * 在 PixiJS Container 中渲染语法高亮的 JSON 文本
 *
 * @param PIXI - PixiJS 引用
 * @param container - 渲染目标 Container（会清空已有子节点）
 * @param jsonStr - JSON 字符串（应为 JSON.stringify 格式化后的）
 * @param opts - 可选配置
 * @returns 渲染结果信息
 */
export function renderHighlightedJSON(
  PIXI: any,
  container: any,
  jsonStr: string,
  opts?: HighlightOptions
): HighlightResult {
  const options = opts || {};
  const startX = options.x ?? 0;
  const startY = options.y ?? 0;
  const fontSize = (options.fontSize ?? 24) * (PIXI.ratio || 1);
  const lineHeightMultiplier = options.lineHeight ?? 1.5;
  const lineHeight = fontSize * lineHeightMultiplier;
  const fontFamily = options.fontFamily || 'monospace, Menlo, Consolas';
  const maxLines = options.maxLines ?? 80;
  const themeName = options.theme ?? 'dark';
  const baseColors = THEMES[themeName] || THEMES.dark;
  const colors = { ...baseColors, ...(options.colors || {}) };

  // 清空容器已有子节点
  while (container.children.length > 0) {
    container.removeChildAt(0);
  }

  const tokens = tokenizeJSON(jsonStr);

  // TextStyle 缓存（同类型复用减少对象创建）
  const styleCache: Record<string, any> = {};
  function getStyle(type: string) {
    if (!styleCache[type]) {
      const color = (colors as any)[type] ?? colors.punctuation;
      styleCache[type] = new PIXI.TextStyle({
        fontFamily,
        fontSize: `${fontSize}px`,
        fill: color,
      });
    }
    return styleCache[type];
  }

  // 空格宽度缓存（用于计算缩进）
  let spaceWidth = 0;
  function getSpaceWidth(): number {
    if (!spaceWidth) {
      const metrics = PIXI.TextMetrics.measureText(' ', getStyle('punctuation'));
      spaceWidth = metrics.width;
    }
    return spaceWidth;
  }

  let cursorX = startX;
  let cursorY = startY;
  let lineCount = 1;
  let maxContentWidth = 0;
  let truncated = false;

  // 最大渲染宽度（用于自动换行）
  const wrapWidth = options.maxWidth || 0;

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    if (token.type === 'newline') {
      if (cursorX > maxContentWidth) maxContentWidth = cursorX;
      cursorX = startX;
      cursorY += lineHeight;
      lineCount++;

      // 行数限制检查（0 = 不限制）
      if (maxLines > 0 && lineCount > maxLines) {
        truncated = true;
        const truncText = new PIXI.Text(`... 内容已截断（共 ${jsonStr.split('\n').length} 行）`, {
          fontFamily,
          fontSize: `${fontSize}px`,
          fill: colors.punctuation,
          fontStyle: 'italic',
        });
        truncText.x = startX;
        truncText.y = cursorY;
        container.addChild(truncText);
        cursorY += lineHeight;
        break;
      }
      continue;
    }

    if (token.type === 'whitespace') {
      // 空格不创建 Text 节点，仅移动光标（节省 draw call）
      cursorX += token.value.length * getSpaceWidth();
      continue;
    }

    const style = getStyle(token.type);
    const text = new PIXI.Text(token.value, style);

    // 自动换行：如果当前 token 超出容器宽度，换到下一行
    if (wrapWidth > 0 && cursorX + text.width > wrapWidth && cursorX > startX) {
      if (cursorX > maxContentWidth) maxContentWidth = cursorX;
      cursorX = startX;
      cursorY += lineHeight;
      lineCount++;
    }

    text.x = cursorX;
    text.y = cursorY;
    container.addChild(text);
    cursorX += text.width;
  }

  if (cursorX > maxContentWidth) maxContentWidth = cursorX;

  return {
    contentHeight: cursorY + lineHeight - startY,
    contentWidth: maxContentWidth - startX,
    lineCount,
    truncated,
  };
}

// ============================================================
//  工具函数
// ============================================================

/**
 * 判断字符串是否为合法 JSON
 */
export function isJSONString(str: string): boolean {
  if (!str || typeof str !== 'string') return false;
  const trimmed = str.trim();
  if ((trimmed[0] !== '{' && trimmed[0] !== '[')) return false;
  try {
    JSON.parse(trimmed);
    return true;
  } catch {
    return false;
  }
}

/**
 * 将任意对象格式化为带缩进的 JSON 字符串
 * 比 formatObj 更适合语法高亮展示
 */
export function toHighlightableJSON(obj: any, indent: number = 2): string {
  try {
    return JSON.stringify(obj, null, indent);
  } catch {
    return String(obj);
  }
}
