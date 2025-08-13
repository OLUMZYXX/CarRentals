import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

const clientId =
  '1089297983125-lc4bs9kg0ragaapip9hcl3aqeve5jodo.apps.googleusercontent.com'

ReactDOM.createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={clientId}>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
)
