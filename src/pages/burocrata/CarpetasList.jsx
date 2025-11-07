import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteCarpetaRequest } from "../../api/carpetas";
import { getCarpetasByBurocrataId } from "../../api/burocratas";
import BurocrataLayout from "../../components/layouts/BurocrataLayout";
import { getMe } from "../../api/usuarios";

export default function CarpetasList() {
  const [carpetas, setCarpetas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await getMe();
        const u = data?.data;
        console.log(u);
        if (u.role !== "BUROCRATA" || !u.perfilId) {
          alert("Debés iniciar sesión como BUROCRATA.");
          return;
        }
        const carpetasBuro = await getCarpetasByBurocrataId(u.perfilId);
        setCarpetas(carpetasBuro.data.data);
      } catch (e) {
        console.error("No se pudo obtener /usuarios/me", e);
        alert("Iniciá sesión para continuar.");
      }finally{
        setLoading(false)
      }
    })();
  }, []);
   

  const handleDelete = async (id) => {
    if (confirm("¿Estás seguro de eliminar esta carpeta?")) {
      await deleteCarpetaRequest(id);
      setCarpetas(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <BurocrataLayout>
  <div className="p-6 text-white">
    {/* Encabezado centrado */}
    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 text-center sm:text-left">
      <h1 className="text-3xl font-extrabold flex items-center gap-2 mb-4 sm:mb-0">
        📂 Carpetas
      </h1>
      <button
        onClick={() => navigate("/burocrata/carpeta/crear")}
        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg text-sm font-semibold shadow-lg hover:shadow-blue-600/40 transition"
      >
        + Nueva Carpeta
      </button>
    </div>

    {/* Lista de carpetas */}
    {loading ? (
      <p className="text-white/70 text-center">Cargando...</p>
    ) : carpetas.length === 0 ? (
      <p className="text-white/70 text-center">No hay carpetas registradas.</p>
    ) : (
      <ul className="space-y-4 max-w-3xl mx-auto">
        {carpetas.map(c => (
          <li
            key={c.id}
            className="flex justify-between items-center bg-[#2E2E2E] p-4 rounded-xl shadow-md hover:shadow-lg transition"
          >
            <span className="truncate max-w-[65%] font-medium">
              {c.descripcion || `Carpeta ${c.id}`}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/burocrata/carpeta/${c.id}`)}
                className="bg-green-600 hover:bg-green-700 px-4 py-1.5 rounded-lg text-sm font-semibold shadow hover:shadow-green-600/30 transition"
              >
                Ver
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="bg-red-600 hover:bg-red-700 px-4 py-1.5 rounded-lg text-sm font-semibold shadow hover:shadow-red-600/30 transition"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
</BurocrataLayout>

  );
}
