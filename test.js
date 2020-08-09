function Container() {
    this.size = { height: 500, width: 500 };
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
    this.map_size = { height: '80%', width: '100%' };
    this.query = "";
}

Map.prototype.getElement = function() {
    return this.element;
}

Map.prototype.setSize = function(size) {
    this.size = size;
}

Map.prototype.setElement = function(element) {
    this.element = element;
}

Map.prototype.getQuery = function() {
    return this.query;
}

Map.prototype.setQuery = function(query) {
    this.query = query;
}

Map.prototype.create = function() {
    var div = document.createElement("div");
    div.id = "mapViewContainer";
    div.style.height = this.size.height;
    div.style.width = this.size.width;
    var newPopup = document.createElement("iframe");
    newPopup.id = "chromeGoogleMapsSearchPopup";
    // newPopup.src = chrome.runtime.getURL('popup.html');
    div.appendChild(newPopup)
    this.setElement(div);
    /*
    Add whatever more objects I need to add here
    */
    this.parentElement.appendChild(div);
}

Map.prototype.update = function() {
    var div = document.getElementById("mapViewContainer");
    div.style.height = this.size.height;
    div.style.width = this.size.width;
    this.setElement(div);
    /*
    Add whatever more objects I need to add here
    */
}

Map.prototype.search = function() {
    //searching
}

// Ad

function Ad(parent, parentDiv) {
    this.parentObject = parent;
    this.parentElement = parentDiv;
    this.element = null;
}

Ad.prototype.setElement = function(element) {
    this.element = element;
}

Ad.prototype.create = function() {
    var campaign = document.createElement("div");
    campaign.id = "campaign_gmaps_api"
    this.parentElement.appendChild(campaign);
    this.setElement(campaign)
    this.getAd();
}

Ad.prototype.remove = function() {
    this.element.style.visibility = "hidden";
}

Ad.prototype.show = function() {
    this.element.style.visibility = "visible";
}

Ad.prototype.getAd = function() {
    var xhr = new XMLHttpRequest()
    xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            var json = JSON.parse(xhr.responseText);
            if (json.ads.length) {
                var ads = JSON.parse(xhr.responseText).ads;
                this.element.innerHTML = ads[Math.floor(Math.random() * ads.length)].addContent
                this.element.style.display = "block";
            } else {
                this.element.style.display = "none";
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

chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    if (req.greeting == "get_selected_text") {
        var selection = window.getSelection();
        var textRange = selection.getRangeAt(0);
        var rect = textRange.getBoundingClientRect();
        var selectedText = selection.toString();
        container.show();

        map.setQuery(selectedText);
        container.update(rect.left, rect.top + window.pageYOffset);
        map.search();

        sendResponse({ "farewell" : "found selected text" })
    }
})

var prevSize = { height: 500, width: 500 };

window.addEventListener("resize", function (event) {
    if (prevSize.width != container.getSize().width && prevSize.height != container.getSize().height) {
        prevSize = container.getSize();
        container.setSize(container.getSize());
        if (container.getSize().height < 500) {
            ad.remove();
            map.setSize({ height: '90%', width: '90%' })
        } else {
            ad.show();
            map.setSize({ height: '60%', width: '90%' })
        }
        map.update();
    }

    if (container.getElement().offsetLeft + container.getElement().offsetWidth > window.innerWidth) {
        container.getElement().style.left = (window.innerWidth - container.getElement().offsetWidth) + "px";
    }
})

