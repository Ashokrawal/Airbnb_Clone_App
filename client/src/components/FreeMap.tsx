import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const FreeMap = () => {
  return (
    <MapContainer
      center={[48.8566, 2.3522]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[48.8566, 2.3522]}>
        <Popup>Paris, France</Popup>
      </Marker>
    </MapContainer>
  );
};
