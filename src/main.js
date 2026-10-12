const { app } = require('electron');
const { createMainWindow } = require('./app/window');
const { usePepFlash } = require('./app/plugin/flash_plugin');
const { createMenu } = require('./app/menu');
const { createFilter } = require('./app/filter');
const { isArm, startSocket } = require('./app/ruffle/ruffle_socket');


/**
 *  平行摩尔 Electron 微端 -- 应用入口文件
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


// 主窗口空对象
let mainWindow = null;
// Ruffle Socket 桥进程空对象
let socketProcess = null;

// 非 ARM 架构挂载 Adobe Flash Player PPAPI 插件
if (!isArm()) {
    usePepFlash();
}

/* 应用准备就绪的流程控制 */
app.on('ready', () => {
    // ARM 架构没有合适的 Adobe Flash Player PPAPI 插件，
    // 采用 Ruffle 渲染
    if (isArm()) {
        startSocket(socketProcess);
    }
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

/* 应用关闭前杀死 Socket 桥 */
app.on('before-quit', () => {
    app.isQuitting = true;
    if (socketProcess) {
        socketProcess.kill('SIGTERM');
    }
});

/* 针对 MAC 系统的窗口关闭流程控制 */
app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
