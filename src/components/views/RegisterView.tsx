import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';
import Box from '../Box';

const MySwal = withReactContent(Swal);

const RegisterView: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate(); // Hook para redirigir al usuario

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // --- Validaciones en el Frontend ---
        if (!username || !password || !confirmPassword || !email) {
            MySwal.fire('Campos incompletos', 'Por favor, rellena todos los campos.', 'warning');
            return;
        }
        if (password !== confirmPassword) {
            MySwal.fire('Contraseñas no coinciden', 'Las contraseñas que has introducido no son iguales.', 'error');
            return;
        }

        setIsLoading(true);
        try {
            const apiUrl = `${import.meta.env.VITE_API_URL}/api/register`;
            const response = await axios.post(apiUrl, { username, password, email });

            await MySwal.fire({
                title: '¡Registro Exitoso!',
                text: response.data.message,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
            });

            // Redirigimos al usuario a la página principal para que inicie sesión
            navigate('/');

        } catch (error: any) {
            MySwal.fire('Error en el Registro', error.response?.data?.message || 'Ocurrió un error inesperado.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box title="Registro de Nueva Cuenta">
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre de Usuario</label>
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Confirmar Contraseña</label>
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                </div>
                <div className="pt-2">
                    <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-green-400">
                        {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                    </button>
                </div>
            </form>
        </Box>
    );
};

export default RegisterView;