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
  const location = useLocation();

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">▣</span>
          <span className="brand-text">WAREHOUSE</span>
        </div>
        <div className="navbar-links">
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>⚙</span> Admin
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>◫</span> Gallery
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            <span>♥</span> Favorites
            {favorites.length > 0 && <span className="nav-badge">{favorites.length}</span>}
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
