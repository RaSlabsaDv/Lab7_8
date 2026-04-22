import { createContext, useContext, useState, useEffect } from 'react';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('wh_favorites') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('wh_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = (id) => favorites.some(f => f.id === id);

  const toggleFavorite = (item) => {
    setFavorites(prev =>
      prev.some(f => f.id === item.id)
        ? prev.filter(f => f.id !== item.id)
        : [...prev, item]
    );
  };

  const removeFavorite = (id) => setFavorites(prev => prev.filter(f => f.id !== id));

  return (
    <FavoritesContext.Provider value={{ favorites, isFavorite, toggleFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be inside FavoritesProvider');
  return ctx;
};
