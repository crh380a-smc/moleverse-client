const { BrowserWindow } = require('electron');
const windowConfig = require('../config/window.json');

const createMainWindow = () => {
    let mainWindow = new BrowserWindow({
        width: windowConfig.width,
        height: windowConfig.height,
        useContentSize: true,
        autoHideMenuBar: false,
        resizable: windowConfig.resizable,
        fullscreenable: windowConfig.resizable,
        menuBarVisible: true,
        webPreferences: {
            plugins: true,
        }
    });
    mainWindow.loadURL('http://mole.61.com/');
    return mainWindow;
};

const createWindow = (url, width, height, resizable) => {
    let subWindow = new BrowserWindow({
        width,
        height,
        useContentSize: true,
        autoHideMenuBar: true,
        resizable,
        fullscreenable: resizable,
        menuBarVisible: false,
    });
    subWindow.loadURL(url);
    return subWindow;
};

module.exports = { createMainWindow, createWindow };
