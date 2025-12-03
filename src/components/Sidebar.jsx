// Sidebar with controls and tower list

function Sidebar({ towers, linkingMode, selectedTower, onToggleLinking, onTowerSelect }) {
  return (
    <div className="fixed top-4 left-4 bg-white rounded-lg shadow-lg p-4 w-80 max-h-[90vh] overflow-y-auto z-[1000]">
      <h2 className="text-xl text-black font-bold" style={{padding: "0px 5px"}}>RF Link Planner</h2>
      
      <div className="mb-4 m-auto">
        <button
          onClick={onToggleLinking}
          className={`w-full px-2 py-2 rounded font-medium ${
            linkingMode
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {linkingMode ? '✓ Linking Mode Active' : 'Enable Linking Mode'}
        </button>
        {linkingMode && (
          <p className="text-xs text-gray-600 mt-2">
            Click two towers with matching frequencies to create a link
          </p>
        )}
      </div>
      
      <div className="mb-4">
        <h3 className="font-semibold mb-2">Instructions:</h3>
        <ul className="text-sm text-gray-700 space-y-1" style={{paddingLeft:"10px"}}>
          <li>• Click map to place towers</li>
          <li>• Click tower to configure</li>
          <li>• Enable linking mode to connect towers</li>
          <li>• Click link to see Fresnel zone</li>
        </ul>
      </div>
      
      <div>
        <h3 className="font-semibold mb-2">Towers ({towers.length})</h3>
        <div className="space-y-2">
          {towers.map((tower) => (
            <div
              key={tower.id}
              onClick={() => onTowerSelect(tower.id)}
              className={`px-2 py-2 border rounded cursor-pointer hover:bg-gray-50 ${
                selectedTower?.id === tower.id ? 'border-blue-500 bg-blue-50' : ''
              }`}
              style={{padding:"10px"}}
            >
              <p className="text-sm text-black">{tower.name}</p>
              {tower.location && (
                <div className="text-sm font-semibold text-gray-500">{tower.location}</div>
              )}
              <div className="text-sm text-gray-600">{tower.frequency} GHz</div>
            </div>
          ))}
          {towers.length === 0 && (
            <p className="text-sm text-gray-500">No towers yet. Click on the map to add one.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
