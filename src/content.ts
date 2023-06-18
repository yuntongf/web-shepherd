// This file is injected as a content script
console.log("Hello from content script!")

// listen for messages from the page
const msg = {
    from: "content",
    to: "background",
    url: window.location.href
}
console.log("message to background is", msg)

chrome.runtime.sendMessage(msg) // send received data to the background page

export {}; 