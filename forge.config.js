module.exports = {
    packagerConfig: {
        name: 'MoleVerseClient',
        productName: '平行摩尔微端',
        icon: './resources/favicon',
        overwrite: true,
        asar: false,
        version: "0.0.1",
        ignore: [
            '.git',
            '.vscode',
            'node_modules/.cache',
            '.npmrc',
            'resources',
            'forge.config.js',
            '.gitignore',
            'data/',
        ],
    },
    makers: [{
        name: "@electron-forge/maker-squirrel",
        config: {
            "name": "electron_quick_start",
        },
    },{
        name: "@electron-forge/maker-zip",
        platforms: ["darwin"],
    },{
        name: "@electron-forge/maker-deb",
        config: {},
    },{
        name: "@electron-forge/maker-rpm",
        config: {},
    }],
};
