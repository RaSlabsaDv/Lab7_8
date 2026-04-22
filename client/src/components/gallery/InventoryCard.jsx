import { getPhotoUrl } from '../../../../../warehouse-app/client/src/services/inventoryApi.js';
import { useFavorites } from '../../store/FavoritesContext.js';
import './InventoryCard.css';

export default function InventoryCard({ item, onClick }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(item.id);

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  return (
    <div className="inv-card" onClick={() => onClick(item)}>
      <div className="card-photo">
        {item.photo
          ? <img src={getPhotoUrl(item.id)} alt={item.inventory_name} loading="lazy" />
          : <div className="card-no-photo">◫</div>
        }
        <button
          className={`fav-btn ${fav ? 'active' : ''}`}
          onClick={handleFav}
          title={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          ♥
        </button>
      </div>
      <div className="card-body">
        <span className="card-name">{item.inventory_name}</span>
        {item.description && <span className="card-desc">{item.description}</span>}
      </div>
    </div>
  );
}
