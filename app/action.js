const { session } = require('electron');
const { store } = require('./store');
const { createWindow } = require('./window');
const promptDialog = require('electron-prompt');
const { CUSTOM_ENTRYPOINT_ID, URL } = require('../config');


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
    let menuItem = {};
    if (entrypoint.id === CUSTOM_ENTRYPOINT_ID) {
        menuItem = {
            id: entrypoint.id,
            label: entrypoint.label,
            click() {
                store.state.entrypoint = (store.state.customEntrypoint == undefined || store.state.customEntrypoint == '') ? URL.verseUrl[0].url : store.state.customEntrypoint;
                window.loadURL(store.state.entrypoint);
            },
        };
    } else {
        menuItem = {
            id: entrypoint.id,
            label: entrypoint.label,
            click() {
                store.state.entrypoint = entrypoint.url;
                window.loadURL(store.state.entrypoint);
            },
        };
    }
    return menuItem;
}

/**
 *  自定义镜像设置动作
 * 
 *  @returns {Object} Electron 菜单模板
 */

function customEntrypointAction() {
    return {
        label: '设置自定义镜像',
        click() {
            promptDialog({
                title: '自定义镜像',
                label: '请输入自定义镜像地址：',
                value: store.state.customEntrypoint,
                height: 200,
                inputAttrs: {
                    type: 'url',
                },
                type: 'input',
            }).then((res) => {
                store.state.customEntrypoint = (res === null || res == '') ? URL.verseUrl[0].url : res;
            }).catch(console.error);
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
    customEntrypointAction,
    linkAction,
    devToolsAction,
};
