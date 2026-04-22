import { useEffect } from 'react';
import { getPhotoUrl } from '../../services/inventoryApi.js';
import { useFavorites } from "../../store/FavoritesContext.jsx";
import './InventoryQuickView.css';

export default function InventoryQuickView({ item, onClose }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(item.id);

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="qv-box" onClick={e => e.stopPropagation()}>
        <button className="qv-close" onClick={onClose}>✕</button>
        <div className="qv-layout">
          <div className="qv-photo">
            {item.photo
              ? <img src={getPhotoUrl(item.id)} alt={item.inventory_name} />
              : <div className="qv-no-photo">◫</div>
            }
          </div>
          <div className="qv-info">
            <span className="tag">Quick View</span>
            <h2 className="qv-title">{item.inventory_name}</h2>
            <p className="qv-desc">{item.description || 'No description available.'}</p>
            <button
              className={`btn ${fav ? 'btn-danger' : 'btn-primary'}`}
              style={{ marginTop: 'auto' }}
              onClick={() => toggleFavorite(item)}
            >
              {fav ? '♥ Remove from Favorites' : '♥ Add to Favorites'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
