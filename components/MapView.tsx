
import React from 'react';
import { GoogleMap, useLoadScript, Polyline, Marker } from '@react-google-maps/api';
import { useAppContext } from '../context/AppContext';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
      {
          "featureType": "poi",
          "stylers": [{ "visibility": "off" }]
      },
      {
          "featureType": "transit",
          "stylers": [{ "visibility": "off" }]
      }
  ]
};

const MapView: React.FC = () => {
  const { state } = useAppContext();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // IMPORTANT: Replace with your key
    libraries: ['geometry'],
  });

  const center = state.currentPath.length > 0 ? state.currentPath[state.currentPath.length - 1] : { lat: 40.7128, lng: -74.0060 };

  const renderMap = () => (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      options={mapOptions}
      mapContainerClassName="map-container"
    >
      {state.currentPath.length > 0 && (
        <>
          <Polyline
            path={state.currentPath}
            options={{
              strokeColor: '#1D4ED8',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            }}
          />
          <Marker position={state.currentPath[state.currentPath.length - 1]} />
        </>
      )}
    </GoogleMap>
  );

  if (loadError) return <div>Error loading maps. Make sure you have replaced the API Key.</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return renderMap();
};

export default MapView;
