// This file is ran as a background script
console.log("Hello from background script!")

// global variables

let msg = {
    from: "background",
    to: "popup",
    url: ""
}

// event listeners and handlers
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.from === "content") {
      msg.url = message.url;
      console.log("received from content", message.url);
  } 
  if (message.from === "popup") {
      console.log("received from popup")
      chrome.runtime.sendMessage(msg);
  }
})


export {}; 