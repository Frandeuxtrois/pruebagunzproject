// src/components/admin/AdminLayout.tsx

import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- Importante: para renderizar las sub-rutas
import AdminSidebar from './AdminSidebar';

const AdminLayout: React.FC = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* El Menú Lateral */}
            <AdminSidebar />
            
            {/* El Área de Contenido Principal */}
            <main className="flex-1 p-8">
                {/* 'Outlet' es un marcador de posición donde react-router-dom
                    renderizará el componente de la ruta hija que coincida.
                    Ej: Si estás en /admin/manage-characters, aquí se mostrará
                    el componente de esa página. */}
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;