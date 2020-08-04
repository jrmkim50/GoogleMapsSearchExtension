chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.greeting == "create_popup" && ready) {
        var selection = window.getSelection();
        var textRange = selection.getRangeAt(0);
        var rect = textRange.getBoundingClientRect();
        var div = createPopupMap(rect.left, rect.top + window.pageYOffset)
        var map_geocoder = createGoogleMap(div);
        var map = map_geocoder[0];
        var geocoder = map_geocoder[1];
        handleGeoCoding(geocoder, map, selection.toString());
        sendResponse({ farewell: rect.left });
    }
});

function handleGeoCoding(geocoder, map, address) {
    // if (geocoder && map) {
    //     geocoder.geocode({ address: selection }, (results, status) => {
    //         if (status === "OK") {
    //             map.setCenter(results[0].geometry.location);
    //             new google.maps.Marker({
    //                 map: map,
    //                 position: results[0].geometry.location
    //             });
    //         } 
    //     })
    // } 
    var map = document.querySelector("#chromeGoogleMapsSearchPopupDiv");
    var iframe = document.createElement("iframe");
    iframe.src = "https://www.google.com/maps/embed/v1/place?key=AIzaSyAUG1jgsBghqRkt8py6Cx_HW5VusvNkm2Q&q="+address;
    iframe.height = "100%";
    iframe.width = "100%";
    map.appendChild(iframe);
}
document.body.addEventListener("mousemove", function (event) {
    var selection = window.getSelection().toString();
    if (selection) {
        
    }
})

// const script = document.createElement("script");
// script.id = "google-maps-api";
// script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrlbAYmXbhOOFvHn4DFAFvzK48QY_R3Pk&libraries=places";
// script.async = true;
// document.body.appendChild(script);
// var xhr = new XMLHttpRequest();
// xhr.open("GET", "https://maps.googleapis.com/maps/api/js?key=AIzaSyCrlbAYmXbhOOFvHn4DFAFvzK48QY_R3Pk&libraries=places", true);
// xhr.onreadystatechange = function() {
//   if (xhr.readyState == 4) {
//     // JSON.parse does not evaluate the attacker's scripts.
//     console.log(xhr.responseText);
//   }
// }
// xhr.send();

var ready = true;

// script.addEventListener("load", () => {
//     ready = true;
// })

function createPopupMap(x, y, hidden = false) {
    var prevDiv = document.querySelector("#chromeGoogleMapsSearchPopupDiv");
    var newPopup = document.createElement("div");
    newPopup.id = "chromeGoogleMapsSearchPopupDiv";
    if (prevDiv) {
        document.body.replaceChild(newPopup, prevDiv);
    } else {
        document.body.appendChild(newPopup);
    }
    newPopup.style.left = x + 'px';
    newPopup.style.top = y + 'px';
    if (hidden) {
        newPopup.style.display = "none"
    }
    return newPopup;
}

function createGoogleMap(googleMapDiv) {
    console.log("hit");
    if (window.google) {
        console.log("good");
        var gmap = new window.google.maps.Map(googleMapDiv, {
            zoom: 15,
            center: {
                lat: 43.642567,
                lng: -79.387054,
            },
            disableDefaultUI: true,
        })
        ggeocoder = new window.google.maps.Geocoder();
    
        return [gmap, ggeocoder];
    }
    return [null,null]
    
}