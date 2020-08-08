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

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.greeting == "get_selected_text") {
        var selection = window.getSelection();
        var textRange = selection.getRangeAt(0);
        var rect = textRange.getBoundingClientRect();
        var selectedText = selection.toString();
        sendResponse(generateMessage("found selected text", farewell));

        var div = createPopupMap(rect.left, rect.top + window.pageYOffset);

        var port = chrome.runtime.connect({ name: "chrome_gmaps_search_ext_port" });
        var map = document.getElementById("chromeGoogleMapsSearchPopup");
        port.postMessage(generateMessage("update_map", greeting, { "query": selectedText, "size": { "height": map.offsetHeight + 'px', "width": map.offsetWidth + 'px'} }))
        port.onMessage.addListener(function (msg) {
            console.log(msg);
            var div = createPopupMap(0,0);
        });
    }
});

function getFrameHtml(htmlFileName) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", chrome.extension.getURL(htmlFileName), false);
    xmlhttp.send();

    return xmlhttp.responseText;
}

window.addEventListener("resize", function (event) {
    var map = document.getElementById("chromeGoogleMapsSearchPopup");
    var container = document.getElementById("chromeGoogleMapsSearchPopupContainer")
    if (container && (container.offsetLeft + container.offsetWidth > document.body.clientWidth)) {
        container.style.left = (document.body.clientWidth - container.offsetWidth) + "px";
    }
    if (map && map.offsetWidth !== prevWidth) {
        prevWidth = map.offsetWidth;
        if (map.offsetWidth === containerSizeWhenMinified * 0.9) {
            var campaign = document.getElementById("campaign_gmaps_api");
            campaign.style.display = "none";
        } else {
            var campaign = document.getElementById("campaign_gmaps_api");
            campaign.style.display = "block";
            // addToCampaign();
        }
        var port = chrome.runtime.connect({ name: "chrome_gmaps_search_ext_port" });
        port.postMessage(generateMessage("update_map_size", greeting, { "size": { "height": map.offsetHeight + 'px', "width": map.offsetWidth + 'px'} }))
        map.src = map.src;
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
    var width = div.offsetWidth + 'px';
    var height = div.offsetHeight + 'px';

    var button = document.createElement("button");
    button.textContent = "Close"
    button.addEventListener("click", listenForCloseAction);
    div.appendChild(button)


    if (x + div.offsetWidth > window.innerWidth) {
        div.style.left = (x - div.offsetWidth) + 'px';
    } else {
        div.style.left = x + 'px';
    }

    if (y + div.offsetHeight > window.innerHeight) {
        div.style.top = (y - div.offsetHeight) + 'px';
    } else {
        div.style.top = y + 'px';
    }

    var newPopup = document.createElement("iframe");
    newPopup.id = "chromeGoogleMapsSearchPopup";
    div.appendChild(newPopup)
    newPopup.src = chrome.runtime.getURL('_generated_background_page.html');

    var campaign = document.createElement("div");
    campaign.id = "campaign_gmaps_api"
    div.appendChild(campaign);
    addToCampaign();

    return div;
}

function addToCampaign() {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var campaign = document.getElementById("campaign_gmaps_api")
            var json = JSON.parse(xhr.responseText);
            if (json.ads.length) {
                var campaign = document.getElementById("campaign_gmaps_api");
                var ads = JSON.parse(xhr.responseText).ads;
                campaign.innerHTML = ads[Math.floor(Math.random() * ads.length)].addContent
                campaign.style.display = "block";
            } else {
                var campaign = document.getElementById("campaign_gmaps_api");
                campaign.style.display = "none";
            }
        }
    };
    xhr.open("GET", "https://api.jsonbin.io/b/5f2e31111823333f8f1f3e5a/4");
    xhr.setRequestHeader("secret-key", "$2b$10$VXyPCc7WWHF29eGdgKWklOUe0QS27t0dOlm6attXTXP7p8xDWswt2");
    xhr.send();
}

// addToCampaign();

function listenForCloseAction(event) {
    var div = document.getElementById("chromeGoogleMapsSearchPopupContainer");
    document.body.removeChild(div);
    document.body.removeEventListener("click", listenForCloseAction);
}