// src/components/admin/ManageAccountsView.tsx

import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// --- NUEVO: Importamos el modal de edición de cuentas ---
import EditAccountModal from './EditAccountModal';

const MySwal = withReactContent(Swal);

// Interceptor de Axios para enviar el token
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('gunzToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Definimos la estructura de una cuenta para TypeScript
interface Account {
    AID: number;
    UserID: string;
    Name: string;
    Email: string;
    UGradeID: number;
    RegDate: string;
}

const ManageAccountsView: React.FC = () => {
    // Estados para el formulario y resultados
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('UserID');
    const [searchResults, setSearchResults] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    
    // --- NUEVO: Estados para gestionar el modal de edición ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAccountId, setSelectedAccountId] = useState<number | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSearchResults([]);
        try {
            const response = await apiClient.post('/api/admin/account/search', { searchTerm, searchType });
            setSearchResults(response.data);
            if (response.data.length === 0) {
                MySwal.fire('Sin resultados', 'No se encontraron cuentas que coincidan con la búsqueda.', 'info');
            }
        } catch (error: any) {
            MySwal.fire('Error', error.response?.data?.message || 'Ocurrió un error en el servidor.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Función para traducir el UGradeID a un rol legible
    const getGradeName = (gradeId: number): string => {
        switch (gradeId) {
            case 255: return 'Administrator';
            case 254: return 'Developer';
            case 253: return 'Banned';
            case 252: return 'Invisible GM';
            case 0: return 'User';
            default: return `Grade ${gradeId}`;
        }
    };
    
    // --- NUEVO: Funciones para abrir y cerrar el modal ---
    const handleOpenModal = (accountId: number) => {
        setSelectedAccountId(accountId);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedAccountId(null);
    };

    // --- NUEVO: Función para actualizar la tabla después de una edición exitosa ---
    const handleUpdateSuccess = (updatedAccount: Account) => {
        setSearchResults(prevResults => 
            prevResults.map(acc => 
                acc.AID === updatedAccount.AID ? { ...acc, ...updatedAccount } : acc
            )
        );
    };


    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manejar Cuentas</h1>

            <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center gap-4">
                <select value={searchType} onChange={e => setSearchType(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                    <option value="UserID">Por UserID</option>
                    <option value="Email">Por Email</option>
                    <option value="AID">Por AID</option>
                    <option value="CharacterName">Por Nombre de Personaje</option>
                </select>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Térmimo de búsqueda..."
                    className="flex-grow p-2 border border-gray-300 rounded-md"
                />
                <button type="submit" disabled={isLoading} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300">
                    {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {searchResults.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">AID</th>
                                <th className="p-2">UserID</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Rango (UGradeID)</th>
                                <th className="p-2">Fecha de Registro</th>
                                <th className="p-2 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map(acc => (
                                <tr key={acc.AID} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{acc.AID}</td>
                                    <td className="p-2 font-semibold">{acc.UserID}</td>
                                    <td className="p-2">{acc.Email}</td>
                                    <td className="p-2">{getGradeName(acc.UGradeID)} ({acc.UGradeID})</td>
                                    <td className="p-2">{new Date(acc.RegDate).toLocaleDateString()}</td>
                                    <td className="p-2 text-center space-x-2">
                                        {/* --- MODIFICADO: Conectamos el onClick del botón Editar --- */}
                                        <button 
                                            onClick={() => handleOpenModal(acc.AID)}
                                            className="text-blue-500 hover:underline text-sm"
                                        >
                                            Editar
                                        </button>
                                        <button className="text-green-500 hover:underline text-sm">Dar Coins</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- NUEVO: Renderizamos el modal y le pasamos las props necesarias --- */}
            <EditAccountModal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                accountId={selectedAccountId}
                onUpdateSuccess={handleUpdateSuccess}
            />
        </div>
    );
};

export default ManageAccountsView;