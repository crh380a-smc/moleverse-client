const path = require('path');
const { app } = require('electron');


/**
 *  平行摩尔 Electron 微端 -- Flash 插件加载方法定义
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


/**
 *  加载 Flash插件
 * 
 *  @returns {void}
 */

function usePepFlash() {
    // Flash 版本号、插件路径存储变量
    let flashVersion;
    let flashPath;
    // 根据运行环境分配合适的 Flash 插件
    switch (process.platform) {
        case 'darwin':
            flashPath = path.join(__dirname, 'darwin', 'PepperFlashPlayer.plugin');
            flashVersion = '21.0.0.204';
            break;
        case 'win32':
            flashPath = path.join(__dirname, 'windows', 'pepflashplayer64_26_0_0_131.dll');
            flashVersion = '26.0.0.131';
            break;
        default:
            if (process.arch == 'arm' || process.arch == 'arm64') {
                flashPath = path.join(__dirname, 'linux', 'arm64', 'libpepflashplayer.so');
                flashVersion = '12.0.0.77';
            } else {
                flashPath = path.join(__dirname, 'linux', 'x64', 'libpepflashplayer.so');
                flashVersion = '34.0.0.137';
            }
            break;
    }
    // 向 Electron 挂载 Flash 插件
    app.commandLine.appendSwitch('ppapi-flash-path', flashPath);
    app.commandLine.appendSwitch('ppapi-flash-version', flashVersion);
    app.commandLine.appendSwitch('--disable-http-cache');
    // 禁用 chrome-sandbox
    app.commandLine.appendSwitch('no-sandbox');
}


module.exports = { usePepFlash };
