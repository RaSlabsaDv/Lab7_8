import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getInventoryItem, updateInventory, updateInventoryPhoto, getPhotoUrl } from '../services/inventoryApi.js';
import styles from './AdminInventoryEdit.module.css';

export default function AdminInventoryEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [nameError, setNameError] = useState('');
  const [textSaved, setTextSaved] = useState(false);
  const [photoSaved, setPhotoSaved] = useState(false);

  useEffect(() => {
    getInventoryItem(id)
      .then(data => { setItem(data); setName(data.inventory_name); setDesc(data.description); })
      .catch(e => alert(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleTextSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) { setNameError('Name is required'); return; }
    setNameError(''); setSaving(true);
    try {
      await updateInventory(id, { inventory_name: name.trim(), description: desc.trim() });
      setTextSaved(true);
      setTimeout(() => setTextSaved(false), 2500);
    } catch (err) { alert(err.message); }
    finally { setSaving(false); }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handlePhotoSave = async () => {
    if (!photoFile) return;
    setSavingPhoto(true);
    try {
      const fd = new FormData();
      fd.append('photo', photoFile);
      await updateInventoryPhoto(id, fd);
      setPhotoSaved(true);
      setTimeout(() => setPhotoSaved(false), 2500);
    } catch (err) { alert(err.message); }
    finally { setSavingPhoto(false); }
  };

  if (loading) return <div className="page-container"><div className="skeleton" style={{ height: 400 }} /></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <button className="btn btn-ghost" onClick={() => navigate('/admin')} style={{ marginBottom: 8, paddingLeft: 0 }}>
            ← Back
          </button>
          <h1 className="page-title">Edit <span>{item?.inventory_name}</span></h1>
        </div>
      </div>

      <div className={styles.editSections}>
        <section className={styles.editCard}>
          <h2 className={styles.editSectionTitle}>
            <span className={styles.sectionNum}>01</span> Text Data
          </h2>
          <form onSubmit={handleTextSave} noValidate>
            <div className="form-group">
              <label className="form-label">Inventory Name *</label>
              <input
                className={`form-input${nameError ? ' error' : ''}`}
                value={name}
                onChange={e => setName(e.target.value)}
              />
              {nameError && <span className="form-error">{nameError}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" value={desc} onChange={e => setDesc(e.target.value)} />
            </div>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving…' : textSaved ? '✓ Saved!' : 'Save Text'}
            </button>
          </form>
        </section>

        <section className={styles.editCard}>
          <h2 className={styles.editSectionTitle}>
            <span className={styles.sectionNum}>02</span> Photo
          </h2>
          <div className={styles.photoCurrent}>
            <img
              src={photoPreview || (item?.photo ? getPhotoUrl(id) : null)}
              alt="current"
              style={{ display: (photoPreview || item?.photo) ? 'block' : 'none' }}
            />
            {!photoPreview && !item?.photo && (
              <div className={styles.noPhotoPlaceholder}>◫ No photo</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
              Choose New Photo
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: 'none' }} />
            </label>
            {photoFile && (
              <button className="btn btn-primary" onClick={handlePhotoSave} disabled={savingPhoto}>
                {savingPhoto ? 'Uploading…' : photoSaved ? '✓ Updated!' : 'Upload Photo'}
              </button>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
