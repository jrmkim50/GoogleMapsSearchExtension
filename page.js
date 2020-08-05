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

var portVar;

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (msg.greeting == "update_map") {
      console.log("18");
      chrome.storage.local.set({ "query": msg.query });
      search(port);
    }
    return true;
  });
});

function search(port) {
  setTimeout(function () {
    port.postMessage({ greeting: "show_popup" });
  }, 1000)
}

setTimeout(function () {
  chrome.storage.local.get("query", (results) => {
    var query = "Dorney Park";
    var gmap = map;
    if (results.query) {
      query = results.query;
    }
    handleGeoCoding(gmap, query);
  });
}, 10000)

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
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      var infoWindow = new google.maps.InfoWindow({ content: address })
      infoWindow.open(map, marker);
      google.maps.event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);
      })
      map.getDiv().style.visibility = 'visible';
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
  newPopup.style.visibility = 'hidden';
  document.body.appendChild(newPopup);
  return newPopup;
}