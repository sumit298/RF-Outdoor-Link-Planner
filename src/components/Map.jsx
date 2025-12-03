import { MapContainer, TileLayer, useMapEvents, Marker, Polyline, Polygon, Popup } from "react-leaflet";
import L from "leaflet";
import { generateFresnelEllipse } from "../utils/calculations";

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to handle map clicks
function MapClickHandler({ onClick }) {
  useMapEvents({
    click: (e) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

const Map = ({ onClickMap, towers, links, onTowerClick, selectedLink, onLinkClick }) => {
  return (
    <MapContainer
      center={[28.6139, 77.2090]}
      zoom={6}
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapClickHandler onClick={onClickMap} />
      
      {/* Render Towers */}
      {towers.map((tower) => (
        <Marker
          key={tower.id}
          position={[tower.lat, tower.lng]}
          eventHandlers={{
            click: () => onTowerClick(tower.id),
          }}
        >
          <Popup>
            <div>
              <strong>{tower.name}</strong><br />
              {tower.location && (
                <>
                  <span className="text-gray-600">{tower.location}</span><br />
                </>
              )}
              Frequency: {tower.frequency} GHz<br />
              <span className="text-xs text-gray-500">
                {tower.lat.toFixed(4)}, {tower.lng.toFixed(4)}
              </span>
            </div>
          </Popup>
        </Marker>
      ))}
      
      {/* Render Links */}
      {links.map((link) => {
        const tower1 = towers.find(t => t.id === link.tower1Id);
        const tower2 = towers.find(t => t.id === link.tower2Id);
        
        if (!tower1 || !tower2) return null;
        
        return (
          <Polyline
            key={link.id}
            positions={[[tower1.lat, tower1.lng], [tower2.lat, tower2.lng]]}
            color={selectedLink?.id === link.id ? "#ff0000" : "#3388ff"}
            weight={selectedLink?.id === link.id ? 4 : 2}
            eventHandlers={{
              click: () => onLinkClick(link.id),
            }}
          >
            <Popup>
              <div>
                <strong>Link</strong><br />
                {tower1.name} ↔ {tower2.name}<br />
                Distance: {(link.distance / 1000).toFixed(2)} km<br />
                Frequency: {link.frequency} GHz
              </div>
            </Popup>
          </Polyline>
        );
      })}
      
      {/* Render Fresnel Zone for selected link */}
      {selectedLink && (() => {
        const tower1 = towers.find(t => t.id === selectedLink.tower1Id);
        const tower2 = towers.find(t => t.id === selectedLink.tower2Id);
        
        if (!tower1 || !tower2) return null;
        
        const fresnelPoints = generateFresnelEllipse(tower1, tower2, selectedLink.frequency);
        
        return (
          <Polygon
            positions={fresnelPoints}
            pathOptions={{
              color: '#ff6b6b',
              fillColor: '#ff6b6b',
              fillOpacity: 0.2,
              weight: 2,
            }}
          />
        );
      })()}
    </MapContainer>
  );
};

export default Map;
