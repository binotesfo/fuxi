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

        if (consecutiveCorrect === 1) {
            points = 1;  // Level 1
        } else if (consecutiveCorrect === 3 || consecutiveCorrect === 4) {
            points = 3;  // Level 2
        } else if (consecutiveCorrect >= 5 && consecutiveCorrect <= 9) {
            points = 5;  // Level 3
        } else if (consecutiveCorrect >= 10) {
            points = 10; // Level 4
        }

        // 已掌握额外奖励
        if (isMastered) {
            points += 50; // Level 5
        }

        return points;
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