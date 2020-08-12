var prevSize = { height: 500, width: 500 };
var initialSize = { height: 500, width: 500 };

// Container 
function Container(children) {
    this.size = initialSize;
    this.children = children;
    this.element = null;
}

Container.prototype.getSize = function () {
    if (this.element) {
        return { height: this.element.offsetHeight, width: this.element.offsetWidth }
    }
    return this.size;
}

Container.prototype.setSize = function (size) {
    this.size = size;
}

Container.prototype.getElement = function () {
    return this.element;
}

Container.prototype.setElement = function (element) {
    this.element = element
}

Container.prototype.create = function () {
    var div = document.createElement("div");
    div.id = "chromeGoogleMapsSearchPopupContainer";
    document.body.appendChild(div);
    this.setElement(div);
    this.hide();
}

Container.prototype.update = function (x, y) {
    var div = this.element;
    if (x + this.size.width > window.innerWidth) {
        div.style.left = (x - this.size.width) + 'px';
    } else {
        div.style.left = x + 'px';
    }
    if (y + this.size.height > window.innerHeight) {
        div.style.top = (y - this.size.height) + 'px';
    } else {
        div.style.top = y + 'px';
    }

    this.setElement(div);
}

Container.prototype.hide = function () {
    this.element.style.visibility = "hidden";
}

Container.prototype.show = function () {
    this.element.style.visibility = "visible";
}

// Button

function Button(parent, parentDiv) {
    this.parentObject = parent;
    this.parentElement = parentDiv;
    this.element = null;
}

Button.prototype.getElement = function () {
    return this.element;
}

Button.prototype.setElement = function (element) {
    this.element = element
}

Button.prototype.create = function () {
    var button = document.createElement("button");
    button.textContent = "Close";
    this.parentElement.appendChild(button);
    this.setElement(button);

    var self = this;
    var sendHideAction = function () {
        self.parentObject.hide();
    }
    button.addEventListener("click", sendHideAction);
}

// Map

function Map(parent, parentDiv) {
    this.parentObject = parent;
    this.parentElement = parentDiv;
    this.element = null;
    this.size = { height: '60%', width: '90%' };
    this.map_size = { height: '90%', width: '100%' };
    this.query = "";
    this.link = null;
    this.mapElement = null;
}

Map.prototype.getElement = function () {
    return this.element;
}

Map.prototype.setSize = function (size) {
    this.size = size;
}

Map.prototype.getMapSize = function () {
    if (this.mapElement) {
        return { height: this.mapElement.offsetHeight, width: this.mapElement.offsetWidth }
    }
    return this.map_size;
}

Map.prototype.setElement = function (element) {
    this.element = element;
}

Map.prototype.getQuery = function () {
    return this.query;
}

Map.prototype.setQuery = function (query) {
    this.query = query;
}

Map.prototype.create = function () {
    var div = document.createElement("div");
    div.id = "mapViewContainer";
    div.style.height = this.size.height;
    div.style.width = this.size.width;
    var newPopup = document.createElement("iframe");
    newPopup.id = "chromeGoogleMapsSearchPopup";
    newPopup.src = chrome.runtime.getURL('popup.html');
    div.appendChild(newPopup)

    this.mapElement = newPopup;

    this.setElement(div);
    /*
    Add whatever more objects I need to add here
    */
    var link = document.createElement("a");
    link.textContent = ""
    link.href = "#"
    this.link = link;
    div.appendChild(link)
    this.parentElement.appendChild(div);
}

Map.prototype.setLink = function(placeId) {
    if (this.link) {
        this.link.href = "https://www.google.com/maps/place/?q=place_id:" + placeId;
        this.link.textContent = "Open on Google Maps"
    }
}

Map.prototype.update = function () {
    this.element.style.height = this.size.height;
    this.element.style.width = this.size.width;
    this.setElement(this.element);
    /*
    Add whatever more objects I need to add here
    */
}

