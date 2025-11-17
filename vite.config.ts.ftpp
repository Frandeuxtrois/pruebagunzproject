import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Devolvemos el objeto de configuración, añadiendo la propiedad 'base'.
    return {
      // --- AÑADIDO: La URL base para el despliegue en producción ---
      // Esto asegura que todos los archivos (CSS, JS, imágenes) se carguen desde la subcarpeta correcta.
      // Asegúrate de que las mayúsculas/minúsculas coincidan con tu carpeta en el FTP.
      base: '/gunz/Gunz2026/',
      
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});