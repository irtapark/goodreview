import React, { useState, useEffect } from 'react';
import { UserCircle, Wallet, Settings, Save, Receipt, ArrowUpRight, ArrowDownLeft, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user } = useAuth();
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    avatar_url: '',
    iban: ''
  });
  
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (user) {
      setProfileData({
        full_name: user.full_name || '',
        email: user.email || '',
        avatar_url: user.avatar_url || '',
        iban: user.iban || ''
      });
      fetchTransactions();
    }
  }, [user]);

  const fetchTransactions = async () => {
    setLoading(true);
    const { data } = await supabase.from('transactions').selectByUserId(user.id);
    if (data) {
      setTransactions(data);
    }
    setLoading(false);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    // Actualizamos el usuario en la DB simulada
    const { error } = await supabase.from('users').update(user.id, profileData);
    setSaving(false);
    
    if (!error) {
      alert("Perfil actualizado correctamente");
      // Forzamos la recarga para que el Navbar agarre el nuevo auth_token actualizado
      window.location.reload();
    } else {
      alert("Error al actualizar el perfil");
    }
  };

  if (!user) return <div className="container py-20 text-center">Inicia sesión para ver tu perfil.</div>;

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header del Perfil */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-8 md:py-12">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              {profileData.avatar_url ? (
                <img src={profileData.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm" />
              ) : (
                <UserCircle size={96} className="text-gray-300 bg-white rounded-full border-4 border-white shadow-sm" />
              )}
              <div className="absolute bottom-0 right-0 bg-primary text-white p-1.5 rounded-full shadow-md cursor-pointer hover:bg-brand transition-colors">
                <Upload size={14} />
              </div>
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{user.full_name}</h1>
              <p className="text-secondary text-sm">{user.email}</p>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-gray-100 text-gray-700 uppercase tracking-wider">
                  {user.role === 'host' ? 'Anfitrión' : 'Huésped'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 md-grid-cols-4 gap-6 md:gap-8">
          
          {/* Sidebar de Navegación */}
          <div className="md:col-span-1">
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 host-tabs-container">
              <button 
                onClick={() => setActiveTab('personal')}
                className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg font-medium transition-colors host-tab-item ${activeTab === 'personal' ? 'bg-primary text-white' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
              >
                <Settings size={18} /> Ajustes de Cuenta
              </button>
              <button 
                onClick={() => setActiveTab('payment')}
                className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg font-medium transition-colors host-tab-item ${activeTab === 'payment' ? 'bg-primary text-white' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
              >
                <Wallet size={18} /> Método de Pago
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg font-medium transition-colors host-tab-item ${activeTab === 'history' ? 'bg-primary text-white' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
              >
                <Receipt size={18} /> Transacciones
              </button>
            </nav>
          </div>

          {/* Contenido Principal */}
          <div className="md:col-span-3">
            
            {/* TAB: Personal Info */}
            {activeTab === 'personal' && (
              <div className="card p-6 md:p-8 bg-white border border-gray-200">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings size={20} color="var(--primary-color)" /> Información Personal</h2>
                
                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="form-group mb-0">
                      <label className="form-label">Nombre Completo</label>
                      <input 
                        type="text" 
                        required 
                        className="form-input" 
                        value={profileData.full_name} 
                        onChange={e => setProfileData({...profileData, full_name: e.target.value})} 
                      />
                    </div>
                    <div className="form-group mb-0">
                      <label className="form-label">Correo Electrónico</label>
                      <input 
                        type="email" 
                        required 
                        className="form-input" 
                        value={profileData.email} 
                        onChange={e => setProfileData({...profileData, email: e.target.value})} 
                        disabled 
                      />
                      <p className="text-[10px] text-gray-400 mt-1">El email no puede ser modificado por seguridad.</p>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">URL de Foto de Perfil</label>
                    <input 
                      type="url" 
                      className="form-input" 
                      placeholder="https://ejemplo.com/mifoto.jpg"
                      value={profileData.avatar_url} 
                      onChange={e => setProfileData({...profileData, avatar_url: e.target.value})} 
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button type="submit" disabled={saving} className="btn btn-primary flex items-center gap-2">
                      <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: Payment Info */}
            {activeTab === 'payment' && (
              <div className="card p-6 md:p-8 bg-white border border-gray-200">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Wallet size={20} color="var(--primary-color)" /> Información Bancaria</h2>
                
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-sm text-secondary mb-6">
                  {user.role === 'host' 
                    ? 'Esta es la cuenta desde donde se realizarán los recargos automáticos para fondear tu Billetera Virtual y poder pagar los cashbacks.' 
                    : 'Ingresa el IBAN de tu cuenta bancaria europea para que podamos transferirte el cashback ganado por tus reseñas.'}
                </div>

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="form-group">
                    <label className="form-label">Número de Cuenta IBAN</label>
                    <input 
                      type="text" 
                      className="form-input font-mono tracking-wider" 
                      placeholder="ESXX XXXX XXXX XXXX XXXX XXXX"
                      value={profileData.iban} 
                      onChange={e => setProfileData({...profileData, iban: e.target.value})} 
                    />
                  </div>
                  
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button type="submit" disabled={saving} className="btn btn-primary flex items-center gap-2">
                      <Save size={16} /> {saving ? 'Guardando...' : 'Guardar Detalles de Pago'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB: History */}
            {activeTab === 'history' && (
              <div className="card p-6 md:p-8 bg-white border border-gray-200">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Receipt size={20} color="var(--primary-color)" /> Historial de Transacciones</h2>
                
                {loading ? (
                  <div className="text-center py-8 text-secondary">Cargando transacciones...</div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                    <Receipt size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-secondary font-medium">Aún no tienes transacciones registradas.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {transactions.map(txn => (
                      <div key={txn.id} className="flex justify-between items-center p-4 rounded-lg border border-gray-100 bg-gray-50">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-full ${txn.type === 'deposit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {txn.type === 'deposit' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                          </div>
                          <div>
                            <p className="font-bold text-sm">
                              {txn.type === 'deposit' ? 'Recarga de Saldo' : 'Retiro / Pago'}
                            </p>
                            <p className="text-xs text-secondary">{new Date(txn.created_at).toLocaleDateString()} a las {new Date(txn.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${txn.type === 'deposit' ? 'text-green-600' : 'text-gray-800'}`}>
                            {txn.type === 'deposit' ? '+' : '-'}€{txn.amount.toFixed(2)}
                          </p>
                          <span className="text-[10px] font-bold text-gray-500 uppercase px-2 py-0.5 rounded-full bg-gray-200 mt-1 inline-block">
                            {txn.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
