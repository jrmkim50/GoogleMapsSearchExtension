var title = "Search on Google Maps";
var contexts = ["selection"];
var id = "gmaps_search_ext";

const visibile = "VISIBLE";
const hide = "HIDE";
const greeting = "GREETING"
const farewell = "FAREWELL";

var gmapsAPILoaded = false;

function searchOnGoogleMaps(info, tab) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { greeting: "get_selected_text" })
  });
}

function addScript() {
  var script = document.createElement("script");
  script.id = "google-maps-api";
  script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrlbAYmXbhOOFvHn4DFAFvzK48QY_R3Pk&libraries=places&callback=init";
  script.async = true;
  document.body.appendChild(script);
}

function init() {
  gmapsAPILoaded = true;
  document.body.style.margin = 0;
  console.log(Date.now());
}

function mapEventHandler(msg, Map, port) {
  if (msg.greeting == "update_map") {
    chrome.storage.local.set({ "query": msg.query });
    chrome.storage.local.set({ "size": msg.size })
    port.postMessage(generateMessage("show_popup", greeting));
  } else if (msg.greeting == "update_map_size") {
    chrome.storage.local.set({ "size": msg.size }, function () {

    })
  }
}

setTimeout(function () {
  chrome.storage.local.get("size", (results) => {
    var newPopup = document.getElementById("chromeGoogleMapsDiv")
    if (results && newPopup) {
      console.log(results);
      newPopup.style.height = results.size.height;
      newPopup.style.width = results.size.width;
    }
  })
}, 1000)

setTimeout(function () {
  var Map = {
    div: createPopupMap(0, 0),
    map: null
  }
  Map.div.style.width = '100px'
  Map.div.style.height = '100px'
  Map.div.style.backgroundColor = "red";

  if (gmapsAPILoaded) {
    Map.map = createGoogleMap(Map.div);
    chrome.runtime.onConnect.addListener(function (port) {
      port.onMessage.addListener((msg) => { mapEventHandler(msg, Map, port) })
    })
  }
}, 1000)

// function listenForMessages(msg) {
//   if (msg.greeting == "update_map") {
//     chrome.storage.local.set({ "query": msg.query });
//     chrome.storage.local.set({ "size": msg.size })
//     try {
//       setTimeout(function () {

//         div.style.height = msg.size.height;
//         div.style.width = msg.size.width;
//         div.style.backgroundColor = "red";
//       // handleGeoCoding(map, msg.query);
//       }, 1000);
//       port.postMessage(generateMessage("show_popup", greeting));
//       console.log("success")
//     } catch (error) {
//       console.log(error);
//     }
//   } else if (msg.greeting == "update_map_size") {
//     chrome.storage.local.set({ "size": msg.size }, function () {
//       chrome.storage.local.get("size", (results) => {
//         if (results) {
//           console.log(results);
//           div.style.height = results.size.height;
//           div.style.width = results.size.width;
//         }
//       })
//     });
//     console.log("setting to " + msg.size);
//     port.postMessage({ "farewell": "done" })
//   }
//   return true;
// }

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({ "id": id, "title": title, "contexts": contexts });
  chrome.contextMenus.onClicked.addListener(searchOnGoogleMaps);
  addScript();
})

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



// function postDelayedMessage(port) {
//   setTimeout(function () {
//     port.postMessage(generateMessage("show_popup", greeting));
//   }, 1000)
// }

// setTimeout(function () {
//   chrome.storage.local.get("size", (results) => {
//     if (results) {
//       console.log(results);
//       div.style.height = results.size.height;
//       div.style.width = results.size.width;
//     }
//   })
//   chrome.storage.local.get("query", (results) => {
//     var query = "";
//     var gmap = map;
//     if (results.query) {
//       query = results.query;
//     }
//     handleGeoCoding(gmap, query);
//   });

// }, 1000)



function createGoogleMap(googleMapDiv) {
  if (google) {
    var gmap = new google.maps.Map(googleMapDiv, {
      zoom: 15, center: { lat: 43.642567, lng: -79.387054 },
      disableDefaultUI: true
    })
    return gmap;
  }
  return null
}

// function showErrorMessage(map) {
//   map.getDiv().innerHTML = "<h1 style='margin-top: 10px; text-align: center;'>Location not found.</h1>"
//   visibility(map.getDiv(), visibile);
// }

// function visibility(div, mode) {
//   if (mode === "HIDE") {
//     div.classList.add("hiddenDiv");
//     div.classList.remove("visibleDiv");
//   } else {
//     div.classList.add("visibleDiv");
//     div.classList.remove("hiddenDiv");
//   }
// }

// function handleGeoCoding(map, address, size) {
//   try {
//     if (!address) {
//       showErrorMessage(map);
//     } else {
//       var geocoder = new google.maps.Geocoder();
//       geocoder.geocode({ address: address }, function (results, status) {
//         if (status === google.maps.GeocoderStatus.OK) {
//           map.setCenter(results[0].geometry.location);
//           var marker = new google.maps.Marker({
//             map: map,
//             position: results[0].geometry.location
//           });
//           map.fitBounds(results[0].geometry.viewport);
//           var infoWindow = new google.maps.InfoWindow({ content: address })
//           infoWindow.open(map, marker);
//           google.maps.event.addListener(marker, "click", () => {
//             infoWindow.open(map, marker);
//           })
//           visibility(map.getDiv(), visibile);
//         } else {
//           showErrorMessage(map);
//         }
//       })
//     }
//   } catch (error) {
//     showErrorMessage(map);
//     console.log(error);
//   }
// }

function createPopupMap(x, y) {
  var newPopup = document.getElementById("chromeGoogleMapsDiv")
  if (newPopup) {
    newPopup.parentNode.removeChild(newPopup);
  }
  newPopup = document.createElement("div");
  newPopup.id = "chromeGoogleMapsDiv";
  // visibility(newPopup, hide);
  document.body.appendChild(newPopup);
  return newPopup;
}