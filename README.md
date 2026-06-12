# YT's Lastseen

I keep YouTube watch history turned off. The side effect? 
YouTube has no memory of where you left off. I kept losing my place in 
long videos and got annoyed enough to fix it, so I built this fairly simple extension.

A lightweight Chrome content script that saves your playback position and resumes exactly where you left off, across sessions, tabs, and browser restarts.

## How it works

- Hooks into `yt-navigate-finish` to handle YouTube's SPA navigation
- Saves `currentTime` to `chrome.storage.local` while the video plays
- Restores position on reload, including a final save on tab close via `beforeunload`
- Auto-prunes entries older than 30 days to keep storage clean
- Ignores videos watched less than 15 seconds in (no pointless saves)

## Install (unpacked)

1. Clone this repo
2. Go to `chrome://extensions`
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the repo folder
5. Open YouTube — it just works

## Note

- YouTube Shorts not supported
- Livestreams are ignored
