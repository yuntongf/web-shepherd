// This file is injected as a content script
console.log("Hello from content script!")

// inject script
// function injectScript(file_path: string, tag: string) {
//     var node = document.getElementsByTagName(tag)[0];
//     var script = document.createElement('script');
//     script.setAttribute('type', "text/javascript"); 
//     script.setAttribute('src', file_path);
//     node.appendChild(script);
// }
// injectScript(chrome.extension.getURL('injected.js'), 'body');

// console.log(window.location.href)

// listen for messages from the page
const msg = {
    from: "content",
    to: "background",
    url: window.location.href
}
console.log("message to background is", msg)

chrome.runtime.sendMessage(msg) // send received data to the background page

export {}; 