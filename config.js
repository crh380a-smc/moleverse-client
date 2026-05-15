/**
 *  平行摩尔 Electron 微端 -- 应用配置文件
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


const WINDOW = require('./config/window.json');
const URL = require('./config/url.json');
const STORE_PATH = './data/client_data.json';
const CUSTOM_ENTRYPOINT_ID = 999;


module.exports = { WINDOW, URL, STORE_PATH, CUSTOM_ENTRYPOINT_ID };
