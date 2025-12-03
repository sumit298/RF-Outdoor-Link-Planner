import { useState } from 'react';
import Map from './components/Map';
import Sidebar from './components/Sidebar';
import TowerConfig from './components/TowerConfig';
import LinkInfo from './components/LinkInfo';
import { calculateDistance } from './utils/calculations';
import './App.css';

// Function to get place name from coordinates
const getPlaceName = async (lat, lng) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`
    );
    const data = await response.json();
    
    if (data && data.address) {
      const { city, town, village, county, state, country } = data.address;
      const place = city || town || village || county;
      return place ? `${place}, ${state || country}` : `${state || country}`;
    }
    return 'Unknown Location';
  } catch (error) {
    console.error('Error fetching place name:', error);
    return 'Unknown Location';
  }
};

function App() {
  // State management
  const [towers, setTowers] = useState([]);
  const [links, setLinks] = useState([]);
  const [selectedTower, setSelectedTower] = useState(null);
  const [selectedLink, setSelectedLink] = useState(null);
  const [linkingMode, setLinkingMode] = useState(false);
  const [firstTowerForLink, setFirstTowerForLink] = useState(null);
  const [configTower, setConfigTower] = useState(null);

  // Handle map click - add new tower
  const handleMapClick = async (lat, lng) => {
    if (linkingMode) return; // Don't add towers in linking mode
    
    // Get place name for the location
    const placeName = await getPlaceName(lat, lng);
    
    const newTower = {
      id: Date.now(),
      lat,
      lng,
      frequency: 5.0, // Default 5 GHz
      name: `Tower ${towers.length + 1}`,
      location: placeName,
    };
    
    setTowers([...towers, newTower]);
    setConfigTower(newTower); // Open config panel for new tower
  };

  // Handle tower click
  const handleTowerClick = (towerId) => {
    const tower = towers.find(t => t.id === towerId);
    
    if (linkingMode) {
      // Linking mode: select towers to create link
      if (!firstTowerForLink) {
        setFirstTowerForLink(tower);
        setSelectedTower(tower);
      } else {
        // Check if frequencies match
        if (firstTowerForLink.frequency !== tower.frequency) {
          alert(`Cannot link towers with different frequencies!\n${firstTowerForLink.name}: ${firstTowerForLink.frequency} GHz\n${tower.name}: ${tower.frequency} GHz`);
          setFirstTowerForLink(null);
          setSelectedTower(null);
          return;
        }
        
        // Check if link already exists
        const linkExists = links.some(
          link => 
            (link.tower1Id === firstTowerForLink.id && link.tower2Id === tower.id) ||
            (link.tower1Id === tower.id && link.tower2Id === firstTowerForLink.id)
        );
        
        if (linkExists) {
          alert('Link already exists between these towers!');
          setFirstTowerForLink(null);
          setSelectedTower(null);
          return;
        }
        
        // Create link
        const distance = calculateDistance(
          firstTowerForLink.lat,
          firstTowerForLink.lng,
          tower.lat,
          tower.lng
        );
        
        const newLink = {
          id: Date.now(),
          tower1Id: firstTowerForLink.id,
          tower2Id: tower.id,
          distance,
          frequency: tower.frequency,
        };
        
        setLinks([...links, newLink]);
        setFirstTowerForLink(null);
        setSelectedTower(null);
      }
    } else {
      // Normal mode: open config
      setConfigTower(tower);
      setSelectedTower(tower);
    }
  };

  // Handle link click
  const handleLinkClick = (linkId) => {
    const link = links.find(l => l.id === linkId);
    setSelectedLink(link);
  };

  // Update tower configuration
  const handleUpdateTower = (updatedTower) => {
    setTowers(towers.map(t => t.id === updatedTower.id ? updatedTower : t));
    setConfigTower(updatedTower);
    
    // Update links with new frequency if changed
    setLinks(links.map(link => {
      if (link.tower1Id === updatedTower.id || link.tower2Id === updatedTower.id) {
        const tower1 = link.tower1Id === updatedTower.id ? updatedTower : towers.find(t => t.id === link.tower1Id);
        const tower2 = link.tower2Id === updatedTower.id ? updatedTower : towers.find(t => t.id === link.tower2Id);
        
        // Check if frequencies still match
        if (tower1.frequency !== tower2.frequency) {
          return null; // Mark for deletion
        }
        
        return { ...link, frequency: updatedTower.frequency };
      }
      return link;
    }).filter(Boolean)); // Remove null links
  };

  // Delete tower
  const handleDeleteTower = (towerId) => {
    setTowers(towers.filter(t => t.id !== towerId));
    setLinks(links.filter(l => l.tower1Id !== towerId && l.tower2Id !== towerId));
    setConfigTower(null);
    setSelectedTower(null);
  };

  // Delete link
  const handleDeleteLink = (linkId) => {
    setLinks(links.filter(l => l.id !== linkId));
    setSelectedLink(null);
  };

  // Toggle linking mode
  const handleToggleLinking = () => {
    setLinkingMode(!linkingMode);
    setFirstTowerForLink(null);
    setSelectedTower(null);
    setConfigTower(null);
  };

  return (
    <div className="relative w-screen h-screen">
      <Map
        onClickMap={handleMapClick}
        towers={towers}
        links={links}
        onTowerClick={handleTowerClick}
        selectedLink={selectedLink}
        onLinkClick={handleLinkClick}
      />
      
      <Sidebar
        towers={towers}
        linkingMode={linkingMode}
        selectedTower={selectedTower}
        onToggleLinking={handleToggleLinking}
        onTowerSelect={handleTowerClick}
      />
      
      {configTower && (
        <TowerConfig
          tower={configTower}
          onUpdate={handleUpdateTower}
          onDelete={handleDeleteTower}
          onClose={() => setConfigTower(null)}
        />
      )}
      
      {selectedLink && (
        <LinkInfo
          link={selectedLink}
          towers={towers}
          onDelete={handleDeleteLink}
          onClose={() => setSelectedLink(null)}
        />
      )}
    </div>
  );
}

export default App;
