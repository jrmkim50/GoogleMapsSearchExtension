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
    })
    return gmap;
  }
  return null
}

chrome.storage.sync.get(['address'], function(items) {
  console.log(items);
  handleGeoCoding(map, items.address)
});

function handleGeoCoding(map, address) {
  console.log("0")
  if (!map) {
    return;
  }
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, function (results, status) {
    console.log("2")
    if (status === google.maps.GeocoderStatus.OK) {
      console.log("3")
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
    } else {
      console.log("4")
    } 
  })
}

