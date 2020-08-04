//Create context menu button

const script = document.createElement("script");
script.id = "google-maps-api";
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrlbAYmXbhOOFvHn4DFAFvzK48QY_R3Pk&libraries=places";
script.async = true;
document.body.appendChild(script);
document.body.style.margin = 0;

var div = createPopupMap(0,0);
var map;

script.addEventListener("load", function(ev) {
  map = createGoogleMap(div)
  handleGeoCoding(map, "Hunter College", retrieveMap); //msg.query
})

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  handleGeoCoding(map, "Queens College", retrieveMap, sendResponse); //msg.query
  return true;
});

function retrieveMap(map, sendResponse = null) {
  if (sendResponse) {
    sendResponse({ farewell: "goodbye" });
  }
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

function handleGeoCoding(map, address, cb, sendResponse = null) {
  if (map) {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        console.log(results[0].geometry.location.lat())
        map.setCenter(results[0].geometry.location);
        new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });
        cb(map, sendResponse);
      }
    })
  }
}

function createPopupMap(x, y, hidden = false) {
  var newPopup = document.getElementById("chromeGoogleMapsDiv")
  if (newPopup) {
    newPopup.parentNode.removeChild(newPopup);
    console.log("removing node");
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