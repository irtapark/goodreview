import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserCircle, Search } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { LogOut } from 'lucide-react';

export default function Navbar() {
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav style={{ backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container flex items-center justify-between py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2">
          <ShieldCheck size={26} color="var(--secondary-color)" />
          <span className="text-xl md:text-2xl font-bold text-brand">GoodReview</span>
        </Link>
        
        <div className="flex items-center gap-3 sm:gap-4">
          <Link to="/" className="btn btn-secondary flex items-center gap-2">
            <Search size={18} />
            <span>Explorar Destinos</span>
          </Link>
          
          {!user ? (
            <Link to="/login" className="btn btn-outline flex items-center gap-2">
              <UserCircle size={18} />
              <span>Iniciar Sesión</span>
            </Link>
          ) : (
            <>
              {user.role === 'host' ? (
                <Link to="/host" className="btn btn-outline text-brand border-brand flex items-center gap-2">
                  <UserCircle size={18} />
                  <span>Panel de Anfitrión</span>
                </Link>
              ) : (
                <Link to="/guest" className="btn btn-outline flex items-center gap-2">
                  <UserCircle size={18} />
                  <span>Mis Reclamos</span>
                </Link>
              )}
              
              <div className="flex items-center gap-2 sm:gap-3 border-l border-gray-200 pl-2 sm:pl-4 ml-1 sm:ml-2">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-bold">{user.full_name}</div>
                  <div className="text-xs text-secondary capitalize">{user.role}</div>
                </div>
                <button onClick={handleLogout} className="text-secondary hover:text-red-500 transition-colors p-2" title="Cerrar Sesión">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
