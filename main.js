const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const DataStore = require("./renderer/MusicDataStore")
let myStore = new DataStore({'name': "Music Data"})

class AppWindow extends BrowserWindow {
    constructor(config, fileLocation) {
        const basicConfig = {
            width: 800,
            height: 600,
            webPreferences: {
                nodeIntegration: true
            }
        }
        const finalConfig = {...basicConfig, ...config}
        super(finalConfig);
        this.loadFile(fileLocation);
        this.once('ready-to-show', () => {
            this.show();
        })
    }
}

app.on('ready', () => {
    const mainWindow = new AppWindow({}, './renderer/index.html')
    mainWindow.webContents.on('did-finish-load',()=>{
        console.log("init load")
        mainWindow.send("getTracks",myStore.getTracks())
    })
    //add-music-window
    ipcMain.on("add-music-window", () => {
        const addWindow = new AppWindow({
            width: 500,
            height: 400,
            webPreferences: {
                nodeIntegration: true
            },
            parent: mainWindow
        }, './renderer/add.html')
    })
    //add-tracks
    ipcMain.on("add-tracks", (event, tracks) => {
        const updatedTracks = myStore.addTracks(tracks).getTracks()
        mainWindow.send("getTracks",updatedTracks)
    })
    //add-tracks-error
    ipcMain.on("add-tracks-error", () => {
        dialog.showErrorBox("错误操作", "请添加音乐")
    })
    //delete-tracks-file
    ipcMain.on("delete-track", (event,id) => {
        const deleteUpdateTrack = myStore.deleteTrack(id).getTracks()
        mainWindow.send("getTracks",deleteUpdateTrack)
    })
    //open-music-file
    ipcMain.on("open-music-file", (event) => {
        dialog.showOpenDialog({
            properties: ['openFile', 'multiSelections'],
            filters: [{
                name: "Music", extensions: ['mp3']
            }]
        }, (file) => {
            if (file) {
                event.sender.send('select-file', file);
            }
        })
    });

})

