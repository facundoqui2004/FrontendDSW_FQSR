import { BrowserRouter, Routes ,Route } from "react-router-dom";


//PAGES
import { 
  // Páginas generales
  Home, 
  LoginPage, 
  RegisterPage,
  // Páginas de administrador
  HomeAdmin, 
  GestionarUsuarios, 
  GestionarMetahumanos, 
  GestionarBurocratas,
  Tramites,
  // Páginas de metahumanos
  HomeMeta, 
  TramitesMetaHumano, 
  CrearPoderes,
  // Páginas de burócratas
  HomeBurocrata
} from './pages';
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
            path="/meta/tramites" 
            element={
              <ProtectedRoute requiredRole="METAHUMANO">
                <TramitesMetaHumano />
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
