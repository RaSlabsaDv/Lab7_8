import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteInventory, getPhotoUrl } from '../../services/inventoryApi.js';
import ConfirmModal from './ConfirmModal.jsx';
import './InventoryTable.css';

export default function InventoryTable({ items, onDeleted }) {
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteInventory(deleteTarget.id);
      onDeleted(deleteTarget.id);
      setDeleteTarget(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="inv-table-wrap">
        <table className="inv-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>
                  <div className="table-thumb">
                    {item.photo
                      ? <img src={getPhotoUrl(item.id)} alt={item.inventory_name} onError={e => { e.target.style.display='none'; }} />
                      : <span className="no-photo">◫</span>
                    }
                  </div>
                </td>
                <td>
                  <span className="item-name">{item.inventory_name}</span>
                </td>
                <td>
                  <span className="item-desc">{item.description || '—'}</span>
                </td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate(`/admin/details/${item.id}`)}>View</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate(`/admin/edit/${item.id}`)}>Edit</button>
                    <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(item)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete item?"
          message={`Are you sure you want to delete "${deleteTarget.inventory_name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </>
  );
}
