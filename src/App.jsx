  import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

  // PAGES
  import { 
    // 🌐 Generales
    Home, 
    LoginPage, 
    RegisterPage,

    // 👑 Admin
    HomeAdmin, 
    GestionarUsuarios, 
    GestionarMetahumanos, 
    GestionarBurocratas,
    Tramites,

    // 🧍 Metahumanos
    HomeMeta, 
    TramitesMetaHumano, 
    CrearPoderes,

    // 🧾 Burócratas
    HomeBurocrata,
    CarpetasList,
    CrearCarpeta,
    CarpetaDetalle
  } from './pages';

  import { AuthProvider } from './context/AuthContext';
  // import ProtectedRoute from './components/ProtectedRoute'; // si lo usás, lo vemos luego

  function App() {
    return (
      <BrowserRouter>
        <AuthProvider>
          <Routes>

            {/* 🌐 Generales */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 👑 Admin */}
            <Route path="/admin" element={<HomeAdmin />} />
            <Route path="/admin/usuarios" element={<GestionarUsuarios />} />
            <Route path="/admin/metahumanos" element={<GestionarMetahumanos />} />
            <Route path="/admin/burocratas" element={<GestionarBurocratas />} />
            <Route path="/admin/tramites" element={<Tramites />} />

            {/* 🧍 Metahumanos */}
            <Route path="/metahumano" element={<HomeMeta />} />
            <Route path="/metahumano/tramites" element={<TramitesMetaHumano />} />
            <Route path="/metahumano/poderes/crear" element={<CrearPoderes />} />

            {/* 🧾 Burócratas (ruta nueva y alias para compatibilidad) */}
            <Route path="/homeBurocrata" element={<HomeBurocrata />} />

            <Route path="/burocrata/carpetas" element={<CarpetasList />} />
            <Route path="/burocrata/carpeta/crear" element={<CrearCarpeta />} />
            <Route path="/burocrata/carpeta/:id" element={<CarpetaDetalle />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );
  }

  export default App;
