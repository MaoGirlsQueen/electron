const {ipcRenderer} = require('electron');
const {$} = require("./help");
const path= require('path');
let musicFilesPath = []
$("select-music").addEventListener('click',()=>{
    ipcRenderer.send("open-music-file");
})
$("add-music").addEventListener("click",()=>{
    if(musicFilesPath.length>0){
        ipcRenderer.send("add-tracks",musicFilesPath);
    }else{
        ipcRenderer.send("add-tracks-error");
    }

})

const renderList = (pathes)=>{
 const musicList = $('musicList')
    const musicItemsHTML = pathes.reduce((html,music)=>{
        html+=`<li class="list-group-item"><i class="icon-music iconfont mr-2 text-warning"></i><b class="text-info">${path.basename(music)}</b></li>`
        return html
    },"")
    musicList.innerHTML = `<ul class="list-group">${musicItemsHTML}</ul>`
}
ipcRenderer.on('select-file',(event,path)=>{
    if(Array.isArray(path)){
        renderList(path)
        musicFilesPath= path
    }
})