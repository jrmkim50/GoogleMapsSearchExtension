chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.greeting == "create_popup") {
        var selection = window.getSelection();
        var textRange = selection.getRangeAt(0);
        var rect = textRange.getBoundingClientRect();
        var selectedText = selection.toString();
        var div = createPopupMap(rect.left, rect.top + window.pageYOffset);
        chrome.runtime.sendMessage({ greeting: "sending_map_div", query: selectedText, map_div: div }, function (response) {
            if (response) {
              console.log(response.farewell);
            }
        })
        sendResponse({farewell: "goodbye"});
        console.log("hit")
    }
    if (request.greeting == "resending_map") {
        console.log(request.map);
        sendResponse({farewell: "thank you"})
    }
});

document.body.addEventListener("mousemove", function (event) {
    var selection = window.getSelection().toString();
    if (selection) {

    }
})

function createPopupMap(x, y, hidden = false) {
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
    if (hidden) {
        newPopup.style.display = "none"
    }
    return newPopup;
}