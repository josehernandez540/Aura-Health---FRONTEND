import React from "react";
import { useAuthStore } from "../../../features/auth/store/auth.store.js";
import { SIDEBAR_CONFIG } from "./sidebar.config";
import { NavLink } from "react-router-dom";
import "./sidebar.css";

const Sidebar = () => {
  const { role, logout, userId } = useAuthStore();

  return (
    <aside className="sidebar">
      {/* 🔹 BRAND */}
      <div className="brand">
        <div className="brand-icon">
          <img src="/assets/logo.png" height="30" />
        </div>
        <div className="brand-text">
          <h1>Aura Health</h1>
          <span>Sistema Clínico</span>
        </div>
      </div>

      <nav className="nav">
        {SIDEBAR_CONFIG.map((section) => {
          if (!section.roles.includes(role)) return null;

          return (
            <div className="nav-section" key={section.label}>
              <div className="nav-section-label">{section.label}</div>

              {section.items.map((item) => (
                <NavLink
                  to={item.path}
                  key={item.path}
                  className={({ isActive }) =>
                    `nav-item ${isActive ? "active" : ""}`
                  }
                >
                  <span className="icon">
                    <img
                      src={`/icons/${item.icon}`}
                      alt=""
                      className="icon-img"
                    />
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-card">
          <div className="avatar">{role?.slice(0, 2)}</div>

          <div className="user-info">
            <div className="user-name">{userId}</div>
            <div className="user-role">Rol: {role}</div>
          </div>

          <button onClick={logout}>
            <img src='/icons/left.svg' alt="" className="icon-img" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
