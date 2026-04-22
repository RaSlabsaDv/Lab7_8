import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getInventory } from '../services/inventoryApi.js';
import InventoryTable from '../components/inventory/InventoryTable.jsx';

export default function AdminInventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true); setError(null);
    try { setItems(await getInventory()); }
    catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDeleted = (id) => setItems(prev => prev.filter(i => i.id !== id));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Admin <span>Inventory</span></h1>
        <button className="btn btn-primary" onClick={() => navigate('/admin/create')}>
          + New Item
        </button>
      </div>

      {loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 72, borderRadius: 8 }} />
          ))}
        </div>
      )}

      {error && (
        <div className="state-box state-error">
          <span className="icon">⚠</span>
          <span>Error: {error}</span>
          <button className="btn btn-secondary" onClick={load}>Retry</button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="state-box">
          <span className="icon">◫</span>
          <span>No inventory items yet.</span>
          <button className="btn btn-primary" onClick={() => navigate('/admin/create')}>Add first item</button>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <InventoryTable items={items} onDeleted={handleDeleted} />
      )}
    </div>
  );
}
