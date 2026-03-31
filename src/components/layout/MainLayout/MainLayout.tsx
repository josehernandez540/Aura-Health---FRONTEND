import React from 'react';
import Sidebar from '../SideBar/Sidebar';
import Navbar from '../NavBar/Navbar';
import './MainLayout.css';

interface Props {
  children: React.ReactNode;
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="app">
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