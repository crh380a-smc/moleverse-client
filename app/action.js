const { store } = require('./store');
const { createWindow } = require('./window');


/**
 *  平行摩尔 Electron 微端 -- 窗口菜单动作定义
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


/**
 *  页面刷新动作
 * 
 *  @param {Electron.BrowserView} window Electron 窗口对象
 *  @returns {Object} Electron 菜单模板
 */

function refreshAction(window) {
    return {
        label: '刷新页面（F5）',
        click() {
            window.loadURL(store.state.entrypoint);
        },
    };
}

/**
 *  缓存清除动作
 * 
 *  @param {Electron.BrowserView} window Electron 窗口对象
 *  @returns {Object} Electron 菜单模板
 */

function clearCacheAction(window) {
    return {
        label: '清除缓存并刷新页面（Ctrl+F5）',
        click() {
            session.defaultSession.clearCache();
            window.loadURL(store.state.entrypoint);
        },
    };
}

/**
 *  连接节点设置动作
 * 
 *  @param {Electron.BrowserView} window Electron 窗口对象
 *  @param {Object} entrypoint 连接节点数据对象
 *  @returns {Object} Electron 菜单模板
 */

function entrypointAction(window, entrypoint) {
    return {
        label: entrypoint.label,
        click() {
            store.state.entrypoint = entrypoint.url;
            window.loadURL(store.state.entrypoint);
        },
    };
}

/**
 *  外链动作
 * 
 *  @param {Object} link 外链数据对象
 *  @returns {Object} Electron 菜单模板
 */

function linkAction(link) {
    return {
        label: link.label,
        click: () => {
            createWindow(link.url, link.width, link.height);
        },
    };
}

/**
 *  开发者工具动作
 * 
 *  @param {Electron.BrowserView} window Electron 窗口对象
 *  @returns {Object} Electron 菜单模板
 */

function devToolsAction(window) {
    return {
        label: '开发者工具',
        click() {
            if (window) {
                window.webContents.openDevTools();
            }
        },
    };
}


module.exports = {
    refreshAction,
    clearCacheAction,
    entrypointAction,
    linkAction,
    devToolsAction,
};
