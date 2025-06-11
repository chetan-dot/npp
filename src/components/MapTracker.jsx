'use client';
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { vehicleTracker } from '@/helper/apiservices/fetchUserDetails';

const MapTracker = () => {
  const mapRef = useRef(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState(null);

  const centerPosition = [78.404, 29.148];

  const iconMap = {
    tractor: '🚜',
    'e-rickshaw': '🛺',
    JCV: '🛻',
    'TATA MAGIC': '🚐',
    SKYLIFT: '🏗️',
    Sivar: '🚛',
  };

  const getIconForVehicle = (vehicleName) => {
    const matchedKey = Object.keys(iconMap).find((key) =>
      vehicleName.toLowerCase().includes(key.toLowerCase())
    );
    return matchedKey ? iconMap[matchedKey] : '🚘';
  };

  const fetchVehicles = async () => {
    try {
      const response = await vehicleTracker();
      const map = mapRef.current;
      if (!map) return;

      const validVehicles = response.devices.filter(
        (v) => v.success && v.location
      );

      const updatedVehicles = validVehicles.map((v) => {
        const { lat, lng, gpsTime, address } = v.location;
        const position = [parseFloat(lng), parseFloat(lat)];

        const icon = getIconForVehicle(v.vehicleName);
        const markerEl = document.createElement('div');
        markerEl.innerText = icon;
        markerEl.style.fontSize = '24px';
        markerEl.style.cursor = 'pointer';

        const popup = new maplibregl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 25,
        });

        markerEl.addEventListener('mouseenter', () => {
          popup
            .setLngLat(position)
            .setHTML(
              `<strong>${v.vehicleName}</strong><br/> Ward: ${v.ward}<br/> address: ${address}`
            )
            .addTo(map);
        });

        markerEl.addEventListener('mouseleave', () => {
          popup.remove();
        });

        const marker = new maplibregl.Marker({ element: markerEl })
          .setLngLat(position)
          .addTo(map);

        return {
          id: v.deviceId,
          name: v.vehicleName,
          ward: v.ward,
          marker,
          popup,
          position,
          gpsTime,
          address,
        };
      });

      setVehicles(updatedVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const map = new maplibregl.Map({
      container: 'mapContainer',
      style: `https://api.maptiler.com/maps/streets/style.json?key=l9lmtrpVhvZpFVk4QpST`,
      center: centerPosition,
      zoom: 14,
    });

    mapRef.current = map;

    map.on('load', () => {
      fetchVehicles();
    });

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const interval = setInterval(() => {
      fetchVehicles();
    }, 180000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      const vehicle = vehicles.find((v) => v.name === selectedVehicle);
      setVehicleDetails(vehicle);

      if (vehicle && mapRef.current) {
        mapRef.current.flyTo({
          center: vehicle.position,
          zoom: 16,
          speed: 1.2,
          curve: 1.5,
          essential: true,
        });
      }
    }
  }, [selectedVehicle, vehicles]);

  const vehicleTypeCounts = vehicles.reduce((acc, v) => {
    const icon = getIconForVehicle(v.name);
    acc[icon] = (acc[icon] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="p-4 relative">
      <h2 className="text-2xl font-bold mb-4">🚛 Live Multi-Vehicle Tracker</h2>

      <div className="flex items-center gap-2 mb-4">
        <select
          onChange={(e) => setSelectedVehicle(e.target.value)}
          value={selectedVehicle}
          className="border border-gray-300 p-2 rounded"
        >
          <option value="">Select Vehicle</option>
          {vehicles.map((v) => (
            <option key={v.id} value={v.name}>
              Ward {v.ward} ({getIconForVehicle(v.name)})
            </option>
          ))}
        </select>
      </div>

      {/* Map Container */}
      <div
        id="mapContainer"
        style={{ height: '700px', width: '100%', borderRadius: '10px' }}
      />

      {/* Legend box */}
      <div className="absolute top-[120px] right-4 bg-[rgb(229,231,235)] shadow-lg rounded p-3 text-sm space-y-2 z-10">
        <h4 className="font-semibold mb-2">🚗 Vehicle Types</h4>
        {Object.keys(iconMap).map((type) => (
          <div key={type} className="flex items-center gap-2">
            <span>{iconMap[type]}</span>
            <span>{type}</span>
            <span className="ml-auto font-bold">
              {
                vehicles.filter((v) =>
                  v.name.toLowerCase().includes(type.toLowerCase())
                ).length
              }
            </span>
          </div>
        ))}
      </div>

      {vehicleDetails && (
        <div className="mt-4 p-3 bg-gray-100 rounded shadow text-sm space-y-1">
          <h3 className="text-lg font-semibold mb-2">📋 Vehicle Details</h3>
          <p>
            <strong>Name:</strong> {vehicleDetails.name}
          </p>
          <p>
            <strong>Ward:</strong> {vehicleDetails.ward}
          </p>
          <p>
            <strong>Position:</strong> {vehicleDetails.position[1].toFixed(5)},{' '}
            {vehicleDetails.position[0].toFixed(5)}
          </p>
          <p>
            <strong>Address:</strong> {vehicleDetails.address}
          </p>
          <p>
            <strong>GPS Time:</strong> {vehicleDetails.gpsTime}
          </p>
        </div>
      )}
    </div>
  );
};

export default MapTracker;
