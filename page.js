var script = document.createElement("script");
script.id = "google-maps-api";
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrlbAYmXbhOOFvHn4DFAFvzK48QY_R3Pk&libraries=places&callback=gmapsScriptCallback";
script.async = true;
document.body.appendChild(script);
document.body.style.margin = 0;

const visibile = "VISIBLE";
const hide = "HIDE";
const greeting = "GREETING"
const farewell = "FAREWELL";

var ready = false;

function gmapsScriptCallback() {
  ready = true;
}

var div = createPopupMap(0, 0);

chrome.runtime.onConnect.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    if (msg.greeting == "update_map") {
      div = createPopupMap(0, 0)
      setTimeout(function() {
        var map = createGoogleMap(div);
        div.style.height = msg.size.height;
        div.style.width = msg.size.width;
        handleGeoCoding(map, msg.query, port);
      }, 1000)
    } else if (msg.greeting == "update_map_size") {
      div.style.height = msg.size.height;
      div.style.width = msg.size.width;
      port.postMessage({ "farewell": "done" })
    }
    return true;
  });
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

function showErrorMessage(map) {
  map.getDiv().innerHTML = "<h1 style='margin-top: 10px; text-align: center;'>Location not found.</h1>"
  visibility(map.getDiv(), visibile);
}

function visibility(div, mode) {
  if (mode === "HIDE") {
    div.classList.add("hiddenDiv");
    div.classList.remove("visibleDiv");
  } else {
    div.classList.add("visibleDiv");
    div.classList.remove("hiddenDiv");
  }
}

function handleGeoCoding(map, address, port) {
  try {
    if (!address) {
      showErrorMessage(map);
    } else {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: address }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
          map.fitBounds(results[0].geometry.viewport);
          var infoWindow = new google.maps.InfoWindow({ content: address })
          infoWindow.open(map, marker);
          google.maps.event.addListener(marker, "click", () => {
            infoWindow.open(map, marker);
          })
          console.log(results);
          if (port) {
            port.postMessage({ "greeting": "show_popup", "placeId": results[0].place_id });
          }
          visibility(map.getDiv(), visibile);
        } else {
          showErrorMessage(map);
        }
      })
    }
  } catch (error) {
    showErrorMessage(map);
    console.log(error);
  }
}

function createPopupMap(x, y) {
  var newPopup = document.getElementById("chromeGoogleMapsDiv")
  if (newPopup) {
    newPopup.parentNode.removeChild(newPopup);
  }
  newPopup = document.createElement("div");
  newPopup.id = "chromeGoogleMapsDiv";
  visibility(newPopup, hide);
  document.body.appendChild(newPopup);
  return newPopup;
}