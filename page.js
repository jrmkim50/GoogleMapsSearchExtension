var script = document.createElement("script");
script.id = "google-maps-api";
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrlbAYmXbhOOFvHn4DFAFvzK48QY_R3Pk&libraries=places&callback=gmapsScriptCallback";
script.async = true;
document.body.appendChild(script);
document.body.style.margin = 0;

var div = createPopupMap(0, 0);
var map;

function gmapsScriptCallback() {
  map = createGoogleMap(div)
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.greeting == "update_map") {
    chrome.storage.local.set({ "query": request.query });
    sendResponse({ farewell: "done updating map" })
  }
})

setTimeout(function() {
  chrome.storage.local.get("query", (results) => {
    var quer = "Dorney Park";
    var gmap = map;
    if (results.query) {
      quer = results.query;
      console.log(quer);
    }
    handleGeoCoding(gmap, quer);
  });
}, 1000)

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

function handleGeoCoding(map, address, cb, port = null) {
  if (google && !map) {
    map = createGoogleMap(div);
  }
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, function (results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      console.log(map.getCenter().lat());
      map.setCenter(results[0].geometry.location);
      console.log(results);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      var infoWindow = new google.maps.InfoWindow({
        content: address
      })
      infoWindow.open(map, marker);
      google.maps.event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);
      })

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { greeting: "finished_geolocation" }, function (response) {
          if (response) {
            console.log(response.farewell);
          }
        });
      });

      if (cb) {
        cb(map, port);
      }
    }
  })
}

function createPopupMap(x, y) {
  var newPopup = document.getElementById("chromeGoogleMapsDiv")
  if (newPopup) {
    newPopup.parentNode.removeChild(newPopup);
  }
  newPopup = document.createElement("div");
  newPopup.id = "chromeGoogleMapsDiv";
  newPopup.style.width = '300px';
  newPopup.style.height = '300px';
  document.body.appendChild(newPopup);
  return newPopup;
}