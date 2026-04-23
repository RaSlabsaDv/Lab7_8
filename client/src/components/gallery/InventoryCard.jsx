import { getPhotoUrl } from '../../services/inventoryApi.js';
import { useFavorites } from "../../store/FavoritesContext.jsx";
import styles from './InventoryCard.module.css';

export default function InventoryCard({ item, onClick }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(item.id);

  const handleFav = (e) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  return (
    <div className={styles.invCard} onClick={() => onClick(item)}>
      <div className={styles.cardPhoto}>
        {item.photo
          ? <img src={getPhotoUrl(item.id)} alt={item.inventory_name} loading="lazy" />
          : <div className={styles.cardNoPhoto}>◫</div>
        }
        <button
          className={`${styles.favBtn}${fav ? ` ${styles.active}` : ''}`}
          onClick={handleFav}
          title={fav ? 'Remove from favorites' : 'Add to favorites'}
        >
          ♥
        </button>
      </div>
      <div className={styles.cardBody}>
        <span className={styles.cardName}>{item.inventory_name}</span>
        {item.description && <span className={styles.cardDesc}>{item.description}</span>}
      </div>
    </div>
  );
}
