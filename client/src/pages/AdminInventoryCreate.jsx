import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createInventory } from '../services/inventoryApi.js';
import InventoryForm from '../components/inventory/InventoryForm.jsx';

export default function AdminInventoryCreate() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async ({ formData }) => {
    setLoading(true);
    try {
      await createInventory(formData);
      navigate('/admin');
    } catch (e) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button className="btn btn-ghost" onClick={() => navigate('/admin')} style={{ marginBottom: 8, paddingLeft: 0 }}>
            ← Back
          </button>
          <h1 className="page-title">New <span>Item</span></h1>
        </div>
      </div>
      <InventoryForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Item" />
    </div>
  );
}
