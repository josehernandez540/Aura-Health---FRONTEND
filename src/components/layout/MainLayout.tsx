import { Outlet } from "react-router-dom";
import SessionGuard from "../SessionGuard";

const MainLayout = () => {
  return (
    <div>
      <SessionGuard />
      <header>
        <h1>Aura Health</h1>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;