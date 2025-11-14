import React from 'react';
// --- AÑADIDO: Importamos el componente 'Link' que gestiona la navegación ---
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  children: React.ReactNode;
  // --- MODIFICADO: Cambiamos 'onClick' por 'to' para recibir una URL ---
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({ children, to }) => {
  // --- AÑADIDO (Bonus): Hook para saber en qué página estamos ---
  const location = useLocation();
  // Comprobamos si la URL actual coincide con el enlace de este item
  const isActive = location.pathname === to;

  return (
    <li>
      {/* --- MODIFICADO: Reemplazamos <button> por <Link> --- */}
      {/* El componente Link se encarga de cambiar la URL sin recargar la página */}
      {/* --- MODIFICADO (Bonus): Añadimos un estilo dinámico para el enlace activo --- */}
      <Link 
        to={to} 
        className={`px-4 py-2.5 text-[#444] hover:text-black font-semibold text-[13px] no-underline bg-transparent border-none cursor-pointer ${
          isActive ? 'text-black font-bold' : '' // Si el enlace está activo, lo ponemos en negrita
        }`}
      >
        {children}
      </Link>
    </li>
  );
};

// --- MODIFICADO: La interfaz ya no necesita recibir 'onNavItemClick' ---
interface NavbarProps {
    // onNavItemClick: (view: string) => void; // Esta prop ya no es necesaria
}

const Navbar: React.FC<NavbarProps> = (/* ya no recibe onNavItemClick */) => {
  const navItems = ['Home', 'Novedades', 'Foro', 'Descargas', 'Guías', 'Ranking Clanes', 'Ranking Individual'];

  // --- AÑADIDO: Función para convertir el texto del menú en una URL válida ---
  const generateUrl = (item: string): string => {
    // Caso especial para el 'Home', que debe apuntar a la raíz '/'
    if (item === 'Home') {
      return '/';
    }
    // Para los demás, convertimos a minúsculas y reemplazamos espacios por guiones
    // Ejemplo: "Ranking Clanes" se convierte en "/ranking-clanes"
    return `/${item.toLowerCase().replace(/ /g, '-')}`;
  };

  return (
    <nav className="mb-5 h-12 bg-gradient-to-b from-[#f0f0f0] to-[#cccccc] border border-[#aaa] rounded-lg flex justify-center items-center shadow-inner">
      <ul className="list-none flex p-0 m-0">
        {/* --- MODIFICADO: Ahora pasamos la URL generada al prop 'to' de NavItem --- */}
        {navItems.map(item => (
            <NavItem key={item} to={generateUrl(item)}>
                {item}
            </NavItem>
        ))}
      </ul>
    </nav>
  );
};

export default Navbar;