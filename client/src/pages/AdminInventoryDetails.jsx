import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getInventoryItem, getPhotoUrl } from '../services/inventoryApi.js';
import './AdminInventoryDetails.css';

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
      <div className="details-layout">
        <div className="details-photo-wrap">
          {item.photo
            ? <img src={getPhotoUrl(id)} alt={item.inventory_name} className="details-photo" />
            : <div className="details-no-photo">◫</div>
          }
        </div>
        <div className="details-info">
          <span className="tag">ID: {item.id.slice(0, 8)}…</span>
          <h1 className="details-title">{item.inventory_name}</h1>
          <p className="details-desc">{item.description || 'No description provided.'}</p>
          <div className="details-meta">
            <div className="meta-row">
              <span className="meta-label">Created</span>
              <span className="meta-value">{new Date(item.createdAt).toLocaleString()}</span>
            </div>
            <div className="meta-row">
              <span className="meta-label">Updated</span>
              <span className="meta-value">{new Date(item.updatedAt).toLocaleString()}</span>
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
