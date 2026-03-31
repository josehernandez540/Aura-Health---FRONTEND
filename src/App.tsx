import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./app/router";
import ToastStack from "./components/common/Toast/ToastStack";

export function App(): React.JSX.Element {
  return (
    <>
      <RouterProvider router={router} />
      <ToastStack />
    </>
  );
}