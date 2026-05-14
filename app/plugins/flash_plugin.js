const path = require('path');
const { app } = require('electron');

const usePepFlash = () => {
    let name;
    let version;
    switch (process.platform) {
        case 'darwin':
            name = 'PepperFlashPlayer.plugin';
            version = '21.0.0.204';
            break
        case 'linux':
            name = 'libpepflashplayer.so';
            break;
        case 'win32':
        default:
            name = 'pepflashplayer64_26_0_0_131.dll';
            version = '26.0.0.131';
            break;
    }
    app.commandLine.appendSwitch('ppapi-flash-path', path.join(__dirname, name));
    app.commandLine.appendSwitch('ppapi-flash-version', version);
    app.commandLine.appendSwitch('--disable-http-cache');
};

module.exports = { usePepFlash };
