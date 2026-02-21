/**
 * Storage管理模块
 * 负责LocalStorage操作封装和数据迁移
 */

class StorageManager {
    constructor() {
        this.version = '2.0';
    }

    /**
     * 保存数据
     * @param {string} key - 存储键
     * @param {*} data - 要保存的数据
     */
    save(key, data) {
        try {
            const value = JSON.stringify(data);
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    }

    /**
     * 读取数据
     * @param {string} key - 存储键
     * @param {*} defaultValue - 默认值
     * @returns {*} 读取的数据或默认值
     */
    load(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            if (value === null) {
                return defaultValue;
            }
            return JSON.parse(value);
        } catch (error) {
            console.error('读取数据失败:', error);
            return defaultValue;
        }
    }

    /**
     * 删除数据
     * @param {string} key - 存储键
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('删除数据失败:', error);
            return false;
        }
    }

    /**
     * 清空指定前缀的所有数据
     * @param {string} prefix - 键前缀
     */
    clear(prefix = '') {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (!prefix || key.startsWith(prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('清空数据失败:', error);
            return false;
        }
    }

    /**
     * 数据迁移（兼容性处理）
     * @param {string} oldKey - 旧键名
     * @param {string} newKey - 新键名
     * @param {Function} transformFn - 数据转换函数
     */
    migrate(oldKey, newKey, transformFn = null) {
        const oldData = this.load(oldKey);
        
        if (oldData !== null) {
            const newData = transformFn ? transformFn(oldData) : oldData;
            
            // 添加版本标识
            if (typeof newData === 'object' && newData !== null) {
                newData.version = this.version;
                newData.migratedAt = Date.now();
            }
            
            this.save(newKey, newData);
            return true;
        }
        
        return false;
    }

    /**
     * 检查并迁移旧版本数据
     * @param {string} prefix - 数据前缀
     */
    checkAndMigrate(prefix) {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith(prefix)) {
                const data = this.load(key);
                if (data && !data.version) {
                    // 旧版本数据，需要迁移
                    data.version = this.version;
                    data.migratedAt = Date.now();
                    this.save(key, data);
                    console.log(`✅ 已迁移数据: ${key}`);
                }
            }
        });
    }

    /**
     * 获取所有键
     * @param {string} prefix - 可选的键前缀过滤
     * @returns {Array} 键列表
     */
    getKeys(prefix = '') {
        const keys = Object.keys(localStorage);
        if (!prefix) {
            return keys;
        }
        return keys.filter(key => key.startsWith(prefix));
    }

    /**
     * 获取存储空间使用情况
     * @returns {Object} 存储空间信息
     */
    getStorageInfo() {
        try {
            let total = 0;
            const keys = Object.keys(localStorage);
            
            keys.forEach(key => {
                total += localStorage.getItem(key).length;
            });
            
            // localStorage通常限制为5-10MB
            const limit = 5 * 1024 * 1024; // 5MB
            const used = total * 2; // UTF-16编码，每个字符2字节
            
            return {
                keys: keys.length,
                used: used,
                limit: limit,
                usagePercent: (used / limit * 100).toFixed(2)
            };
        } catch (error) {
            console.error('获取存储信息失败:', error);
            return { error: error.message };
        }
    }

    /**
     * 导出数据
     * @param {string} prefix - 数据前缀
     * @returns {Object} 导出的数据
     */
    exportData(prefix = '') {
        const data = {};
        const keys = this.getKeys(prefix);
        
        keys.forEach(key => {
            data[key] = this.load(key);
        });
        
        return {
            version: this.version,
            exportedAt: Date.now(),
            count: keys.length,
            data: data
        };
    }

    /**
     * 导入数据
     * @param {Object} exportData - 导出的数据对象
     */
    importData(exportData) {
        if (!exportData || !exportData.data) {
            console.error('无效的导入数据');
            return false;
        }

        try {
            Object.keys(exportData.data).forEach(key => {
                this.save(key, exportData.data[key]);
            });
            
            console.log(`✅ 已导入 ${exportData.count} 条数据`);
            return true;
        } catch (error) {
            console.error('导入数据失败:', error);
            return false;
        }
    }
}

// 导出类和实例
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StorageManager };
}