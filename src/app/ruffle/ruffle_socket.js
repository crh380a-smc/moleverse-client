const os = require('os');
const path = require('path');
const { app } = require('electron');
const { fork } = require('child_process');
const { RUFFLE_SOCKET_PORT, BASE_DIR } = require('../../config');

/**
 *  平行摩尔 Electron 微端 -- Ruffle Socket 桥调用业务定义
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


/**
 *  判断是否为 ARM 架构
 * 
 *  @returns {Boolean}
 */

function isArm() {
    return (os.arch() === 'arm' || os.arch() === 'arm64') ? true : false;
}


/**
 *  获取淘米服务器清单文件路径
 * 
 *  @returns {String}
 */

function getHostFile() {
    if (app.isPackaged) {
        return path.join(process.resourcesPath, 'app', 'src', 'manifest', 'ruffle-hosts.json');
    } else {
        return path.join(BASE_DIR, 'manifest', 'ruffle-hosts.json');
    }
}


/**
 *  开启 Socket 桥
 * 
 *  @param {Object} proc Socket 桥进程对象
 *  @returns {void}
 */

function startSocket(proc) {
    // 启动 Socket 桥
    proc = fork(path.join(__dirname, 'ws_bridge.js'), [
        '--allow', getHostFile(),
        '--any', RUFFLE_SOCKET_PORT,
    ]);
    // 实时收集日志
    proc.on('message', (data) => {
        console.log(`[Socket][INFO] - ${data.toString().trim()}`);
    });
    proc.on('error', (data) => {
        console.error(`[Socket][ERROR] - ${data.toString().trim()}`);
    });
    // 处理 Socket 桥异常与崩溃恢复
    proc.on('exit', (code, signal) => {
        console.log(`[SOCKET][INFO] - Socket bridge is successfully exited（Code：${code}，Signal：${signal}）`);
        if (code !== 0 && !app.isQuitting) {
            console.warn(`[SOCKET][WARNING] - Unexpected error occurred, rebooting（Code：${code}，Signal：${signal}）`);
            setTimeout(() => {
                startSocket(proc);
            }, 2000);
        }
    });
}


module.exports = { isArm, startSocket };
