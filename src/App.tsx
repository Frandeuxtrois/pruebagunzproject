// src/App.tsx - AHORA USA REACT-ROUTER-DOM PARA GESTIONAR LA NAVEGACIÓN Y EL LAYOUT DE ADMIN

import React, { useState, useCallback, useEffect } from 'react';
// --- NUEVO: Eliminamos 'useNavigate' y 'useLocation' que no estábamos usando para limpiar ---
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Navbar from './components/Navbar';
import LeftColumn from './components/LeftColumn';
import CenterColumn from './components/CenterColumn';
import RightColumn from './components/RightColumn';
import type { User } from './types';

// --- NUEVO: Importamos las vistas y componentes de protección ---
import ProtectedRoute from './components/ProtectedRoute'; // Nuestro guardián de rutas de admin
import HomeView from './components/views/HomeView';
import RankingIndividualView from './components/views/RankingIndividualView';
import RankingClansView from './components/views/RankingClansView';
import UserPanelView from './components/views/UserPanelView';
// --- NUEVO: Importamos el Layout y el Dashboard de Admin ---
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardView from './components/admin/AdminDashboardView';
// --- NUEVO: Importamos la nueva vista para manejar personajes ---
import ManageCharactersView from './components/admin/ManageCharactersView'; 
// <-- Importa la nueva RegisterView
import RegisterView from './components/views/RegisterView'; 
// --- 1. IMPORTA LA NUEVA VISTA DE CUENTAS ---
import ManageAccountsView from './components/admin/ManageAccountsView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);

  useEffect(() => {
    // Este efecto para comprobar la sesión al cargar se queda igual.
    const token = localStorage.getItem('gunzToken');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.userId });
      } catch (e) {
        localStorage.removeItem('gunzToken');
      }
    }
    setIsLoadingSession(false);
  }, []);

  const handleLogin = useCallback((username: string) => {
    setUser({ username });
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem('gunzToken');
    setUser(null);
  }, []);

  if (isLoadingSession) {
    return <div>Cargando...</div>;
  }

  // --- ESTRUCTURA PRINCIPAL CAMBIADA PARA USAR EL ROUTER Y DISTINGUIR LAYOUTS ---
  return (
    <BrowserRouter>
      {/* Las Routes ahora son el componente principal para decidir qué layout mostrar */}
      <Routes>
        
        {/* --- RUTA PROTEGIDA PARA EL PANEL DE ADMIN --- */}
        {/* Todas las URLs que empiecen con /admin entrarán aquí */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              {/* Envolvemos las rutas de admin con el nuevo AdminLayout */}
              <AdminLayout />
            </ProtectedRoute>
          } 
        >
      
          {/* Estas son las "sub-rutas" o "rutas hijas" que se mostrarán dentro del <Outlet/> de AdminLayout */}
          {/* La ruta 'index' es lo que se muestra en /admin */}
          <Route index element={<AdminDashboardView />} />

          {/* --- MODIFICADO: Reemplazamos el placeholder con el componente real --- */}
          <Route path="manage-characters" element={<ManageCharactersView />} />
          
          {/* --- AÑADIDO: Nueva ruta para la gestión de cuentas --- */}
          {/* La URL será /admin/manage-accounts */}
          <Route path="manage-accounts" element={<ManageAccountsView />} />
          
          {/* Aquí añadiremos más sub-rutas de admin en el futuro */}
        </Route>

        {/* --- RUTAS PÚBLICAS (EL RESTO DE LA WEB) --- */}
        {/* La ruta '/*' captura todas las demás URLs que no sean /admin */}
        <Route 
          path="/*" 
          element={
            // El layout principal de la web pública
            <div 
              className="min-h-screen bg-black bg-repeat" 
              style={{ backgroundImage: "url('./images/background.png')" }}
            >
              <Header />
              <div id="page-wrapper" className="max-w-4xl mx-auto bg-[#bcbcbc] p-2.5 font-sans text-xs text-[#333]">
                {/* El Navbar necesitará ser actualizado para usar <Link> en lugar de onClick */}
                <Navbar />
                <main id="content-grid" className="grid grid-cols-[180px_1fr_220px] gap-4">
                  <LeftColumn />
                  <CenterColumn>
                    {/* El contenido de CenterColumn también se gestiona con rutas anidadas */}
                    <Routes>
                      <Route index element={<HomeView />} />
                      <Route path="register" element={<RegisterView />} />
                      <Route path="ranking-individual" element={<RankingIndividualView />} />
                      <Route path="ranking-clanes" element={<RankingClansView />} />
                      <Route path="user-panel" element={<UserPanelView />} />
                    </Routes>
                  </CenterColumn>
                  <RightColumn 
                    user={user} 
                    onLogin={handleLogin} 
                    onLogout={handleLogout}
                  />
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;