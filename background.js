function searchOnGoogleMaps(info, tab) {
    var address = info.selectionText;
    address = address.replace(/\s+/g, "+");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {greeting: "create_popup"}, function(response) {
          console.log(response.farewell);
        });
    });
}

var title = "Search on Google Maps";
var contexts = ["selection"];
var id = "search_ext";

chrome.contextMenus.create({ "id": id, "title": title, "contexts": contexts });
chrome.contextMenus.onClicked.addListener(searchOnGoogleMaps);