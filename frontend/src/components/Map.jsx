import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";


export default function Map() {
  return (
    <MapContainer
      center={[42.5669, 13.3792]}
      zoom={16}
      style={{ height: "100%", width: "100%", zIndex: 0, position: "relative" }}
      dragging={false}
      zoomControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
     touchZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={[45.4642, 9.19]}>
        <Popup>Ciao, sono un punto sulla mappa!</Popup>
      </Marker>
    </MapContainer>
  );
}
