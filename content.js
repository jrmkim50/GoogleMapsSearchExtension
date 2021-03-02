let div = document.createElement("div");
div.id = "map-div";
document.body.appendChild(div);
changeDivVisibility("none");
let selection = undefined;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.greeting === "get_selected_text") {
        console.log("searching")
        selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            var textRange = selection.getRangeAt(0);
            var rect = textRange.getBoundingClientRect();
            var selectedText = selection.toString();
            try {
                sendResponse({ farewell: selectedText });
                clearChildren();
                createCloseButton();
                createDonateLink(); 
                changeDivVisibility("flex");
                setMapPosition(rect.left, rect.top);
            } catch (err) {
                console.log(err);
            }
        } else {
            sendResponse({ farewell: "Nothing selected" });
        }
    } else if (request.greeting === "ready_to_read") {
        createPopup();
    }
});

function convertRectCoordsToDocumentCoords(x, y) {
    x += window.pageXOffset;
    y += window.pageYOffset;
    var width = parseInt(getComputedStyle(div).getPropertyValue('width'));
    var height = parseInt(getComputedStyle(div).getPropertyValue('height'));
    var windowWidth = document.body.clientWidth;
    var windowHeight = document.body.clientHeight;
    if (x + width > windowWidth)
        x -= width;
    if (y + height > windowHeight)
        y -= height;
    return [x, y];
}

window.addEventListener("resize", () => {
    if (selection && selection.rangeCount > 0) {
        var textRange = selection.getRangeAt(0);
        var rect = textRange.getBoundingClientRect();
        var [x, y] = convertRectCoordsToDocumentCoords(rect.left, rect.top);
        div.style.top = `${y}px`;
        div.style.left = `${x}px`;
    }
})

function setMapPosition(x, y) {
    if (!div) {
        return;
    }
    [x, y] = convertRectCoordsToDocumentCoords(x, y);
    div.style.left = `${x}px`;
    div.style.top = `${y}px`;
}

function createDonateLink() {
    if (!div) {
        return;
    }
    let link = document.createElement("a");
    link.innerText = "Support this project!";
    link.href = "https://www.buymeacoffee.com/jk23541";
    div.appendChild(link);
}

function createCloseButton() {
    if (!div) {
        return;
    }
    let button = document.createElement("button");
    button.innerText = "Close";
    button.onclick = function () {
        clearChildren();
    }
    div.appendChild(button);
}

function createPopup() {
    var newPopup = document.createElement("iframe");
    newPopup.src = chrome.runtime.getURL('popup.html');
    newPopup.id = "chromeGoogleMapsSearchPopup";
    document.body.addEventListener("click", closeOnBackgroundClick)
    div.appendChild(newPopup);
    return newPopup;
}

function closeOnBackgroundClick(event) {
    var overlap = checkClickOverlap(div, event.clientY, event.clientX);
    if (!overlap) {
        clearChildren();
        document.body.removeEventListener("click", closeOnBackgroundClick);
    }
}

function clearChildren() {
    div.textContent = '';
    changeDivVisibility("none");
}

function changeDivVisibility(visiblility) {
    if (visiblility === "flex") {
        div.style.display = visiblility;
    } else if (visiblility === "none") {
        div.style.display = visiblility;
    }
}

function checkClickOverlap(div, top2, left2) {
    var rect = div.getBoundingClientRect();
    var [top1, left1, height1, width1] = [rect.top, rect.left, rect.height, rect.width];
    if (top2 > top1 && top2 < top1 + height1 && left2 > left1 && left2 < left1 + width1) {
        return true;
    }
    return false;
}