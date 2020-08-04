//Create context menu button
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

const script = document.createElement("script");
script.id = "google-maps-api";
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrlbAYmXbhOOFvHn4DFAFvzK48QY_R3Pk&libraries=places";
script.async = true;
document.body.appendChild(script);

//Listen for message from popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.greeting == "sending_map_frame") {
    var div = createPopupMap(0,0);
    // var map = createGoogleMap(div);
    // handleGeoCoding(map, "Google", retrieveMap); //request.query
    sendResponse({ farewell: "goodbye"});
    return true;
  }
})

function retrieveMap(map) {
  console.log(map.getDiv());
  
}

function createGoogleMap(googleMapDiv) {
  if (google) {
    var gmap = new google.maps.Map(googleMapDiv, {
      zoom: 15,
      center: {
        lat: 43.642567,
        lng: -79.387054,
      },
      disableDefaultUI: true,
    })
    return gmap;
  }
  return null
}

function handleGeoCoding(map, address, cb) {
  if (map) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        console.log(results)
        map.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        cb(map);
      }
    })
  }
}

function createPopupMap(x, y, hidden = false) {
  var newPopup = document.getElementById("chromeGoogleMapsDiv")
  if (newPopup) {
    newPopup.parentNode.removeChild(newPopup);
  }
  var newPopup = document.createElement("div");
  newPopup.id = "chromeGoogleMapsDiv";
  newPopup.style.left = x + 'px';
  newPopup.style.top = y + 'px';
  newPopup.style.width = '300px';
  newPopup.style.height = '300px';
  newPopup.style.backgroundColor = 'red';
  if (hidden) {
      newPopup.style.display = "none"
  }
  document.body.appendChild(newPopup);
  return newPopup;
}