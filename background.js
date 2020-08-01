function searchOnGoogleMaps(info, tab) {
    var address = info.selectionText;
    address = address.replace(/\s+/g, "+");
    chrome.tabs.create({url: "https://www.google.com/maps/place/"+address});
}

var title = "Search on Google Maps";
var contexts = ["selection"];
var id = "search";

chrome.contextMenus.create({"id": id, "title": title, "contexts": contexts});

chrome.contextMenus.onClicked.addListener(searchOnGoogleMaps);