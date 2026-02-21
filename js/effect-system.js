/**
 * 特效系统模块
 * 负责答题特效、粒子效果、积分动画等
 */

class EffectSystem {
    constructor() {
        this.container = null;
        this.effects = [];
        this.colors = {
            level1: '#4CAF50',      // 绿色 - 1-2次连对
            level2: '#FFD700',      // 金色 - 3-5次连对
            level3: '#FF6B6B',      // 红色 - 6-10次连对
            level4: '#FF1493',      // 粉色 - 11-20次连对
            level5: '#9C27B0',      // 紫色 - 20+次连对
            level6: '#00FFFF',      // 蓝青色 - 已掌握
            bronze: '#CD7F32',      // 青铜 - 结算奖励
            silver: '#C0C0C0',      // 白银 - 结算奖励
            gold: '#FFD700',        // 黄金 - 结算奖励
            blue: '#2196F3',        // 蓝色 - 80%突破
            silver_star: '#B0C4DE', // 银色星光 - 90%突破
            golden: '#FFA500',      // 金色光芒 - 95%突破
            diamond: '#B9F2FF',     // 钻石闪耀 - 96%突破
            amethyst: '#9966CC',    // 紫水晶 - 97%突破
            rainbow: '#FF69B4',     // 七彩彩虹 - 98%突破
            dragon: '#FF4500'       // 龙凤呈祥 - 99%突破
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
        } else if (consecutiveCorrect >= 20) {
            this.level5_Streak20(consecutiveCorrect);
        } else if (consecutiveCorrect >= 10) {
            this.level4_Streak11(consecutiveCorrect);
        } else if (consecutiveCorrect >= 5) {
            this.level3_Streak6(consecutiveCorrect);
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
     * 等级1：答对1-2次
     */
    level1_Correct() {
        this.createParticles('star', 10, this.colors.level1);
    }

    /**
     * 等级2：连对3-5次
     */
    level2_Streak3(streak) {
        this.createParticles('heart', 15, this.colors.level2);
        this.createParticles('confetti', 10);
    }

    /**
     * 等级3：连对6-10次
     */
    level3_Streak6(streak) {
        this.createParticles('diamond', 20, this.colors.level3);
        this.flashScreen();
    }

    /**
     * 等级4：连对11-20次
     */
    level4_Streak11(streak) {
        this.createParticles('comet', 25, this.colors.level4);
        this.showComboNumber(streak);
        this.flashScreen();
    }

    /**
     * 等级5：连对20+次
     */
    level5_Streak20(streak) {
        this.createParticles('lightning', 30, this.colors.level5);
        this.createRainbow();
        this.showComboNumber(streak);
        this.flashScreen();
    }

    /**
     * 等级6：已掌握（增强版）
     */
    level5_Mastered() {
        // 超大烟花群（5个烟花同时绽放）
        this.createMultipleFireworks(5);
        // 全屏金色雨滴下落
        this.createFallingItems('🌟', 50);
        // 皇冠从天而降
        this.createFallingItems('👑', 3);
        // 屏幕震动+闪光
        this.shakeScreen();
        this.flashScreen();
        // "恭喜掌握！"文字动画
        this.showCongratulationText('恭喜掌握！');
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

    /**
     * 创建彩虹效果
     */
    createRainbow() {
        if (!this.container) this.init();
        
        const containerRect = this.container.getBoundingClientRect();
        const rainbow = document.createElement('div');
        rainbow.className = 'rainbow';
        rainbow.style.left = `${containerRect.width / 2}px`;
        rainbow.style.top = `${containerRect.height / 2}px`;
        this.container.appendChild(rainbow);
        
        setTimeout(() => rainbow.remove(), 2000);
    }

    /**
     * 创建多个烟花效果
     */
    createMultipleFireworks(count) {
        if (!this.container) this.init();
        
        const containerRect = this.container.getBoundingClientRect();
        
        for (let f = 0; f < count; f++) {
            setTimeout(() => {
                const centerX = Math.random() * containerRect.width;
                const centerY = Math.random() * containerRect.height;
                
                for (let i = 0; i < 20; i++) {
                    const particle = document.createElement('div');
                    particle.className = 'firework';
                    particle.style.left = `${centerX}px`;
                    particle.style.top = `${centerY}px`;
                    particle.style.background = this.getRandomColor();
                    
                    const angle = Math.random() * Math.PI * 2;
                    const distance = 50 + Math.random() * 100;
                    particle.style.setProperty('--tx', `${Math.cos(angle) * distance}px`);
                    particle.style.setProperty('--ty', `${Math.sin(angle) * distance}px`);
                    
                    this.container.appendChild(particle);
                    setTimeout(() => particle.remove(), 1000);
                }
            }, f * 200);
        }
    }

    /**
     * 显示恭喜文字
     */
    showCongratulationText(text) {
        if (!this.container) this.init();
        
        const textDiv = document.createElement('div');
        textDiv.className = 'congratulation-text';
        textDiv.textContent = text;
        this.container.appendChild(textDiv);
        
        setTimeout(() => textDiv.remove(), 3000);
    }

    // ========== 正确率突破特效 ==========

    /**
     * 80%突破特效 - 蓝色光环扩散
     */
    breakthrough80() {
        this.createHalo(this.colors.blue);
        this.showCongratulationText('突破80%！');
    }

    /**
     * 90%突破特效 - 银色星光闪烁
     */
    breakthrough90() {
        this.createFallingItems('⭐', 30);
        this.createHalo(this.colors.silver_star);
        this.showCongratulationText('突破90%！');
    }

    /**
     * 95%突破特效 - 金色光芒四射
     */
    breakthrough95() {
        this.createParticles('star', 40, this.colors.golden);
        this.flashScreen();
        this.showCongratulationText('突破95%！');
    }

    /**
     * 96%突破特效 - 钻石闪耀
     */
    breakthrough96() {
        this.createParticles('diamond', 50, this.colors.diamond);
        this.createFallingItems('💎', 10);
        this.flashScreen();
        this.showCongratulationText('突破96%！');
    }

    /**
     * 97%突破特效 - 紫水晶光芒
     */
    breakthrough97() {
        this.createParticles('crystal', 40, this.colors.amethyst);
        this.createHalo(this.colors.amethyst);
        this.showCongratulationText('突破97%！');
    }

    /**
     * 98%突破特效 - 七彩彩虹
     */
    breakthrough98() {
        this.createRainbow();
        this.createFallingItems('🌈', 5);
        this.createParticles('star', 50, this.colors.rainbow);
        this.showCongratulationText('突破98%！');
    }

    /**
     * 99%突破特效 - 龙凤呈祥
     */
    breakthrough99() {
        this.createFallingItems('🐉', 3);
        this.createFallingItems('🦚', 3);
        this.createMultipleFireworks(7);
        this.createRainbow();
        this.flashScreen();
        this.showCongratulationText('突破99%！');
    }

    // ========== 结算奖励特效 ==========

    /**
     * 青铜奖励特效
     */
    settlementBronze() {
        this.createFallingItems('🛡️', 5);
        this.createParticles('bronze', 20, this.colors.bronze);
        this.showScoreAdd(50);
        this.showCongratulationText('青铜奖励 +50');
    }

    /**
     * 白银奖励特效
     */
    settlementSilver() {
        this.createFallingItems('🛡️', 10);
        this.createParticles('silver', 30, this.colors.silver);
        this.showScoreAdd(100);
        this.showCongratulationText('白银奖励 +100');
    }

    /**
     * 黄金奖励特效
     */
    settlementGold() {
        this.createFallingItems('🛡️', 15);
        this.createParticles('gold', 40, this.colors.gold);
        this.createFirework();
        this.showScoreAdd(200);
        this.showCongratulationText('黄金奖励 +200');
    }

    // ========== 最终通关特效 ==========

    /**
     * 最终通关特效（持续10-12秒）
     */
    ultimateVictory() {
        const effects = [];
        
        // 0-2秒：屏幕逐渐变暗，聚光灯效果
        effects.push(setTimeout(() => {
            this.darkenScreen();
        }, 0));

        // 2-4秒：超大烟花群（10个烟花同时绽放）
        effects.push(setTimeout(() => {
            this.createMultipleFireworks(10);
        }, 2000));

        // 4-6秒：全屏金色雨滴+钻石雨滴混合下落
        effects.push(setTimeout(() => {
            this.createFallingItems('🌟', 100);
            this.createFallingItems('💎', 30);
        }, 4000));

        // 6-8秒：皇冠+宝石+奖杯从天而降
        effects.push(setTimeout(() => {
            this.createFallingItems('👑', 5);
            this.createFallingItems('💎', 10);
            this.createFallingItems('🏆', 5);
            this.shakeScreen();
        }, 6000));

        // 8-10秒：屏幕震动+彩虹色闪光+龙凤呈祥动画
        effects.push(setTimeout(() => {
            this.createRainbow();
            this.flashScreen();
            this.createFallingItems('🐉', 3);
            this.createFallingItems('🦚', 3);
        }, 8000));

        // 10-12秒：全屏文字"🎉 恭喜通关！🎉"逐渐放大显示
        effects.push(setTimeout(() => {
            const victoryText = document.createElement('div');
            victoryText.className = 'victory-text';
            victoryText.innerHTML = '🎉 恭喜通关！🎉';
            this.container.appendChild(victoryText);
            setTimeout(() => victoryText.remove(), 3000);
        }, 10000));

        // 12秒后恢复正常
        effects.push(setTimeout(() => {
            this.restoreScreen();
        }, 12000));

        // 返回效果ID数组，可用于取消
        return effects;
    }

    /**
     * 屏幕变暗（聚光灯效果）
     */
    darkenScreen() {
        const flash = document.getElementById('flashOverlay');
        if (flash) {
            flash.classList.add('darken');
            setTimeout(() => flash.classList.remove('darken'), 12000);
        }
    }

    /**
     * 恢复屏幕
     */
    restoreScreen() {
        const flash = document.getElementById('flashOverlay');
        if (flash) {
            flash.classList.remove('darken', 'show');
        }
        document.body.classList.remove('shake');
    }

    /**
     * 创建光环效果
     */
    createHalo(color) {
        if (!this.container) this.init();
        
        const halo = document.createElement('div');
        halo.className = 'halo';
        halo.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
        halo.style.left = '50%';
        halo.style.top = '50%';
        halo.style.transform = 'translate(-50%, -50%)';
        this.container.appendChild(halo);
        
        setTimeout(() => halo.remove(), 2000);
    }
}

// 导出类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EffectSystem };
}