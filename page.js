var script = document.createElement("script");
script.id = "google-maps-api";
script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrlbAYmXbhOOFvHn4DFAFvzK48QY_R3Pk&libraries=places&callback=gmapsScriptCallback";
script.async = true;
document.body.appendChild(script);
let map = undefined;

function gmapsScriptCallback() {
  map = createGoogleMap(document.getElementById("map-div"));
}

function createGoogleMap(googleMapDiv) {
  if (google) {
    var gmap = new google.maps.Map(googleMapDiv, {
      zoom: 15, center: { lat: 43.642567, lng: -79.387054 },
      disableDefaultUI: true
    });

    chrome.storage.sync.get(['address'], function (items) {
      console.log(items.address);
      if (items.address !== "") {
        chrome.storage.sync.set({ 'address': "" });
        handleGeoCoding(map, items.address);
      }
    });
    return gmap;
  }
  return null
}

function handleGeoCoding(map, address) {
  if (!map) {
    return;
  }
  var service = new google.maps.places.PlacesService(map);
  var request = {
    query: address,
    fields: ['name', 'geometry']
  }
  service.findPlaceFromQuery(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      if (results && results.length > 0) {
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location
        });

        var infoWindow = new google.maps.InfoWindow({ content: address })
        infoWindow.open(map, marker);
        google.maps.event.addListener(marker, "click", () => {
          infoWindow.open(map, marker);
        })
        map.setCenter(results[0].geometry.location);
        map.fitBounds(results[0].geometry.viewport);
      }
    } else {
      var marker = new google.maps.Marker({
        map: map,
        position: map.getCenter()
      });
      var infoWindow = new google.maps.InfoWindow({ content: status })
      infoWindow.open(map, marker);
      google.maps.event.addListener(marker, "click", () => {
        infoWindow.open(map, marker);
      })
    }
    document.getElementById("map-div").style.visibility = "visible";
  });
}

