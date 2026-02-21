/**
 * Firebase管理模块
 * 负责Firebase初始化、配置管理和数据操作
 */

class FirebaseManager {
    constructor(config) {
        this.config = config || {};
        this.app = null;
        this.db = null;
        this.isConnected = false;
        this.listeners = new Map();
    }

    /**
     * 初始化Firebase
     * @param {Object} config - Firebase配置对象
     * @returns {boolean} 是否初始化成功
     */
    init(config = null) {
        if (config) {
            this.config = config;
        }

        // 检查Firebase SDK是否已加载
        if (typeof firebase === 'undefined') {
            console.warn('Firebase SDK未加载，将使用本地存储');
            return false;
        }

        try {
            // 初始化Firebase应用
            this.app = firebase.initializeApp(this.config);
            
            // 获取数据库引用
            this.db = firebase.database();
            
            this.isConnected = true;
            console.log('✅ Firebase初始化成功');
            return true;
        } catch (error) {
            console.error('❌ Firebase初始化失败:', error);
            this.isConnected = false;
            return false;
        }
    }

    /**
     * 读取数据
     * @param {string} path - 数据路径
     * @returns {Promise} 数据Promise
     */
    async read(path) {
        if (!this.isConnected || !this.db) {
            console.warn('Firebase未连接，无法读取数据');
            return null;
        }

        try {
            const snapshot = await this.db.ref(path).once('value');
            return snapshot.val();
        } catch (error) {
            console.error('读取数据失败:', error);
            return null;
        }
    }

    /**
     * 写入数据
     * @param {string} path - 数据路径
     * @param {*} data - 要写入的数据
     * @returns {Promise} 写入Promise
     */
    async write(path, data) {
        if (!this.isConnected || !this.db) {
            console.warn('Firebase未连接，无法写入数据');
            return false;
        }

        try {
            await this.db.ref(path).set(data);
            return true;
        } catch (error) {
            console.error('写入数据失败:', error);
            return false;
        }
    }

    /**
     * 更新数据
     * @param {string} path - 数据路径
     * @param {Object} data - 要更新的数据
     * @returns {Promise} 更新Promise
     */
    async update(path, data) {
        if (!this.isConnected || !this.db) {
            console.warn('Firebase未连接，无法更新数据');
            return false;
        }

        try {
            await this.db.ref(path).update(data);
            return true;
        } catch (error) {
            console.error('更新数据失败:', error);
            return false;
        }
    }

    /**
     * 删除数据
     * @param {string} path - 数据路径
     * @returns {Promise} 删除Promise
     */
    async remove(path) {
        if (!this.isConnected || !this.db) {
            console.warn('Firebase未连接，无法删除数据');
            return false;
        }

        try {
            await this.db.ref(path).remove();
            return true;
        } catch (error) {
            console.error('删除数据失败:', error);
            return false;
        }
    }

    /**
     * 监听数据变化
     * @param {string} path - 数据路径
     * @param {Function} callback - 数据变化回调
     * @returns {Function} 取消监听的函数
     */
    onValue(path, callback) {
        if (!this.isConnected || !this.db) {
            console.warn('Firebase未连接，无法监听数据');
            return () => {};
        }

        const listener = this.db.ref(path).on('value', (snapshot) => {
            callback(snapshot.val());
        });

        // 存储监听器引用
        const key = `${path}_${Date.now()}`;
        this.listeners.set(key, { path, listener });

        // 返回取消监听的函数
        return () => {
            this.db.ref(path).off('value', listener);
            this.listeners.delete(key);
        };
    }

    /**
     * 获取数据库引用
     * @returns {Object} Firebase数据库引用
     */
    getDatabase() {
        return this.db;
    }

    /**
     * 检查连接状态
     * @returns {boolean} 是否已连接
     */
    isConnectedStatus() {
        return this.isConnected;
    }

    /**
     * 获取配置
     * @returns {Object} Firebase配置
     */
    getConfig() {
        return this.config;
    }

    /**
     * 清理所有监听器
     */
    disconnect() {
        this.listeners.forEach(({ path, listener }) => {
            if (this.db) {
                this.db.ref(path).off('value', listener);
            }
        });
        this.listeners.clear();
        this.isConnected = false;
        console.log('Firebase已断开连接');
    }
}

// 默认Firebase配置（伏羲项目）
const DEFAULT_FIREBASE_CONFIG = {
    apiKey: "AIzaSyCh9Ar8TuQmZWtuOCTF6VzJNs_m0qbiHFk",
    authDomain: "fuxi-chu2-yuwen-up.firebaseapp.com",
    projectId: "fuxi-chu2-yuwen-up",
    storageBucket: "fuxi-chu2-yuwen-up.firebasestorage.app",
    messagingSenderId: "489932483223",
    appId: "1:489932483223:web:d3233921d00bdbb23b17d2",
    measurementId: "G-BPYRERB02C",
    databaseURL: "https://fuxi-chu2-yuwen-up-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// 导出类和配置
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { FirebaseManager, DEFAULT_FIREBASE_CONFIG };
}