// src/App.tsx - AHORA GESTIONA LA SESIÓN DEL USUARIO

import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import LeftColumn from './components/LeftColumn';
import CenterColumn from './components/CenterColumn';
import RightColumn from './components/RightColumn';
import type { User } from './types';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeView, setActiveView] = useState('Home');
  // NUEVO: Estado para saber si estamos verificando la sesión al cargar la página.
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  // NUEVO: Este efecto se ejecuta una sola vez al cargar la app para comprobar si ya hay una sesión activa.
  useEffect(() => {
    const token = localStorage.getItem('gunzToken');
    if (token) {
      // Si encontramos un token, asumimos que el usuario está logueado.
      // Extraemos el nombre de usuario directamente del token para mostrarlo rápidamente.
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.userId });
      } catch (e) {
        // Si el token es inválido o corrupto, lo eliminamos.
        localStorage.removeItem('gunzToken');
      }
    }
    // Indicamos que la comprobación inicial ha terminado.
    setIsLoadingSession(false);
  }, []);

  const handleLogin = useCallback((username: string) => {
    setUser({ username });
  }, []);

  const handleLogout = useCallback(() => {
    // Al cerrar sesión, eliminamos el token del navegador.
    localStorage.removeItem('gunzToken');
    setUser(null);
  }, []);

  const handleNavClick = useCallback((view: string) => {
    setActiveView(view);
  }, []);

  // NUEVO: Mostramos un mensaje de carga mientras se verifica la sesión para evitar parpadeos.
  if (isLoadingSession) {
    return <div>Cargando...</div>;
  }

  return (
    <div 
      className="min-h-screen bg-black bg-repeat" 
      style={{ backgroundImage: "url('./images/background.png')" }}
    >
      <Header />
      <div id="page-wrapper" className="max-w-4xl mx-auto bg-[#bcbcbc] p-2.5 font-sans text-xs text-[#333]">
        
        <Navbar onNavItemClick={handleNavClick} />
        <main id="content-grid" className="grid grid-cols-[180px_1fr_220px] gap-4">
          <LeftColumn />
          <CenterColumn activeView={activeView} />
          <RightColumn 
            user={user} 
            onLogin={handleLogin} 
            onLogout={handleLogout} 
            onNavigate={setActiveView} 
            />
            
        </main>
      </div>
    </div>
  );
};

export default App;