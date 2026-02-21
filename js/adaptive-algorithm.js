/**
 * 自适应算法模块
 * 负责基于权重的题目选择和学习状态管理
 */

class AdaptiveAlgorithm {
    constructor(storageManager, storageKey) {
        this.storage = storageManager;
        this.storageKey = storageKey;
        this.defaultFrequency = 10;
        this.minFrequency = 1;
        this.masterThreshold = 3;
        this.states = this.loadStates();
        this.globalStreak = 0; // 全局连对计数器
    }

    /**
     * 加载题目状态
     */
    loadStates() {
        return this.storage.load(this.storageKey, {});
    }

    /**
     * 保存题目状态
     */
    saveStates() {
        this.storage.save(this.storageKey, this.states);
    }

    /**
     * 初始化题目状态
     * @param {Array} questions - 题目数组
     */
    initializeStates(questions) {
        questions.forEach(q => {
            if (!this.states[q.id]) {
                this.states[q.id] = {
                    frequency: this.defaultFrequency,
                    consecutiveCorrect: 0,
                    correctCount: 0,
                    totalAttempts: 0
                };
            }
        });
        this.saveStates();
    }

    /**
     * 选择下一题
     * @param {Array} questions - 题目数组
     * @returns {Object} 选中的题目
     */
    selectQuestion(questions) {
        // 初始化题目状态
        this.initializeStates(questions);

        // 获取已掌握的题目ID
        const masteredIds = this.getMasteredIds();

        // 过滤可用的题目
        const available = questions.filter(q => !masteredIds.includes(q.id));

        if (available.length === 0) {
            return null;
        }

        // 计算总权重
        const totalWeight = available.reduce(
            (sum, q) => sum + (this.states[q.id]?.frequency || this.defaultFrequency),
            0
        );

        // 随机选择
        let random = Math.random() * totalWeight;
        let selected = available[0];

        for (const q of available) {
            random -= (this.states[q.id]?.frequency || this.defaultFrequency);
            if (random <= 0) {
                selected = q;
                break;
            }
        }

        return selected;
    }

    /**
     * 更新进度（答对或答错）
     * @param {number} questionId - 题目ID
     * @param {boolean} isCorrect - 是否正确
     */
    updateProgress(questionId, isCorrect) {
        const state = this.states[questionId];
        if (!state) return;

        // 更新全局连对计数器
        if (isCorrect) {
            this.globalStreak++;
        } else {
            this.globalStreak = 0;
        }

        if (isCorrect) {
            this.updateCorrect(questionId);
        } else {
            this.updateWrong(questionId);
        }

        this.saveStates();
    }

    /**
     * 更新题目状态（答对）
     * @param {number} questionId - 题目ID
     */
    updateCorrect(questionId) {
        const state = this.states[questionId];
        if (!state) return;

        state.consecutiveCorrect++;
        state.correctCount++;
        state.totalAttempts++;

        // 降低权重（答对后出现频率降低）
        state.frequency = Math.max(
            this.minFrequency,
            state.frequency - 2
        );
    }

    /**
     * 更新题目状态（答错）
     * @param {number} questionId - 题目ID
     */
    updateWrong(questionId) {
        const state = this.states[questionId];
        if (!state) return;

        state.consecutiveCorrect = 0;
        state.totalAttempts++;

        // 重置权重（答错后权重恢复）
        state.frequency = this.defaultFrequency;
    }

    /**
     * 获取连对次数
     * @param {number} questionId - 题目ID
     * @returns {number} 连对次数
     */
    getConsecutiveCorrect(questionId) {
        const state = this.states[questionId];
        return state ? state.consecutiveCorrect : 0;
    }

    /**
     * 获取全局连对次数
     * @returns {number} 全局连对次数
     */
    getGlobalStreak() {
        return this.globalStreak;
    }

    /**
     * 检查是否已掌握
     * @param {number} questionId - 题目ID
     * @returns {boolean} 是否已掌握
     */
    isMastered(questionId) {
        const state = this.states[questionId];
        return state && state.consecutiveCorrect >= this.masterThreshold;
    }

    /**
     * 获取已掌握的题目ID列表
     * @returns {Array} 已掌握的题目ID列表
     */
    getMasteredIds() {
        return Object.keys(this.states).filter(
            id => this.states[id].consecutiveCorrect >= this.masterThreshold
        );
    }

    /**
     * 获取进度
     * @param {number} totalQuestions - 总题目数（可选）
     * @returns {Object} 进度信息
     */
    getProgress(totalQuestions = null) {
        const masteredIds = this.getMasteredIds();
        const total = totalQuestions !== null ? totalQuestions : Object.keys(this.states).length;
        const mastered = masteredIds.length;

        return {
            mastered,
            learning: total - mastered,
            total
        };
    }

    /**
     * 检查是否所有题目都已掌握
     * @param {number} totalQuestions - 总题目数
     * @returns {boolean} 是否全部已掌握
     */
    isAllMastered(totalQuestions) {
        const progress = this.getProgress(totalQuestions);
        return progress.learning === 0 && progress.mastered === totalQuestions;
    }

    /**
     * 获取统计信息
     * @returns {Object} 统计信息
     */
    getStats() {
        let mastered = 0;
        let totalCorrect = 0;
        let totalAttempts = 0;

        Object.values(this.states).forEach(state => {
            if (state.consecutiveCorrect >= this.masterThreshold) {
                mastered++;
            }
            totalCorrect += state.correctCount || 0;
            totalAttempts += state.totalAttempts || 0;
        });

        return {
            mastered,
            total: Object.keys(this.states).length,
            correct: totalCorrect,
            attempts: totalAttempts,
            accuracy: totalAttempts > 0
                ? Math.round(totalCorrect / totalAttempts * 100)
                : 0
        };
    }

    /**
     * 重置所有进度
     */
    reset() {
        this.states = {};
        this.globalStreak = 0;
        this.storage.remove(this.storageKey);
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdaptiveAlgorithm };
}