/**
 * 错题本模块
 * 负责错题记录、统计和模式切换
 */

class WrongBook {
    constructor(storageManager, storageKey) {
        this.storage = storageManager;
        this.storageKey = storageKey || 'wrong_book';
        this.wrongBook = [];
        this.load();
    }

    /**
     * 加载错题本数据
     */
    load() {
        this.wrongBook = this.storage.load(this.storageKey, []);
    }

    /**
     * 保存错题本数据
     */
    save() {
        this.storage.save(this.storageKey, this.wrongBook);
    }

    /**
     * 添加错题
     * @param {number} questionId - 题目ID
     */
    addWrong(questionId) {
        const existing = this.wrongBook.find(
            item => item.questionId === questionId
        );

        if (existing) {
            existing.wrongCount++;
            existing.lastWrongTime = Date.now();
        } else {
            this.wrongBook.push({
                questionId: questionId,
                wrongCount: 1,
                lastWrongTime: Date.now()
            });
        }

        this.save();
    }

    /**
     * 移除错题（答对后）
     * @param {number} questionId - 题目ID
     */
    removeWrong(questionId) {
        const index = this.wrongBook.findIndex(
            item => item.questionId === questionId
        );

        if (index >= 0) {
            this.wrongBook[index].wrongCount--;
            
            if (this.wrongBook[index].wrongCount <= 0) {
                this.wrongBook.splice(index, 1);
            }
            
            this.save();
        }
    }

    /**
     * 更新错误次数
     * @param {number} questionId - 题目ID
     * @param {number} count - 错误次数
     */
    updateWrongCount(questionId, count) {
        const existing = this.wrongBook.find(
            item => item.questionId === questionId
        );

        if (existing) {
            existing.wrongCount = count;
            existing.lastWrongTime = Date.now();
            this.save();
        }
    }

    /**
     * 获取错题列表
     * @returns {Array} 错题列表
     */
    getWrongList() {
        return [...this.wrongBook];
    }

    /**
     * 获取错题数量
     * @returns {number} 错题数量
     */
    getCount() {
        return this.wrongBook.length;
    }

    /**
     * 检查题目是否在错题本中
     * @param {number} questionId - 题目ID
     * @returns {boolean} 是否在错题本中
     */
    hasQuestion(questionId) {
        return this.wrongBook.some(
            item => item.questionId === questionId
        );
    }

    /**
     * 清空错题本
     */
    clear() {
        this.wrongBook = [];
        this.save();
    }

    /**
     * 按错误次数排序（优先练习错误次数多的）
     */
    sortByWrongCount() {
        return this.wrongBook.sort((a, b) => b.wrongCount - a.wrongCount);
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WrongBook };
}