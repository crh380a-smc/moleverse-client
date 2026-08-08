const { app } = require('electron');
const { createMainWindow } = require('./app/window');
const { usePepFlash } = require('./app/plugin/flash_plugin');
const { createMenu } = require('./app/menu');
const { createFilter } = require('./app/filter');


/**
 *  平行摩尔 Electron 微端 -- 应用入口文件
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


// 主窗口空对象
let mainWindow = null;
// 挂载 Flash 插件
usePepFlash();

/* 应用准备就绪的流程控制 */
app.on('ready', () => {
    // 创建资源过滤器
    createFilter();
    // 创建主窗口并返回主窗口实例
    mainWindow = createMainWindow();
    // 创建菜单
    createMenu(mainWindow);
    /* 主窗口关闭时的流程控制 */
    mainWindow.on('closed', function() {
        // 销毁主窗口对象
        mainWindow = null;
        // 退出应用
        app.quit();
    });
});

/* 针对 MAC 系统的窗口关闭流程控制 */
app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
