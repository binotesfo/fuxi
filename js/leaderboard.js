/**
 * 排行榜模块
 * 负责排行榜数据管理、UI渲染和同步
 */

class Leaderboard {
    constructor(firebaseManager, storageManager, leaderboardPath) {
        this.firebase = firebaseManager;
        this.storage = storageManager;
        this.leaderboardPath = leaderboardPath;
        this.currentUsername = null;
        this.leaderboard = [];
        this.isLocalMode = false;
    }

    /**
     * 加载排行榜数据
     */
    async load() {
        if (this.firebase.isConnectedStatus()) {
            // 从Firebase加载
            const data = await this.firebase.read(this.leaderboardPath);
            this.leaderboard = data ? Object.values(data) : [];
            this.isLocalMode = false;
        } else {
            // 从LocalStorage加载
            this.leaderboard = this.storage.load('leaderboard_data', []);
            this.isLocalMode = true;
        }

        // 按分数排序
        this.leaderboard.sort((a, b) => (b.score || 0) - (a.score || 0));
        
        // 只保留前50名
        this.leaderboard = this.leaderboard.slice(0, 50);
    }

    /**
     * 保存排行榜数据
     */
    async save() {
        // 保存到LocalStorage
        this.storage.save('leaderboard_data', this.leaderboard);

        // 如果Firebase可用，也保存到Firebase
        if (this.firebase.isConnectedStatus() && !this.isLocalMode) {
            const data = {};
            this.leaderboard.forEach(item => {
                if (item.username) {
                    data[item.username] = item;
                }
            });
            await this.firebase.write(this.leaderboardPath, data);
        }
    }

    /**
     * 更新用户分数
     */
    async updateUserScore(username, score) {
        const existingIndex = this.leaderboard.findIndex(
            item => item.username === username
        );

        const userData = {
            username: username,
            score: score,
            updateTime: Date.now()
        };

        if (existingIndex >= 0) {
            // 更新现有用户
            if (score > this.leaderboard[existingIndex].score) {
                this.leaderboard[existingIndex] = userData;
            }
        } else {
            // 添加新用户
            this.leaderboard.push(userData);
        }

        // 重新排序
        this.leaderboard.sort((a, b) => (b.score || 0) - (a.score || 0));

        await this.save();
    }

    /**
     * 渲染排行榜UI
     */
    render(containerId, currentUsername) {
        this.currentUsername = currentUsername;
        const container = document.getElementById(containerId);
        
        if (!container) return;

        container.innerHTML = '';

        if (this.leaderboard.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px;">暂无排行榜数据</p>';
            return;
        }

        this.leaderboard.forEach((item, index) => {
            const div = document.createElement('div');
            div.className = 'leaderboard-item';
            
            if (item.username === currentUsername) {
                div.classList.add('current-user');
            }

            const rank = index + 1;
            let rankHtml = rank;
            
            if (rank <= 3) {
                const medals = ['🥇', '🥈', '🥉'];
                rankHtml = medals[rank - 1];
            }

            div.innerHTML = `
                <div class="leaderboard-rank">${rankHtml}</div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${this.escapeHtml(item.username)}</div>
                    <div class="leaderboard-score">${item.score || 0} 分</div>
                </div>
            `;

            container.appendChild(div);
        });
    }

    /**
     * 显示排行榜弹窗
     */
    show() {
        const modal = document.getElementById('leaderboardModal');
        if (modal) {
            modal.classList.add('show');
            this.load().then(() => {
                this.render('leaderboardList', this.currentUsername);
            });
        }
    }

    /**
     * 隐藏排行榜弹窗
     */
    hide() {
        const modal = document.getElementById('leaderboardModal');
        if (modal) {
            modal.classList.remove('show');
        }
    }

    /**
     * 关闭排行榜弹窗（别名）
     */
    close() {
        this.hide();
    }

    /**
     * 获取当前用户排名
     */
    getUserRank(username) {
        const index = this.leaderboard.findIndex(
            item => item.username === username
        );
        return index >= 0 ? index + 1 : null;
    }

    /**
     * HTML转义
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Leaderboard };
}