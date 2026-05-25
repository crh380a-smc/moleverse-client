/**
 *  平行摩尔 Electron 微端 -- 应用配置文件
 * 
 *  @author C.R.H <shinra.dx@outlook.com>
 *  @license MIT
 */


const BASE_DIR = __dirname;
const WINDOW = require('./manifest/window.json');
const URL = require('./manifest/url.json');
const FILTERS = require('./manifest/filter.json');
const CUSTOM_ENTRYPOINT_ID = 999;


module.exports = { BASE_DIR, WINDOW, URL, FILTERS, CUSTOM_ENTRYPOINT_ID };
