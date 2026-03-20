import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div>
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