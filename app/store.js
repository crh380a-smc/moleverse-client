const fs = require('fs');
const { app } = require('electron');
const { URL } = require('../config');


/**
 *  平行摩尔 Electron 微端 -- 用户数据持久化器定义
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


// 用户数据存储路径常量
const DATA_FILE = `${app.getPath('userData')}/user_data.json`;

// 定义用户数据模板
const userDataTemplate = {
    entrypoint: "", 
    customEntrypoint: "",
};

// 定义用户数据持久化器
const store = {
    state: null,
};

/**
 *  初始化用户数据文件
 * 
 *  @returns {void}
 */

function initState() {
    if (!fs.existsSync(DATA_FILE)) {
        let initData = JSON.stringify(userDataTemplate);
        fs.writeFileSync(DATA_FILE, initData, 'utf8');
    }
}

/**
 *  加载用户数据
 * 
 *  @returns {void}
 */

function loadState() {
    if (store.state === null) {
        try {
            // 从 DATA_FILE 里读取用户配置文件，存入 store.state
            let storeFile = fs.readFileSync(DATA_FILE, 'utf8');
            store.state = JSON.parse(storeFile);
        } catch (e) {
            console.error(`读取状态失败：${e}`);
        }
    }
    setEntrypoint();
    setCustomEntrypoint();
}

/**
 *  存储用户数据
 * 
 *  @returns {void}
 */

function saveState() {
    if (store.state !== null) {
        try {
            // 将 store.state 的数据编码成 JSON，存入 DATA_FILE 的用户配置文件
            let storeData = JSON.stringify(store.state);
            fs.writeFileSync(DATA_FILE, storeData, 'utf8');
        } catch (e) {
            console.error(`保存状态失败：${e}`);
        }
    }
}

/**
 *  Store 操作 -- 初始化默认连接节点
 * 
 *  @returns {void}
 */

function setEntrypoint() {
    if (store.state.entrypoint == '') {
        store.state.entrypoint = URL.verseUrl[0].url;
    }
}

/**
 *  Store 操作 -- 初始化默认自定义节点
 * 
 *  @returns {void}
 */

function setCustomEntrypoint() {
    if (store.state.customEntrypoint == '') {
        store.state.customEntrypoint = URL.verseUrl[0].url;
    }
}


module.exports = { store, initState, loadState, saveState };
