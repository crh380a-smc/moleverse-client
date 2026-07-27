const { globalShortcut, session } = require('electron');
const { store } = require('./store');


/**
 *  平行摩尔 Electron 微端 -- 窗口快捷键动作定义
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


/**
 *  页面刷新快捷键
 * 
 *  @param {Electron.BrowserView} window Electron 窗口对象
 *  @returns {void}
 */

function refreshShortcut(window) {
    // F5
    globalShortcut.register('F5', () => {
        if (window) {
            window.reload();
        }
    });
}

/**
 *  缓存清除快捷键
 * 
 *  @param {Electron.BrowserView} window Electron 窗口对象
 *  @returns {void}
 */

function clearCacheShortcut(window) {
    // Ctrl + F5
    globalShortcut.register('CommandOrControl+F5', () => {
        if (window) {
            session.defaultSession.clearCache();
            window.reload();
        }
    });
}

/**
 *  开发者工具快捷键
 * 
 *  @param {Electron.BrowserView} window Electron 窗口对象
 *  @returns {void}
 */

function devToolsShortcut(window) {
    // Ctrl + F12
    globalShortcut.register('CommandOrControl+F12', () => {
        if (window) {
            window.webContents.openDevTools();
        }
    });
}

/**
 *  快捷键注册函数
 * 
 *  @param {Electron.BrowserView} window Electron 窗口对象
 *  @returns {void}
 */

function createShortcut(window) {
    refreshShortcut(window);
    clearCacheShortcut(window);
    devToolsShortcut(window);
}


module.exports = { createShortcut };
