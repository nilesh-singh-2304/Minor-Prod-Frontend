import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import routes from './routes/AppRouter.jsx'
import { ThemeProvider } from './theme-provider.jsx'

createRoot(document.getElementById('root')).render(
  <ThemeProvider attribute="class" defaultTheme="dark">
    <RouterProvider router={routes} />
  </ThemeProvider>
)
