import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App';
import './index.css'

let response = "hello world!";
const root = ReactDOM.createRoot(document.getElementById('popup')!);

// say hi to backend
const msg = {
    from: "popup",
    to: "background"
}
chrome.runtime.sendMessage(msg);

chrome.runtime.onMessage.addListener(
    function(message, sender, sendResponse) {
        if (message.status === "indexed") {
            response = message.status;
            root.render(
                <App response={response}/>
            );
        }
    }
);

root.render(
    <div>loading...</div>
);

