'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Send, User } from 'lucide-react';

export default function ChatClientePage() {
  const router = useRouter();
  const params = useParams();
  const tecnicoId = params.id;

  const [mensajes, setMensajes] = useState([
    { id: 1, remitente: 'tecnico', texto: '¡Hola! He recibido tu solicitud de servicio. ¿En qué te puedo ayudar hoy?', hora: '10:00 AM' }
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState('');
  const [tecnicoNombre, setTecnicoNombre] = useState('Técnico');

  useEffect(() => {
    const tecnicosMap: Record<string, string> = {
      '1': 'Carlos Mendoza',
      '2': 'Ana Sofía Ruiz',
      '3': 'Jorge Valenzuela'
    };
    if (tecnicoId && tecnicosMap[tecnicoId as string]) {
      setTecnicoNombre(tecnicosMap[tecnicoId as string]);
    }
  }, [tecnicoId]);

  const enviarMensaje = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    const mensajeUsuario = {
      id: Date.now(),
      remitente: 'cliente',
      texto: nuevoMensaje,
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMensajes(prev => [...prev, mensajeUsuario]);
    setNuevoMensaje('');

    // Simular respuesta automática del técnico
    setTimeout(() => {
      const respuestaTecnico = {
        id: Date.now() + 1,
        remitente: 'tecnico',
        texto: 'Entendido, estaré atento y coordinamos los detalles pronto.',
        hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMensajes(prev => [...prev, respuestaTecnico]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      {/* Header del Chat */}
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/cliente/explorar')}
            className="text-slate-400 hover:text-white transition p-1"
            title="Volver al catálogo"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white shadow">
            <User size={20} />
          </div>
          <div>
            <h1 className="font-bold text-base">{tecnicoNombre}</h1>
            <p className="text-xs text-emerald-400 flex items-center gap-1">● En línea</p>
          </div>
        </div>
      </header>

      {/* Contenedor de Mensajes */}
      <div className="flex-1 max-w-3xl w-full mx-auto p-6 overflow-y-auto space-y-4">
        {mensajes.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.remitente === 'cliente' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-md rounded-2xl px-4 py-3 text-sm shadow-md ${
                msg.remitente === 'cliente'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-bl-none'
              }`}
            >
              <p>{msg.texto}</p>
              <span className="text-[10px] text-slate-400 block text-right mt-1">{msg.hora}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Input para Enviar Mensaje */}
      <footer className="bg-slate-800 border-t border-slate-700 p-4">
        <form onSubmit={enviarMensaje} className="max-w-3xl mx-auto flex gap-3">
          <input
            type="text"
            value={nuevoMensaje}
            onChange={(e) => setNuevoMensaje(e.target.value)}
            placeholder="Escribe un mensaje al técnico..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-xl font-medium transition flex items-center justify-center shadow-lg shadow-blue-600/20"
          >
            <Send size={18} />
          </button>
        </form>
      </footer>
    </div>
  );
}