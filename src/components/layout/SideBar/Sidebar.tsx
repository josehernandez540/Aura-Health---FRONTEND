import React from "react";
import { useAuthStore } from "../../../features/auth/store/auth.store";
import { useSidebarStore } from "../../../store/sidebar.store";
import { SIDEBAR_CONFIG } from "./sidebar.config";
import { NavLink } from "react-router-dom";
import './sidebar.css';

const Sidebar: React.FC = () => {
  const { role, logout, userId } = useAuthStore();
  const { collapsed, toggleCollapsed } = useSidebarStore();

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="brand">
        <div className="brand-icon">
          <img src="/assets/logo.png" height="30" alt="Aura Logo" />
        </div>
        <div className="brand-text">
          <h1>Aura Health</h1>
          <span>Sistema Clínico</span>
        </div>

        <button
          className="sidebar-toggle"
          data-tour="sidebar-toggle"
          onClick={toggleCollapsed}
          title={collapsed ? "Expandir menú" : "Colapsar menú"}
          aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <img
            src={`/icons/${collapsed ? "bars-3-bottom-right" : "bars-3"}.svg`}
            alt=""
            className="icon-img"
          />
        </button>
      </div>

      <nav className="nav">
        {SIDEBAR_CONFIG.map((section) => {
          if (!role || !section.roles.includes(role)) return null;

          return (
            <div className="nav-section" key={section.label}>
              <div className="nav-section-label">{section.label}</div>

              {section.items.map((item) => (
                <NavLink
                  to={item.path}
                  key={item.path}
                  data-tour={`nav-${item.path}`}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <span className="icon">
                    <img
                      src={`/icons/${item.icon}`}
                      alt=""
                      className="icon-img"
                    />
                  </span>
                  <span className="nav-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-card" title={collapsed ? `${userId ?? "Usuario"} · Rol: ${role}` : undefined}>
          <div className="avatar">
            {role ? role.slice(0, 2).toUpperCase() : '??'}
          </div>

          <div className="user-info">
            <div className="user-name">{userId || 'Usuario'}</div>
            <div className="user-role">Rol: {role}</div>
          </div>

          <button onClick={() => logout()} title="Cerrar Sesión">
            <img src='/icons/left.svg' alt="Logout" className="icon-img" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
