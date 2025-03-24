import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'


const setFavicon = (faviconPath) => {
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = faviconPath;
  document.head.appendChild(link);
};

setFavicon('/src/assets/icons8-law-100 (1).png'); // Path relative to the public folder

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
