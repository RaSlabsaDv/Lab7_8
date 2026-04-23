import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getInventoryItem, getPhotoUrl } from '../services/inventoryApi.js';
import styles from './AdminInventoryDetails.module.css';

export default function AdminInventoryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInventoryItem(id)
      .then(setItem)
      .catch(e => alert(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="page-container"><div className="skeleton" style={{ height: 400 }} /></div>;
  if (!item) return <div className="page-container"><div className="state-box state-error"><span>Item not found</span></div></div>;

  return (
    <div className="page-container">
      <button className="btn btn-ghost" onClick={() => navigate('/admin')} style={{ marginBottom: 24, paddingLeft: 0 }}>
        ← Back to list
      </button>
      <div className={styles.detailsLayout}>
        <div className={styles.detailsPhotoWrap}>
          {item.photo
            ? <img src={getPhotoUrl(id)} alt={item.inventory_name} className={styles.detailsPhoto} />
            : <div className={styles.detailsNoPhoto}>◫</div>
          }
        </div>
        <div className={styles.detailsInfo}>
          <span className="tag">ID: {item.id.slice(0, 8)}…</span>
          <h1 className={styles.detailsTitle}>{item.inventory_name}</h1>
          <p className={styles.detailsDesc}>{item.description || 'No description provided.'}</p>
          <div className={styles.detailsMeta}>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Created</span>
              <span className={styles.metaValue}>{new Date(item.createdAt).toLocaleString()}</span>
            </div>
            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Updated</span>
              <span className={styles.metaValue}>{new Date(item.updatedAt).toLocaleString()}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
            <button className="btn btn-primary" onClick={() => navigate(`/admin/edit/${id}`)}>Edit Item</button>
            <button className="btn btn-secondary" onClick={() => navigate('/admin')}>Back to Admin</button>
          </div>
        </div>
      </div>
    </div>
  );
}
