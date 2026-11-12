'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Send, Phone, Video, ShieldCheck, CheckCheck } from 'lucide-react';

function ChatContent() {
  const router = useRouter();
  const params = useParams();
  const tecnicoId = params.id;

  const [mensaje, setMensaje] = useState('');
  const [mensajes, setMensajes] = useState([
    { id: 1, remitente: 'tecnico', texto: '¡Hola! Recibí tu solicitud de servicio. ¿En qué horario te viene bien que nos reunamos?', hora: '10:15 AM' },
    { id: 2, remitente: 'cliente', texto: 'Hola Carlos, ¿podría ser hoy por la tarde tipo 4:00 PM?', hora: '10:16 AM' },
    { id: 3, remitente: 'tecnico', texto: 'Perfecto, a las 4:00 PM estaré por allí. Llevaré las herramientas necesarias.', hora: '10:18 AM' }
  ]);

  const enviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensaje.trim()) return;

    const nuevoMsg = {
      id: mensajes.length + 1,
      remitente: 'cliente',
      texto: mensaje,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMensajes([...mensajes, nuevoMsg]);
    setMensaje('');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Barra superior del chat */}
      <header className="bg-slate-800 border-b border-slate-700 p-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
              CM
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-800 rounded-full"></span>
          </div>
          <div>
            <h1 className="font-bold text-sm md:text-base flex items-center gap-1.5">
              Carlos Mendoza <ShieldCheck size={16} className="text-blue-400" />
            </h1>
            <p className="text-xs text-emerald-400 font-medium">En línea</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="p-2.5 bg-slate-700/60 hover:bg-slate-700 rounded-xl transition text-slate-300">
            <Phone size={18} />
          </button>
          <button className="p-2.5 bg-slate-700/60 hover:bg-slate-700 rounded-xl transition text-slate-300">
            <Video size={18} />
          </button>
        </div>
      </header>

      {/* Cuerpo de los mensajes */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-4 md:p-6 overflow-y-auto space-y-4">
        <div className="text-center my-2">
          <span className="bg-slate-800/80 border border-slate-700/60 text-slate-400 text-xs px-3 py-1 rounded-full">
            Conversación segura cifrada de extremo a extremo
          </span>
        </div>

        {mensajes.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.remitente === 'cliente' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[70%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-md ${
                msg.remitente === 'cliente'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
              }`}
            >
              <p>{msg.texto}</p>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400 px-1">
              <span>{msg.hora}</span>
              {msg.remitente === 'cliente' && <CheckCheck size={14} className="text-blue-400" />}
            </div>
          </div>
        ))}
      </div>

      {/* Caja de texto inferior para escribir */}
      <footer className="bg-slate-800 border-t border-slate-700 p-4">
        <form onSubmit={enviarMensaje} className="max-w-3xl mx-auto flex items-center gap-3">
          <input
            type="text"
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            placeholder="Escribe un mensaje al técnico..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition flex items-center justify-center shadow-lg shadow-blue-600/20"
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
}

export default function ChatClientePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Cargando chat...</div>}>
      <ChatContent />
    </Suspense>
  );
}