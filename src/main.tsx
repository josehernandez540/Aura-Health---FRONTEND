import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import "./index.css";
import "./App.css";
import { router } from "./app/router";
import {App} from './App.tsx'

try {
  const stored = JSON.parse(localStorage.getItem('theme-storage') ?? 'null');
  if (stored?.state?.theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  }
} catch {
  // ignore malformed/missing storage, defaults to dark
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
