let activeTimer=null

function lastSeenTill(video){
     console.log("I WAS WORKing")
    if(!video){
        console.log("I FOUND THE VIDEO")
        return;
    }
    const urlParam=new URLSearchParams(window.location.search)
    const videoId=urlParam.get('v')
    console.log(videoId)
    if(!videoId)return;

    //check for existing url : time pair
    chrome.storage.local.get([videoId],(result)=>{
        if(result[videoId]){
            console.log(result[videoId])
            const savedTime=result[videoId].time
            if(video.readyState>=1){
                video.currentTime=savedTime
            }
            else{
                video.addEventListener("loadedmetadata",()=>{
                    video.currentTime=savedTime
                },{once:true})
            }
        }
    })

    //clear the previous process
    if(activeTimer){
        clearInterval(activeTimer)
        activeTimer=null
        console.log("Killed old loop");
    }

    //run every 3 seconds while the video plays
    activeTimer=setInterval(()=>{
        if(!video.paused && video.currentTime>5){
            chrome.storage.local.set({[videoId]:{time:video.currentTime,savedAt:Date.now()}})
            console.log("Saved time for video "+videoId+" as "+video.currentTime)
        }
    },3000)

    window.addEventListener("beforeunload",()=>{
        chrome.storage.local.set({[videoId]:{time:video.currentTime,savedAt:Date.now()}})
    })
}

//wait until video is loaded for the first time
function init(){
    if(document.querySelector('video')){
     lastSeenTill(document.querySelector('video'))
    }
    else{
        setTimeout(init,500);
    }
}

init()


document.addEventListener('yt-navigate-finish', () => {
    const video = document.querySelector('video');
    lastSeenTill(video);
});

// const observer=new MutationObserver((mutations)=>{
//     for(const mutation of mutations){
//         for(const node of mutation.addedNodes){
//             if(node instanceof Element && node.tagName=="VIDEO"){
//                 lastSeenTill(node)
//             }
//         }
//     } 
// })

// observer.observe(document.body, { childList: true, subtree: true });

 