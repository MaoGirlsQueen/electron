const {ipcRenderer} = require('electron');
const {$,convertDuration} = require("./help");
let musicAudio = new Audio()
let allTracks = []
let currentTrack=[]
$("add-music-button").addEventListener('click', () => {
    ipcRenderer.send("add-music-window");
})
const renderListHtml = (tracks) => {
    const tracksList = $("trackList")

    const tracksHtml = tracks.reduce((html,track ) => {
        html += `<li class="music-track list-group-item d-flex justify-content-between align-items-center row">
                    <div class="col-10">
                        <i class="icon-music iconfont mr-2 text-warning"></i>
                         <b class="text-info">${track.fileName}</b>
                    </div>
                    <div class="col-2">
                        <i class="icon-play iconfont mr-2 text-primary index-icon-cursor" data-id="${track.id}"></i>
                        <i class="icon-delete iconfont text-danger index-icon-cursor" data-id="${track.id}"></i>
                     </div>
                  </li>`
        return html
    }, "")
    const emptyTrackHtml = "<div class='alert alert-primary'>小主，还未添加音乐哦！</div>"
    tracksList.innerHTML = tracks.length ? `<ul class="list-group">${tracksHtml}</ul>`:emptyTrackHtml
}
ipcRenderer.on("getTracks", (event, tracks) => {
    allTracks = tracks
    renderListHtml(tracks)
})

$("trackList").addEventListener('click', (event) => {
    event.preventDefault()
    const {dataset,classList}=event.target
    const id = dataset && dataset.id
    if(id && classList.contains("icon-play")){
        //play music
        //is current music
        if(currentTrack && currentTrack.id == id){
            //current music
            musicAudio.play()
        }else{
            //new music
            currentTrack = allTracks.find(track=>track.id == id)
            musicAudio.src= currentTrack.path
            musicAudio.play()
             const restIconEle = document.querySelector(".icon-Pause")
             if(restIconEle){
                 restIconEle.classList.replace("icon-Pause","icon-play")
             }
        }
        classList.replace("icon-play","icon-Pause")
    }else if(id && classList.contains("icon-Pause")){
        //pausd music
        musicAudio.pause();
        classList.replace("icon-Pause","icon-play")
    }else if(id && classList.contains("icon-delete")){
       //delete current music
        ipcRenderer.send("delete-track",id)
    }
})
const renderPlayHtml = (name,duration)=>{
    const player = $("play-status")
    const html = `
                <div class="col font-weight-bold text-info">
                正在播放：${name}
                </div>
                <div class="col text-info">
                <span id="current-seeker" >00:00</span> / <span id="current-seeker">${convertDuration(duration)}</span>
                </div>
                `
    player.innerHTML = html
}
const updateProgressHtml = (currentTime,duration)=>{
    const progress = Math.floor(currentTime/duration*100)
    const bar = $("player-progress")
    bar.innerHTML = progress+"%"
    bar.style.width = progress+"%"
    const seeker = $("current-seeker")
    seeker.innerHTML = convertDuration(currentTime)
}
//musicAudio listener
musicAudio.addEventListener("loadedmetadata",()=>{
    //开始渲染播放器status
    renderPlayHtml(currentTrack.fileName,musicAudio.duration)
})
musicAudio.addEventListener("timeupdate",()=>{
    //更新播放器status
    updateProgressHtml(musicAudio.currentTime,musicAudio.duration)
})