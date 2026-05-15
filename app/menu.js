const { Menu } = require('electron');
const { URL } = require('../config');
const { refreshAction, clearCacheAction, entrypointAction, devToolsAction, linkAction } = require('./action');


/**
 *  平行摩尔 Electron 微端 -- 窗口菜单控制方法定义
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


/**
 *  创建菜单
 * 
 *  @param {Electron.BrowserWindow} window Electron 窗口对象
 *  @returns {void}
 */

function createMenu(window) {
    // 定义菜单模板
    let template = [
        {
            label: '版本/节点选择',
            submenu: createVersionMenu(window),
        },
        {
            label: '页面重载',
            submenu: [
                refreshAction(window),
                clearCacheAction(window),
            ],
        },
        {
            label: '实用链接',
            submenu: createExternalMenu(),
        },
        // 开发者工具选项
        devToolsAction(window),
    ];
    // 通过菜单模板构建菜单对象
    let menu = Menu.buildFromTemplate(template);
    // 设置菜单
    Menu.setApplicationMenu(menu);
}

/**
 *  创建节点选择菜单
 * 
 *  @param {Electron.BrowserWindow} window Electron 窗口对象
 *  @returns {Object} Electron 菜单模板
 */

function createVersionMenu(window) {
    let menu = [];
    // 添加官方服务器节点（国服、台服）
    URL.officialUrl.forEach((item) => {
        menu.push(entrypointAction(window, item));
    });
    menu.push({type: 'separator'});
    // 添加官方服务器镜像节点
    URL.mirrorUrl.forEach((item) => {
        menu.push(entrypointAction(window, item));
    });
    menu.push({type: 'separator'});
    // 添加平行摩尔服务器节点
    URL.verseUrl.forEach((item) => {
        menu.push(entrypointAction(window, item));
    });
    return menu;
}

/**
 *  创建外链菜单
 * 
 *  @returns {Object} Electron 菜单模板
 */

function createExternalMenu() {
    let menu = [];
    // 添加实用外链
    URL.externalUrl.forEach((item) => {
        menu.push(linkAction(item));
    });
    menu.push({type: 'separator'});
    // 添加官服更新公告链接
    menu.push(linkAction({
        label: '官服更新公告',
        width: 800,
        height: 600,
        url: URL.informationUrl,
    }));
    return menu;
}


module.exports = { createMenu };
