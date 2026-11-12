'use client';

import { useRouter } from 'next/navigation';
import { Wrench, ShieldCheck, Star, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      
      {/* Navbar Superior */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 text-white rounded-xl">
            <Wrench size={22} />
          </div>
          <span className="font-bold text-lg tracking-tight">Servicios Técnicos</span>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => router.push('/login')}
            className="text-sm font-medium px-4 py-2 text-slate-300 hover:text-white transition"
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => router.push('/cliente/explorar')}
            className="bg-blue-600 hover:bg-blue-500 text-sm font-medium px-4 py-2 rounded-xl transition shadow-lg shadow-blue-600/20"
          >
            Explorar App
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 text-blue-400 border border-blue-500/20 px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
          <ShieldCheck size={16} /> Profesionales verificados y garantizados
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Encuentra expertos calificados para <span className="text-blue-500">cualquier servicio técnico</span>
        </h1>
        
        <p className="text-slate-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          Conectamos de forma rápida, segura y directa a clientes con los mejores técnicos en electricidad, plomería y electrodomésticos.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          <button
            onClick={() => router.push('/cliente/explorar')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-medium text-base transition flex items-center justify-center gap-2 shadow-xl shadow-blue-600/25"
          >
            Explorar Plataforma <ArrowRight size={18} />
          </button>
        </div>

        {/* Beneficios */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-8 border-t border-slate-800">
          <div className="bg-slate-800/50 border border-slate-800 p-5 rounded-2xl">
            <CheckCircle2 className="text-emerald-400 mb-3" size={24} />
            <h3 className="font-bold text-base mb-1">Técnicos Certificados</h3>
            <p className="text-slate-400 text-sm">Rigurosos filtros de validación para garantizar la máxima seguridad en tu hogar.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-800 p-5 rounded-2xl">
            <Star className="text-amber-400 mb-3" size={24} />
            <h3 className="font-bold text-base mb-1">Calificaciones Reales</h3>
            <p className="text-slate-400 text-sm">Historial transparente de valoraciones y tarifas por hora antes de contratar.</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-800 p-5 rounded-2xl">
            <Wrench className="text-blue-400 mb-3" size={24} />
            <h3 className="font-bold text-base mb-1">Gestión Inmediata</h3>
            <p className="text-slate-400 text-sm">Solicita y acepta servicios en tiempo real con notificaciones instantáneas.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full px-6 py-6 border-t border-slate-800 text-center text-xs text-slate-500">
        © 2026 Servicios Técnicos. Todos los derechos reservados.
      </footer>

    </div>
  );
}