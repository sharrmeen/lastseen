let activeTimer=null
let unloadHandler=null

function lastSeenTill(video){
    if(!video){
        return;
    }
    const urlParam=new URLSearchParams(window.location.search)
    const videoId=urlParam.get('v')
    if(!videoId)return;

    //check for existing url : time pair
    chrome.storage.local.get([videoId],(result)=>{
        if(result[videoId]){
            // console.log("Saved time found for "+result[videoId]+"at "+result[videoId].time)
            const savedTime=result[videoId].time
            video.currentTime=savedTime
            // console.log("Video time updated to "+savedTime)

            video.addEventListener("loadedmetadata",()=>{
                video.currentTime=savedTime
                // console.log("Video time updated to "+savedTime)
            },{once:true})
            
        }
    })

    //clear the previous process
    if(activeTimer){
        clearInterval(activeTimer)
        activeTimer=null
        // console.log("Killed old loop");
    }

    //run every 3 seconds while the video plays
    activeTimer=setInterval(()=>{
        if(!video.paused && video.currentTime>15){
            chrome.storage.local.set({[videoId]:{time:video.currentTime,savedAt:Date.now()}})
            // console.log("Saved time for video "+videoId+" as "+video.currentTime)
        }
    },3000)

    if (unloadHandler) window.removeEventListener('beforeunload', unloadHandler);

    unloadHandler=()=>{
        chrome.storage.local.set({[videoId]:{time:video.currentTime,savedAt:Date.now()}})
    }
    window.addEventListener("beforeunload",unloadHandler)
}

//cleanup old entries
chrome.storage.local.get(null,(all)=>{
    const month=30*24*60*60*1000;
    const toDelete=Object.keys(all).filter((k)=>
        Date.now()-all[k]?.savedAt>month
    )
    if(toDelete.length){
        chrome.storage.local.remove(toDelete);
    }
})

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

//fire when the video components src changes (since SPA)
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

 