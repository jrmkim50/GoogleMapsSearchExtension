chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var selection = window.getSelection();
    var textRange = selection.getRangeAt(0);
    var rect = textRange.getBoundingClientRect();
    var selectedText = selection.toString();
    sendResponse({ farewell: "found selected text" });
    
    chrome.runtime.sendMessage({greeting: "update_map", query: selectedText}, function(response) {
        if (response) {
            console.log(response.farewell);
            var div = createPopupMap(rect.left, rect.top + window.pageYOffset);
        }
    })
});

function createPopupMap(x, y) {
    var newPopup = document.getElementById("chromeGoogleMapsSearchPopup");
    if (newPopup) {
        newPopup.parentNode.removeChild(newPopup);
    }
    newPopup = document.createElement("iframe");
    document.body.appendChild(newPopup);
    newPopup.id = "chromeGoogleMapsSearchPopup";
    if (x + 300 > window.innerWidth) {
        newPopup.style.left = (x - 200) + 'px';
    } else {
        newPopup.style.left = x + 'px';
    }
    newPopup.style.top = y + 'px';
    newPopup.src = chrome.runtime.getURL('popup.html');
    return newPopup;
}

// document.body.addEventListener("mousemove", function (event) {
//     var selection = window.getSelection().toString();
//     if (selection) {

//     }
// })