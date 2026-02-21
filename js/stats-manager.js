/**
 * 统计管理模块
 * 负责统计数据计算和UI更新
 */

class StatsManager {
    constructor(storageManager, storageKey) {
        this.storage = storageManager;
        this.storageKey = storageKey;
        this.stats = this.loadStats();
    }

    /**
     * 加载统计数据
     */
    loadStats() {
        const defaultStats = {
            correct: 0,
            total: 0,
            accuracyRate: 0
        };
        return this.storage.load(this.storageKey, defaultStats);
    }

    /**
     * 保存统计数据
     */
    saveStats() {
        this.storage.save(this.storageKey, this.stats);
    }

    /**
     * 记录答题
     * @param {boolean} isCorrect - 是否正确
     */
    recordAnswer(isCorrect) {
        this.stats.total++;
        if (isCorrect) {
            this.stats.correct++;
        }

        // 计算正确率
        this.stats.accuracyRate = this.stats.total > 0
            ? Math.round(this.stats.correct / this.stats.total * 100)
            : 0;

        this.saveStats();
    }

    /**
     * 获取统计信息
     * @returns {Object} 统计信息
     */
    getStats() {
        return { ...this.stats };
    }

    /**
     * 重置统计
     */
    reset() {
        this.stats = {
            correct: 0,
            total: 0,
            accuracyRate: 0
        };
        this.saveStats();
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StatsManager };
}