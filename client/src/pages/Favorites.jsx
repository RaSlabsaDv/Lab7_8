import { useState } from 'react';
import { useFavorites } from '../store/FavoritesContext.jsx';
import { getPhotoUrl } from '../services/inventoryApi.js';
import InventoryQuickView from '../components/gallery/InventoryQuickView.jsx';
import './Favorites.css';

export default function Favorites() {
  const { favorites, removeFavorite } = useFavorites();
  const [selected, setSelected] = useState(null);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My <span>Favorites</span></h1>
        {favorites.length > 0 && <span className="tag">{favorites.length} saved</span>}
      </div>

      {favorites.length === 0 && (
        <div className="state-box">
          <span className="icon" style={{ fontSize: 56 }}>♥</span>
          <span>No favorites yet.</span>
          <span style={{ fontSize: 12 }}>Click ♥ on any item in the gallery to save it here.</span>
        </div>
      )}

      {favorites.length > 0 && (
        <div className="fav-grid">
          {favorites.map(item => (
            <div key={item.id} className="fav-card" onClick={() => setSelected(item)}>
              <div className="fav-photo">
                {item.photo
                  ? <img src={getPhotoUrl(item.id)} alt={item.inventory_name} loading="lazy" />
                  : <div className="fav-no-photo">◫</div>
                }
              </div>
              <div className="fav-info">
                <span className="fav-name">{item.inventory_name}</span>
                {item.description && <span className="fav-desc">{item.description}</span>}
              </div>
              <button
                className="fav-remove"
                onClick={e => { e.stopPropagation(); removeFavorite(item.id); }}
                title="Remove from favorites"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {selected && <InventoryQuickView item={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
