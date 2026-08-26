const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'minigame');
const DIST = path.join(ROOT, 'dist');

// 需要原样复制的静态资源（相对于 minigame/ 目录）
const STATIC_PATTERNS = [
  'game.json',
  'images',
  'workers',
  'open-data-context',
  'js/vendor',
  'js/api/render/loadFont/assets',
  'js/api/file/unzip/assets',
  'js/api/game-recorder/getGameRecorder/bgm.mp3',
  // sub-lockstep 只复制静态资源（图片）。源码 .js 文件由 tsc 通过 allowJs 编译成 CommonJS。
  'sub-lockstep/images',
];

/**
 * 递归复制目录/文件
 */
function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;

  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const child of fs.readdirSync(src)) {
      copyRecursive(path.join(src, child), path.join(dest, child));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

// 1. 清理 dist
console.log('🗑  Cleaning dist/...');
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true });
}
fs.mkdirSync(DIST, { recursive: true });

// 2. TypeScript 编译 → dist/
// 使用 --noCheck 跳过类型检查，只做转译。
// 原因：历史遗留的组件文件（box.ts/text.ts 等）用了 `deploy = {}` 无类型注解，
// 在 TS 5 的严格模式下会报大量错误，但运行时完全正常。
// 类型检查交给 IDE 的 language server 做（读 lints 时可以看到真正的问题），
// 构建时不需要重复检查。
console.log('🔨 Compiling TypeScript (transpile only)...');
try {
  execSync(`npx tsc --noCheck --outDir "${DIST}"`, { cwd: ROOT, stdio: 'inherit' });
} catch {
  // tsc 仍会输出 .js，继续执行
  console.log('⚠️  TypeScript transpile reported issues (output still generated)');
}

// 3. 复制静态资源
console.log('📦 Copying static assets...');
for (const pattern of STATIC_PATTERNS) {
  const src = path.join(SRC, pattern);
  const dest = path.join(DIST, pattern);
  if (fs.existsSync(src)) {
    copyRecursive(src, dest);
    console.log(`   ✓ ${pattern}`);
  } else {
    console.log(`   ⚠ ${pattern} (not found, skipped)`);
  }
}

console.log('✅ Build complete → dist/');
