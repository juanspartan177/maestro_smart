'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Wrench, Star, MapPin, DollarSign, ArrowLeft, CheckCircle, Calendar, MessageSquare, Award, Heart } from 'lucide-react';

export const dynamic = 'force-dynamic'; // Forzar la regeneración de la página en cada solicitud

export default function PerfilTecnicoClientePage() {
  const router = useRouter();
  const params = useParams();
  const tecnicoId = Array.isArray(params.id) ? params.id[0] : (params.id as string);

  const [tecnico, setTecnico] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoritos, setFavoritos] = useState<string[]>([]);

  useEffect(() => {
    const role = localStorage.getItem('user_role');
    if (role === 'CLIENTE' || role === 'TECNICO') {
      setIsLoggedIn(true);

      // Cargar favoritos guardados en localStorage
      const savedFavs = localStorage.getItem('cliente_favoritos');
      if (savedFavs) {
        setFavoritos(JSON.parse(savedFavs));
      }
    }

    const tecnicosData: { [key: string]: any } = {
      '1': {
        id: '1',
        nombre: 'Carlos Mendoza',
        especialidad: 'Electricidad y Cableado',
        calificacion: 4.9,
        tarifa: '$35/hr',
        zona: 'Zona Norte',
        descripcion: 'Electricista certificado con más de 8 años de experiencia en instalaciones residenciales, tableros y solución de averías complejas.',
        certificados: [
          { id: 1, titulo: 'Certificación Oficial de Electricista Clase A', entidad: 'Superintendencia de Electricidad', año: '2021' },
          { id: 2, titulo: 'Diplomado en Instalaciones de Alta y Baja Tensión', entidad: 'Instituto Tecnológico Superior', año: '2023' }
        ],
        trabajos: [
          { id: 1, titulo: 'Instalación de tablero eléctrico principal', fecha: 'Enero 2026' },
          { id: 2, titulo: 'Cableado estructurado para oficina residencial', fecha: 'Diciembre 2025' }
        ],
        opiniones: [
          { id: 1, cliente: 'Mariana López', estrellas: 5, comentario: 'Excelente servicio, muy puntual y profesional.', fecha: 'Hace 3 días' },
          { id: 2, cliente: 'Roberto Gómez', estrellas: 5, comentario: 'Resolvió el cortocircuito rápidamente. 100% recomendado.', fecha: 'Hace 1 semana' }
        ]
      },
      '2': {
        id: '2',
        nombre: 'Ana Sofía Ruiz',
        especialidad: 'Reparación de Electrodomésticos',
        calificacion: 4.8,
        tarifa: '$30/hr',
        zona: 'Zona Centro',
        descripcion: 'Especialista en línea blanca, refrigeración y lavadoras de todas las marcas principales del mercado.',
        certificados: [
          { id: 1, titulo: 'Especialista en Línea Blanca y Refrigeración', entidad: 'Centro de Formación Técnica Industrial', año: '2022' }
        ],
        trabajos: [
          { id: 1, titulo: 'Reparación de tarjeta de refrigerador Samsung', fecha: 'Febrero 2026' }
        ],
        opiniones: [
          { id: 1, cliente: 'Claudia Pérez', estrellas: 5, comentario: 'Muy atenta y honesta con el presupuesto de las piezas.', fecha: 'Hace 2 semanas' }
        ]
      },
      '3': {
        id: '3',
        nombre: 'Jorge Valenzuela',
        especialidad: 'Plomería y Gasfitería',
        calificacion: 4.7,
        tarifa: '$40/hr',
        zona: 'Zona Sur',
        descripcion: 'Soluciones inmediatas para fugas de agua, destapes de cañerías e instalación de grifería moderna.',
        certificados: [
          { id: 1, titulo: 'Certificado en Gasfitería y Redes Sanitarias', entidad: 'Sindicato de Instaladores Sanitarios', año: '2020' }
        ],
        trabajos: [
          { id: 1, titulo: 'Cambio total de tuberías y grifería de baño', fecha: 'Enero 2026' }
        ],
        opiniones: [
          { id: 1, cliente: 'Esteban Silva', estrellas: 4, comentario: 'Buen trabajo y dejó todo limpio al terminar.', fecha: 'Hace un mes' }
        ]
      }
    };

    const encontrado = tecnicosData[tecnicoId || '1'] || tecnicosData['1'];
    setTecnico(encontrado);
    setLoading(false);
  }, [tecnicoId]);

  const toggleFavorito = () => {
    // Si NO está logueado, guardamos el ID pendiente y lo mandamos al login
    if (!isLoggedIn) {
      localStorage.setItem('pending_favorite', tecnicoId);
      router.push('/login');
      return;
    }

    let nuevosFavs;
    if (favoritos.includes(tecnicoId)) {
      nuevosFavs = favoritos.filter(id => id !== tecnicoId);
    } else {
      nuevosFavs = [...favoritos, tecnicoId];
    }
    setFavoritos(nuevosFavs);
    localStorage.setItem('cliente_favoritos', JSON.stringify(nuevosFavs));
  };

  const handleSolicitar = () => {
    if (!isLoggedIn) {
      router.push('/login');
    } else {
      alert(`¡Solicitud de servicio enviada con éxito a ${tecnico?.nombre}!`);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Cargando perfil...</div>;
  }

  const esFavorito = favoritos.includes(tecnicoId);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-3xl mx-auto">
        
        {/* Botón Volver */}
        <button
          onClick={() => router.push('/cliente/explorar')}
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition text-sm font-medium"
        >
          <ArrowLeft size={16} /> Volver al catálogo
        </button>

        {/* Tarjeta de Perfil Principal */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg mb-6 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl font-bold">{tecnico.nombre}</h1>
              <p className="text-blue-400 font-medium">{tecnico.especialidad}</p>
            </div>
            <div className="flex items-center gap-2">
              {/* Botón de Corazón de Favorito */}
              <button
                onClick={toggleFavorito}
                className="text-slate-400 hover:text-rose-500 transition p-2 bg-slate-900/60 rounded-xl border border-slate-700/80 shadow"
                title={isLoggedIn ? "Guardar en favoritos" : "Inicia sesión para guardar en favoritos"}
              >
                <Heart 
                  size={20} 
                  fill={esFavorito ? "currentColor" : "none"} 
                  className={esFavorito ? "text-rose-500" : "text-slate-400"}
                />
              </button>

              <div className="flex items-center gap-1 bg-amber-400/10 text-amber-400 border border-amber-400/20 px-3 py-2 rounded-xl font-bold text-sm">
                <Star size={18} fill="currentColor" /> {tecnico.calificacion}
              </div>
            </div>
          </div>

          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            {tecnico.descripcion}
          </p>

          <div className="flex flex-wrap gap-4 text-xs text-slate-400 border-t border-slate-700 pt-4 mb-6">
            <span className="flex items-center gap-1"><MapPin size={16} className="text-blue-400" /> {tecnico.zona}</span>
            <span className="flex items-center gap-1 font-semibold text-emerald-400"><DollarSign size={16} /> {tecnico.tarifa}</span>
          </div>

          <button
            onClick={handleSolicitar}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <Calendar size={18} /> Solicitar Servicio
          </button>
        </div>

        {/* Certificados y Credenciales Verificadas */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award className="text-amber-400" size={20} /> Certificados y Credenciales
          </h2>
          <div className="space-y-3">
            {tecnico.certificados && tecnico.certificados.map((cert: any) => (
              <div key={cert.id} className="bg-slate-900/60 border border-slate-700/60 p-4 rounded-xl flex justify-between items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{cert.titulo}</span>
                    <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                      <CheckCircle size={10} /> Verificado
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{cert.entidad}</p>
                </div>
                <span className="text-xs font-semibold text-slate-300 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">{cert.año}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trabajos Realizados */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <CheckCircle className="text-emerald-400" size={20} /> Trabajos Realizados
          </h2>
          <div className="space-y-3">
            {tecnico.trabajos.map((trabajo: any) => (
              <div key={trabajo.id} className="bg-slate-900/60 border border-slate-700/60 p-4 rounded-xl flex justify-between items-center">
                <span className="text-sm font-medium text-slate-200">{trabajo.titulo}</span>
                <span className="text-xs text-slate-400">{trabajo.fecha}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Opiniones de Clientes */}
        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <MessageSquare className="text-blue-400" size={20} /> Opiniones de Clientes
          </h2>
          <div className="space-y-4">
            {tecnico.opiniones.map((op: any) => (
              <div key={op.id} className="bg-slate-900/60 border border-slate-700/60 p-4 rounded-xl space-y-2">
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
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}