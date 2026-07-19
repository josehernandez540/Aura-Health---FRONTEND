import React from 'react';
import Sidebar from '../SideBar/Sidebar';
import Navbar from '../NavBar/Navbar';
import { useSidebarStore } from '../../../store/sidebar.store';
import ProductTourTrigger from '../../../features/tour/ProductTourTrigger';
import './MainLayout.css';

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  const collapsed = useSidebarStore((state) => state.collapsed);

  return (
    <div className={`app ${collapsed ? "sidebar-collapsed" : ""}`}>
      <ProductTourTrigger />
      <Sidebar />

      <main className="main">
        <Navbar />

        <div className="page">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;