'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Wrench, ShieldCheck, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<'CLIENTE' | 'TECNICO'>('CLIENTE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (userRole: 'CLIENTE' | 'TECNICO') => {
    if (userRole === 'CLIENTE') {
      localStorage.setItem('user_role', 'CLIENTE');
      localStorage.setItem('user_id', '22222222-2222-2222-2222-222222222222');
      router.push('/cliente/explorar');
    } else {
      localStorage.setItem('user_role', 'TECNICO');
      localStorage.setItem('user_id', '11111111-1111-1111-1111-111111111111');
      router.push('/tecnico/inicio');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl p-6 shadow-xl border border-slate-700">
        
        <div className="text-center mb-6">
          <div className="inline-flex p-3 bg-blue-600/20 text-blue-400 rounded-xl mb-2">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold">Servicios Técnicos</h1>
          <p className="text-slate-400 text-sm mt-1">Ingresa a tu cuenta para continuar</p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl mb-6 border border-slate-700">
          <button
            onClick={() => setRole('CLIENTE')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
              role === 'CLIENTE' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <User size={18} /> Cliente
          </button>
          <button
            onClick={() => setRole('TECNICO')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${
              role === 'TECNICO' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench size={18} /> Técnico
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'CLIENTE' ? 'cliente@correo.com' : 'tecnico@correo.com'}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <button
            onClick={() => handleLogin(role)}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg font-medium text-sm transition flex items-center justify-center gap-2"
          >
            Iniciar Sesión <ArrowRight size={16} />
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-700/60">
          <p className="text-xs text-center text-slate-400 mb-3 font-semibold">⚡ ACCESOS RÁPIDOS</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleLogin('CLIENTE')}
              className="bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 border border-emerald-500/30 py-2 px-3 rounded-lg text-xs font-medium transition text-center"
            >
              Acceso Cliente
            </button>
            <button
              onClick={() => handleLogin('TECNICO')}
              className="bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-500/30 py-2 px-3 rounded-lg text-xs font-medium transition text-center"
            >
              Acceso Técnico
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}