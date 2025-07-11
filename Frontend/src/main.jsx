import CssBaseline from '@mui/material/CssBaseline'
import ToastWrapper from './components/Toastify/ToastWrapper.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
// import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'
import theme from './theme'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
  <CssVarsProvider theme={theme}>
    <CssBaseline />
    <App />
    <ToastWrapper />
  </CssVarsProvider>
  // </React.StrictMode>
)
