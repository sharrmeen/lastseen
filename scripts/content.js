 function lastSeenTill(video){
     console.log("I WAS WORKing")
    if(video){
        console.log("I FOUND THE VIDEO")
    }
    const urlParam=new URLSearchParams(window.location.search)
    const videoId=urlParam.get('v')
    if(!videoId)return;

    //check for existing url : time pair
    chrome.storage.local.get([videoId],(result)=>{
        if(result[videoId]){
            video.currentTime=result[videoId]
        }
    })
    video.addEventListener("playing",(event)=>{
        console.log("THIS VIDEO IS MOW PLAYING")
    })

    //run every 3 seconds while the video plays
    setInterval(()=>{
        if(!video.paused && !video.currentTime>2){
            chrome.storage.local.set({[videoId]:video.currentTime})
        }
    },3000)

    /*
    detect the video element
    extract the url? store as a key in local storage
    check if that url is already present
    if yes -> {
    retrieve the duration of the url
    change video duration using seek
    }

    if not -> create a key value pair of the url and duration (research more)
    add an event listener to detect duration changes
    add a timeout so it does occur immediately
    maybe every 5 seconds
    update duration accordingly

    Edge Cases: 
    buffers?
    seek?
    */
}

lastSeenTill(document.querySelector('video'))

const observer=new MutationObserver((mutations)=>{
    for(const mutation of mutations){
        for(const node of mutation.addedNodes){
            if(node instanceof Element && node.tagName=="VIDEO"){
                lastSeenTill(node)
            }
        }
    }
})

observer.observe(document.body, { childList: true, subtree: true });

 