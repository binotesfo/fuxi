/**
 * 积分系统模块
 * 负责积分计算、保存和显示
 */

class ScoreSystem {
    constructor(storageManager, storageKey) {
        this.storage = storageManager;
        this.storageKey = storageKey || 'score';
        this.totalScore = 0;
        this.load();
    }

    /**
     * 加载积分
     */
    load() {
        this.totalScore = this.storage.load(this.storageKey, 0);
    }

    /**
     * 保存积分
     */
    save() {
        this.storage.save(this.storageKey, this.totalScore);
    }

    /**
     * 计算积分
     * @param {number} consecutiveCorrect - 连续正确次数
     * @param {boolean} isMastered - 是否已掌握
     * @returns {number} 积分
     */
    calculateScore(consecutiveCorrect, isMastered) {
        let points = 0;

        // 连对细化规则
        if (consecutiveCorrect >= 1 && consecutiveCorrect <= 2) {
            points = 1;   // 1-2次连对
        } else if (consecutiveCorrect >= 3 && consecutiveCorrect <= 4) {
            points = 3;   // 3-4次连对
        } else if (consecutiveCorrect >= 5 && consecutiveCorrect <= 9) {
            points = 5;   // 5-9次连对
        } else if (consecutiveCorrect >= 10 && consecutiveCorrect <= 19) {
            points = 10;  // 10-19次连对
        } else if (consecutiveCorrect >= 20) {
            points = 20;  // 20+次连对
        }

        // 已掌握额外奖励
        if (isMastered) {
            points += 50;
        }

        return points;
    }

    /**
     * 计算结算奖励
     * @param {number} accuracyRate - 正确率（0-100）
     * @returns {Object} { level, points, text }
     */
    calculateSettlementReward(accuracyRate) {
        if (accuracyRate >= 95) {
            return { level: 'gold', points: 200, text: '黄金奖励' };
        } else if (accuracyRate >= 85) {
            return { level: 'silver', points: 100, text: '白银奖励' };
        } else if (accuracyRate >= 70) {
            return { level: 'bronze', points: 50, text: '青铜奖励' };
        } else {
            return { level: 'none', points: 0, text: '无奖励' };
        }
    }

    /**
     * 计算通关奖励
     * @returns {number} 通关奖励积分
     */
    calculateVictoryReward() {
        return 500; // 终极通关奖励
    }

    /**
     * 添加积分
     * @param {number} points - 增加的积分
     */
    addScore(points) {
        this.totalScore += points;
        this.save();
        return this.totalScore;
    }

    /**
     * 获取当前积分
     * @returns {number} 当前积分
     */
    getScore() {
        return this.totalScore;
    }

    /**
     * 重置积分
     */
    reset() {
        this.totalScore = 0;
        this.save();
    }

    /**
     * 显示积分增加动画
     * @param {number} points - 增加的积分
     * @param {Object} effectSystem - 特效系统实例
     */
    showScoreAdd(points, effectSystem) {
        if (effectSystem) {
            effectSystem.showScoreAdd(points);
        }
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ScoreSystem };
}