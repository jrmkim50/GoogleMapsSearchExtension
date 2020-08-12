var title = "Search on Google Maps";
var contexts = ["selection"];
var id = "gmaps_search_ext";

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({ "id": id, "title": title, "contexts": contexts });
  chrome.contextMenus.onClicked.addListener(searchOnGoogleMaps);
})

function searchOnGoogleMaps(info, tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "get_selected_text" }, function (response) {
      if (response) {
        console.log(response.farewell);
      }
    });
  });
}

(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga'); // Note: https protocol here

ga('create', 'UA-167530777-2', 'auto'); // Enter your GA identifier
ga('set', 'checkProtocolTask', function () { }); // Removes failing protocol check. @see: http://stackoverflow.com/a/22152353/1958200
ga('require', 'displayfeatures');
ga('send', 'pageview', '/popup.html');

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.greeting == "ad_generated") {
      ga('send', 'event', {
        eventCategory: 'Ad Load',
        eventAction: 'load',
        eventLabel: request.ad_id,
        eventValue: request.ad_id
      })
      sendResponse({ farewell: "goodbye" });
    }
  });