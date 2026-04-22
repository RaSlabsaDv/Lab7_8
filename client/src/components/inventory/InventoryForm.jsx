import { useState } from 'react';
import './InventoryForm.css';

export default function InventoryForm({ initial = {}, onSubmit, loading, submitLabel = 'Save' }) {
  const [name, setName] = useState(initial.inventory_name || '');
  const [desc, setDesc] = useState(initial.description || '');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    return e;
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    const fd = new FormData();
    fd.append('inventory_name', name.trim());
    fd.append('description', desc.trim());
    if (photo) fd.append('photo', photo);
    onSubmit({ formData: fd, name: name.trim(), description: desc.trim(), hasPhoto: !!photo });
  };

  return (
    <form className="inv-form" onSubmit={handleSubmit} noValidate>
      <div className="form-group">
        <label className="form-label">Inventory Name *</label>
        <input
          className={`form-input ${errors.name ? 'error' : ''}`}
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter item name"
        />
        {errors.name && <span className="form-error">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea
          className="form-input"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Optional description..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">Photo</label>
        <div className="photo-upload-area" onClick={() => document.getElementById('photo-input').click()}>
          {preview
            ? <img src={preview} alt="preview" className="photo-preview" />
            : <div className="photo-placeholder">
                <span style={{ fontSize: 32 }}>◫</span>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Click to upload image</span>
              </div>
          }
        </div>
        <input id="photo-input" type="file" accept="image/*" onChange={handlePhoto} style={{ display: 'none' }} />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
