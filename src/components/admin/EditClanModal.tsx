// src/components/admin/EditClanModal.tsx

import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios, { InternalAxiosRequestConfig } from 'axios'; // Importamos el tipo para el interceptor
import Swal from 'sweetalert2';

// Interceptor de Axios
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// --- INTERCEPTOR CORREGIDO ---
// La función DEBE devolver el objeto 'config' para que la petición continúe.
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('gunzToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config; // <-- ESTA LÍNEA ES LA CORRECCIÓN
}, error => {
  return Promise.reject(error);
});


interface EditClanModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    clanId: number | null;
    onUpdateSuccess: (updatedClan: any) => void;
}

const EditClanModal: React.FC<EditClanModalProps> = ({ isOpen, onRequestClose, clanId, onUpdateSuccess }) => {
    const [clanData, setClanData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && clanId) {
            setIsLoading(true);
            apiClient.get(`/api/admin/clan/${clanId}`)
                .then(response => setClanData(response.data))
                .catch(error => {
                    Swal.fire('Error', 'No se pudieron cargar los datos del clan.', 'error');
                    onRequestClose();
                })
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, clanId, onRequestClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setClanData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Renombramos 'Point' a 'Points' en el frontend, pero la DB espera 'Point'.
        // Hacemos una copia de los datos y ajustamos el nombre del campo antes de enviar.
        const dataToSend = { ...clanData };
        if (dataToSend.Points !== undefined) {
            dataToSend.Point = dataToSend.Points;
            delete dataToSend.Points;
        }

        const { CLID, MasterName, ...updatedData } = dataToSend;
        
        apiClient.post('/api/admin/clan/update', { clid: CLID, updatedData })
            .then(() => {
                Swal.fire('¡Éxito!', 'Clan actualizado correctamente.', 'success');
                onUpdateSuccess(clanData);
                onRequestClose();
            })
            .catch(error => Swal.fire('Error', error.response?.data?.message || 'No se pudo actualizar el clan.', 'error'))
            .finally(() => setIsLoading(false));
    };

    const customStyles = {
        content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)', width: '400px' },
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Editar Clan">
            <h2 className="text-xl font-bold mb-4">Editar Clan</h2>
            {isLoading || !clanData ? <p>Cargando...</p> : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm">Nombre del Clan</label>
                        <input type="text" name="Name" value={clanData.Name} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-sm">Máster CID (ID del Personaje)</label>
                        <input type="number" name="MasterCID" value={clanData.MasterCID} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md" />
                        <p className="text-xs text-gray-500 mt-1">Máster Actual: {clanData.MasterName || 'N/A'}</p>
                    </div>
                    <div>
                        <label className="block text-sm">Puntos</label>
                        {/* El nombre del campo aquí es 'Points' para consistencia con el resto de la app */}
                        <input type="number" name="Points" value={clanData.Points} onChange={handleChange} className="mt-1 block w-full p-2 border rounded-md" />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                        <button type="button" onClick={onRequestClose} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50">Cancelar</button>
                        <button type="submit" disabled={isLoading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300">
                            {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            )}
        </Modal>
    );
};

export default EditClanModal;