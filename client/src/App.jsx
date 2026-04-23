import { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import AdminInventory from './pages/AdminInventory.jsx';
import AdminInventoryCreate from './pages/AdminInventoryCreate.jsx';
import AdminInventoryEdit from './pages/AdminInventoryEdit.jsx';
import AdminInventoryDetails from './pages/AdminInventoryDetails.jsx';
import Gallery from './pages/Gallery.jsx';
import Favorites from './pages/Favorites.jsx';
import { useFavorites } from './store/FavoritesContext.jsx';
import styles from './styles/App.module.css';

export default function App() {
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className={styles.app}>
      <nav className={styles.navbar} ref={navRef}>
        <div className={styles.navbarBrand}>
          <span className={styles.brandIcon}>▣</span>
          <span>WAREHOUSE</span>
        </div>

        <button
          className={`${styles.navBurger}${menuOpen ? ` ${styles.open}` : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <div className={`${styles.navbarLinks}${menuOpen ? ` ${styles.open}` : ''}`}>
          <NavLink
            to="/gallery"
            className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`}
          >
            <span>◫ Gallery</span>
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`}
          >
            <span>♥ Favorites</span>
            {favorites.length > 0 && <span className={styles.navBadge}>{favorites.length}</span>}
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) => `${styles.navLink}${isActive ? ` ${styles.active}` : ''}`}
          >
            <span>⚙ Admin</span>
          </NavLink>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<Gallery />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/admin" element={<AdminInventory />} />
          <Route path="/admin/create" element={<AdminInventoryCreate />} />
          <Route path="/admin/edit/:id" element={<AdminInventoryEdit />} />
          <Route path="/admin/details/:id" element={<AdminInventoryDetails />} />
        </Routes>
      </main>
    </div>
  );
}
