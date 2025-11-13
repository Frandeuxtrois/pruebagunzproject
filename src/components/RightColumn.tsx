
import React from 'react';
import LoginBox from './LoginBox';
import WelcomeBox from './WelcomeBox';
import type { User } from '../types';

interface RightColumnProps {
  user: User | null;
  onLogin: (username: string) => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
}

const RightColumn: React.FC<RightColumnProps> = ({ user, onLogin, onLogout, onNavigate }) => {
  return (
    <aside id="right-column">
      {user ? (
        <WelcomeBox 
            username={user.username} 
            onLogout={onLogout} 
            onNavigate={onNavigate}
        />
      ) : (
        <LoginBox onLogin={onLogin} />
      )}
    </aside>
  );
};

export default RightColumn;
