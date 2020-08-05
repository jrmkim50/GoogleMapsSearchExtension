chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.greeting == "get_selected_text") {
        var selection = window.getSelection();
        var textRange = selection.getRangeAt(0);
        var rect = textRange.getBoundingClientRect();
        var selectedText = selection.toString();
        sendResponse({ farewell: "found selected text" });
        var div = createPopupMap(rect.left, rect.top + window.pageYOffset);
        var port = chrome.runtime.connect({ name: "chrome_gmaps_search_ext_port" });
        port.postMessage({ greeting: "update_map", query: selectedText })
        port.onMessage.addListener(function (msg) {
            if (msg.greeting == "show_popup") {
                console.log("showing");
                var popup = document.getElementById("chromeGoogleMapsSearchPopup");
                popup.style.background = "none";
            }
        });
    }
});

function createPopupMap(x, y) {
    var newPopup = document.getElementById("chromeGoogleMapsSearchPopup");
    if (newPopup) {
        newPopup.parentNode.removeChild(newPopup);
    }
    newPopup = document.createElement("iframe");
    var button = document.createElement("button");
    button.textContent = "X";
    document.body.appendChild(newPopup);
    document.body.insertBefore(button, newPopup)
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