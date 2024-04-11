"use strict";
// 简单的jsserver代码
exports.main = function (req) {
    console.log(req);
    const ok = check(); // 游戏侧自行实现校验修改逻辑
    if (ok) {
        // 验证通过
        return JSON.stringify({ ret: true });
    }
    else {
        // 验证不通过
        return JSON.stringify({ ret: false });
    }
};
function check() {
    return true;
}
