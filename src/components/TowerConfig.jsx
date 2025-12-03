// Tower Configuration Panel

function TowerConfig({ tower, onUpdate, onDelete, onClose }) {
  if (!tower) return null;

  return (
    <div className="fixed top-4 right-4 bg-white text-black rounded-lg shadow-lg p-4 w-80 z-1000" style={{padding: "15px"}}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Configure Tower</h3>
        <button onClick={onClose} className="text-gray-100 hover:text-gray-200">✕</button>
      </div>
      
      <div className="">
        <div className="" style={{marginBottom: "10px"}}>
          <label className="block text-sm font-medium mb-1 text-gray-700">Tower Name</label>
          <input
            type="text"
            value={tower.name}
            onChange={(e) => onUpdate({ ...tower, name: e.target.value })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none bg-white text-gray-900"
          />
        </div>
        
        <div style={{marginBottom: "10px"}}>
          <label className="block text-sm font-medium mb-1 text-gray-700">Frequency (GHz)</label>
          <input
            type="number"
            step="0.1"
            value={tower.frequency}
            onChange={(e) => onUpdate({ ...tower, frequency: parseFloat(e.target.value) })}
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none bg-white text-gray-900"
          />
        </div>
        
        {tower.location && (
          <div style={{marginBottom: "10px"}}>
            <label className="block text-sm font-medium mb-1 text-gray-700">Location</label>
            <input
              type="text"
              value={tower.location}
              onChange={(e) => onUpdate({ ...tower, location: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:border-blue-500 focus:outline-none bg-white text-gray-900"
              placeholder="Location name"
            />
          </div>
        )}
        
        <div className="text-sm text-gray-600">
          <p>Lat: {tower.lat.toFixed(4)}</p>
          <p>Lng: {tower.lng.toFixed(4)}</p>
        </div>
        
        <button
          onClick={() => onDelete(tower.id)}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Delete Tower
        </button>
      </div>
    </div>
  );
}

export default TowerConfig;
