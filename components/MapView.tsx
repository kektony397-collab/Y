import React from 'react';
import { GoogleMap, useLoadScript, Polyline, Marker } from '@react-google-maps/api';
import { useAppContext } from '../context/AppContext';

// !!! IMPORTANT !!!
// Replace "YOUR_GOOGLE_MAPS_API_KEY" with your actual Google Maps API key.
// You can get one from the Google Cloud Console. Make sure to enable the "Maps JavaScript API".
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

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
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
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

  if (GOOGLE_MAPS_API_KEY === "YOUR_GOOGLE_MAPS_API_KEY") {
    return (
        <div className="p-4 text-center text-yellow-800 bg-yellow-100 dark:bg-yellow-900/50 rounded-lg h-full flex flex-col justify-center items-center">
            <p className="font-bold text-lg">Google Maps API Key Needed</p>
            <p className="mt-2">
                To display the map, you need to provide a Google Maps API key.
            </p>
            <p className="mt-2 text-sm">
                Please replace <strong>"YOUR_GOOGLE_MAPS_API_KEY"</strong> in <code>components/MapView.tsx</code> with your actual key.
            </p>
            <p className="mt-4 text-xs text-gray-600 dark:text-gray-400">
                You can get a key from the Google Cloud Console. Make sure to enable the "Maps JavaScript API" and set up billing for your project.
            </p>
        </div>
    );
  }

  if (loadError) {
    return (
        <div className="p-4 text-center text-red-700 bg-red-100 dark:bg-red-900/50 rounded-lg h-full flex flex-col justify-center items-center">
            <p className="font-bold text-lg">Error Loading Google Maps</p>
            <p className="mt-2">This can happen for a few reasons:</p>
            <ul className="list-disc list-inside text-left mt-2 mx-auto max-w-md">
                <li>The Google Maps API key is invalid.</li>
                <li>Billing is not enabled for the project in Google Cloud Console.</li>
                <li>The API key has incorrect restrictions (e.g., HTTP referrers).</li>
            </ul>
            <p className="mt-4 text-sm">
                Please check the JavaScript console for technical details from Google.
            </p>
      </div>
    );
  }

  if (!isLoaded) return (
    <div className="flex items-center justify-center h-full">
      <p>Loading Maps...</p>
    </div>
  );

  return renderMap();
};

export default MapView;