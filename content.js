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
    newPopup.id = "chromeGoogleMapsSearchPopup";
    document.body.appendChild(newPopup);
    var width = parseInt(getComputedStyle(newPopup).getPropertyValue('width'));
    var height = parseInt(getComputedStyle(newPopup).getPropertyValue('height'));
    if (x + width > window.innerWidth) {
        console.log("x + ")
        newPopup.style.left = (x - width) + 'px';
    } else {
        newPopup.style.left = x + 'px';
    }
    if (y + height > window.innerHeight) {
        newPopup.style.top = (y - height) + 'px';
    } else {
        newPopup.style.top = y + 'px';
    }
    newPopup.src = chrome.runtime.getURL('popup.html');
    document.body.addEventListener("click", listenForCloseAction)
    return newPopup;
}

function listenForCloseAction(event) {
    var newPopup = document.getElementById("chromeGoogleMapsSearchPopup");
    if (newPopup) {
        var overlap = checkOverlap(newPopup.style.top, newPopup.style.left, newPopup.style.height, newPopup.style.width, 
            event.clientY, event.clientX);
        if (!overlap) {
            document.body.removeChild(newPopup);
        }
    }
    document.body.removeEventListener("click", listenForCloseAction);
}

function checkOverlap(top1, left1, height1, width1,
    top2, left2) {
    if (top2 > top1 && top2 < top1 + height1 && left2 > left1 && left2 < left1+width1) {
        return true;
    }
    return false;
}