import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
// --- NUEVO: Importamos el modal que creamos para editar clanes ---
import EditClanModal from './EditClanModal';
import CreateClanModal from './CreateClanModal';


const MySwal = withReactContent(Swal);

// Interceptor de Axios para enviar el token
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('gunzToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Definimos la estructura de un clan para TypeScript
interface Clan {
    CLID: number;
    Name: string;
    Level: number;
    Points: number;
    Wins: number;
    Losses: number;
    MasterName: string;
}

const ManageClansView: React.FC = () => {
    // Estados para el formulario y resultados
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('ClanName');
    const [searchResults, setSearchResults] = useState<Clan[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // --- NUEVO: Estados para gestionar el modal de edición ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClanId, setSelectedClanId] = useState<number | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSearchResults([]);
        try {
            const response = await apiClient.post('/api/admin/clan/search', { searchTerm, searchType });
            setSearchResults(response.data);
            if (response.data.length === 0) {
                MySwal.fire('Sin resultados', 'No se encontraron clanes que coincidan con la búsqueda.', 'info');
            }
        } catch (error: any) {
            MySwal.fire('Error', error.response?.data?.message || 'Ocurrió un error en el servidor.', 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    // --- NUEVO: Función para manejar el borrado de un clan ---
    const handleDelete = (clid: number, clanName: string) => {
        MySwal.fire({
            title: '¿ESTÁS SEGURO?',
            html: `Vas a borrar el clan <b>${clanName}</b> (CLID: ${clid}) y a expulsar a todos sus miembros.<br/>¡Esta acción es irreversible!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡Borrar Clan!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Usamos el endpoint de borrado que creamos en el backend
                apiClient.post('/api/admin/clan/delete', { clid })
                    .then(response => {
                        MySwal.fire('¡Clan Borrado!', response.data.message, 'success');
                        // Actualizamos la lista de resultados para que el clan desaparezca de la tabla
                        setSearchResults(prev => prev.filter(clan => clan.CLID !== clid));
                    })
                    .catch(err => {
                        MySwal.fire('Error', err.response?.data?.message || 'No se pudo borrar el clan.', 'error');
                    });
            }
        });
    };

    // --- NUEVO: Funciones para abrir/cerrar el modal de edición ---
    const handleOpenModal = (clid: number) => {
        setSelectedClanId(clid);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClanId(null);
    };

    // --- NUEVO: Función para actualizar la tabla después de una edición exitosa ---
    const handleUpdateSuccess = (updatedClan: Clan) => {
        setSearchResults(prev => prev.map(c => c.CLID === updatedClan.CLID ? { ...c, ...updatedClan } : c));
    };


     const handleCreateSuccess = () => {
        // Si hay un término de búsqueda, la refrescamos. Si no, no hacemos nada.
        if (searchTerm.trim()) {
            handleSearch(new Event('submit') as any);
        }
    };


    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manejar Clanes</h1>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    className="bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700"
                >
                    Crear Nuevo Clan
                </button>
            <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center gap-4">
                <select value={searchType} onChange={e => setSearchType(e.target.value)} className="p-2 border border-gray-300 rounded-md">
                    <option value="ClanName">Por Nombre de Clan</option>
                    <option value="CLID">Por CLID</option>
                    <option value="MasterName">Por Nombre del Máster</option>
                </select>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    placeholder="Término de búsqueda..."
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
                                <th className="p-2">CLID</th>
                                <th className="p-2">Nombre del Clan</th>
                                <th className="p-2">Máster</th>
                                <th className="p-2">Nivel</th>
                                <th className="p-2">Puntos</th>
                                <th className="p-2">W/L</th>
                                <th className="p-2 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map(clan => (
                                <tr key={clan.CLID} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{clan.CLID}</td>
                                    <td className="p-2 font-semibold">{clan.Name}</td>
                                    <td className="p-2">{clan.MasterName || 'N/A'}</td>
                                    <td className="p-2">{clan.Level}</td>
                                    <td className="p-2">{clan.Points}</td>
                                    <td className="p-2">{clan.Wins} / {clan.Losses}</td>
                                    <td className="p-2 text-center space-x-2">
                                        {/* --- MODIFICADO: Conectamos el botón Editar --- */}
                                        <button 
                                            onClick={() => handleOpenModal(clan.CLID)} 
                                            className="text-blue-500 hover:underline text-sm"
                                        >
                                            Editar
                                        </button>
                                        {/* --- MODIFICADO: Conectamos el botón Borrar --- */}
                                        <button 
                                            onClick={() => handleDelete(clan.CLID, clan.Name)} 
                                            className="text-red-500 hover:underline text-sm"
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            
            {/* --- NUEVO: Renderizamos el modal y le pasamos las props que necesita --- */}
            <EditClanModal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                clanId={selectedClanId}
                onUpdateSuccess={handleUpdateSuccess}
            />
                        {/* --- RENDERIZAMOS EL NUEVO MODAL DE CREACIÓN --- */}
                        <CreateClanModal 
                isOpen={isCreateModalOpen}
                onRequestClose={() => setIsCreateModalOpen(false)}
                onCreateSuccess={handleCreateSuccess}
            />
        </div>
    );
};

export default ManageClansView;