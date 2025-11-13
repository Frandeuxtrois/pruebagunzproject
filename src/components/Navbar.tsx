import React from 'react';

interface NavItemProps {
  children: React.ReactNode;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ children, onClick }) => (
  <li>
    <button onClick={onClick} className="px-4 py-2.5 text-[#444] hover:text-black font-semibold text-[13px] no-underline bg-transparent border-none cursor-pointer">
      {children}
    </button>
  </li>
);

interface NavbarProps {
    onNavItemClick: (view: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavItemClick }) => {
  const navItems = ['Home', 'Novedades', 'Foro', 'Descargas', 'Guías', 'Ranking Clanes', 'Ranking Individual'];

  return (
    <nav className="mb-5 h-12 bg-gradient-to-b from-[#f0f0f0] to-[#cccccc] border border-[#aaa] rounded-lg flex justify-center items-center shadow-inner">
      <ul className="list-none flex p-0 m-0">
        {navItems.map(item => <NavItem key={item} onClick={() => onNavItemClick(item)}>{item}</NavItem>)}
      </ul>
    </nav>
  );
};

export default Navbar;
