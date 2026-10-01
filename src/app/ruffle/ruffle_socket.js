const os = require('os');
const path = require('path');
const { app } = require('electron');
const { spawn } = require('child_process');
const { RUFFLE_SOCKET_PORT } = require('../../config');

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
 *  获取 Socket 桥执行文件路径
 * 
 *  @returns {String}
 */

function getSocketPath() {
    if (app.isPackaged) {
        return path.join(process.resourcesPath, 'app', 'src', 'app', 'ruffle');
    } else {
        return path.join(__dirname);
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
    proc = spawn(path.join(getSocketPath(), 'MoleSocketBridge'), [
        '--allow', path.join(getSocketPath(), 'ruffle-hosts.json'),
        '--any', RUFFLE_SOCKET_PORT,
    ], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, PYTHONUNBUFFERED: 1 },
    });
    // 实时收集日志
    proc.stdout.on('data', (data) => {
        console.log(`[Socket][INFO] - ${data.toString().trim()}`);
    });
    proc.stderr.on('data', (data) => {
        console.error(`[Socket][ERROR] - ${data.toString().trim()}`);
    });
    // 处理 Socket 桥异常与崩溃恢复
    proc.on('close', (code) => {
        console.log(`[SOCKET][INFO] - Socket桥已退出（代码：${code}）`);
        if (code !== 0 && !app.isQuitting) {
            console.warn(`[SOCKET][WARNING] - 检测到Socket桥异常退出，尝试重启......`);
            setTimeout(() => {
                startSocket(proc);
            }, 2000);
        }
    });
}


module.exports = { isArm, getSocketPath, startSocket };
