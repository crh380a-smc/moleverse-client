const { BrowserWindow } = require('electron');
const { WINDOW } = require('../config');
const { store } = require('./store');


/**
 *  平行摩尔 Electron 微端 -- 窗口控制方法定义
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


/**
 *  创建主窗口
 * 
 *  @returns {Electron.BrowserView} Electron 窗口对象
 */

function createMainWindow() {
    // 从应用配置中读取主窗口宽、高、拉伸数据，创建主窗口
    let mainWindow = new BrowserWindow({
        width: WINDOW.width,
        height: WINDOW.height,
        useContentSize: true,
        autoHideMenuBar: false,
        resizable: WINDOW.resizable,
        fullscreenable: WINDOW.resizable,
        menuBarVisible: true,
        webPreferences: {
            plugins: true,
            contextIsolation: false,
        }
    });
    // 加载最近一次连接的节点
    mainWindow.loadURL(store.get('entrypoint'));
    // 返回 Electron 窗口对象
    return mainWindow;
}

/**
 *  创建新窗口（用于外链）
 * 
 *  @param {String} url 外链链接
 *  @param {Number} width 窗口宽度
 *  @param {Number} height 窗口高度
 *  @param {Boolean} resizable 窗口是否可以拉伸
 *  @returns {Electron.BrowserView} Electron 窗口对象
 */

function createWindow(url, width = 1280, height = 720, resizable = true) {
    // 新窗口不提供菜单
    let subWindow = new BrowserWindow({
        width,
        height,
        useContentSize: true,
        autoHideMenuBar: true,
        resizable,
        fullscreenable: resizable,
        menuBarVisible: false,
    });
    // 加载外链
    subWindow.loadURL(url);
    // 返回新窗口对象
    return subWindow;
}


module.exports = { createMainWindow, createWindow };
