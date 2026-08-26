/**
 * 通用格式化工具
 * 将任意对象递归展开为可读文本，避免嵌套对象显示 [object Object]
 */

/** 递归格式化值为可读字符串 */
export function formatValue(v: any): string {
  if (v === null || v === undefined) return '-';
  if (typeof v === 'object' && !Array.isArray(v)) {
    const entries = Object.entries(v);
    if (!entries.length) return '{}';
    const lines = entries.map(([key, val]) => `  ${key}: ${formatValue(val)}`);
    return '{\n' + lines.join('\n') + '\n}';
  }
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    return '[ ' + v.map((item) => formatValue(item)).join(', ') + ' ]';
  }
  return String(v);
}

/** 把任意对象格式化为 key: value 文本列表 */
export function formatObj(obj: any): string {
  if (!obj || typeof obj !== 'object') return String(obj);
  return Object.keys(obj)
    .map((k) => `${k}: ${formatValue(obj[k])}`)
    .join('\n');
}

/**
 * 将对象格式化为 JSON 字符串（带缩进）
 * 传给 setInfo 后会自动触发 JSON 语法高亮渲染
 *
 * @param obj - 要格式化的对象
 * @param indent - 缩进空格数，默认 2
 * @returns JSON 格式字符串
 */
export function formatJSON(obj: any, indent: number = 2): string {
  if (obj === null || obj === undefined) return 'null';
  if (typeof obj !== 'object') return JSON.stringify(obj);
  try {
    return JSON.stringify(obj, null, indent);
  } catch {
    // 循环引用等异常情况回退到 formatObj
    return formatObj(obj);
  }
}
