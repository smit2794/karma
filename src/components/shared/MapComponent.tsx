import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Dynamic SVG Marker Generator
const createCustomIcon = (color: string) => {
  const markerHtmlStyles = `
    background-color: ${color};
    width: 24px;
    height: 24px;
    display: block;
    left: -12px;
    top: -24px;
    position: relative;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 2px solid white;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  `;
  return L.divIcon({
    className: "custom-pin",
    iconAnchor: [0, 24],
    popupAnchor: [0, -24],
    html: `<span style="${markerHtmlStyles}" />`
  });
};

const defaultIcon = createCustomIcon("#0066CC");

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  popupContent?: React.ReactNode;
  color?: string; // e.g. "#ef4444" (red), "#eab308" (yellow), "#3b82f6" (blue)
}

interface MapProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
}

// Component to programmatically update map center when props change
const MapUpdater = ({ center, zoom }: { center: [number, number]; zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

export function MapComponent({ markers, center, zoom = 7, className = "h-96 w-full rounded-xl" }: MapProps) {
  const defaultCenter: [number, number] = center || (markers.length > 0 ? [markers[0].lat, markers[0].lng] : [22.2587, 71.1924]); // Default to Gujarat

  return (
    <div className={className}>
      <MapContainer center={defaultCenter} zoom={zoom} scrollWheelZoom={false} style={{ height: "100%", width: "100%", zIndex: 0 }}>
        {import.meta.env.VITE_MAP_API_KEY ? (
          <TileLayer
            attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
            url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${import.meta.env.VITE_MAP_API_KEY}`}
          />
        ) : (
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        )}
        
        <MapUpdater center={defaultCenter} zoom={zoom} />
        
        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={[marker.lat, marker.lng]}
            title={marker.title}
            icon={marker.color ? createCustomIcon(marker.color) : defaultIcon}
          >
            {marker.popupContent && (
              <Popup>{marker.popupContent}</Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
