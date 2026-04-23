import { useState, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useLocation } from 'react-router-dom';
import AdminInventory from './pages/AdminInventory.jsx';
import AdminInventoryCreate from './pages/AdminInventoryCreate.jsx';
import AdminInventoryEdit from './pages/AdminInventoryEdit.jsx';
import AdminInventoryDetails from './pages/AdminInventoryDetails.jsx';
import Gallery from './pages/Gallery.jsx';
import Favorites from './pages/Favorites.jsx';
import { useFavorites } from './store/FavoritesContext.jsx';
import './styles/app.css';

export default function App() {
  const { favorites } = useFavorites();
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef(null);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, [location]);

  // Close menu on outside click
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
    <div className="app">
      <nav className="navbar" ref={navRef}>
        <div className="navbar-brand">
          <span className="brand-icon">▣</span>
          <span className="brand-text">WAREHOUSE</span>
        </div>

        <button
          className={`nav-burger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>◫ Gallery</span>
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>♥ Favorites</span>
            {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
          </NavLink>
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>⚙ Admin</span>
          </NavLink>
        </div>
      </nav>

      <main className="main-content">
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