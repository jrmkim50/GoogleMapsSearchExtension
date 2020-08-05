chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var selection = window.getSelection();
    var textRange = selection.getRangeAt(0);
    var rect = textRange.getBoundingClientRect();
    var selectedText = selection.toString();
    sendResponse({ farewell: "goodbye" });
    var port = chrome.runtime.connect({name: "maps_comms_link"});
    port.postMessage({greeting: "update_map", query: selectedText});
    port.onMessage.addListener(function(msg) {
        if (msg) {
            console.log(msg.farewell);
            var div = createPopupMap(rect.left, rect.top + window.pageYOffset);
        }
    });
});

function createPopupMap(x, y, hidden = false) {
    var newPopup = document.getElementById("chromeGoogleMapsSearchPopup");
    if (newPopup) {
        newPopup.parentNode.removeChild(newPopup);
    }
    newPopup = document.createElement("iframe");
    document.body.appendChild(newPopup);
    newPopup.id = "chromeGoogleMapsSearchPopup";
    newPopup.style.left = x + 'px';
    newPopup.style.top = y + 'px';
    if (hidden) {
        newPopup.style.display = "none"
    }
    newPopup.src = chrome.runtime.getURL('popup.html');
    return newPopup;
}

function refreshDiv() {
    var popup = document.getElementById("chromeGoogleMapsSearchPopup");
    // popup.src = chrome.runtime.getURL('popup.html');
    console.log(popup)
    // popup.contentWindow.location.reload(true);
}

// document.body.addEventListener("mousemove", function (event) {
//     var selection = window.getSelection().toString();
//     if (selection) {

//     }
// })