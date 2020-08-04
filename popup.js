chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var selection = window.getSelection();
    var textRange = selection.getRangeAt(0);
    var rect = textRange.getBoundingClientRect();
    var selectedText = selection.toString();
    if (request.greeting == "create_popup") {
        chrome.runtime.sendMessage({ greeting: "sending_map_frame", query: selectedText }, function (response) {
            if (response) {
                var div = createPopupMap(rect.left, rect.top + window.pageYOffset);
            }
        })

        sendResponse({ farewell: "goodbye" });
    }
});

// document.body.addEventListener("mousemove", function (event) {
//     var selection = window.getSelection().toString();
//     if (selection) {

//     }
// })

function createPopupMap(x, y, hidden = false) {
    var newPopup = document.getElementById("chromeGoogleMapsSearchPopup");
    if (newPopup) {
        newPopup.parentNode.removeChild(newPopup);
    }
    newPopup = document.createElement("iframe");
    newPopup.id = "chromeGoogleMapsSearchPopup";
    newPopup.style.left = x + 'px';
    newPopup.style.top = y + 'px';
    if (hidden) {
        newPopup.style.display = "none"
    }
    document.body.appendChild(newPopup);
    newPopup.src = chrome.runtime.getURL('popup.html');
    return newPopup;
}