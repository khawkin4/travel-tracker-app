const satellite = document.getElementById("satellite-mode");

mapboxgl.accessToken =
  "pk.eyJ1Ijoia2FsdmFyeWhhd2tpbnMiLCJhIjoiY2s1b2ptYzVvMHV6NDNybzdjaWM4OTBkaSJ9.tU3Kx22nzlBFV33ijcq38w";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 9,
  center: [-74.006, 40.7128]
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
        icon: "post",
        description: `You visited this location on ${place.dateVisited}.`
      }
    };
  });

  loadMap(places);
}

//Load map with locations
function loadMap(places) {
  map.on("load", function() {
    map.addLayer({
      id: "points",
      type: "symbol",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: places
        }
      },
      layout: {
        "icon-image": "{icon}-15",
        "icon-size": 1.5,
        "text-field": "{city}",
        "text-font": ["Open Sans Semibold, Arial Unicode MS Bold"],
        "text-offset": [0, 0.9],
        "text-anchor": "top"
      }
    });
    map.addSource("mapbox-satellite", {
      type: "raster",
      url: "mapbox://mapbox.satellite",
      tileSize: 256
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
