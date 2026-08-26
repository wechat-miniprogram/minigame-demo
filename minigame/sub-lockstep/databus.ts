// @ts-nocheck
/**
 * 全局状态管理器
 */
class DataBus {
    constructor() {
        this.userInfo = {};

        this.reset();
    }

    reset() {
        this.gameover       = false;
        this.currAccessInfo = '';
        this.bullets        = [];
        this.playerMap      = {};
        this.playerList     = [];
        this.selfPosNum     = 0;
        this.selfClientId   = 1;
        this.selfMemberInfo = {};
        this.matchPattern   = void 0;
    }

    /**
     * 回收子弹，进入对象池
     * 此后不进入帧循环
     */
    removeBullets(bullet) {
        const idx = this.bullets.indexOf(bullet);
        if (idx !== -1) this.bullets.splice(idx, 1);

        if (bullet.parent) bullet.parent.removeChild(bullet);
    }
}

export default new DataBus();

