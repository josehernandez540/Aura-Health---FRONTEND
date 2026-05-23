import { Outlet } from "react-router-dom";
import SessionGuard from "../SessionGuard";
import Sidebar from "./Sidebar";
 
const MainLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      <SessionGuard />
      <Sidebar />
      <main style={{ flex: 1, marginLeft: '220px', minHeight: '100vh' }}>
        <Outlet />
      </main>
    </div>
  );
};
 
export default MainLayout;