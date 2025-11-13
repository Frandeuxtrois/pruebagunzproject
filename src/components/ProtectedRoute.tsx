import React from 'react';
import { Navigate } from 'react-router-dom';

// Función para obtener y decodificar el token
const getUserRole = (): string | null => {
    const token = localStorage.getItem('gunzToken');
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        // Devolvemos el rol que guardamos en el token durante el login
        return payload.role;
    } catch (e) {
        // Si el token es inválido, lo tratamos como si no hubiera rol
        return null;
    }
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const userRole = getUserRole();

  // Si el rol del usuario no es 'admin', lo redirigimos a la página de inicio.
  if (userRole !== 'admin') {
    // El componente Navigate es la forma moderna de redirigir en react-router-dom.
    return <Navigate to="/" replace />;
  }

  // Si el rol es 'admin', mostramos el contenido que esta ruta está protegiendo.
  return <>{children}</>;
};

export default ProtectedRoute;```

---

### Fase 3: Crear el "Caparazón" del Panel de Admin

Ahora creamos los componentes base para el Admin CP.

1.  Crea una nueva carpeta: `src/components/admin/`.
2.  Dentro de `src/components/admin/`, crea un archivo llamado `AdminDashboardView.tsx`. Pega esto:

```tsx
// src/components/admin/AdminDashboardView.tsx
import React from 'react';

const AdminDashboardView: React.FC = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Dashboard de Administración</h1>
            <p>¡Bienvenido al Panel de Administración! Desde aquí podrás gestionar el servidor.</p>
            <p>Selecciona una opción del menú para comenzar.</p>
        </div>
    );
};

export default AdminDashboardView;