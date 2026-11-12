'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Wrench, Search, LogOut, Star, MapPin, Calendar, LogIn, User, Heart, ClipboardList, Settings, X, Save, MessageSquare, Clock } from 'lucide-react';

export default function ClienteExplorarPage() {
  const router = useRouter();
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [favoritos, setFavoritos] = useState<string[]>([]);
  
  const [contratados, setContratados] = useState<{ id: string; estado: 'EN_PROCESO' | 'ACEPTADO' }[]>([]);

  // Estados para modales
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isContratadosOpen, setIsContratadosOpen] = useState(false);

  // Estados para el perfil del usuario editable
  const [userName, setUserName] = useState('Juan Pérez');
  const [userEmail, setUserEmail] = useState('cliente@demo.com');
  const [userPhone, setUserPhone] = useState('+56 9 1234 5678');

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role === 'CLIENTE' || role === 'TECNICO') {
      setIsLoggedIn(true);

      const savedName = localStorage.getItem('user_name');
      const savedEmail = localStorage.getItem('user_email');
      const savedPhone = localStorage.getItem('user_phone');
      if (savedName) setUserName(savedName);
      if (savedEmail) setUserEmail(savedEmail);
      if (savedPhone) setUserPhone(savedPhone);

      const savedContratados = localStorage.getItem('cliente_contratados_detalles');
      if (savedContratados) {
        setContratados(JSON.parse(savedContratados));
      }

      const pendingFavorite = localStorage.getItem('pending_favorite');
      if (pendingFavorite) {
        setFavoritos(prev => prev.includes(pendingFavorite) ? prev : [...prev, pendingFavorite]);
        localStorage.removeItem('pending_favorite');
      }
    } else {
      setIsLoggedIn(false);
    }
    fetchTecnicos();
  }, []);

  const fetchTecnicos = async () => {
    try {
      const { data, error } = await supabase.from('tecnicos').select('*');
      if (error || !data || data.length === 0) {
        setTecnicos([
          { id: '1', nombre: 'Carlos Mendoza', especialidad: 'Electricidad y Cableado', calificacion: 4.9, tarifa: '$35/hr', zona: 'Zona Norte' },
          { id: '2', nombre: 'Ana Sofía Ruiz', especialidad: 'Reparación de Electrodomésticos', calificacion: 4.8, tarifa: '$30/hr', zona: 'Zona Centro' },
          { id: '3', nombre: 'Jorge Valenzuela', especialidad: 'Plomería y Gasfitería', calificacion: 4.7, tarifa: '$40/hr', zona: 'Zona Sur' },
        ]);
      } else {
        setTecnicos(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorito = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isLoggedIn) {
      localStorage.setItem('pending_favorite', id);
      router.push('/login');
      return;
    }

    if (favoritos.includes(id)) {
      setFavoritos(favoritos.filter(favId => favId !== id));
    } else {
      setFavoritos([...favoritos, id]);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_name', userName);
    localStorage.setItem('user_email', userEmail);
    localStorage.setItem('user_phone', userPhone);
    setIsEditingProfile(false);
    alert('¡Información de cuenta actualizada con éxito!');
  };

  const handleSolicitar = (tec: any) => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      const existe = contratados.some(item => item.id === tec.id);
      if (!existe) {
        const nuevos = [...contratados, { id: tec.id, estado: 'EN_PROCESO' as const }];
        setContratados(nuevos);
        localStorage.setItem('cliente_contratados_detalles', JSON.stringify(nuevos));
      }
      setIsContratadosOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setMenuOpen(false);
    setFavoritos([]);
    setContratados([]);
    setUserName('Juan Pérez');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6 relative">
      <div className="max-w-4xl mx-auto">
        
        {/* Encabezado */}
        <header className="flex justify-between items-center mb-8 bg-slate-800 p-4 rounded-xl border border-slate-700 shadow-lg relative">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Wrench className="text-blue-500" size={22} /> Catálogo de Técnicos
            </h1>
            <p className="text-sm text-slate-400">
              {isLoggedIn ? (
                <>Hola, <span className="text-white font-medium">{userName}</span></>
              ) : (
                "Encuentra y contrata profesionales calificados"
              )}
            </p>
          </div>
          <div>
            {isLoggedIn ? (
              <div className="relative">
                {/* Botón Avatar de Usuario */}
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-xl transition border border-slate-600 font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-md">
                    <User size={16} />
                  </div>
                  <span className="text-sm hidden sm:inline">{userName.split(' ')[0]}</span>
                </button>

                {/* Submenú Desplegable Compacto */}
                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1.5 z-50 text-xs">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setIsEditingProfile(true);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 transition"
                    >
                      <Settings size={14} className="text-blue-400" /> Editar Cuenta
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setIsFavoritesOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 transition"
                    >
                      <Heart size={14} className="text-rose-400" /> Mis Favoritos ({favoritos.length})
                    </button>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        setIsContratadosOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white flex items-center gap-2 transition"
                    >
                      <ClipboardList size={14} className="text-emerald-400" /> Contratados ({contratados.length})
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
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm transition font-medium shadow-md shadow-blue-600/20"
              >
                <LogIn size={16} /> Iniciar Sesión
              </button>
            )}
          </div>
        </header>

        {/* Modal para Editar Cuenta */}
        {isEditingProfile && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Settings className="text-blue-400" size={20} /> Editar Información de Cuenta
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
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Teléfono de Contacto</label>
                  <input
                    type="text"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
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

        {/* Modal para Mis Favoritos */}
        {isFavoritesOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <Heart className="text-rose-400" size={20} fill="currentColor" /> Mis Técnicos Favoritos
                </h2>
                <button 
                  onClick={() => setIsFavoritesOpen(false)}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              {favoritos.length === 0 ? (
                <p className="text-slate-400 text-center py-8 text-sm">No tienes ningún técnico guardado en favoritos todavía.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {tecnicos
                    .filter((tec) => favoritos.includes(tec.id))
                    .map((tec) => (
                      <div key={tec.id} className="bg-slate-900 border border-slate-700/60 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-sm text-white">{tec.nombre}</h3>
                          <p className="text-blue-400 text-xs mb-1">{tec.especialidad}</p>
                          <span className="text-slate-400 text-xs">{tec.zona} • <strong className="text-emerald-400">{tec.tarifa}</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setIsFavoritesOpen(false);
                              router.push(`/cliente/tecnico/${tec.id}`);
                            }}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition"
                          >
                            Ver Perfil
                          </button>
                          <button
                            onClick={() => setFavoritos(favoritos.filter(id => id !== tec.id))}
                            className="bg-red-600/20 text-red-400 hover:bg-red-600/30 p-1.5 rounded-lg transition border border-red-500/30"
                            title="Quitar de favoritos"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}

              <div className="flex justify-end pt-4 mt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsFavoritesOpen(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded-xl text-xs font-medium transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal para Servicios Contratados */}
        {isContratadosOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <ClipboardList className="text-emerald-400" size={20} /> Mis Servicios Contratados
                </h2>
                <button 
                  onClick={() => setIsContratadosOpen(false)}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X size={20} />
                </button>
              </div>

              {contratados.length === 0 ? (
                <p className="text-slate-400 text-center py-8 text-sm">No has solicitado ningún servicio todavía. Haz clic en "Solicitar Servicio" en cualquier tarjeta.</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                  {contratados.map((item) => {
                    const tec = tecnicos.find(t => t.id === item.id);
                    if (!tec) return null;
                    return (
                      <div key={tec.id} className="bg-slate-900 border border-slate-700/60 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-sm text-white">{tec.nombre}</h3>
                          <p className="text-blue-400 text-xs mb-1">{tec.especialidad}</p>
                          
                          {item.estado === 'EN_PROCESO' ? (
                            <span className="text-amber-400 text-xs font-semibold flex items-center gap-1">
                              <Clock size={12} /> En proceso (Esperando confirmación del técnico)
                            </span>
                          ) : (
                            <span className="text-emerald-400 text-xs font-semibold">● Aceptado - Chat habilitado</span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {item.estado === 'ACEPTADO' ? (
                            <button
                              onClick={() => {
                                setIsContratadosOpen(false);
                                router.push(`/cliente/chat/${tec.id}`);
                              }}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                            >
                              <MessageSquare size={14} /> Ir al Chat
                            </button>
                          ) : (
                            <button
                              disabled
                              className="bg-slate-800 text-slate-500 px-3 py-1.5 rounded-lg text-xs font-medium cursor-not-allowed border border-slate-700"
                            >
                              Esperando...
                            </button>
                          )}

                          <button
                            onClick={() => {
                              const nuevos = contratados.filter(c => c.id !== tec.id);
                              setContratados(nuevos);
                              localStorage.setItem('cliente_contratados_detalles', JSON.stringify(nuevos));
                            }}
                            className="bg-red-600/20 text-red-400 hover:bg-red-600/30 p-1.5 rounded-lg transition border border-red-500/30"
                            title="Cancelar solicitud"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex justify-end pt-4 mt-4 border-t border-slate-700">
                <button
                  type="button"
                  onClick={() => setIsContratadosOpen(false)}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 px-4 py-2 rounded-xl text-xs font-medium transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Buscador */}
        <div className="mb-6 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3.5 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por especialidad o servicio..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <h2 className="text-lg font-semibold mb-4 text-slate-200">Técnicos Disponibles</h2>

        {loading ? (
          <p className="text-slate-400 text-center py-10">Cargando profesionales...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tecnicos.map((tec) => {
              const esFavorito = favoritos.includes(tec.id);
              return (
                <div key={tec.id} className="bg-slate-800 border border-slate-700 rounded-xl p-5 shadow-md flex flex-col justify-between hover:border-slate-600 transition">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        onClick={() => router.push(`/cliente/tecnico/${tec.id}`)}
                        className="font-bold text-base cursor-pointer hover:text-blue-400 transition"
                      >
                        {tec.nombre}
                      </h3>
                      <div className="flex items-center gap-2">
                        {/* Botón de Favorito (Corazón) */}
                        <button
                          onClick={(e) => toggleFavorito(tec.id, e)}
                          className="text-slate-400 hover:text-rose-500 transition p-1.5 bg-slate-900/50 rounded-lg border border-slate-700/60"
                          title="Guardar en favoritos"
                        >
                          <Heart 
                            size={16} 
                            fill={esFavorito ? "currentColor" : "none"} 
                            className={esFavorito ? "text-rose-500" : "text-slate-400"}
                          />
                        </button>
                        <span className="flex items-center gap-1 text-amber-400 text-xs font-semibold bg-amber-400/10 px-2 py-1 rounded-md">
                          <Star size={14} fill="currentColor" /> {tec.calificacion}
                        </span>
                      </div>
                    </div>
                    <p className="text-blue-400 text-sm font-medium mb-3">{tec.especialidad}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 mb-5">
                      <span className="flex items-center gap-1"><MapPin size={14} /> {tec.zona}</span>
                      <span className="font-semibold text-emerald-400">{tec.tarifa}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSolicitar(tec)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
                  >
                    <Calendar size={16} /> Solicitar Servicio
                  </button>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}