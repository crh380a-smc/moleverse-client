const { session, protocol } = require('electron');
const FILTERS = require('../config/filter.json');
const path = require('path');


/**
 *  平行摩尔 Electron 微端 -- 网页资源过滤器定义
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


/**
 *  过滤淘米官方 swfobject.js
 * 
 *  @returns {void}
 */

function swfObjectFilter() {
    // 定义微端 URL Scheme，将请求资源指向 resources 目录
    protocol.registerFileProtocol('mole-client', (request, callback) => {
        let localFile = request.url.substring(14);
        callback(decodeURI(path.normalize(`resources/${localFile}`)));
    });
    // 判断配置文件声明的操作系统是否和运行环境一致
    if (process.platform == FILTERS.swfObjectFilter.platform) {
        // 定义过滤器
        let filter = {
            urls: [FILTERS.swfObjectFilter.pattern]
        };
        // 将匹配到的网络请求重定向，指向本地资源
        session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
            callback({'redirectURL': `mole-client://${FILTERS.swfObjectFilter.localResource}`});
        });
    }
}

function createFilter() {
    swfObjectFilter();
}


module.exports = { createFilter };
