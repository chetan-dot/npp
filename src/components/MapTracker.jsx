// import React, { useEffect, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix leaflet marker icons not showing
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
//   iconUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   shadowUrl:
//     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
// });

// const LiveTrackingComponent = () => {
//   const [position, setPosition] = useState([28.6139, 77.209]); // Default: Delhi

//   useEffect(() => {
//     const watchId = navigator.geolocation.watchPosition(
//       (pos) => {
//         const { latitude, longitude } = pos.coords;
//         setPosition([latitude, longitude]);
//       },
//       (err) => {
//         console.error('Error getting location: ', err);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       }
//     );

//     return () => navigator.geolocation.clearWatch(watchId);
//   }, []);

//   return (
//     <div style={{ height: '500px', width: '100%' }}>
//       <MapContainer
//         center={position}
//         zoom={16}
//         style={{ height: '100%', width: '100%' }}
//       >
//         <TileLayer
//           attribution="&copy; OpenStreetMap contributors"
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={position}>
//           <Popup>🚗 Vehicle is here!</Popup>
//         </Marker>
//       </MapContainer>
//     </div>
//   );
// };

// export default LiveTrackingComponent;

'use client';
import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapTracker = () => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [position, setPosition] = useState([77.209, 28.6139]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    mapRef.current = new maplibregl.Map({
      container: 'mapContainer',
      style: 'https://demotiles.maplibre.org/style.json',
      center: position,
      zoom: 14,
    });

    // Add marker
    markerRef.current = new maplibregl.Marker()
      .setLngLat(position)
      .addTo(mapRef.current);

    return () => mapRef.current.remove();
  }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newCoords = [longitude, latitude];
        setPosition(newCoords);

        if (markerRef.current) markerRef.current.setLngLat(newCoords);
        if (mapRef.current) mapRef.current.setCenter(newCoords);
      },
      (err) => console.error('GPS error:', err),
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">🚗 Live GPS Tracker</h2>
      <div
        id="mapContainer"
        style={{ height: '500px', width: '100%', borderRadius: '10px' }}
      />
    </div>
  );
};

export default MapTracker;
