import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';

// Interceptor de Axios para enviar el token
const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_URL });
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('gunzToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

interface EditAccountModalProps {
    isOpen: boolean;
    onRequestClose: () => void;
    accountId: number | null;
    onUpdateSuccess: (updatedAccount: any) => void;
}

const EditAccountModal: React.FC<EditAccountModalProps> = ({ isOpen, onRequestClose, accountId, onUpdateSuccess }) => {
    const [accountData, setAccountData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen && accountId) {
            setIsLoading(true);
            apiClient.get(`/api/admin/account/${accountId}`)
                .then(response => setAccountData(response.data))
                .catch(error => {
                    Swal.fire('Error', 'No se pudieron cargar los datos de la cuenta.', 'error');
                    onRequestClose();
                })
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, accountId, onRequestClose]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAccountData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const { AID, UserID, ...updatedData } = accountData;
        
        apiClient.post('/api/admin/account/update', { aid: AID, updatedData })
            .then(() => {
                Swal.fire('¡Éxito!', 'Cuenta actualizada correctamente.', 'success');
                onUpdateSuccess(accountData);
                onRequestClose();
            })
            .catch(error => Swal.fire('Error', error.response?.data?.message || 'No se pudo actualizar la cuenta.', 'error'))
            .finally(() => setIsLoading(false));
    };

    const customStyles = {
        content: { top: '50%', left: '50%', right: 'auto', bottom: 'auto', transform: 'translate(-50%, -50%)', width: '400px' },
    };

    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles} contentLabel="Editar Cuenta">
            {/* --- MODIFICADO: Añadimos un padding general y un título más limpio --- */}
            <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                    {accountData ? `Editando Cuenta: ${accountData.UserID}` : 'Editar Cuenta'}
                </h2>
                
                {isLoading || !accountData ? (
                    <p>Cargando datos de la cuenta...</p> 
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">UserID (No editable)</label>
                            <input type="text" value={accountData.UserID} disabled className="mt-1 block w-full p-2 bg-gray-100 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input type="text" name="Name" value={accountData.Name} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="Email" value={accountData.Email} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Rango (UGradeID)</label>
                            <select name="UGradeID" value={accountData.UGradeID} onChange={handleChange} className="mt-1 block w-full p-2 border border-gray-300 rounded-md">
                                <option value="255">Administrator</option>
                                <option value="254">Developer</option>
                                <option value="253">Banned</option>
                                <option value="252">Invisible GM</option>
                                <option value="0">User</option>
                            </select>
                        </div>
                        
                        {/* --- BOTONES MODIFICADOS CON ESTILOS DE TAILWIND --- */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <button 
                                type="button" 
                                onClick={onRequestClose}
                                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300"
                            >
                                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </Modal>
    );
};

export default EditAccountModal;