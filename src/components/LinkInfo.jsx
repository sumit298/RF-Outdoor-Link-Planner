// Link Information Panel

function LinkInfo({ link, towers, onDelete, onClose }) {
  if (!link) return null;

  const tower1 = towers.find(t => t.id === link.tower1Id);
  const tower2 = towers.find(t => t.id === link.tower2Id);

  if (!tower1 || !tower2) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white text-black rounded-lg shadow-lg p-6 w-80 z-1000" style={{padding: "10px"}}>
      <div className="flex justify-between items-center mb-6" style={{marginBottom: "10px"}}>
        <h3 className="text-lg font-bold">Link Information</h3>
        <button onClick={onClose} className="text-gray-100 hover:text-gray-200 text-xl">✕</button>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="bg-gray-50 px-4 py-3 rounded" style={{marginBottom: "10px"}}>
          <div className="mb-2">
            <strong>From:</strong> {tower1.name}
          </div>
          <div>
            <strong>To:</strong> {tower2.name}
          </div>
        </div>
        
        <div className="bg-blue-50 px-4 py-3 rounded" style={{marginBottom: "10px"}}>
          <div className="mb-2" >
            <strong>Distance:</strong> {(link.distance / 1000).toFixed(2)} km
          </div>
          <div>
            <strong>Frequency:</strong> {link.frequency} GHz
          </div>
        </div>
        
        <div className="pt-2 text-xs text-gray-600 bg-red-50 px-4 py-3 rounded">
          <p className="mb-2"><strong>Fresnel Zone:</strong></p>
          <p>The red ellipse shows the First Fresnel Zone. This area should be clear of obstacles for optimal signal transmission.</p>
        </div>
        
        <button
          onClick={() => onDelete(link.id)}
          className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 mt-3 font-medium"
        >
          Delete Link
        </button>
      </div>
    </div>
  );
}

export default LinkInfo;
