import { Component, StrictMode } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Providers
import BackendProvider from './providers/BackendProvider'
import LocalizationProvider from './providers/LocalizationProvider'

// Pages
import CockpitPage from './pages/CockpitPage'
import LoginPage from './pages/LoginPage'
import ListPage from './pages/ListPage'
import ErrorPage from './pages/ErrorPage'
import SupplierPage from './pages/masters/Supplier/Supplier'

// Components
import RequireAuth from './components/RequireAuth'

class App extends Component {
  render() {
    return (
      <BackendProvider>
        <LocalizationProvider>
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <RequireAuth>
                    <CockpitPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/:doctypeSlug/list"
                element={
                  <RequireAuth>
                    <ListPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/suppliers/:name"
                element={
                  <RequireAuth>
                    <SupplierPage />
                  </RequireAuth>
                }
              />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </BrowserRouter>
        </LocalizationProvider>
      </BackendProvider>
    )
  }
}

export default App
