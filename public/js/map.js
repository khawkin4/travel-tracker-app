const satellite = document.getElementById("satellite-mode");

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2FsdmFyeWhhd2tpbnMiLCJhIjoiY2s1b2ptYzVvMHV6NDNybzdjaWM4OTBkaSJ9.tU3Kx22nzlBFV33ijcq38w";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 1,
  center: [-20.7492, 40.4637]
});

satellite.addEventListener("click", toggleSatellite);

function toggleSatellite(e) {
  e.preventDefault();

  if (satellite.value == "Toggle Satellite View") {
    map.addLayer({
      type: "raster",
      id: "satellite-map",
      source: "mapbox-satellite",
      opacity: 0.6
    });
    satellite.value = "Toggle Street View";
  } else {
    map.removeLayer("satellite-map");
    satellite.value = "Toggle Satellite View";
  }
}

//Fetch map with points

async function getPlaces() {
  const res = await fetch("/api/v1/places");
  const data = await res.json();
  //await toggleSatellite();

  const places = data.data.map(place => {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [
          place.location.coordinates[0],
          place.location.coordinates[1]
        ]
      },
      properties: {
        city: place.location.city,
        description: `Visited on ${place.dateVisited}.`
      }
    };
  });

  loadMap(places);
}

//Load map with locations
function loadMap(places) {
  map.on("load", function() {
    map.addSource("mapbox-satellite", {
      type: "raster",
      url: "mapbox://mapbox.satellite",
      tileSize: 256
    });

    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);

    places.forEach(marker => {
      // create the popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setText(
        marker.properties.description
      );
      new mapboxgl.Marker({ color: randomColor })
        .setLngLat(marker.geometry.coordinates)
        .setPopup(popup)
        .addTo(map);
    });

    map.addControl(new mapboxgl.FullscreenControl());

    // Add geolocate control to the map.
    map.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
    );
  });
}

getPlaces();
