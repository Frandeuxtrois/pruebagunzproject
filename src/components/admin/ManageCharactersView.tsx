import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
// --- NUEVO: Importamos el wrapper de React para SweetAlert ---
import withReactContent from 'sweetalert2-react-content';
// --- AÑADIDO: Importamos nuestro componente Modal que faltaba ---
import EditCharacterModal from './EditCharacterModal';

// --- NUEVO: Creamos una instancia de SweetAlert para usar en React ---
const MySwal = withReactContent(Swal);

// Interceptor de Axios para enviar el token de admin
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('gunzToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Definimos la estructura de un personaje para TypeScript
interface Character {
    CID: number;
    AID: number;
    Name: string;
    Level: number;
    UserID: string; // El UserID de la cuenta
    Kills: number;
    Deaths: number;
}

const ManageCharactersView: React.FC = () => {
    // Estados para el formulario
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState('Name');
    
    // Estados para los resultados
    const [searchResults, setSearchResults] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // --- 2. NUEVOS ESTADOS PARA GESTIONAR EL MODAL ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCharId, setSelectedCharId] = useState<number | null>(null);
    
    // --- MODIFICADO: La lógica de búsqueda ahora vive en su propia función ---
    // Esto nos permite llamarla desde diferentes lugares sin simular eventos.
    const doSearch = async () => {
        setIsLoading(true);
        setSearchResults([]);

        try {
            const response = await apiClient.post('/api/admin/character/search', {
                searchTerm,
                searchType
            });
            setSearchResults(response.data);
            if (response.data.length === 0) {
                MySwal.fire('Sin resultados', 'No se encontraron personajes que coincidan con la búsqueda.', 'info');
            }
        } catch (error: any) {
            console.error("Error al buscar personajes:", error);
            MySwal.fire('Error', error.response?.data?.message || 'Ocurrió un error en el servidor.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // --- MODIFICADO: handleSearch ahora solo se encarga del evento del formulario ---
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        doSearch();
    };
     
    const getPlaceholderText = () => {
        switch (searchType) {
            case 'Name': return "Nombre del personaje...";
            case 'CID': return "ID del personaje...";
            case 'UserID': return "UserID de la cuenta...";
            case 'Email': return "Email de la cuenta...";
            default: return "Término de búsqueda...";
        }
    };

    // --- NUEVO: Función para manejar el borrado de un personaje ---
    const handleDelete = (charId: number, charName: string) => {
        MySwal.fire({
            title: `¿Estás seguro?`,
            text: `Vas a borrar al personaje "${charName}" (CID: ${charId}). Esta acción lo marcará como borrado.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡Bórralo!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Hacemos la llamada al endpoint de borrado de admin
                apiClient.post('/api/admin/character/delete', { characterId: charId })
                    .then(response => {
                        MySwal.fire('¡Borrado!', response.data.message, 'success');
                        // Actualizamos la lista de resultados para que el personaje desaparezca de la tabla
                        setSearchResults(prevResults => prevResults.filter(char => char.CID !== charId));
                    })
                    .catch(err => {
                        MySwal.fire('Error', err.response?.data?.message || 'No se pudo borrar el personaje.', 'error');
                    });
            }
        });
    };

    // --- MODIFICADO: La función de borrado por cuenta ahora llama a doSearch() ---
    const handleDeleteAllFromAccount = (accountId: number, userId: string) => {
        MySwal.fire({
            title: '¿ACCIÓN IRREVERSIBLE?',
            html: `Vas a borrar <b>TODOS</b> los personajes de la cuenta <b>${userId}</b> (AID: ${accountId}).<br/>¡Esta acción no se puede deshacer!`,
            icon: 'error',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Sí, ¡Borrar todo!',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                apiClient.post('/api/admin/account/clearcharacters', { accountId })
                    .then(response => {
                        MySwal.fire('¡Éxito!', response.data.message, 'success');
                        // Para reflejar el cambio, volvemos a hacer la búsqueda de forma limpia.
                        doSearch(); 
                    })
                    .catch(err => {
                        MySwal.fire('Error', err.response?.data?.message || 'No se pudieron borrar los personajes.', 'error');
                    });
            }
        });
    };

    // --- 3. NUEVAS FUNCIONES PARA ABRIR Y CERRAR EL MODAL ---
    const handleOpenModal = (charId: number) => {
     console.log("Intentando abrir modal para el personaje con CID:", charId);
        setSelectedCharId(charId); // Guardamos el ID del personaje a editar
        setIsModalOpen(true); // Abrimos el modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCharId(null); // Limpiamos el ID
    };
    
    // --- 4. NUEVA FUNCIÓN PARA ACTUALIZAR LA TABLA DESPUÉS DE EDITAR ---
    const handleUpdateSuccess = (updatedChar: Character) => {
        // Buscamos el personaje en nuestra lista de resultados y actualizamos sus datos
        setSearchResults(prevResults => 
            prevResults.map(char => 
                char.CID === updatedChar.CID ? { ...char, ...updatedChar } : char
            )
        );
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Manejar Personajes</h1>
            
            {/* Formulario de Búsqueda */}
            <form onSubmit={handleSearch} className="bg-white p-4 rounded-lg shadow-md mb-6 flex items-center gap-4">
                <select 
                    value={searchType} 
                    onChange={e => setSearchType(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md"
                >
                    <option value="Name">Por Nombre de Personaje</option>
                    <option value="CID">Por CID de Personaje</option>
                    <option value="UserID">Por UserID de Cuenta</option>
                    <option value="Email">Por Email de Cuenta</option>
                </select>
                <input 
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    // --- MODIFICADO: Usamos la función getPlaceholderText ---
                    placeholder={getPlaceholderText()}
                    className="flex-grow p-2 border border-gray-300 rounded-md"
                />
                <button 
                    type="submit"
                    disabled={isLoading}
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                >
                    {isLoading ? 'Buscando...' : 'Buscar'}
                </button>
            </form>

            {/* Tabla de Resultados */}
            {searchResults.length > 0 && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">CID</th>
                                <th className="p-2">Nombre</th>
                                <th className="p-2">Cuenta (UserID)</th>
                                <th className="p-2">Nivel</th>
                                <th className="p-2">K/D</th>
                                <th className="p-2 text-center">Acciones de Personaje</th>
                                {/* --- AÑADIDO: Cabecera para la nueva columna --- */}
                                <th className="p-2 text-center">Acciones de Cuenta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {searchResults.map(char => (
                                <tr key={char.CID} className="border-b hover:bg-gray-50">
                                    <td className="p-2">{char.CID}</td>
                                    <td className="p-2 font-semibold">{char.Name}</td>
                                    <td className="p-2">{char.UserID}</td>
                                    <td className="p-2">{char.Level}</td>
                                    <td className="p-2">{char.Kills} / {char.Deaths}</td>
                                    <td className="p-2 text-center space-x-2">
                                        {/* --- AÑADIDO: Conectamos la función handleOpenModal al botón Editar --- */}
                                        <button 
                                            onClick={() => handleOpenModal(char.CID)}
                                            className="text-blue-500 hover:underline text-sm"
                                        >
                                            Editar
                                        </button>
                                        {/* --- MODIFICADO: Conectamos la función handleDelete al onClick --- */}
                                        <button 
                                            onClick={() => handleDelete(char.CID, char.Name)}
                                            className="text-red-500 hover:underline text-sm"
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                    {/* --- AÑADIDO: Celda con el nuevo botón --- */}
                                    <td className="p-2 text-center">
                                        <button 
                                            onClick={() => handleDeleteAllFromAccount(char.AID, char.UserID)}
                                            title={`Borrar todos los personajes de la cuenta ${char.UserID}`}
                                            className="text-white bg-red-800 hover:bg-red-900 text-xs py-1 px-2 rounded"
                                        >
                                            Limpiar Cuenta
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* --- AÑADIDO: Renderizamos el componente Modal y le pasamos sus props --- */}
            {/* Este componente es invisible hasta que la prop 'isOpen' es verdadera */}
            <EditCharacterModal 
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                characterId={selectedCharId}
                onUpdateSuccess={handleUpdateSuccess}
            />
        </div>
    );
};

export default ManageCharactersView;