var title = "Search with Easy Address Search";
var contexts = ["all"];
var id = "gmaps_search_ext";

chrome.runtime.onInstalled.addListener(function () {
  console.log("installed");
  chrome.tabs.create({url: chrome.runtime.getURL('help.html')});
})

chrome.contextMenus.create({ "id": id, "title": title, "contexts": contexts });

chrome.contextMenus.onClicked.addListener(searchOnGoogleMaps);
console.log("running");

function searchOnGoogleMaps(_, tab) {
  console.log("clicked");
  chrome.tabs.sendMessage(tab.id, { greeting: "get_selected_text" }, (response) => {
    console.log(chrome.runtime.lastError);
    if (!chrome.runtime.lastError && response && response.farewell !== "Nothing selected") {
      setTimeout(() => {
        chrome.storage.sync.set({ 'address': response.farewell }, () => {
          chrome.tabs.sendMessage(tab.id, { greeting: "ready_to_read" });
        });
      }, 0);
    }
  });
}