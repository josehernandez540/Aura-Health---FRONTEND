import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import { useUIStore } from "./store/ui.store.js";
import ToastStack from "./components/common/Toast/ToastStack";

export function App() {

  return (
    <>
      <RouterProvider router={router} />
      <ToastStack />
    </>
  );
}