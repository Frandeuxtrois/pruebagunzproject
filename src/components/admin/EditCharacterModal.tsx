// src/components/admin/EditCharacterModal.tsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';
// --- NUEVO: Importamos el wrapper de React para SweetAlert ---
import withReactContent from 'sweetalert2-react-content';

// --- NUEVO: Creamos una instancia de SweetAlert para usar en React ---
const MySwal = withReactContent(Swal);

// Interceptor de Axios para enviar el token
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('gunzToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface EditCharacterModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    characterId: number | null;
    onUpdateSuccess: (updatedChar: any) => void;
}

const EditCharacterModal: React.FC<EditCharacterModalProps> = ({ isOpen, onRequestClose, characterId, onUpdateSuccess }) => {
    const [characterData, setCharacterData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    // --- NUEVO: Estado para el campo de texto del ItemID ---
    const [itemId, setItemId] = useState('');
        // --- NUEVO: Estado para controlar la pestaña activa ---
    const [activeTab, setActiveTab] = useState<'stats' | 'items'>('stats');

    // Cargar los datos del personaje cuando el modal se abre
    useEffect(() => {
        if (isOpen && characterId) {
            setIsLoading(true);
            apiClient.get(`/api/admin/character/${characterId}`)
                .then(response => {
                    setCharacterData(response.data);
                })
                .catch(error => {
                    console.error("Error al cargar datos del personaje:", error);
                    MySwal.fire('Error', 'No se pudieron cargar los datos del personaje.', 'error');
                    onRequestClose(); // Cerramos el modal si hay un error
                })
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, characterId, onRequestClose]);

    // Manejar cambios en el formulario
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCharacterData((prevData: any) => ({
            ...prevData,
            [name]: value
        }));
    };

    // Enviar los datos actualizados a la API
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { CID, ...updatedData } = characterData;
        
        apiClient.post('/api/admin/character/update', { cid: CID, updatedData })
            .then(response => {
                MySwal.fire('¡Éxito!', 'Personaje actualizado correctamente.', 'success');
                onUpdateSuccess(characterData); // Devolvemos los datos actualizados al componente padre
                onRequestClose(); // Cerramos el modal
            })
            .catch(error => {
                MySwal.fire('Error', error.response?.data?.message || 'No se pudo actualizar el personaje.', 'error');
            })
            .finally(() => setIsLoading(false));
    };

    // --- NUEVO: Función para manejar la adición de un ítem ---
    const handleAddItem = () => {
        if (!itemId.trim()) {
            MySwal.fire('Campo vacío', 'Por favor, introduce un ItemID.', 'info');
            return;
        }
        setIsLoading(true);
        apiClient.post('/api/admin/character/additem', { cid: characterId, itemId: itemId })
            .then(response => {
                MySwal.fire('¡Ítem Añadido!', response.data.message, 'success');
                setItemId(''); // Limpiamos el campo de texto después de añadir
            })
            .catch(error => {
                MySwal.fire('Error', error.response?.data?.message || 'No se pudo añadir el ítem.', 'error');
            })
            .finally(() => setIsLoading(false));
    };

// --- NUEVA FUNCIÓN PARA BORRAR UN ÍTEM ESPECÍFICO ---
    const handleDeleteItem = () => {
        if (!itemId.trim()) {
            MySwal.fire('Campo vacío', 'Por favor, introduce un ItemID para borrar.', 'info');
            return;
        }
        setIsLoading(true);
        // Llamamos al endpoint que ya creamos en el backend
        apiClient.post('/api/admin/character/deleteitem', { cid: characterId, itemId: itemId })
            .then(response => {
                MySwal.fire('¡Ítem Borrado!', response.data.message, 'success');
                setItemId(''); // Limpiamos el campo
            })
            .catch(error => {
                MySwal.fire('Error', error.response?.data?.message || 'No se pudo borrar el ítem. ¿Estás seguro de que el personaje lo tiene?', 'error');
            })
            .finally(() => setIsLoading(false));
    };

    // --- NUEVO: Función para manejar el vaciado del inventario ---
    const handleClearInventory = () => {
        MySwal.fire({
            title: '¿ESTÁS SEGURO?',
            text: `Vas a borrar TODOS los ítems del inventario de ${characterData.Name}. ¡Esta acción no se puede deshacer!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, ¡Vaciar Inventario!',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoading(true);
                apiClient.post('/api/admin/character/clearinventory', { cid: characterId })
                    .then(response => {
                        MySwal.fire('¡Inventario Vaciado!', response.data.message, 'success');
                    })
                    .catch(error => {
                        MySwal.fire('Error', error.response?.data?.message || 'No se pudo vaciar el inventario.', 'error');
                    })
                    .finally(() => setIsLoading(false));
            }
        });
    };

    // Estilos personalizados para el modal
    const customStyles = {
        content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', marginRight: '-50%', transform: 'translate(-50%, -50%)', width: '500px' },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' }
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Editar Personaje">
            {isLoading || !characterData ? (
                // Vista de carga simple
                <div className="p-8 text-center">Cargando datos del personaje...</div>
            ) : (
                // Estructura principal del modal con pestañas
                <div className="flex flex-col">
                
                    {/* 1. Cabecera Fija */}
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">
                            Editando a: <span className="text-blue-600">{characterData.Name}</span>
                        </h2>
                    </div>

                    {/* 2. Barra de Navegación de Pestañas */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                type="button"
                                onClick={() => setActiveTab('stats')}
                                // Lógica de clases: cambia el estilo si la pestaña está activa
                                className={`py-3 px-5 font-medium text-sm border-b-2 transition-colors duration-200 ${
                                    activeTab === 'stats' 
                                        ? 'border-blue-500 text-blue-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Editar Stats
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('items')}
                                className={`py-3 px-5 font-medium text-sm border-b-2 transition-colors duration-200 ${
                                    activeTab === 'items' 
                                        ? 'border-blue-500 text-blue-600' 
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                Manejar Ítems
                            </button>
                        </nav>
                    </div>

                    {/* 3. Contenido de las Pestañas (se muestra uno u otro) */}
                    <div className="p-1">
                        {/* Contenido de la Pestaña "Editar Stats" */}
                        {activeTab === 'stats' && (
                            <form onSubmit={handleSubmit} className="space-y-1">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                                    <input type="text" name="Name" value={characterData.Name} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nivel</label>
                                    <input type="number" name="Level" value={characterData.Level} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Experiencia (XP)</label>
                                    <input type="number" name="XP" value={characterData.XP} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Bounty (BP)</label>
                                    <input type="number" name="Bounty" value={characterData.Bounty} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div className="flex justify-end pt-4">
                                    <button type="submit" disabled={isLoading} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:bg-blue-300">
                                        {isLoading ? 'Guardando...' : 'Guardar Cambios de Stats'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {/* Contenido de la Pestaña "Manejar Ítems" */}
                        {activeTab === 'items' && (
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-800">Gestionar Ítem por ID</h3>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="number"
                                            placeholder="Escribe un ItemID..."
                                            value={itemId}
                                            onChange={(e) => setItemId(e.target.value)}
                                            className="flex-grow p-2 border border-gray-300 rounded-md"
                                        />
                                        {/* BOTÓN DE AÑADIR (SIN CAMBIOS) */}
                                        <button 
                                            onClick={handleAddItem}
                                            disabled={isLoading}
                                            className="bg-green-500 text-white font-bold py-2 px-3 rounded-md hover:bg-green-600 disabled:bg-green-300"
                                        >
                                            Añadir
                                        </button>
                                        {/* --- NUEVO BOTÓN DE BORRAR --- */}
                                        <button 
                                            onClick={handleDeleteItem}
                                            disabled={isLoading}
                                            className="bg-yellow-500 text-white font-bold py-2 px-3 rounded-md hover:bg-yellow-600 disabled:bg-yellow-300"
                                        >
                                            Borrar
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="border-t border-gray-200 pt-6">
                                    <h3 className="text-lg font-semibold mb-2 text-red-600">Zona Peligrosa</h3>
                                    <button 
                                        onClick={handleClearInventory}
                                        disabled={isLoading}
                                        className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-red-400"
                                    >
                                        Vaciar Inventario Completo
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 4. Pie de Página Fijo */}
                    <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                         <button type="button" onClick={onRequestClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">
                            Cerrar
                         </button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default EditCharacterModal;