chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var selection = window.getSelection();
    var textRange = selection.getRangeAt(0);
    var rect = textRange.getBoundingClientRect();
    var selectedText = selection.toString();
    sendResponse({ farewell: "goodbye" });
    chrome.runtime.sendMessage({ greeting: "update_map" }, function (response) {
        if (response) {
          console.log(response.farewell);
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
    newPopup.src = 'about:blank'
    newPopup.id = "chromeGoogleMapsSearchPopup";
    newPopup.style.left = x + 'px';
    newPopup.style.top = y + 'px';
    if (hidden) {
        newPopup.style.display = "none"
    }
    newPopup.src = chrome.runtime.getURL('popup.html');
    document.body.appendChild(newPopup);
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