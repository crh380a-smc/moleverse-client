const fs = require('fs');
const { STORE_PATH, URL } = require('../config');


/**
 *  平行摩尔 Electron 微端 -- 用户数据持久化器定义
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


// 定义用户数据持久化器
const store = {
    state: null,
};

/**
 *  加载用户数据
 * 
 *  @returns {void}
 */

function loadState() {
    if (store.state === null) {
        try {
            // 从 STORE_PATH 里读取用户配置文件，存入 store.state
            let storeFile = fs.readFileSync(STORE_PATH, 'utf8');
            store.state = JSON.parse(storeFile);
        } catch (e) {
            console.error(`读取状态失败：${e}`);
        }
    }
    setEntrypoint();
}

/**
 *  存储用户数据
 * 
 *  @returns {void}
 */

function saveState() {
    if (store.state !== null) {
        try {
            // 将 store.state 的数据编码成 JSON，存入 STORE_PATH 的用户配置文件
            let storeData = JSON.stringify(store.state);
            fs.writeFileSync(STORE_PATH, storeData, 'utf8');
        } catch (e) {
            console.error(`保存状态失败：${e}`);
        }
    }
}

/**
 *  Store 操作 -- 记录最近一次连接的节点
 * 
 *  @returns {void}
 */

function setEntrypoint() {
    if (store.state.entrypoint == '') {
        store.state.entrypoint = URL.verseUrl[0].url;
    }
}


module.exports = { store, loadState, saveState };
