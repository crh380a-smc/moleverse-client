const { session } = require('electron');
const { FILTERS } = require('../config');


/**
 *  平行摩尔 Electron 微端 -- 网页资源过滤器定义
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


/**
 *  淘米官方 swfobject.js 过滤器
 * 
 *  @returns {void}
 */

function swfObjectFilter() {
    // 判断配置文件声明的操作系统是否和运行环境一致
    if (process.platform == FILTERS.swfObjectFilter.platform) {
        // 定义过滤器
        let filter = {
            urls: [FILTERS.swfObjectFilter.pattern]
        };
        // 将匹配到的网络请求重定向，指向 self-hosted swfobject.js
        session.defaultSession.webRequest.onBeforeRequest(filter, (details, callback) => {
            callback({'redirectURL': FILTERS.swfObjectFilter.redirect});
        });
    }
}

/**
 *  过滤器注册方法
 * 
 *  @returns {void}
 */

function createFilter() {
    swfObjectFilter();
}


module.exports = { createFilter };
