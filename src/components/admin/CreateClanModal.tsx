import React, { useState } from 'react';
import Modal from 'react-modal';
import axios, { InternalAxiosRequestConfig } from 'axios';
import Swal from 'sweetalert2';

// --- INTERCEPTOR CORREGIDO ---
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('gunzToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config; // <-- ESTA LÍNEA ES LA CORRECCIÓN
}, error => {
    return Promise.reject(error);
});

interface CreateClanModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    onCreateSuccess: () => void;
}

const CreateClanModal: React.FC<CreateClanModalProps> = ({ isOpen, onRequestClose, onCreateSuccess }) => {
    const [clanName, setClanName] = useState('');
    const [masterCID, setMasterCID] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        apiClient.post('/api/admin/clan/create', { clanName, masterCID })
            .then(() => {
                Swal.fire('¡Éxito!', `El clan '${clanName}' ha sido creado.`, 'success');
                onCreateSuccess(); // Llama a la función para refrescar la búsqueda
                onRequestClose();
                // Limpiamos los campos para la próxima vez
                setClanName('');
                setMasterCID('');
            })
            .catch(error => Swal.fire('Error', error.response?.data?.message || 'No se pudo crear el clan.', 'error'))
            .finally(() => setIsLoading(false));
    };
    
    // Estilos para el modal
    const customStyles = {
        content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)', width: '400px' },
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Crear Nuevo Clan">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Clan</h2>
            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Nuevo Clan</label>
                    <input type="text" value={clanName} onChange={e => setClanName(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">CID del Personaje Máster</label>
                    <input type="number" value={masterCID} onChange={e => setMasterCID(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" required />
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                    <button type="button" onClick={onRequestClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                    <button type="submit" disabled={isLoading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-300">
                        {isLoading ? 'Creando...' : 'Crear Clan'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateClanModal;