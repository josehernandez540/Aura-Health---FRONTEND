import { Outlet } from "react-router-dom";
import SessionGuard from "../SessionGuard";

const MainLayout = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      <SessionGuard />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;