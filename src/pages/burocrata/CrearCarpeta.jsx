import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createCarpetaRequest } from "../../api/carpetas";
import BurocrataLayout from "../../components/layouts/BurocrataLayout";

export default function CrearCarpeta() {
  const [titulo, setTitulo] = useState("");
  const [estado, setEstado] = useState("activa");
  const [metahumanoId, setMetahumanoId] = useState("");
  const [tipo, setTipo] = useState("general"); // 👈 valor por defecto
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await createCarpetaRequest({
        descripcion: titulo,
        estado: estado,
        tipo: tipo,
        metahumanoId: Number(metahumanoId),
      });
      alert("✅ Carpeta creada con éxito");
      navigate("/burocrata/carpetas");
    } catch (err) {
      console.error("❌ Error al crear carpeta:", err);
    }
  };

  return (
    <BurocrataLayout>
  <div className="flex justify-center items-center p-6 min-h-[calc(100vh-100px)]">
    <div className="bg-[#2E2E2E]/90 backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-lg p-8 text-white">
      {/* Encabezado */}
      <h1 className="text-3xl font-extrabold mb-6 text-center flex items-center justify-center gap-2">
        ➕ Nueva Carpeta
      </h1>

      {/* Formulario */}
      <form onSubmit={handleCreate} className="space-y-5">
        {/* Descripción */}
        <div>
          <label className="block mb-1 font-semibold">Descripción</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1F1F1F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            placeholder="Ingrese la descripción"
            required
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block mb-1 font-semibold">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1F1F1F] text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          >
            <option value="activa">Activa</option>
            <option value="pendiente">Pendiente</option>
            <option value="cerrada">Cerrada</option>
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label className="block mb-1 font-semibold">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1F1F1F] text-white focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
          >
            <option value="general">General</option>
            <option value="penal">Penal</option>
            <option value="civil">Civil</option>
            <option value="metahumano">Metahumano</option>
          </select>
        </div>

        {/* Metahumano ID */}
        <div>
          <label className="block mb-1 font-semibold">ID del Metahumano</label>
          <input
            type="number"
            value={metahumanoId}
            onChange={(e) => setMetahumanoId(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#1F1F1F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
            placeholder="Ingrese el ID del Metahumano"
            required
          />
        </div>

        {/* Botón */}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-blue-600/40 transition"
          >
            Crear
          </button>
        </div>
      </form>
    </div>
  </div>
</BurocrataLayout>

  );
}
