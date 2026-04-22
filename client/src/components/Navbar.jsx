import { NavLink } from "react-router-dom";
import "./Navbar.css";

export function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-logo">
          <span className="logo-icon">▣</span>
          <span className="logo-text">Адмінка + галерейка</span>
          <span className="logo-tag">SYS</span>
        </NavLink>
        <div className="navbar-links">
          <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Адмінка
          </NavLink>
          <NavLink to="/gallery" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}>
            Галерейка
          </NavLink>
          <NavLink to="/favorites" className={({ isActive }) => `nav-link nav-link-fav ${isActive ? "active" : ""}`}>
            ❤ Улюблені
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
