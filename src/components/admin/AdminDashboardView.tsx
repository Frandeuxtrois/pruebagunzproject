// src/components/admin/AdminDashboardView.tsx
import React from 'react';

const AdminDashboardView: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard de Administración</h1>
            <p>¡Bienvenido al Panel de Administración! Desde aquí podrás gestionar el servidor.</p>
            <p>Selecciona una opción del menú para comenzar.</p>
        </div>
    );
};

export default AdminDashboardView;