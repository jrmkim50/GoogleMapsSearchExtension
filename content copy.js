const greeting = "GREETING"
const farewell = "FAREWELL";
var containerWidthFullSize = 500;
var prevWidth = containerWidthFullSize * 0.9;
var containerSizeWhenMinified = 200;

function generateMessage(message, mode, extraContent) {
    if (mode == "GREETING") {
        var message = { "greeting": message };
    } else {
        var message = { "farewell": message };
    }
    if (extraContent) {
        message = Object.assign({}, message, extraContent);
    }
    return message
}

var div = createPopupMap(0, 0);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.greeting == "get_selected_text") {
        var selection = window.getSelection();
        var textRange = selection.getRangeAt(0);
        var rect = textRange.getBoundingClientRect();
        var div = document.getElementById("chromeGoogleMapsSearchPopupContainer");
        div.style.left = rect.left+'px';
        div.style.top = rect.top+'px';
        var selectedText = selection.toString();
        sendResponse(generateMessage("found selected text", farewell));

        var port = chrome.runtime.connect({ name: "chrome_gmaps_search_ext_port" });
        var map = document.getElementById("chromeGoogleMapsSearchPopup");
        port.postMessage(generateMessage("update_map", greeting, { "query": selectedText, "size": { "height": map.offsetHeight + 'px', "width": map.offsetWidth + 'px'} }))
        port.onMessage.addListener(function (msg) {
            div.style.visibility = "visible";
        });
    }
});

window.addEventListener("resize", function (event) {
    var map = document.getElementById("chromeGoogleMapsSearchPopup");
    var container = document.getElementById("chromeGoogleMapsSearchPopupContainer")
    if (container && (container.offsetLeft + container.offsetWidth > document.body.clientWidth)) {
        container.style.left = (document.body.clientWidth - container.offsetWidth) + "px";
    }
    if (map && map.offsetWidth !== prevWidth) {
        prevWidth = map.offsetWidth;
        var port = chrome.runtime.connect({ name: "chrome_gmaps_search_ext_port" });
        port.postMessage(generateMessage("update_map_size", greeting, { "size": { "height": map.offsetHeight + 'px', "width": map.offsetWidth + 'px'} }))
    }
})

function createPopupMap(x, y) {
    var div = document.getElementById("chromeGoogleMapsSearchPopupContainer");
    if (div) {
        div.parentNode.removeChild(div);
    }
    div = document.createElement('div')
    div.id = "chromeGoogleMapsSearchPopupContainer"
    document.body.appendChild(div);

    var button = document.createElement("button");
    button.textContent = "Close"
    button.addEventListener("click", listenForCloseAction);
    div.appendChild(button)

    div.style.top = '0px'
    div.style.left = '0px'
    div.style.visibility = "hidden"

    var newPopup = document.createElement("iframe");
    newPopup.id = "chromeGoogleMapsSearchPopup";
    div.appendChild(newPopup)
    newPopup.src = chrome.runtime.getURL('popup.html');

    return div;
}

function listenForCloseAction(event) {
    var div = document.getElementById("chromeGoogleMapsSearchPopupContainer");
    document.body.removeChild(div);
    document.body.removeEventListener("click", listenForCloseAction);
}