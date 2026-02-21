/**
 * 统计管理模块
 * 负责统计数据计算和UI更新
 */

class StatsManager {
    constructor(storageManager, storageKey) {
        this.storage = storageManager;
        this.storageKey = storageKey;
        this.stats = this.loadStats();
        this.milestones = this.loadMilestones();
        this.answerCount = 0; // 本轮答题计数
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
     * 加载里程碑数据
     */
    loadMilestones() {
        const defaultMilestones = {
            '80': false,
            '90': false,
            '95': false,
            '96': false,
            '97': false,
            '98': false,
            '99': false
        };
        return this.storage.load(this.storageKey + '_milestones', defaultMilestones);
    }

    /**
     * 保存统计数据
     */
    saveStats() {
        this.storage.save(this.storageKey, this.stats);
    }

    /**
     * 保存里程碑数据
     */
    saveMilestones() {
        this.storage.save(this.storageKey + '_milestones', this.milestones);
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
        this.answerCount++;

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
        this.answerCount = 0;
        this.saveStats();
    }

    /**
     * 重置里程碑
     */
    resetMilestones() {
        this.milestones = {
            '80': false,
            '90': false,
            '95': false,
            '96': false,
            '97': false,
            '98': false,
            '99': false
        };
        this.saveMilestones();
    }

    /**
     * 检查是否需要结算（每20题）
     * @returns {boolean} 是否需要结算
     */
    shouldSettle() {
        return this.answerCount > 0 && this.answerCount % 20 === 0;
    }

    /**
     * 检查正确率里程碑突破
     * @param {number} accuracyRate - 当前正确率
     * @returns {Array} 突破的里程碑列表
     */
    checkMilestones(accuracyRate) {
        const breakthroughs = [];
        const milestones = ['80', '90', '95', '96', '97', '98', '99'];
        
        for (const milestone of milestones) {
            const milestoneValue = parseInt(milestone);
            if (accuracyRate >= milestoneValue && !this.milestones[milestone]) {
                this.milestones[milestone] = true;
                breakthroughs.push(milestoneValue);
            }
        }
        
        if (breakthroughs.length > 0) {
            this.saveMilestones();
        }
        
        return breakthroughs;
    }

    /**
     * 重置答题计数器
     */
    resetAnswerCount() {
        this.answerCount = 0;
    }

    /**
     * 获取当前答题数
     * @returns {number} 当前答题数
     */
    getAnswerCount() {
        return this.answerCount;
    }

    /**
     * 显示结算弹窗
     * @param {Object} reward - 结算奖励对象
     * @param {Object} effectSystem - 特效系统实例
     * @param {Object} scoreSystem - 积分系统实例
     */
    showSettlementReward(reward, effectSystem, scoreSystem) {
        const modal = document.getElementById('settlementModal');
        if (!modal) return;

        const title = document.getElementById('settlementTitle');
        const accuracyDisplay = document.getElementById('settlementAccuracy');
        const rewardDisplay = document.getElementById('settlementReward');
        const pointsDisplay = document.getElementById('settlementPoints');
        const confirmBtn = document.getElementById('settlementConfirm');

        // 设置内容
        if (title) title.textContent = reward.text || '结算奖励';
        if (accuracyDisplay) accuracyDisplay.textContent = `${this.stats.accuracyRate}%`;
        if (rewardDisplay) {
            const levelText = {
                'gold': '🥇 黄金',
                'silver': '🥈 白银',
                'bronze': '🥉 青铜',
                'none': '无奖励'
            };
            rewardDisplay.textContent = levelText[reward.level] || '无奖励';
        }
        if (pointsDisplay) pointsDisplay.textContent = `+${reward.points}`;

        // 显示弹窗
        modal.classList.add('show');

        // 播放结算特效
        if (reward.level === 'gold' && effectSystem) {
            effectSystem.settlementGold();
        } else if (reward.level === 'silver' && effectSystem) {
            effectSystem.settlementSilver();
        } else if (reward.level === 'bronze' && effectSystem) {
            effectSystem.settlementBronze();
        }

        // 添加积分
        if (reward.points > 0 && scoreSystem) {
            scoreSystem.addScore(reward.points);
        }

        // 确认按钮事件
        if (confirmBtn) {
            confirmBtn.onclick = () => {
                modal.classList.remove('show');
                this.resetAnswerCount();
            };
        }
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StatsManager };
}