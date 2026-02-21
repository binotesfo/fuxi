/**
 * 特效系统模块
 * 负责答题特效、粒子效果、积分动画等
 */

class EffectSystem {
    constructor() {
        this.container = null;
        this.effects = [];
        this.colors = {
            level1: '#4CAF50',
            level2: '#FFD700',
            level3: '#FF6B6B',
            level4: '#FF1493',
            level5: '#00FFFF'
        };
    }

    /**
     * 初始化特效容器
     */
    init() {
        this.container = document.getElementById('effectContainer');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'effect-container';
            this.container.id = 'effectContainer';
            document.body.appendChild(this.container);
        }
    }

    /**
     * 显示答题效果
     * @param {boolean} isCorrect - 是否正确
     * @param {number} level - 等级(1-5)
     * @param {number} combo - 连对次数
     */
    showAnswerEffect(isCorrect, level, combo) {
        if (!this.container) this.init();
        
        if (!isCorrect) {
            this.shakeScreen();
            return;
        }

        switch (level) {
            case 1:
                this.level1_Correct();
                break;
            case 2:
                this.level2_Streak3(combo);
                break;
            case 3:
                this.level3_Streak5(combo);
                break;
            case 4:
                this.level4_Streak10(combo);
                break;
            case 5:
                this.level5_Mastered();
                break;
        }
    }

    /**
     * 显示特效（简化版，用于向后兼容）
     * @param {number} consecutiveCorrect - 连对次数
     * @param {number} score - 积分
     */
    showEffect(consecutiveCorrect, score) {
        if (!this.container) this.init();

        // 显示积分增加动画
        this.showScoreAdd(score);

        // 根据连对次数显示不同的效果
        if (consecutiveCorrect === 0) {
            // 答错了
            this.showErrorEffect();
        } else if (consecutiveCorrect >= 10) {
            this.level4_Streak10(consecutiveCorrect);
        } else if (consecutiveCorrect >= 5) {
            this.level3_Streak5(consecutiveCorrect);
        } else if (consecutiveCorrect >= 3) {
            this.level2_Streak3(consecutiveCorrect);
        } else {
            this.level1_Correct();
        }
    }

    /**
     * 显示积分增加动画
     * @param {number} score - 增加的积分
     */
    showScoreAdd(score) {
        if (!this.container) this.init();
        
        const floatDiv = document.createElement('div');
        floatDiv.className = 'score-float';
        floatDiv.textContent = `+${score}`;
        this.container.appendChild(floatDiv);
        
        setTimeout(() => floatDiv.remove(), 1500);
    }

    /**
     * 显示连对提示
     * @param {number} count - 连对次数
     */
    showStreak(count) {
        const indicator = document.getElementById('streakIndicator');
        if (indicator) {
            indicator.classList.add('show');
            document.getElementById('streakCount').textContent = count;
        }
    }

    /**
     * 创建粒子效果
     * @param {string} type - 粒子类型
     * @param {number} count - 粒子数量
     * @param {string} color - 粒子颜色
     */
    createParticles(type, count, color) {
        if (!this.container) this.init();
        
        const containerRect = this.container.getBoundingClientRect();
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = `particle ${type}`;
            
            if (color) {
                particle.style.background = color;
            }
            
            const x = Math.random() * containerRect.width;
            const y = Math.random() * containerRect.height;
            
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 100;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity - 100;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            this.container.appendChild(particle);
            
            setTimeout(() => particle.remove(), 1000);
        }
    }

    /**
     * 震动屏幕
     */
    shakeScreen() {
        const flash = document.getElementById('flashOverlay');
        if (flash) {
            document.body.classList.add('shake');
            setTimeout(() => document.body.classList.remove('shake'), 500);
        }
    }

    /**
     * 显示错误特效
     */
    showErrorEffect() {
        this.shakeScreen();
    }

    /**
     * 闪光效果
     */
    flashScreen() {
        const flash = document.getElementById('flashOverlay');
        if (flash) {
            flash.classList.add('show');
            setTimeout(() => flash.classList.remove('show'), 300);
        }
    }

    /**
     * 清除所有特效
     */
    clearEffects() {
        if (this.container) {
            this.container.innerHTML = '';
        }
    }

    /**
     * 等级1：答对一次
     */
    level1_Correct() {
        this.createParticles('star', 10, this.colors.level1);
    }

    /**
     * 等级2：连对3-4次
     */
    level2_Streak3(streak) {
        this.createParticles('heart', 15, this.colors.level2);
        this.createParticles('confetti', 10);
    }

    /**
     * 等级3：连对5-9次
     */
    level3_Streak5(streak) {
        this.createParticles('diamond', 20, this.colors.level3);
        this.flashScreen();
    }

    /**
     * 等级4：连对10次+
     */
    level4_Streak10(streak) {
        this.createParticles('comet', 25, this.colors.level4);
        this.showComboNumber(streak);
        this.flashScreen();
    }

    /**
     * 等级5：已掌握
     */
    level5_Mastered() {
        this.createFirework();
        this.createFallingItems('🏆', 10);
        this.createParticles('star', 30, this.colors.level5);
        this.flashScreen();
    }

    /**
     * 显示连击数字
     */
    showComboNumber(number) {
        if (!this.container) this.init();
        
        const comboDiv = document.createElement('div');
        comboDiv.className = 'combo-number';
        comboDiv.textContent = number;
        this.container.appendChild(comboDiv);
        
        setTimeout(() => comboDiv.remove(), 1500);
    }

    /**
     * 创建烟花效果
     */
    createFirework() {
        if (!this.container) this.init();
        
        const containerRect = this.container.getBoundingClientRect();
        const centerX = containerRect.width / 2;
        const centerY = containerRect.height / 2;
        
        for (let i = 0; i < 5; i++) {
            const angle = (Math.PI * 2 * i) / 5;
            const distance = 100;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            for (let j = 0; j < 20; j++) {
                const particle = document.createElement('div');
                particle.className = 'firework';
                particle.style.left = `${x}px`;
                particle.style.top = `${y}px`;
                particle.style.background = this.getRandomColor();
                
                const fireworkAngle = Math.random() * Math.PI * 2;
                const fireworkDistance = 50 + Math.random() * 100;
                particle.style.setProperty('--tx', `${Math.cos(fireworkAngle) * fireworkDistance}px`);
                particle.style.setProperty('--ty', `${Math.sin(fireworkAngle) * fireworkDistance}px`);
                
                this.container.appendChild(particle);
                setTimeout(() => particle.remove(), 1000);
            }
        }
    }

    /**
     * 创建下落物品效果
     */
    createFallingItems(emoji, count) {
        if (!this.container) this.init();
        
        const containerRect = this.container.getBoundingClientRect();
        
        for (let i = 0; i < count; i++) {
            const item = document.createElement('div');
            item.className = 'falling-item';
            item.textContent = emoji;
            item.style.left = `${Math.random() * containerRect.width}px`;
            item.style.animationDelay = `${i * 0.1}s`;
            
            this.container.appendChild(item);
            setTimeout(() => item.remove(), 2500);
        }
    }

    /**
     * 获取随机颜色
     */
    getRandomColor() {
        const colors = ['#FFD700', '#FF6B6B', '#4CAF50', '#00FFFF', '#FF1493', '#FFA500'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EffectSystem };
}