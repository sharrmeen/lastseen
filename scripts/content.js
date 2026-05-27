 function lastSeenTill(video){
     console.log("I WAS WORKing")
    if(video){
        console.log("I FOUND THE VIDEO")
    }
    video.addEventListener("playing",(event)=>{
        console.log("THIS VIDEO IS MOW PLAYING")
    })
    const dur=video.duration
    console.log("DURATION: "+dur) 
    video.fastSeek(20); 
    console.log("I AM WORKing")
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

// observer.observe(document.querySelector('devsite-content'), {
//   childList: true
// });