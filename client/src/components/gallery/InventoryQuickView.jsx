import { useEffect } from 'react';
import { getPhotoUrl } from '../../services/inventoryApi.js';
import { useFavorites } from "../../store/FavoritesContext.jsx";
import styles from './InventoryQuickView.module.css';

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
      <div className={styles.qvBox} onClick={e => e.stopPropagation()}>
        <button className={styles.qvClose} onClick={onClose}>✕</button>
        <div className={styles.qvLayout}>
          <div className={styles.qvPhoto}>
            {item.photo
              ? <img src={getPhotoUrl(item.id)} alt={item.inventory_name} />
              : <div className={styles.qvNoPhoto}>◫</div>
            }
          </div>
          <div className={styles.qvInfo}>
            <span className="tag">Quick View</span>
            <h2 className={styles.qvTitle}>{item.inventory_name}</h2>
            <p className={styles.qvDesc}>{item.description || 'No description available.'}</p>
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
