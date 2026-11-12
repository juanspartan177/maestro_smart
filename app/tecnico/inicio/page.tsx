'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wrench, User, LogOut, Settings, X, Save, CheckCircle2, XCircle, Clock, Star, DollarSign, MapPin, MessageSquare } from 'lucide-react';

export default function TecnicoInicioPage() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Datos del técnico editable
  const [tecnicoName, setTecnicoName] = useState('Carlos Mendoza');
  const [tecnicoEspecialidad, setTecnicoEspecialidad] = useState('Electricidad y Cableado');
  const [tecnicoTarifa, setTecnicoTarifa] = useState('$35/hr');
  const [tecnicoZona, setTecnicoZona] = useState('Zona Norte');

  // Solicitudes recibidas de clientes
  const [solicitudes, setSolicitudes] = useState<any[]>([]);

  // Opiniones de clientes simuladas
  const [opiniones, setOpiniones] = useState([
    { id: 1, cliente: 'Mariana López', estrellas: 5, comentario: 'Excelente servicio, muy puntual y profesional.', fecha: 'Hace 3 días' },
    { id: 2, cliente: 'Roberto Gómez', estrellas: 5, comentario: 'Resolvió el cortocircuito rápidamente. 100% recomendado.', fecha: 'Hace 1 semana' }
  ]);
  const [respuestaComentario, setRespuestaComentario] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role !== 'TECNICO' && role !== 'CLIENTE') {
      router.push('/login');
    }

    const savedName = localStorage.getItem('tecnico_name');
    const savedEsp = localStorage.getItem('tecnico_especialidad');
    const savedTarifa = localStorage.getItem('tecnico_tarifa');
    const savedZona = localStorage.getItem('tecnico_zona');

    if (savedName) setTecnicoName(savedName);
    if (savedEsp) setTecnicoEspecialidad(savedEsp);
    if (savedTarifa) setTecnicoTarifa(savedTarifa);
    if (savedZona) setTecnicoZona(savedZona);

    // Cargar solicitudes de clientes (simulado para Carlos Mendoza - ID '1')
    const savedContratados = localStorage.getItem('cliente_contratados_detalles');
    if (savedContratados) {
      const parsed = JSON.parse(savedContratados);
      const misSolicitudes = parsed.filter((item: any) => item.id === '1');
      setSolicitudes(misSolicitudes);
    } else {
      setSolicitudes([{ id: '1', estado: 'EN_PROCESO' }]);
    }
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('tecnico_name', tecnicoName);
    localStorage.setItem('tecnico_especialidad', tecnicoEspecialidad);
    localStorage.setItem('tecnico_tarifa', tecnicoTarifa);
    localStorage.setItem('tecnico_zona', tecnicoZona);
    setIsEditingProfile(false);
    alert('¡Perfil de técnico actualizado con éxito!');
  };

  const handleAceptarSolicitud = (id: string) => {
    const actualizadas = solicitudes.map(s => s.id === id ? { ...s, estado: 'ACEPTADO' as const } : s);
    setSolicitudes(actualizadas);
    localStorage.setItem('cliente_contratados_detalles', JSON.stringify(actualizadas));
    alert('¡Has aceptado la solicitud! El chat con el cliente ha sido habilitado.');
  };

  const handleRechazarSolicitud = (id: string) => {
    const actualizadas = solicitudes.filter(s => s.id !== id);
    setSolicitudes(actualizadas);
    localStorage.setItem('cliente_contratados_detalles', JSON.stringify(actualizadas));
  };

  const handleResponderComentario = (id: number) => {
    const texto = respuestaComentario[id];
    if (!texto || !texto.trim()) return;
    alert(`Respuesta enviada con éxito: "${texto}"`);
    setRespuestaComentario({ ...respuestaComentario, [id]: '' });
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  // Separar solicitudes por estado
  const pendientes = solicitudes.filter(s => s.estado === 'EN_PROCESO');
  const enCurso = solicitudes.filter(s => s.estado === 'ACEPTADO');

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 relative">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Encabezado del Técnico */}
        <header className="flex justify-between items-center bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg relative">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Wrench className="text-blue-500" size={22} /> Panel de Técnico
            </h1>
            <p className="text-sm text-slate-400">Bienvenido, <span className="text-white font-medium">{tecnicoName}</span></p>
          </div>

          <div>
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-xl transition border border-slate-600 font-medium"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                  <User size={16} />
                </div>
                <span className="text-sm hidden sm:inline">{tecnicoName.split(' ')[0]}</span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      setIsEditingProfile(true);
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 transition"
                  >
                    <Settings size={14} className="text-blue-400" /> Mi Cuenta
                  </button>
                  <div className="border-t border-slate-700 my-1"></div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-red-400 hover:bg-slate-700 hover:text-red-300 flex items-center gap-2 transition font-medium"
                  >
                    <LogOut size={14} /> Salir
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Modal para Editar Cuenta / Perfil Profesional */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Settings className="text-blue-400" size={20} /> Editar Mi Cuenta Profesional
                </h2>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    value={tecnicoName}
                    onChange={(e) => setTecnicoName(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Especialidad</label>
                  <input
                    type="text"
                    value={tecnicoEspecialidad}
                    onChange={(e) => setTecnicoEspecialidad(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Tarifa por Hora</label>
                  <input
                    type="text"
                    value={tecnicoTarifa}
                    onChange={(e) => setTecnicoTarifa(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Zona de Cobertura</label>
                  <input
                    type="text"
                    value={tecnicoZona}
                    onChange={(e) => setTecnicoZona(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-700">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded-xl text-xs font-medium transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                  >
                    <Save size={14} /> Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 1. SECCIÓN: Solicitudes que tiene que aceptar */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
            <Clock className="text-amber-400" size={20} /> Solicitudes Pendientes de Aprobación
          </h2>

          {pendientes.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-5 text-center text-slate-400 text-sm">
              No tienes nuevas solicitudes por aceptar en este momento.
            </div>
          ) : (
            <div className="space-y-3">
              {pendientes.map((sol) => (
                <div key={sol.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-base">Juan Pérez (Cliente)</span>
                      <span className="bg-amber-400/10 text-amber-400 border border-amber-400/20 text-xs px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                        <Clock size={12} /> Requiere tu aprobación
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm mb-2">Servicio solicitado: <span className="text-blue-400 font-medium">{tecnicoEspecialidad}</span></p>
                    <div className="flex gap-4 text-xs text-slate-400">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {tecnicoZona}</span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1"><DollarSign size={14} /> {tecnicoTarifa}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => handleAceptarSolicitud(sol.id)}
                      className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1 shadow-lg shadow-emerald-600/20"
                    >
                      <CheckCircle2 size={16} /> Aceptar
                    </button>
                    <button
                      onClick={() => handleRechazarSolicitud(sol.id)}
                      className="flex-1 md:flex-none bg-red-600/20 text-red-400 hover:bg-red-600/30 px-4 py-2 rounded-xl text-xs font-medium transition border border-red-500/30 flex items-center justify-center gap-1"
                    >
                      <XCircle size={16} /> Rechazar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 2. SECCIÓN: Trabajos en proceso con acceso al chat */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-400" size={20} /> Trabajos en Proceso (Chat Habilitado)
          </h2>

          {enCurso.length === 0 ? (
            <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-5 text-center text-slate-400 text-sm">
              No tienes trabajos activos en este momento.
            </div>
          ) : (
            <div className="space-y-3">
              {enCurso.map((sol) => (
                <div key={sol.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-base">Juan Pérez (Cliente)</span>
                      <span className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-xs px-2.5 py-0.5 rounded-full font-semibold">
                        ● Activo
                      </span>
                    </div>
                    <p className="text-slate-300 text-sm">Trabajo de {tecnicoEspecialidad} en curso.</p>
                  </div>

                  <button
                    onClick={() => router.push(`/cliente/chat/${sol.id}`)}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-medium transition flex items-center gap-1.5 shadow-md shadow-blue-600/20"
                  >
                    <MessageSquare size={16} /> Abrir Chat con el Cliente
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. SECCIÓN: Comentarios y valoraciones de clientes para responder */}
        <section>
          <h2 className="text-lg font-semibold mb-4 text-slate-200 flex items-center gap-2">
            <Star className="text-amber-400" size={20} fill="currentColor" /> Opiniones y Comentarios de Clientes
          </h2>

          <div className="space-y-4">
            {opiniones.map((op) => (
              <div key={op.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-md space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm text-slate-200">{op.cliente}</span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    {Array.from({ length: op.estrellas }).map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
                <p className="text-slate-300 text-sm">{op.comentario}</p>
                <span className="text-xs text-slate-500 block">{op.fecha}</span>

                {/* Input para responder al comentario */}
                <div className="pt-3 border-t border-slate-700 flex gap-2">
                  <input
                    type="text"
                    placeholder="Escribe una respuesta para mejorar o agradecer..."
                    value={respuestaComentario[op.id] || ''}
                    onChange={(e) => setRespuestaComentario({ ...respuestaComentario, [op.id]: e.target.value })}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleResponderComentario(op.id)}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-xl text-xs font-medium transition"
                  >
                    Responder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}