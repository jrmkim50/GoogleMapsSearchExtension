var script = document.createElement("script");
script.id = "google-maps-api";
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrlbAYmXbhOOFvHn4DFAFvzK48QY_R3Pk&libraries=places";
script.async = true;
document.body.appendChild(script);
document.body.style.margin = 0;
script.addEventListener("load", function (ev) {
  map = createGoogleMap(div)
})

var div = createPopupMap(0, 0);
var map;

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (msg.greeting == "update_map") {
      chrome.storage.local.set({ "query": msg.query });
      port.postMessage({ farewell: "goodbye" })
      return true;
    }
  });
});

chrome.storage.local.get("query", (results) => {
  var quer = "Dorney Park";
  if (results.query) {
    quer = results.query;
  }
  handleGeoCoding(map, quer);
});

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
  if (map) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
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
        if (cb) {
          cb(map, port);
        }
      }
    })
  }
}

function createPopupMap(x, y) {
  var newPopup = document.getElementById("chromeGoogleMapsDiv")
  if (newPopup) {
    newPopup.parentNode.removeChild(newPopup);
  }
  var newPopup = document.createElement("div");
  newPopup.id = "chromeGoogleMapsDiv";
  newPopup.style.width = '300px';
  newPopup.style.height = '300px';
  document.body.appendChild(newPopup);
  return newPopup;
}