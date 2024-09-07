import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { GoogleOAuthProvider } from "@react-oauth/google"

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId="162355479740-223hnabmgsj1uaaeqoe6s9hqe5fvp0be.apps.googleusercontent.com">
  <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>
)