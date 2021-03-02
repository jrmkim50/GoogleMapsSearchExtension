var title = "Search on Google Maps";
var contexts = ["all"];
var id = "gmaps_search_ext";

chrome.runtime.onInstalled.addListener(function () {
  console.log("installed");
  chrome.contextMenus.create({ "id": id, "title": title, "contexts": contexts });
})

chrome.contextMenus.onClicked.addListener(searchOnGoogleMaps);

function searchOnGoogleMaps(_, tab) {
  console.log("clicked");
  chrome.tabs.sendMessage(tab.id, { greeting: "get_selected_text" }, (response) => {
    console.log(response.farewell);
    chrome.storage.sync.set({ 'address': response.farewell });
  });
}