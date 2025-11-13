import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Box from '../Box';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Definimos la estructura de un personaje
interface Character {
    CID: number;
    Name: string;
    Level: number;
    XP: number;
    Kills: number;
    Deaths: number;
    ClanName: string | null;
}

// Creamos una instancia de apiClient para usar nuestro interceptor de token
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('gunzToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));


const UserPanelView: React.FC = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Función para recargar la lista de personajes
    const fetchCharacters = () => {
        setIsLoading(true);
        apiClient.get('/api/characters')
            .then(response => {
                setCharacters(response.data);
            })
            .catch(err => {
                console.error("Error al cargar personajes:", err);
                setError("No se pudo cargar la lista de personajes.");
            })
            .finally(() => setIsLoading(false));
    };

    // Usamos useEffect para cargar los personajes cuando el componente aparece
    useEffect(() => {
        fetchCharacters();
    }, []);

    // Función para manejar el borrado de un personaje
    const handleDelete = (charId: number, charName: string) => {
        MySwal.fire({
            title: `¿Estás seguro de que quieres borrar a ${charName}?`,
            text: "¡Esta acción no se puede deshacer!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡borrar!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                apiClient.post('/api/characters/delete', { characterId: charId })
                    .then(response => {
                        MySwal.fire(
                            '¡Borrado!',
                            `El personaje ${charName} ha sido borrado.`,
                            'success'
                        );
                        // Recargamos la lista para que el personaje borrado desaparezca
                        fetchCharacters(); 
                    })
                    .catch(err => {
                        MySwal.fire(
                            'Error',
                            err.response?.data?.message || 'No se pudo borrar el personaje.',
                            'error'
                        );
                    });
            }
        });
    };


    const renderContent = () => {
        if (isLoading) return <p>Cargando tus personajes...</p>;
        if (error) return <p className="text-red-500">{error}</p>;
        if (characters.length === 0) return <p>No tienes personajes creados en esta cuenta.</p>;

        return (
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="p-2 border-b">Nombre</th>
                        <th className="p-2 border-b text-center">Nivel</th>
                        <th className="p-2 border-b">Clan</th>
                        <th className="p-2 border-b text-center">K/D</th>
                        <th className="p-2 border-b text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {characters.map(char => (
                        <tr key={char.CID} className="hover:bg-gray-100">
                            <td className="p-2 border-b font-semibold">{char.Name}</td>
                            <td className="p-2 border-b text-center">{char.Level}</td>
                            <td className="p-2 border-b">{char.ClanName || 'Sin Clan'}</td>
                            <td className="p-2 border-b text-center">{char.Kills} / {char.Deaths}</td>
                            <td className="p-2 border-b text-center">
                                <button
                                    onClick={() => handleDelete(char.CID, char.Name)}
                                    className="text-red-500 hover:text-red-700 hover:underline text-xs"
                                >
                                    Borrar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <Box title="Panel de Usuario - Mis Personajes">
            <div className="p-4">
                {renderContent()}
            </div>
        </Box>
    );
};

export default UserPanelView;