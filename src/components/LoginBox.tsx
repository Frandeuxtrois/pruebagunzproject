// src/components/LoginBox.tsx - AHORA USA VARIABLES DE ENTORNO

import React, { useState } from 'react';
import axios from 'axios';
import Box from './Box';

interface LoginBoxProps {
    onLogin: (username: string) => void;
}

const LoginBox: React.FC<LoginBoxProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!username.trim() || !password.trim()) {
      setError('Por favor, completa ambos campos.');
      setIsLoading(false);
      return;
    }

    try {
      // --- MODIFICACIÓN CLAVE ---
      // Ahora construimos la URL usando la variable de entorno.
      // Esto nos permite tener una URL para desarrollo y otra para producción.
      const apiUrl = `${import.meta.env.VITE_API_URL}/api/login`;
      const response = await axios.post(apiUrl, {
        username: username,
        password: password,
      });

      // Si la API nos devuelve una respuesta exitosa
      if (response.data.success) {
        // --- LÓGICA JWT EN REACT ---
        // Extraemos el token y el nombre de usuario de la respuesta de la API
        const { token, username } = response.data;

        // Guardamos el token en el "localStorage" del navegador.
        // Esto hace que la sesión persista incluso si el usuario cierra la pestaña.
        localStorage.setItem('gunzToken', token);
        
        // Llamamos a la función onLogin, que le dirá al resto de la aplicación
        // que el usuario ha iniciado sesión.
        onLogin(username);
      }

    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        // Mostramos el mensaje de error que nos envía nuestra API
        setError(err.response.data.message);
      } else {
        setError('No se pudo conectar al servidor de login.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box title="Login" contentClassName="p-4">
      <form onSubmit={handleSubmit}>
        {/* El resto del formulario JSX no cambia en absoluto, solo la lógica de envío */}
        <label htmlFor="username" className="text-[11px] text-[#555] mb-0.5 block">Username:</label>
        <input 
            type="text" 
            id="username" 
            name="username" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-1.5 border border-[#aaa] rounded-md mb-2 bg-[#f0f0f0] shadow-inner"
            disabled={isLoading}
        />
        <label htmlFor="password" className="text-[11px] text-[#555] mb-0.5 block">Password:</label>
        <input 
            type="password" 
            id="password" 
            name="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-1.5 border border-[#aaa] rounded-md mb-2 bg-[#f0f0f0] shadow-inner"
            disabled={isLoading}
        />
        
        {error && <p className="text-red-500 text-xs text-center my-2">{error}</p>}
        
        <input 
            type="submit" 
            value={isLoading ? 'Entrando...' : 'Entrar'} 
            disabled={isLoading}
            className="w-full py-1.5 font-bold bg-gradient-to-b from-[#e8e8e8] to-[#c8c8c8] border border-[#aaa] rounded-md text-[#444] cursor-pointer hover:from-[#f0f0f0] hover:to-[#cccccc] disabled:opacity-50"
        />
      </form>
      <div className="text-center mt-4 text-[11px]">
        <a href="#" className="block my-1 text-[#555] hover:underline">Sos nuevo? registrate aca!</a>
      </div>
    </Box>
  );
};

export default LoginBox;