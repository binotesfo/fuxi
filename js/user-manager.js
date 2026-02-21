/**
 * 用户管理模块
 * 负责用户名输入和保存
 */

class UserManager {
    constructor(storageManager, storageKey) {
        this.storage = storageManager;
        this.storageKey = storageKey || 'username';
        this.username = null;
        this.load();
    }

    /**
     * 加载用户名
     */
    load() {
        this.username = this.storage.load(this.storageKey, null);
    }

    /**
     * 保存用户名
     * @param {string} username - 用户名
     */
    save(username) {
        this.username = username;
        this.storage.save(this.storageKey, username);
    }

    /**
     * 显示用户名输入弹窗
     */
    showUsernameInput() {
        const modal = document.getElementById('usernameModal');
        if (modal) {
            modal.classList.add('show');
            const input = document.getElementById('usernameInput');
            if (input) {
                input.focus();
            }
        }
    }

    /**
     * 隐藏用户名输入弹窗
     */
    hideUsernameInput() {
        const modal = document.getElementById('usernameModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    /**
     * 获取用户名
     * @returns {string} 用户名
     */
    getUsername() {
        return this.username;
    }

    /**
     * 检查用户名是否已设置
     * @returns {boolean} 是否已设置
     */
    hasUsername() {
        return this.username !== null && this.username !== '';
    }

    /**
     * 验证用户名
     * @param {string} username - 用户名
     * @returns {boolean} 是否有效
     */
    validateUsername(username) {
        return username && username.trim().length >= 2;
    }

    /**
     * 检查用户名，如果没有则显示输入弹窗
     */
    checkUsername() {
        if (!this.hasUsername()) {
            this.showUsernameInput();
        }
    }

    /**
     * 保存用户名（从输入框获取）
     */
    saveUsername() {
        const input = document.getElementById('usernameInput');
        if (input) {
            const username = input.value.trim();
            if (this.validateUsername(username)) {
                this.save(username);
                this.hideUsernameInput();
            } else {
                alert('请输入有效的用户名（2-10个字符）');
            }
        }
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { UserManager };
}