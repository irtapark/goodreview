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
    <nav className="nav-bar-sticky">
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
              {user.role === 'admin' ? (
                <Link to="/admin" className="btn btn-outline text-blue-600 border-blue-600 flex items-center gap-2">
                  <ShieldCheck size={18} />
                  <span>Panel de Control</span>
                </Link>
              ) : user.role === 'host' ? (
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
              
              <div className="flex items-center gap-3 border-l border-gray-200 pl-4 ml-2 relative group cursor-pointer">
                <div className="text-right hidden md:block">
                  <div className="text-sm font-bold">{user.full_name}</div>
                  <div className="text-xs text-secondary capitalize">{user.role}</div>
                </div>
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-primary" />
                ) : (
                  <UserCircle size={36} className="text-gray-400" />
                )}
                
                {/* Dropdown Desktop */}
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="flex flex-col py-2">
                    <Link to="/profile" className="px-4 py-2 hover:bg-gray-100 text-sm font-medium flex items-center gap-2">
                      <UserCircle size={16} /> Mi Perfil
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="px-4 py-2 hover:bg-gray-100 text-sm font-medium text-red-500 flex items-center gap-2 text-left">
                      <LogOut size={16} /> Cerrar Sesión
                    </button>
                  </div>
                </div>
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
        <div className="sm-hidden nav-mobile-menu">
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
                {user.role === 'admin' ? (
                  <Link to="/admin" className="btn btn-outline text-blue-600 border-blue-600 flex items-center justify-center gap-2" onClick={closeMenu}>
                    <ShieldCheck size={18} />
                    <span>Panel de Control</span>
                  </Link>
                ) : user.role === 'host' ? (
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
                
                <div className="flex flex-col border-t border-gray-200 pt-3 mt-1 gap-3">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover border-2 border-primary" />
                    ) : (
                      <UserCircle size={36} className="text-gray-400" />
                    )}
                    <div>
                      <div className="text-sm font-bold">{user.full_name}</div>
                      <div className="text-xs text-secondary capitalize">{user.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to="/profile" className="btn btn-outline flex-1 flex items-center justify-center gap-2" onClick={closeMenu}>
                      <UserCircle size={18} /> Perfil
                    </Link>
                    <button onClick={handleLogout} className="btn btn-secondary flex-1 flex items-center justify-center gap-2 text-red-500 border-red-200">
                      <LogOut size={18} /> Salir
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
