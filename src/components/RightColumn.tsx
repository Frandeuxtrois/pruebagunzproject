import React from 'react';
import LoginBox from './LoginBox';
import WelcomeBox from './WelcomeBox';
import type { User } from '../types';

// --- INTERFAZ SIMPLIFICADA ---
// 'onNavigate' ha sido eliminado. Este componente ya no necesita gestionar la navegación.
interface RightColumnProps {
  user: User | null;
  onLogin: (username: string) => void;
  onLogout: () => void;
}

const RightColumn: React.FC<RightColumnProps> = ({ user, onLogin, onLogout }) => {
  return (
    <aside id="right-column">
      {user ? (
        // --- LLAMADA A WELCOMEBOX SIMPLIFICADA ---
        // Ya no le pasamos la prop 'onNavigate' porque WelcomeBox usa <Link> internamente.
        <WelcomeBox 
            username={user.username} 
            onLogout={onLogout} 
        />
      ) : (
        <LoginBox onLogin={onLogin} />
      )}
    </aside>
  );
};

export default RightColumn;