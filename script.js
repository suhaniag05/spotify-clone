console.log('Hello')
let songs;
let currFolder;
function convertSecondsToMinutesSeconds(seconds) {
    // Calculate minutes and remaining seconds
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds =  Math.floor(seconds % 60);

    // Pad single digit seconds with a leading zero
    let secondsStr = remainingSeconds.toString().padStart(2, '0');

    // Return the formatted time
    return `${minutes}:${secondsStr}`;
}

async function getSongs(folder){
    currFolder=folder;
let a=await fetch(`http://127.0.0.1:3000/PROJECT2_Spotify/${folder}/`)
let response=await a.text();
let div=document.createElement("div")
div.innerHTML=response;
let as=div.getElementsByTagName("a")
 songs=[ ]
for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split(`/${folder}/`)[1])
    }
}
let songUL=document.querySelector(".songlist").getElementsByTagName("ul")[0]
songUL.innerHTML=" "
for (const song of songs) {
    songUL.innerHTML=songUL.innerHTML+`<li> 
     
    <img class="invert" src="images/music.svg">
  <div class="info">
    <div> ${song.replaceAll("%20"," ").replace("128 Kbps.mp3"," ")}</div>
    </div>
     <div id="reference" style="visibility: hidden"> ${song.replaceAll("%20"," ")}</div>
    <div class="playnow">
      <span>Play now</span>
    <img class="invert" src="images/play.svg"/>
  </div>
    </li>`;
    
}
Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element=>{
       
        console.log(e.querySelector("#reference").innerHTML)
        playMusic(e.querySelector("#reference").innerHTML.trim())
    })
    

})
return songs
}
let currentSong=new Audio();

const playMusic=(track)=>{
  currentSong.src=`/PROJECT2_Spotify/${currFolder}/` +track;
currentSong.play();
resume.src="images/pause.svg";
document.querySelector(".songinfo").innerHTML=track.replaceAll("%20"," ").replace("128 Kbps.mp3"," ")
document.querySelector(".songtime").innerHTML= "00:00 / 00:00"
}

async function displayalbums(){
    let a=await fetch(`http://127.0.0.1:3000/PROJECT2_Spotify/songs/`)
let response=await a.text();
let div=document.createElement("div")
div.innerHTML=response;
let anchors=div.getElementsByTagName("a")
let cardcontainer=document.querySelector(".card-container")
let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
    if(e.href.includes("/PROJECT2_Spotify/songs")){
        let folder=(e.href.split("/").slice(-2)[0])
        let a=await fetch(`http://127.0.0.1:3000/PROJECT2_Spotify/songs/${folder}/info.json`)
let response=await a.json();
console.log(response)
cardcontainer.innerHTML= cardcontainer.innerHTML+` <div data-folder="${folder}" class="card roboto-regula">
              <div class="play">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="none"
                >
                  <circle cx="12" cy="12" r="10" fill="#0BDA51" />
                  <path
                    d="M9.5 11.1998V12.8002C9.5 14.3195 9.5 15.0791 9.95576 15.3862C10.4115 15.6932 11.0348 15.3535 12.2815 14.6741L13.7497 13.8738C15.2499 13.0562 16 12.6474 16 12C16 11.3526 15.2499 10.9438 13.7497 10.1262L12.2815 9.32594C11.0348 8.6465 10.4115 8.30678 9.95576 8.61382C9.5 8.92086 9.5 9.6805 9.5 11.1998Z"
                    fill="black"
                  />
                </svg>
              </div>
              <img
                src="/PROJECT2_Spotify/songs/${folder}/cover.jpg"
              />
              <h2>${response.title}</h2>
              <p>${response.description}</p>
            </div>`
    }
}

Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item =>{
        songs =await getSongs(`songs/${item.currentTarget.dataset.folder}`)
        playMusic(songs[0])
    })
    })

}
async function main(){

    await getSongs("songs/happy")
    console.log(songs)

displayalbums();

  resume.addEventListener("click",()=>{
if(currentSong.paused){
    currentSong.play()
    resume.src="images/pause.svg";
}
else{
currentSong.pause()
resume.src="images/play.svg";
}
  })
  currentSong.addEventListener("timeupdate",()=>{
    console.log(currentSong.currentTime/currentSong.duration)
    document.querySelector(".songtime").innerHTML=`${convertSecondsToMinutesSeconds(currentSong.currentTime)}/${convertSecondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration*100)+"%";

  })
document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=(e.offsetX/e.target.getBoundingClientRect().width*100);
    document.querySelector(".circle").style.left=percent+"%";
     currentSong.currentTime =((currentSong.duration)*percent)/100;
})

document.querySelector(".hamburger").addEventListener("click",()=>{
document.querySelector(".left").style.left="0"
})
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left="-100%"
    })

    previous.addEventListener("click",()=>{
       
        console.log("Prvious clicked")
        let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }
    })
    
next.addEventListener("click",()=>{
    
        console.log("Next clicked")
 let index= songs.indexOf(currentSong.src.split("/").slice(-1)[0])
if((index+1)<songs.length){
    playMusic(songs[index+1])
}
    })
   
document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    currentSong.volume=parseInt(e.target.value)/100
    if(currentSong.volume>0){
        document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
    }
})

document.querySelector(".vol").addEventListener("click",e=>{
console.log(e.target);
if(e.target.src.includes("volume.svg")){
    e.target.src=  e.target.src.replace("volume.svg","mute.svg")
    currentSong.volume=0
    document.querySelector(".range").getElementsByTagName("input")[0].value=0;
}
else{
    e.target.src= e.target.src.replace("mute.svg","volume.svg")
    currentSong.volume=0.10
    document.querySelector(".range").getElementsByTagName("input")[0].value=10;
}
})
    }
 
main()
 