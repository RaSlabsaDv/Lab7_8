import { useState } from "react";
import { inventoryApi } from "../../services/inventoryApi";
import { useToast } from "../../store/ToastContext";

export function EditModal({ item, onClose, onSaved }) {
  const { addToast } = useToast();
  const [name, setName] = useState(item.inventory_name);
  const [desc, setDesc] = useState(item.description || "");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [savingText, setSavingText] = useState(false);
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [errors, setErrors] = useState({});

  const handlePhotoChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const handleSaveText = async () => {
    if (!name.trim()) { setErrors({ name: "Name is required" }); return; }
    setSavingText(true);
    try {
      const updated = await inventoryApi.updateText(item.id, { inventory_name: name.trim(), description: desc.trim() });
      addToast("Item updated successfully");
      onSaved(updated);
    } catch (e) {
      addToast(e.message, "error");
    } finally {
      setSavingText(false);
    }
  };

  const handleSavePhoto = async () => {
    if (!photoFile) return;
    const fd = new FormData();
    fd.append("photo", photoFile);
    setSavingPhoto(true);
    try {
      const updated = await inventoryApi.updatePhoto(item.id, fd);
      addToast("Photo updated");
      onSaved(updated);
      setPhotoFile(null);
      setPhotoPreview(null);
    } catch (e) {
      addToast(e.message, "error");
    } finally {
      setSavingPhoto(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: "560px" }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Edit Item</span>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Text section */}
          <div>
            <div className="tag tag-accent" style={{ marginBottom: "14px" }}>Text Info</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input value={name} onChange={(e) => { setName(e.target.value); setErrors({}); }} />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
              </div>
              <button className="btn btn-primary" onClick={handleSaveText} disabled={savingText} style={{ alignSelf: "flex-end" }}>
                {savingText ? "Saving…" : "Save Text"}
              </button>
            </div>
          </div>

          <div className="divider" style={{ margin: "0" }} />

          {/* Photo section */}
          <div>
            <div className="tag tag-accent" style={{ marginBottom: "14px" }}>Photo</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--bg-elevated)", border: "1px solid var(--border)", flexShrink: 0 }}>
                  {photoPreview ? (
                    <img src={photoPreview} alt="new" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : item.photo ? (
                    <img src={inventoryApi.photoUrl(item.id)} alt="current" style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={(e) => e.target.style.display = "none"} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-muted)" }}>▣</div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ flex: 1 }} />
              </div>
              {photoFile && (
                <button className="btn btn-primary" onClick={handleSavePhoto} disabled={savingPhoto} style={{ alignSelf: "flex-end" }}>
                  {savingPhoto ? "Uploading…" : "Upload Photo"}
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
