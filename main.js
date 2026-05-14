const { app } = require('electron');
const { createMainWindow } = require('./app/window');
const { usePepFlash } = require('./app/plugins/flash_plugin');


let mainWindow = null;

usePepFlash();

app.on('ready', () => {
    mainWindow = createMainWindow();
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', function() {
        mainWindow = null;
        app.quit();
    });
});

app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
});
