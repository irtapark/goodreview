import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setUser(data.user);
        navigate(data.user.role === 'host' ? '/host' : '/guest');
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: isHost ? 'host' : 'guest'
          }
        }
      });
      if (error) {
        setError(error.message);
      } else {
        setUser(data.user);
        navigate(isHost ? '/host' : '/guest');
      }
    }
    setLoading(false);
  };

  return (
    <div className="container py-20 flex justify-center">
      <div className="card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-brand">GoodReview</h2>
          <p className="text-secondary">
            {isLogin ? 'Bienvenido de nuevo.' : 'Crea tu cuenta para empezar.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm font-medium error-banner-red">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Nombre Completo</label>
              <input 
                required 
                className="form-input" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                placeholder="Ej. Ana García"
              />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Correo Electrónico</label>
            <input 
              required 
              type="email" 
              className="form-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="tu@email.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <input 
              required 
              type="password" 
              className="form-input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="form-group flex items-center gap-2 mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 cursor-pointer" onClick={() => setIsHost(!isHost)}>
              <input 
                type="checkbox" 
                checked={isHost} 
                onChange={() => setIsHost(!isHost)} 
                className="w-4 h-4 text-primary"
              />
              <div>
                <span className="font-bold block">Quiero ser Anfitrión</span>
                <span className="text-xs text-secondary">Marca esta casilla si deseas listar propiedades y gestionar cashbacks.</span>
              </div>
            </div>
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full justify-center py-3 mt-6">
            {loading ? 'Procesando...' : (isLogin ? <><LogIn size={20} /> Iniciar Sesión</> : <><UserPlus size={20} /> Crear Cuenta</>)}
          </button>
        </form>

        <div className="text-center mt-6 text-sm text-secondary">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-bold ml-2 hover:underline">
            {isLogin ? 'Regístrate aquí' : 'Inicia Sesión'}
          </button>
        </div>
      </div>
    </div>
  );
}
