import { FaPhoneAlt, FaEnvelope, FaHeadset, FaQuestionCircle } from "react-icons/fa";
import { MdSupportAgent, MdOutlineForum } from "react-icons/md";
import BurocrataLayout from "../../components/layouts/BurocrataLayout";

export default function SoporteBuro() {
  return (
    <BurocrataLayout>
      {/* 🏛️ Encabezado */}
      <section className="text-center text-white mt-8 mb-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-2">
          🛠️ Centro de Soporte
        </h1>
        <p className="opacity-90 text-base">
          Accedé a ayuda, contactate con el equipo técnico o consultá nuestras guías rápidas.
        </p>
      </section>

      {/* 📦 Contenedor principal */}
      <div className="max-w-3xl mx-auto bg-[#1e293b]/80 backdrop-blur-md rounded-2xl p-8 text-white shadow-xl border border-white/10 mt-20 space-y-10">
        
        {/* Sección de contacto directo */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-400">
            <MdSupportAgent className="text-2xl" /> Contacto directo
          </h2>
          <p className="text-white/80 mb-4">
            Si necesitás asistencia inmediata o tenés problemas técnicos con el sistema, podés comunicarte con nosotros por los siguientes medios:
          </p>

          <div className="bg-white/10 p-5 rounded-xl space-y-4">
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-amber-300 text-lg" />
              <p><strong>Teléfono:</strong> +54 11 4321-7788</p>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-amber-300 text-lg" />
              <p><strong>Email:</strong> soporte@metagov.org</p>
            </div>
            <div className="flex items-center gap-3">
              <FaHeadset className="text-amber-300 text-lg" />
              <p><strong>Horario de atención:</strong> Lunes a Viernes de 8:00 a 18:00 hs</p>
            </div>
          </div>
        </section>

        {/* Preguntas frecuentes */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-400">
            <FaQuestionCircle className="text-2xl" /> Preguntas frecuentes
          </h2>
          <ul className="space-y-4">
            <li className="bg-white/10 p-5 rounded-xl hover:bg-white/15 transition">
              <strong>¿Cómo recupero mi contraseña?</strong>
              <p className="text-white/70 text-sm mt-1">
                Podés restablecer tu contraseña desde la pantalla de inicio de sesión, haciendo clic en “¿Olvidaste tu contraseña?” y siguiendo las instrucciones.
              </p>
            </li>
            <li className="bg-white/10 p-5 rounded-xl hover:bg-white/15 transition">
              <strong>¿Dónde puedo ver mis carpetas asignadas?</strong>
              <p className="text-white/70 text-sm mt-1">
                Iniciá sesión y accedé al menú lateral → “Gestión Carpetas”. Allí podrás visualizar, editar o eliminar tus carpetas actuales.
              </p>
            </li>
            <li className="bg-white/10 p-5 rounded-xl hover:bg-white/15 transition">
              <strong>¿Qué hago si una carpeta presenta datos incorrectos?</strong>
              <p className="text-white/70 text-sm mt-1">
                Contactá con el área técnica a través del correo de soporte o el chat interno indicando el ID de la carpeta y una breve descripción del error.
              </p>
            </li>
          </ul>
        </section>

        {/* Comunidad y foros */}
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-400">
            <MdOutlineForum className="text-2xl" /> Comunidad y foros
          </h2>
          <p className="text-white/80">
            Unite a nuestra comunidad de burócratas para compartir experiencias, resolver dudas y aprender nuevas funcionalidades del sistema.
          </p>
          <div className="bg-white/10 p-5 rounded-xl mt-3 space-y-2">
            <p>
              📍 <strong>Foro oficial:</strong>{" "}
              <a href="#" className="text-amber-300 underline hover:text-amber-400">
                https://foro.metagov.org
              </a>
            </p>
            <p>
              💬 <strong>Chat interno:</strong>{" "}
              Canal <span className="text-amber-300 font-semibold">#soporte-burocratas</span>
            </p>
          </div>
        </section>
      </div>

      {/* Pie de página */}
      <p className="text-center text-white/60 mt-12">
        Última actualización del centro de soporte: 27/10/2025
      </p>
    </BurocrataLayout>
  );
}
