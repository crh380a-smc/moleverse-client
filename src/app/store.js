const Store = require('electron-store');
const { STORE_SCHEMA } = require('../config');


/**
 *  平行摩尔 Electron 微端 -- 用户数据持久化器定义
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


// 初始化 Store
const store = new Store({schema: STORE_SCHEMA});


module.exports = { store };
