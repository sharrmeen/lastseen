 function lastSeenTill(video){
     console.log("I WAS WORKing")
    if(video){
        console.log("I FOUND THE VIDEO")
    }
    const urlParam=new URLSearchParams(window.location.search)
    const videoId=urlParam.get('v')
    console.log(videoId)
    if(!videoId)return;

    //check for existing url : time pair
    chrome.storage.local.get([videoId],(result)=>{
        if(result[videoId]){
            console.log(result[videoId])
            const savedTime=result[videoId]
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

    //run every 3 seconds while the video plays
    setInterval(()=>{
        if(!video.paused && video.currentTime>5){
            chrome.storage.local.set({[videoId]:video.currentTime})
            console.log("Saved time for video "+videoId+" as "+video.currentTime)
        }
    },3000)
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

 