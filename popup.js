function createPopupMap(x, y) {
    var prevDiv = document.querySelector("#chromeGoogleMapsSearchPopupDiv");
    var newPopup = document.createElement("div");
    newPopup.id = "chromeGoogleMapsSearchPopupDiv";
    if (prevDiv) {
        document.body.replaceChild(newPopup, prevDiv);
    } else {
        document.body.appendChild(newPopup);
    }
    newPopup.style.left = x + 'px';
    newPopup.style.top = y + 'px';
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.greeting == "create_popup") {
            var selection = window.getSelection();
            console.log(selection)
            var textRange = selection.getRangeAt(0);
            var rect = textRange.getBoundingClientRect();
            createPopupMap(rect.left, rect.top + window.pageYOffset)
            sendResponse({ farewell: rect.left });
        }
});