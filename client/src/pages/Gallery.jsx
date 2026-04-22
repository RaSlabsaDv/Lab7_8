import { useState, useEffect } from 'react';
import { getInventory } from '../services/inventoryApi.js';
import InventoryCard from '../components/gallery/InventoryCard.jsx';
import InventoryQuickView from '../components/gallery/InventoryQuickView.jsx';
import './Gallery.css';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getInventory()
      .then(setItems)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Inventory <span>Gallery</span></h1>
        {!loading && !error && (
          <span className="tag">{items.length} items</span>
        )}
      </div>

      {loading && (
        <div className="gallery-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card-skeleton">
              <div className="skeleton" style={{ aspectRatio: '1', borderRadius: '12px 12px 0 0' }} />
              <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div className="skeleton" style={{ height: 16, width: '70%' }} />
                <div className="skeleton" style={{ height: 12, width: '90%' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="state-box state-error">
          <span className="icon">⚠</span>
          <span>Failed to load: {error}</span>
          <button className="btn btn-secondary" onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="state-box">
          <span className="icon">◫</span>
          <span>No items in inventory yet.</span>
          <span style={{ fontSize: 12 }}>Add items via the Admin panel.</span>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="gallery-grid">
          {items.map(item => (
            <InventoryCard key={item.id} item={item} onClick={setSelected} />
          ))}
        </div>
      )}

      {selected && <InventoryQuickView item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
