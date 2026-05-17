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
    // Flash 插件名、版本号、操作系统存储变量
    let name;
    let version;
    let platform;
    // 根据运行环境分配合适的 Flash 插件
    switch (process.platform) {
        case 'darwin':
            platform = 'darwin';
            name = 'PepperFlashPlayer.plugin';
            version = '21.0.0.204';
            break;
        case 'win32':
            platform = 'windows';
            name = 'pepflashplayer64_26_0_0_131.dll';
            version = '26.0.0.131';
            break;
        default:
            platform = 'linux';
            name = 'libpepflashplayer.so';
            version = '34.0.0.137';
            break;
    }
    // 向 Electron 挂载 Flash 插件
    app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, platform, name));
    app.commandLine.appendSwitch('ppapi-flash-version', version);
    app.commandLine.appendSwitch('--disable-http-cache');
}


module.exports = { usePepFlash };
