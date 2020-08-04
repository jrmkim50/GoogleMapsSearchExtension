var title = "Search on Google Maps";
var contexts = ["selection"];
var id = "gmaps_search_ext";

chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({ "id": id, "title": title, "contexts": contexts });
  chrome.contextMenus.onClicked.addListener(searchOnGoogleMaps);
})

function searchOnGoogleMaps(info, tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "create_popup" }, function (response) {
      if (response) {
        console.log(response.farewell);
      }
    });
  });
}