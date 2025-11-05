  import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

  // PAGES
  import { 
    // Generales
    Home, 
    LoginPage, 
    RegisterPage,

    // Admin
    HomeAdmin, 
    GestionarUsuarios, 
    GestionarMetahumanos, 
    GestionarBurocratas,
    Tramites,
    MiPerfil as MiPerfilAdmin,
    Soporte as SoporteAdmin,

    // Metahumanos
    HomeMeta, 
    TramitesMetaHumano, 
    CarpetasMeta,
    CrearPoderes,
    SoporteMeta,

    // Burócratas
    HomeBurocrata,
    CarpetasList,
    CrearCarpeta,
    CarpetaDetalle,
    SoporteBuro

  } from './pages';
  import MiPerfilBuro from './pages/burocrata/MiPerfil';
  import MiPerfilMeta from './pages/meta/PerfilMeta';
  // Importar componentes adicionales
  import GestionarPoderes from './pages/admin/tramites/gestionar-poderes';
  import GestionarMultas from './pages/admin/tramites/gestionar-multas';

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
            <Route path="/admin/tramites/crear-poderes" element={<CrearPoderes />} />
            <Route path="/admin/tramites/gestionar-poderes" element={<GestionarPoderes />} />
            <Route path="/admin/tramites/gestionar-multas" element={<GestionarMultas />} />
            <Route path="/admin/perfil" element={<MiPerfilAdmin />} />
            <Route path="/admin/soporte" element={<SoporteAdmin />} />

            {/* 🧍 Metahumanos */}
            <Route path="/metahumano" element={<HomeMeta />} />
            <Route path="/metahumano/tramites" element={<TramitesMetaHumano />} />
            <Route path="/metahumano/carpetas" element={<CarpetasMeta />} />
            <Route path="/metahumano/poderes/crear" element={<CrearPoderes />} />
            <Route path="/metahumano/soporte" element={<SoporteMeta/>}/>
            <Route path="/metahumano/perfil" element={<MiPerfilMeta/>}/>

            {/* 🧾 Burócratas (ruta nueva y alias para compatibilidad) */}
            <Route path="/homeBurocrata" element={<HomeBurocrata />} />
            <Route path="/burocrata/carpetas" element={<CarpetasList />} />
            <Route path="/burocrata/carpeta/crear" element={<CrearCarpeta />} />
            <Route path="/burocrata/carpeta/:id" element={<CarpetaDetalle />} />
            <Route path="/burocrata/perfil" element = {<MiPerfilBuro />}/>
            <Route path="/burocrata/soporte" element={<SoporteBuro />}/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    );
  }

  export default App;
