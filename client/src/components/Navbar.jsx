import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";

export function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarInner}>
        <NavLink to="/" className={styles.navbarLogo}>
          <span className={styles.logoIcon}>▣</span>
          <span className={styles.logoText}>Адмінка + галерейка</span>
          <span className={styles.logoTag}>SYS</span>
        </NavLink>
        <div className={styles.navbarLinks}>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `${styles.navLink}${isActive ? ` ${styles.active}` : ""}`
            }
          >
            Адмінка
          </NavLink>
          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              `${styles.navLink}${isActive ? ` ${styles.active}` : ""}`
            }
          >
            Галерейка
          </NavLink>
          <NavLink
            to="/favorites"
            className={({ isActive }) =>
              `${styles.navLink} ${styles.navLinkFav}${isActive ? ` ${styles.active}` : ""}`
            }
          >
            ❤ Улюблені
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
