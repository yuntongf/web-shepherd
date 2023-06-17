// This file is ran as a background script
console.log("Hello from background script!")

let msg = {
    from: "background",
    to: "popup",
    status: "indexed"
}

let url = ""

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.from === "popup") {
        console.log("received from popup")
        // web scrape url
        setTimeout(() => {chrome.runtime.sendMessage(msg);}, 1000)
    }
    if (message.from === "content") {
        url = message.url;
        console.log("received from content", url);
    } 
})

export {}; 