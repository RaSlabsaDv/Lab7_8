import { inventoryApi } from "../../services/inventoryApi";

export function InventoryDetails({ item, onClose }) {
  if (!item) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">{item.inventory_name}</span>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div style={{ aspectRatio: "1", borderRadius: "var(--radius)", overflow: "hidden", background: "var(--bg-elevated)", border: "1px solid var(--border)" }}>
            {item.photo ? (
              <img src={inventoryApi.photoUrl(item.id)} alt={item.inventory_name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "48px", color: "var(--text-muted)" }}>▣</div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <div className="form-label" style={{ marginBottom: "6px" }}>ID</div>
              <code style={{ fontSize: "11px", color: "var(--text-muted)", fontFamily: "var(--font-mono)" }}>{item.id}</code>
            </div>
            <div>
              <div className="form-label" style={{ marginBottom: "6px" }}>Name</div>
              <div style={{ fontWeight: "700", fontSize: "18px" }}>{item.inventory_name}</div>
            </div>
            {item.description && (
              <div>
                <div className="form-label" style={{ marginBottom: "6px" }}>Description</div>
                <div style={{ color: "var(--text-dim)", fontSize: "14px", lineHeight: "1.6" }}>{item.description}</div>
              </div>
            )}
            <div>
              <div className="form-label" style={{ marginBottom: "6px" }}>Created</div>
              <div style={{ color: "var(--text-muted)", fontSize: "13px", fontFamily: "var(--font-mono)" }}>
                {new Date(item.created_at).toLocaleString()}
              </div>
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
