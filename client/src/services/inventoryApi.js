const BASE = '/inventory';

export const getInventory = async () => {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error('Failed to fetch inventory');
  return res.json();
};

export const getInventoryItem = async (id) => {
  const res = await fetch(`${BASE}/${id}`);
  if (!res.ok) throw new Error('Not found');
  return res.json();
};

export const createInventory = async (formData) => {
  const res = await fetch('/register', { method: 'POST', body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Create failed');
  }
  return res.json();
};

export const updateInventory = async (id, data) => {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Update failed');
  }
  return res.json();
};

export const updateInventoryPhoto = async (id, formData) => {
  const res = await fetch(`${BASE}/${id}/photo`, { method: 'PUT', body: formData });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Photo update failed');
  }
  return res.json();
};

export const deleteInventory = async (id) => {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete failed');
};

export const getPhotoUrl = (id) => `/inventory/${id}/photo`;
