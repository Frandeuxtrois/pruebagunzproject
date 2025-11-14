// src/components/admin/AdminSidebar.tsx

import React from 'react';
import { Link } from 'react-router-dom';

const AdminSidebar: React.FC = () => {
    return (
        <aside className="w-64 bg-gray-800 text-white p-4">
            <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
            <nav>
                <ul>
                    <li className="mb-2">
                        <Link to="/admin" className="block p-2 rounded hover:bg-gray-700">
                            Dashboard
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/admin/manage-characters" className="block p-2 rounded hover:bg-gray-700">
                            Manejar Personajes
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/admin/manage-accounts" className="block p-2 rounded hover:bg-gray-700">
                            Manejar Cuentas
                        </Link>
                    </li>
                    <li className="mb-2">
                        <Link to="/admin/manage-clans" className="block p-2 rounded hover:bg-gray-700">
                            Manejar Clanes
                        </Link>
                    </li>
                    {/* Aquí añadiremos más enlaces en el futuro */}
                </ul>
            </nav>
        </aside>
    );
};

export default AdminSidebar;