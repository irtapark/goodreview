import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, UserCircle, Search, Menu, X, LogOut } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Navbar() {
  const { user, setUser } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsMenuOpen(false); // Close menu on logout
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav style={{ backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', position: 'sticky', top: 0, zIndex: 50 }}>
      <div className="container flex items-center justify-between py-3 md:py-4">
        <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
          <ShieldCheck size={26} color="var(--secondary-color)" />
          <span className="text-xl md:text-2xl font-bold text-brand">GoodReview</span>
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden sm-flex items-center gap-4">
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
              
              <div className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-2">
                <div className="text-right">
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

        {/* Mobile Hamburger Icon */}
        <button 
          className="sm-hidden p-2 text-secondary hover:text-primary-dark transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="sm-hidden border-top border-gray-200" style={{ backgroundColor: 'var(--surface-color)', padding: '1rem', borderTop: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }}>
          <div className="flex flex-col gap-3">
            <Link to="/" className="btn btn-secondary flex items-center justify-center gap-2" onClick={closeMenu}>
              <Search size={18} />
              <span>Explorar Destinos</span>
            </Link>
            
            {!user ? (
              <Link to="/login" className="btn btn-primary flex items-center justify-center gap-2" onClick={closeMenu}>
                <UserCircle size={18} />
                <span>Iniciar Sesión</span>
              </Link>
            ) : (
              <>
                {user.role === 'host' ? (
                  <Link to="/host" className="btn btn-outline text-brand border-brand flex items-center justify-center gap-2" onClick={closeMenu}>
                    <UserCircle size={18} />
                    <span>Panel de Anfitrión</span>
                  </Link>
                ) : (
                  <Link to="/guest" className="btn btn-outline flex items-center justify-center gap-2" onClick={closeMenu}>
                    <UserCircle size={18} />
                    <span>Mis Reclamos</span>
                  </Link>
                )}
                
                <div className="flex items-center justify-between border-t border-gray-200 pt-3 mt-1">
                  <div>
                    <div className="text-sm font-bold">{user.full_name}</div>
                    <div className="text-xs text-secondary capitalize">{user.role}</div>
                  </div>
                  <button onClick={handleLogout} className="btn btn-secondary flex items-center gap-2 text-red-500 border-red-200">
                    <LogOut size={18} />
                    <span>Salir</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
