import { BrowserRouter, Routes ,Route } from "react-router-dom";


//PAGES
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Home from './pages/home'; 
import HomeMeta from './pages/homeMeta';
import HomeBurocrata from './pages/homeBurocrata'; 
import HomeAdmin from './pages/homeAdmin';
import GestionarUsuarios from './pages/GestionarUsuarios';
import GestionarMetahumanos from './pages/GestionarMetahumanos';
import GestionarBurocratas from './pages/GestionarBurocratas';
import Tramites from './pages/Tramites';
import CrearPoderes from './pages/tramites/CrearPoderes';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={ <RegisterPage /> } />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Rutas protegidas */}
          <Route 
            path="/homeMeta" 
            element={
              <ProtectedRoute requiredRole="METAHUMANO">
                <HomeMeta />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/homeBurocrata" 
            element={
              <ProtectedRoute requiredRole="BUROCRATA">
                <HomeBurocrata />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/homeAdmin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <HomeAdmin />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/gestionar-usuarios" 
            element={
              <ProtectedRoute requiredRole="admin">
                <GestionarUsuarios />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/gestionar-metahumanos" 
            element={
              <ProtectedRoute requiredRole="admin">
                <GestionarMetahumanos />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/gestionar-burocratas" 
            element={
              <ProtectedRoute requiredRole="admin">
                <GestionarBurocratas />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/tramites" 
            element={
              <ProtectedRoute requiredRole="admin">
                <Tramites />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/tramites/crear-poderes" 
            element={
              <ProtectedRoute requiredRole="admin">
                <CrearPoderes />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
