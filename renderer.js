// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
// alert(process.versions.node);
const {ipcRenderer} = require('electron')
window.addEventListener('DOMContentLoaded',()=>{
    ipcRenderer.send("message","hello from render")
    ipcRenderer.on("reply",(event,arg)=>{
        document.getElementById("msg").innerHTML =arg
    })
})