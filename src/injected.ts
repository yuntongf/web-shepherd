console.log("in web page")

const url = window.location.href

const msg = {
    from: "injected",
    to: "content",
    url: url
}

window.postMessage(msg)

console.log("out of web page")

export {}