Map.prototype.search = function () {
    var port = chrome.runtime.connect({ name: "chrome_gmaps_search_ext_port" });
    console.log(this.getMapSize())
    port.postMessage({ "greeting": "update_map", "query": this.query, "size": { "height": this.getMapSize().height + 'px', "width": this.getMapSize().width + 'px' } })
    var self = this;
    port.onMessage.addListener(function (msg) {
        self.setLink(msg.placeId);
    });
}

// Ad

function Ad(parent, parentDiv) {
    this.parentObject = parent;
    this.parentElement = parentDiv;
    this.element = null;
}

Ad.prototype.setElement = function (element) {
    this.element = element;
}

Ad.prototype.create = function () {
    var campaign = document.createElement("div");
    campaign.id = "campaign_gmaps_api"
    this.parentElement.appendChild(campaign);
    this.setElement(campaign)
    this.getAd();
}

Ad.prototype.remove = function () {
    this.element.style.display = "none";
}

Ad.prototype.show = function () {
    this.element.style.display = "flex";
}

Ad.prototype.getAd = function () {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var json = JSON.parse(xhr.responseText);
            if (json.ads.length) {
                var ads = JSON.parse(xhr.responseText).ads;
                var mailBody = "mailto:gmaps.search.business.request@gmail.com?subject=Request an Ad&body=To whom it may concern: If you could give us some information on: (1) what your business is, (2) some examples of images/media you want in your ad, (3) the contact information for your business, then we will be in touch with you! Thanks, Chrome Maps Search"
                // var linkDiv = "<div><a href = '" + mailBody + "'>Request ad space</a></div>"
                var id = Math.floor(Math.random() * ads.length);
                var ad = ads[id];
                var adLink = document.createElement("a");
                adLink.href = ad.adLink;
                
                var adImage = document.createElement("img");
                adImage.src = ad.img;
                adLink.appendChild(adImage);
                this.element.appendChild(adLink)

                var requestAd = document.createElement("a")
                requestAd.href = mailBody;
                requestAd.textContent = "Request ad space"
                this.element.appendChild(requestAd)
                
                // this.element.innerHTML = ads[id].adContent + linkDiv
                chrome.runtime.sendMessage({greeting: "ad_generated", ad_id: ad.adId})
            } else {
                // make default ad
            }
        }
    };
    xhr.open("GET", "https://api.jsonbin.io/b/5f2e31111823333f8f1f3e5a/4");
    xhr.setRequestHeader("secret-key", "$2b$10$VXyPCc7WWHF29eGdgKWklOUe0QS27t0dOlm6attXTXP7p8xDWswt2");
    xhr.send();
}

var container = new Container();
container.create()
var button = new Button(container, container.getElement());
button.create()
var map = new Map(container, container.getElement());
map.create();
var ad = new Ad(container, container.getElement())
ad.create();

chrome.runtime.onMessage.addListener(function (req, sender, sendResponse) {
    if (req.greeting == "get_selected_text") {
        var selection = window.getSelection();
        var textRange = selection.getRangeAt(0);
        var rect = textRange.getBoundingClientRect();
        var selectedText = selection.toString();
        sendResponse({ "farewell": "found selected text" });
        container.show();

        map.setQuery(selectedText);
        container.update(rect.left, rect.top + window.pageYOffset);
        map.search();
    }
})

window.addEventListener("resize", function (event) {
    if (container.getElement().style.visibility == "visible") {
        if (prevSize.width != container.getSize().width && prevSize.height != container.getSize().height) {
            prevSize = container.getSize();
            container.setSize(container.getSize());
            if (container.getSize().height < initialSize.height) {
                ad.remove();
                map.setSize({ height: '90%', width: '90%' })
            } else {
                ad.show();
                map.setSize({ height: '60%', width: '90%' })
            }

            var port = chrome.runtime.connect({ name: "chrome_gmaps_search_ext_port" });
            map.update();
            port.postMessage({ "greeting": "update_map_size", "size": { "height": map.getMapSize().height + 'px', "width": map.getMapSize().width + 'px' } })
        }

        if (container.getElement().offsetLeft + container.getElement().offsetWidth > window.innerWidth) {
            container.getElement().style.left = (window.innerWidth - container.getElement().offsetWidth) + "px";
        }
    }
})


