// 'use client';
// import { useEffect, useRef, useState } from 'react';
// import maplibregl from 'maplibre-gl';
// import 'maplibre-gl/dist/maplibre-gl.css';

// const MapTracker = () => {
//   const mapRef = useRef(null);
//   const markerRef = useRef(null);
//   const routeRef = useRef([]);
//   const intervalRef = useRef(null);

//   const noorpurLocations = [
//     [78.404, 29.148],
//     [78.407, 29.15],
//     [78.41, 29.152],
//     [78.412, 29.154],
//     [78.415, 29.156],
//   ];

//   const [position, setPosition] = useState(noorpurLocations[0]);
//   const [currentIndex, setCurrentIndex] = useState(0);

//   useEffect(() => {
//     if (typeof window === 'undefined') return;

//     const bounds = [
//       [68.0, 6.0],
//       [97.5, 37.0],
//     ];

//     const map = new maplibregl.Map({
//       container: 'mapContainer',
//       style: `https://api.maptiler.com/maps/streets/style.json?key=l9lmtrpVhvZpFVk4QpST`,
//       center: position,
//       zoom: 15,
//       minZoom: 4,
//       maxBounds: bounds,
//     });

//     mapRef.current = map;

//     // 🚗 Car Marker
//     const carEl = document.createElement('div');
//     carEl.innerText = '🚗';
//     carEl.style.fontSize = '24px';

//     markerRef.current = new maplibregl.Marker({ element: carEl })
//       .setLngLat(position)
//       .addTo(map);

//     map.on('load', () => {
//       // 📍 Static markers at each location
//       noorpurLocations.forEach((coord) => {
//         const locEl = document.createElement('div');
//         locEl.innerText = '📍';
//         locEl.style.fontSize = '20px';
//         new maplibregl.Marker({ element: locEl }).setLngLat(coord).addTo(map);
//       });

//       // 🟦 Route line source
//       map.addSource('route', {
//         type: 'geojson',
//         data: {
//           type: 'Feature',
//           properties: {},
//           geometry: {
//             type: 'LineString',
//             coordinates: [position],
//           },
//         },
//       });

//       // 🟦 Route line layer
//       map.addLayer({
//         id: 'route-line',
//         type: 'line',
//         source: 'route',
//         layout: {
//           'line-join': 'round',
//           'line-cap': 'round',
//         },
//         paint: {
//           'line-color': '#0074D9',
//           'line-width': 5,
//         },
//       });

//       // Start route trail
//       routeRef.current = [position];
//     });

//     return () => map.remove();
//   }, []);

//   useEffect(() => {
//     if (mapRef.current && currentIndex === 0) {
//       intervalRef.current = setInterval(() => {
//         setCurrentIndex((prevIndex) => {
//           const nextIndex = prevIndex + 1;
//           if (nextIndex >= noorpurLocations.length) {
//             clearInterval(intervalRef.current); // 🛑 Stop at final point
//             return prevIndex;
//           }
//           return nextIndex;
//         });
//       }, 3000); // move every 3 seconds
//     }

//     return () => clearInterval(intervalRef.current);
//   }, [mapRef.current]);

//   useEffect(() => {
//     const nextPosition = noorpurLocations[currentIndex];
//     setPosition(nextPosition);

//     if (markerRef.current) markerRef.current.setLngLat(nextPosition);
//     if (mapRef.current) {
//       mapRef.current.flyTo({ center: nextPosition, speed: 0.5 });

//       // 🟦 Update route trail
//       routeRef.current.push(nextPosition);

//       const source = mapRef.current.getSource('route');
//       if (source) {
//         source.setData({
//           type: 'Feature',
//           properties: {},
//           geometry: {
//             type: 'LineString',
//             coordinates: routeRef.current,
//           },
//         });
//       }
//     }
//   }, [currentIndex]);

//   return (
//     <div>
//       <h2 className="text-xl font-bold mb-2">🚗 Noorpur Car GPS Tracker</h2>
//       <div
//         id="mapContainer"
//         style={{ height: '700px', width: '100%', borderRadius: '10px' }}
//       />
//     </div>
//   );
// };

// export default MapTracker;

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import geolocator from 'geolocator';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapTracker = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [position, setPosition] = useState([78.404, 29.148]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    geolocator.config({ language: 'en' });

    const map = new maplibregl.Map({
      container: 'mapContainer',
      style: `https://api.maptiler.com/maps/streets/style.json?key=l9lmtrpVhvZpFVk4QpST`,
      center: position,
      zoom: 15,
    });

    mapRef.current = map;

    const carEl = document.createElement('div');
    carEl.innerText = '🚗';
    carEl.style.fontSize = '24px';

    markerRef.current = new maplibregl.Marker({ element: carEl })
      .setLngLat(position)
      .addTo(map);

    const getLocation = () => {
      geolocator.locate(
        {
          enableHighAccuracy: true,
          maximumAge: 60000,
          timeout: 5000,
        },
        (err, location) => {
          if (err) return console.error(err);

          const coords = [location.coords.longitude, location.coords.latitude];
          setPosition(coords);

          if (markerRef.current) markerRef.current.setLngLat(coords);
          if (mapRef.current)
            mapRef.current.flyTo({ center: coords, speed: 0.5 });
        }
      );
    };

    const intervalId = setInterval(getLocation, 5000);

    return () => {
      clearInterval(intervalId);
      map.remove();
    };
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">🚗 Live Location Tracker</h2>
      <div
        id="mapContainer"
        style={{ height: '700px', width: '100%', borderRadius: '10px' }}
      />
    </div>
  );
};

export default MapTracker;
