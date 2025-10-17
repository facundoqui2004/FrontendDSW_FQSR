import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCarpetaByIdRequest, patchCarpetaEstadoRequest } from "../../api/carpetas";
import { createEvidenciaRequest, deleteEvidenciaRequest } from "../../api/evidencias";
import { createMultaRequest, deleteMultaRequest } from "../../api/multas";
import BurocrataLayout from "../../components/layouts/BurocrataLayout";

export default function CarpetaDetalle() {
  const { id } = useParams();
  const [carpeta, setCarpeta] = useState(null);
  const [loading, setLoading] = useState(true);

  // Evidencia
  const [descripcion, setDescripcion] = useState("");
  const [fechaRecoleccion, setFechaRecoleccion] = useState("");

  // Actualizar estado carpeta
  const [estadoEdit, setEstadoEdit] = useState("");
  const [savingEstado, setSavingEstado] = useState(false);

  // Multas (por evidencia)
  const [multaForms, setMultaForms] = useState({});

  const fetchCarpeta = async () => {
    try {
      const res = await getCarpetaByIdRequest(id);
      const c = res.data.data || res.data;
      setCarpeta(res.data.data || res.data);
      setCarpeta(c);
      setEstadoEdit(c?.estado || "activa");
    } catch (err) {
      console.error("❌ Error al obtener carpeta:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarpeta();
  }, [id]);

  // Cambiar estado carpeta
  const handleGuardarEstado = async () => {
    try {
      if (!carpeta) return;
      if (estadoEdit === carpeta.estado) return;

      setSavingEstado(true);
      await patchCarpetaEstadoRequest(carpeta.id, estadoEdit);

      await fetchCarpeta();

    } catch (err) {
      console.error("❌ Error al actualizar estado:", err);
      alert("No se pudo actualizar el estado.");
    } finally {
      setSavingEstado(false);
    }
  };

  // 📝 Crear evidencia
  const handleCrearEvidencia = async (e) => {
    e.preventDefault();
    try {
      await createEvidenciaRequest({
        descripcion,
        fechaRecoleccion,
        carpetaId: id,
      });
      setDescripcion("");
      setFechaRecoleccion("");
      fetchCarpeta();
    } catch (err) {
      console.error("❌ Error al crear evidencia:", err);
    }
  };


  
  // 🗑️ Eliminar evidencia
  const handleEliminarEvidencia = async (evidenciaId) => {
    if (!confirm("¿Eliminar esta evidencia?")) return;
    try {
      await deleteEvidenciaRequest(evidenciaId);
      fetchCarpeta();
    } catch (err) {
      console.error("❌ Error al eliminar evidencia:", err);
    }
  };

  // 📌 Cambiar campos de multa
  const handleMultaChange = (evidenciaId, field, value) => {
    setMultaForms(prev => ({
      ...prev,
      [evidenciaId]: {
        ...prev[evidenciaId],
        [field]: value,
      },
    }));
  };

  // 📝 Crear multa
  const handleCrearMulta = async (e, evidenciaId) => {
    e.preventDefault();
    const formData = multaForms[evidenciaId];
    if (!formData) return;

    try {
      await createMultaRequest({
        ...formData,
        montoMulta: Number(formData.montoMulta),
        evidenciaId: evidenciaId,
        estado: "PENDIENTE", // 🟡 Estado por defecto al crear multa
      });

      setMultaForms(prev => ({
        ...prev,
        [evidenciaId]: {
          motivoMulta: "",
          montoMulta: "",
          lugarDePago: "",
          fechaEmision: "",
          fechaVencimiento: "",
          estado: "",
        },
      }));

      fetchCarpeta();
      alert("✅ Multa creada exitosamente con estado PENDIENTE");
    } catch (err) {
      console.error("❌ Error al crear multa:", err);
      alert("❌ Error al crear la multa: " + err.message);
    }
  };

  // 🗑️ Eliminar multa
  const handleEliminarMulta = async (multaId) => {
    if (!confirm("¿Eliminar esta multa?")) return;
    try {
      await deleteMultaRequest(multaId);
      fetchCarpeta();
    } catch (err) {
      console.error("❌ Error al eliminar multa:", err);
    }
  };

  if (loading) {
    return (
      <BurocrataLayout>
        <p className="p-6 text-white">Cargando...</p>
      </BurocrataLayout>
    );
  }

  if (!carpeta) {
    return (
      <BurocrataLayout>
        <p className="p-6 text-white">No se encontró la carpeta solicitada.</p>
      </BurocrataLayout>
    );
  }

  return (
    <BurocrataLayout>
      <div className="p-6 text-white flex flex-col items-center">
        <div className="w-full max-w-2xl">

          {/* 🟡 Cabecera */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl">📁</span>
            <h1 className="text-3xl font-extrabold text-white drop-shadow">
              Detalle de Carpeta #{carpeta.id}
            </h1>
          </div>

          {/* 🧾 Panel de datos */}
          <div className="bg-[#2e2e2e] rounded-xl shadow-xl p-5 mb-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-6">
              <div>
                <p className="text-gray-300 text-sm font-semibold uppercase tracking-wide">
                  Descripción
                </p>
                <p className="text-white text-base">{carpeta.descripcion}</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm font-semibold uppercase tracking-wide">
                  Estado
                </p>
                <p className="text-white text-base">
                  Actual: <span className="capitalize">{carpeta.estado}</span>
                </p>
                <br></br>
                <div className="flex items-center gap-2">
                  <select
                    value={estadoEdit}
                    onChange={(e) => setEstadoEdit(e.target.value)}
                    className="p-2 rounded bg-[#1a1a1a] text-white"
                  >
                    <option value="activa">Activa</option>
                    <option value="pendiente">Pendiente</option>
                    <option value="cerrada">Cerrada</option>
                  </select>
                  <button
                    onClick={handleGuardarEstado}
                    disabled={savingEstado || estadoEdit === carpeta.estado}
                    className={`px-3 py-1 rounded font-semibold transition ${
                      savingEstado || estadoEdit === carpeta.estado
                        ? "bg-gray-600 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {savingEstado ? "Guardando..." : "Guardar"}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-gray-300 text-sm font-semibold uppercase tracking-wide">
                  Tipo
                </p>
                <p className="text-white text-base capitalize">{carpeta.tipo}</p>
              </div>
              <div>
                <p className="text-gray-300 text-sm font-semibold uppercase tracking-wide">
                  ID Carpeta
                </p>
                <p className="text-white text-base">{carpeta.id}</p>
              </div>
            </div>
          </div>

          {/* ✍️ Formulario evidencia */}
          <div className="bg-[#2e2e2e] rounded-xl shadow-xl p-5 mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              ✍️ Nueva Evidencia
            </h2>
            <form onSubmit={handleCrearEvidencia} className="space-y-3">
              <div>
                <label className="block mb-1 font-semibold">Descripción</label>
                <input
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  className="w-full p-2 rounded bg-[#1a1a1a] text-white placeholder-gray-400"
                  placeholder="Descripción de la evidencia"
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-semibold">Fecha de Recolección</label>
                <input
                  type="date"
                  value={fechaRecoleccion}
                  onChange={(e) => setFechaRecoleccion(e.target.value)}
                  className="w-full p-2 rounded bg-[#1a1a1a] text-white"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold"
              >
                Crear Evidencia
              </button>
            </form>
          </div>

          {/* 📜 Lista de evidencias */}
          {carpeta.evidencias?.length > 0 ? (
            <ul className="space-y-6">
              {carpeta.evidencias.map((ev) => (
                <li key={ev.id} className="bg-[#2e2e2e] p-5 rounded-xl shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-semibold text-lg">{ev.descripcion}</p>
                      <p className="text-sm text-gray-400">{ev.fechaRecoleccion}</p>
                    </div>
                    <button
                      onClick={() => handleEliminarEvidencia(ev.id)}
                      className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                    >
                      Eliminar
                    </button>
                  </div>

                  {/* 💰 Multas */}
                  <div className="border-t border-gray-600 pt-3 mt-3">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      💰 Multas
                    </h3>

                    {ev.multas?.length > 0 ? (
                      <ul className="space-y-2 mb-4">
                        {ev.multas.map((m) => (
                          <li key={m.id} className="bg-[#3a3a3a] p-3 rounded flex justify-between">
                            <div>
                              <p className="font-semibold">{m.motivoMulta}</p>
                              <p className="text-sm text-gray-300">
                                ${m.montoMulta} — {m.lugarDePago}
                              </p>
                            </div>
                            <button
                              onClick={() => handleEliminarMulta(m.id)}
                              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded"
                            >
                              Eliminar
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-white/70 mb-4">No hay multas.</p>
                    )}

                    {/* ➕ Crear multa */}
                    <form
                      onSubmit={(e) => handleCrearMulta(e, ev.id)}
                      className="space-y-2"
                    >
                      <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3 mb-3">
                        <p className="text-yellow-200 text-sm flex items-center gap-2">
                          <span>⏳</span>
                          <span>La multa se creará con estado <strong>PENDIENTE</strong> y debe ser aprobada por un administrador</span>
                        </p>
                      </div>
                      <input
                        type="text"
                        placeholder="Motivo de la multa"
                        value={multaForms[ev.id]?.motivoMulta || ""}
                        onChange={(e) =>
                          handleMultaChange(ev.id, "motivoMulta", e.target.value)
                        }
                        className="w-full p-2 rounded bg-[#1a1a1a] text-white"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Monto"
                        value={multaForms[ev.id]?.montoMulta || ""}
                        onChange={(e) =>
                          handleMultaChange(ev.id, "montoMulta", e.target.value)
                        }
                        className="w-full p-2 rounded bg-[#1a1a1a] text-white"
                      />
                      <input
                        type="text"
                        placeholder="Lugar de pago"
                        value={multaForms[ev.id]?.lugarDePago || ""}
                        onChange={(e) =>
                          handleMultaChange(ev.id, "lugarDePago", e.target.value)
                        }
                        className="w-full p-2 rounded bg-[#1a1a1a] text-white"
                        required
                      />
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <label className="block text-sm mb-1 text-gray-300">
                            Fecha de emisión
                          </label>
                          <input
                            type="date"
                            value={multaForms[ev.id]?.fechaEmision || ""}
                            onChange={(e) =>
                              handleMultaChange(ev.id, "fechaEmision", e.target.value)
                            }
                            className="w-full p-2 rounded bg-[#1a1a1a] text-white"
                            required
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm mb-1 text-gray-300">
                            Fecha de vencimiento
                          </label>
                          <input
                            type="date"
                            value={multaForms[ev.id]?.fechaVencimiento || ""}
                            onChange={(e) =>
                              handleMultaChange(ev.id, "fechaVencimiento", e.target.value)
                            }
                            className="w-full p-2 rounded bg-[#1a1a1a] text-white"
                            required
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded font-semibold"
                      >
                        Crear Multa
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-white/70">No hay evidencias asociadas.</p>
          )}
        </div>
      </div>
    </BurocrataLayout>
  );
}
