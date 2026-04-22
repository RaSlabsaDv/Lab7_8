import { useState, useEffect } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("warehouse_favorites") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("warehouse_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggle = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const isFavorite = (id) => favorites.includes(id);

  const remove = (id) => setFavorites((prev) => prev.filter((f) => f !== id));

  return { favorites, toggle, isFavorite, remove };
}
