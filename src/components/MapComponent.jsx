// import { useEffect, useRef, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix Leaflet's default icon issue
// import icon from 'leaflet/dist/images/marker-icon.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';

// let DefaultIcon = L.icon({
//   iconUrl: icon,
//   shadowUrl: iconShadow,
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });
// L.Marker.prototype.options.icon = DefaultIcon;

// // Component to recenter the map
// const RecenterMap = ({ position }) => {
//   const map = useMap();
//   const prevPosition = useRef(position);

//   useEffect(() => {
//     const [prevLat, prevLng] = prevPosition.current;
//     const [newLat, newLng] = position;
//     const hasMoved = prevLat !== newLat || prevLng !== newLng;

//     if (hasMoved) {
//       map.flyTo(position, map.getZoom());
//       prevPosition.current = position;
//     }
//   }, [position, map]);

//   return null;
// };

// const MapComponent = () => {
//   const [position, setPosition] = useState([28.6139, 77.209]); // Default: Delhi
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if ('geolocation' in navigator) {
//       const watchId = navigator.geolocation.watchPosition(
//         (pos) => {
//           setPosition([pos.coords.latitude, pos.coords.longitude]);
//         },
//         (err) => {
//           setError(err.message);
//           console.error('Geolocation error:', err);
//         },
//         {
//           enableHighAccuracy: true,
//           maximumAge: 5000,
//           timeout: 5000,
//         }
//       );

//       return () => navigator.geolocation.clearWatch(watchId);
//     } else {
//       setError('Geolocation is not supported by your browser.');
//     }
//   }, []);

//   return (
//     <div className="w-full h-screen">
//       <MapContainer
//         center={position}
//         zoom={15}
//         scrollWheelZoom={true}
//         style={{ height: '100vh', width: '100%' }}
//       >
//         <TileLayer
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//         />

//         <Marker position={position}>
//           <Popup>{error ? `Error: ${error}` : 'Device is here'}</Popup>
//         </Marker>

//         <RecenterMap position={position} />
//       </MapContainer>
//     </div>
//   );
// };

// export default MapComponent;

import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet's default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Component to recenter the map
const RecenterMap = ({ position }) => {
  const map = useMap();
  const prevPosition = useRef(position);

  useEffect(() => {
    const [prevLat, prevLng] = prevPosition.current;
    const [newLat, newLng] = position;
    const hasMoved = prevLat !== newLat || prevLng !== newLng;

    if (hasMoved) {
      map.flyTo(position, map.getZoom());
      prevPosition.current = position;
    }
  }, [position, map]);

  return null;
};

const MapComponent = () => {
  const [position, setPosition] = useState([28.6139, 77.209]); // Default: Delhi
  const [error, setError] = useState(null);

  useEffect(() => {
    if ('geolocation' in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          setError(err.message);
          console.error('Geolocation error:', err);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 5000,
          timeout: 5000,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setError('Geolocation is not supported by your browser.');
    }
  }, []);

  return (
    <div className="w-full h-screen">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={position}>
          <Popup>{error ? `Error: ${error}` : 'Device is here'}</Popup>
        </Marker>

        <RecenterMap position={position} />
      </MapContainer>
    </div>
  );
};

export default MapComponent;
