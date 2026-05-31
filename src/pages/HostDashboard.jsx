import React, { useState, useEffect } from 'react';
import { Wallet, Home as HomeIcon, CheckSquare, Plus, ExternalLink, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function HostDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [host, setHost] = useState(null);
  const [properties, setProperties] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingFunds, setAddingFunds] = useState(false);
  
  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProp, setNewProp] = useState({
    title: '', location: '', description: '', image: '', regularPrice: '', basePercent: '', extraPercent: '', airbnbUrl: '', bookingUrl: ''
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    // Fetch Host Profile
    const hostRes = await supabase.from('users').selectById(user.id);
    if (hostRes.data) setHost(hostRes.data);

    // Fetch Properties
    const propRes = await supabase.from('properties').selectByHostId(user.id);
    if (propRes.data) setProperties(propRes.data);

    // Fetch Claims (Bookings)
    const claimRes = await supabase.from('bookings').selectByHostId(user.id);
    if (claimRes.data) setClaims(claimRes.data);

    setLoading(false);
  };

  useEffect(() => {
    if (!user || user.role !== 'host') {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [user]);

  const handleAddFunds = async (amount) => {
    setAddingFunds(true);
    const newBalance = host.wallet_balance + amount;
    const { data } = await supabase.from('users').update(user.id, { wallet_balance: newBalance });
    if (data) setHost(data);
    setAddingFunds(false);
  };

  const handleVerifyReview = async (claimId, cashbackAmount) => {
    // 1. Check if wallet has enough funds
    if (host.wallet_balance < cashbackAmount) {
      alert("Fondos insuficientes en la billetera virtual. Por favor, recarga saldo.");
      return;
    }
    
    // 2. Deduct funds from wallet
    const newBalance = host.wallet_balance - cashbackAmount;
    await supabase.from('users').update(user.id, { wallet_balance: newBalance });
    
    // 3. Mark claim as paid
    await supabase.from('bookings').update(claimId, { status: 'paid' });
    
    // Reload data
    fetchData();
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    
    const platforms = [];
    if (newProp.airbnbUrl) platforms.push({ name: "Airbnb", url: newProp.airbnbUrl });
    if (newProp.bookingUrl) platforms.push({ name: "Booking.com", url: newProp.bookingUrl });
    
    await supabase.from('properties').insert(user.id, {
      title: newProp.title,
      location: newProp.location,
      description: newProp.description,
      image: newProp.image || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
      regularPrice: parseFloat(newProp.regularPrice) || 0,
      basePercent: parseFloat(newProp.basePercent) || 0,
      extraPercent: parseFloat(newProp.extraPercent) || 0,
      platforms: platforms
    });
    
    setShowAddModal(false);
    setNewProp({title:'', location:'', description:'', image:'', regularPrice:'', basePercent:'', extraPercent:'', airbnbUrl:'', bookingUrl:''});
    fetchData(); // reload
  };

  if (loading) return <div className="container py-20 text-center">Cargando Panel de Anfitrión...</div>;
  if (!host) return <div className="container py-20 text-center">Error: Anfitrión no encontrado.</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-4 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Panel de Anfitrión</h1>
              <p className="text-secondary text-sm">Bienvenido, {host.full_name}</p>
            </div>
            <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200 w-full sm:w-auto justify-between sm:justify-start">
              <div className="flex items-center gap-2">
                <Wallet color="var(--primary-dark)" size={20} />
                <div className="text-xs text-secondary font-bold">SALDO DISPONIBLE</div>
              </div>
              <div className="text-xl font-bold text-green">€{host.wallet_balance.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 md:py-8">
        <div className="grid grid-cols-1 md-grid-cols-4 gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="col-span-1">
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-primary text-white' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
                style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                <Wallet size={18} /> Billetera y Resumen
              </button>
              <button 
                onClick={() => setActiveTab('properties')}
                className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg font-medium transition-colors ${activeTab === 'properties' ? 'bg-primary text-white' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
                style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                <HomeIcon size={18} /> Mis Propiedades ({properties.length})
              </button>
              <button 
                onClick={() => setActiveTab('claims')}
                className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg font-medium transition-colors ${activeTab === 'claims' ? 'bg-primary text-white' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
                style={{ whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                <CheckSquare size={18} /> Reseñas Pendientes ({claims.filter(c => c.status !== 'paid').length})
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md-col-span-3">
            
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="card p-6 md:p-8 bg-white border-2" style={{ borderColor: 'var(--border-color)' }}>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold mb-2">Billetera Virtual (Prepago)</h2>
                      <p className="text-secondary text-sm max-w-lg">
                        Mantenemos estos fondos seguros para garantizarle a tus inquilinos que recibirán su cashback cuando publiquen la reseña de 5 estrellas.
                      </p>
                    </div>
                    <div className="text-left sm:text-right w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                      <div className="text-3xl md:text-4xl font-bold text-green mb-1">€{host.wallet_balance.toFixed(2)}</div>
                      <div className="text-xs font-bold text-secondary">SALDO ACTUAL</div>
                    </div>
                  </div>
                  
                  <hr className="my-6 border-gray-200" />
                  
                  <h3 className="font-bold mb-4">Añadir Fondos</h3>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <button onClick={() => handleAddFunds(100)} disabled={addingFunds} className="btn btn-outline flex-1 py-3">Añadir €100</button>
                    <button onClick={() => handleAddFunds(500)} disabled={addingFunds} className="btn btn-outline flex-1 py-3">Añadir €500</button>
                    <button onClick={() => handleAddFunds(1000)} disabled={addingFunds} className="btn btn-outline flex-1 py-3 text-brand border-brand">Añadir €1000</button>
                  </div>
                </div>
              </div>
            )}

            {/* PROPERTIES TAB */}
            {activeTab === 'properties' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl md:text-2xl font-bold">Mis Propiedades</h2>
                  <button onClick={() => setShowAddModal(true)} className="btn btn-primary flex items-center gap-2" style={{ padding: '0.625rem 1.25rem' }}><Plus size={18} /> Añadir Propiedad</button>
                </div>
                
                {properties.map(prop => (
                  <div key={prop.id} className="card bg-white p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 border border-gray-200">
                    <img src={prop.image} alt={prop.title} className="w-full sm:w-48 h-40 sm:h-32 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-bold mb-1">{prop.title}</h3>
                      <p className="text-xs sm:text-sm text-secondary mb-3">{prop.location}</p>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                          Fórmula: {prop.basePercent}% (1ª noche) + {prop.extraPercent}% (adicionales)
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {prop.platforms && prop.platforms.map((p, i) => (
                          <a key={i} href={p.url} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1 text-secondary hover:text-primary bg-gray-100 px-3 py-1 rounded">
                            <ExternalLink size={12}/> {p.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* CLAIMS TAB */}
            {activeTab === 'claims' && (
              <div className="space-y-6">
                <h2 className="text-xl md:text-2xl font-bold mb-6">Reclamos y Reseñas Pendientes</h2>
                
                {claims.length === 0 ? (
                  <div className="p-8 text-center text-secondary bg-white rounded-xl border border-gray-200">No hay reclamos registrados.</div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white w-full">
                    <table className="w-full text-left" style={{ minWidth: '640px' }}>
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="p-4 text-xs font-bold text-secondary uppercase">ID Reserva</th>
                          <th className="p-4 text-xs font-bold text-secondary uppercase">Plataforma</th>
                          <th className="p-4 text-xs font-bold text-secondary uppercase">Reembolso</th>
                          <th className="p-4 text-xs font-bold text-secondary uppercase">Estado</th>
                          <th className="p-4 text-xs font-bold text-secondary uppercase">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {claims.map(claim => (
                          <tr key={claim.id}>
                            <td className="p-4 font-mono text-sm">{claim.external_booking_id}</td>
                            <td className="p-4 text-sm">{claim.platform}</td>
                            <td className="p-4 font-bold text-green">€{claim.cashback_amount} <span className="text-xs text-secondary font-normal">(Fijo)</span></td>
                            <td className="p-4">
                              {claim.status === 'paid' ? (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                                  <ShieldCheck size={14} /> Pagado
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded" style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                                  Esperando Reseña
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              {claim.status !== 'paid' && (
                                <button 
                                  onClick={() => handleVerifyReview(claim.id, claim.cashback_amount)}
                                  className="btn btn-primary text-xs py-2 px-3 animate-pulse-glow"
                                  style={{ padding: '0.5rem 0.75rem' }}
                                >
                                  Simular: Reseña 5★ Verificada
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
            
          </div>
        </div>
      </div>

      {/* Add Property Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold">Añadir Nueva Propiedad</h2>
              <button onClick={() => setShowAddModal(false)} className="text-secondary hover:text-primary">
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateProperty} className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="form-group col-span-2">
                  <label className="form-label">Título del Anuncio</label>
                  <input required className="form-input" value={newProp.title} onChange={e => setNewProp({...newProp, title: e.target.value})} placeholder="Ej. Villa Frente al Mar" />
                </div>
                <div className="form-group">
                  <label className="form-label">Ubicación</label>
                  <input required className="form-input" value={newProp.location} onChange={e => setNewProp({...newProp, location: e.target.value})} placeholder="Ej. Bali, Indonesia" />
                </div>
                <div className="form-group">
                  <label className="form-label">URL Foto Principal</label>
                  <input className="form-input" value={newProp.image} onChange={e => setNewProp({...newProp, image: e.target.value})} placeholder="https://..." />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Descripción Breve</label>
                <textarea required className="form-input" value={newProp.description} onChange={e => setNewProp({...newProp, description: e.target.value})} rows="2"></textarea>
              </div>

              <h3 className="font-bold mt-6 mb-4 flex items-center gap-2"><Wallet size={18}/> Estrategia de Cashback</h3>
              <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="form-group mb-0">
                  <label className="form-label">Precio Regular (€)</label>
                  <input required type="number" className="form-input" value={newProp.regularPrice} onChange={e => setNewProp({...newProp, regularPrice: e.target.value})} placeholder="100" />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">% 1ª Noche</label>
                  <input required type="number" className="form-input" value={newProp.basePercent} onChange={e => setNewProp({...newProp, basePercent: e.target.value})} placeholder="20" />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">% Extra</label>
                  <input required type="number" className="form-input" value={newProp.extraPercent} onChange={e => setNewProp({...newProp, extraPercent: e.target.value})} placeholder="5" />
                </div>
              </div>

              <h3 className="font-bold mt-6 mb-4 flex items-center gap-2"><ExternalLink size={18}/> Enlaces (Pega la URL de tu anuncio)</h3>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="form-group mb-0">
                  <label className="form-label">Airbnb Link</label>
                  <input className="form-input" value={newProp.airbnbUrl} onChange={e => setNewProp({...newProp, airbnbUrl: e.target.value})} placeholder="https://airbnb.com/..." />
                </div>
                <div className="form-group mb-0">
                  <label className="form-label">Booking.com Link</label>
                  <input className="form-input" value={newProp.bookingUrl} onChange={e => setNewProp({...newProp, bookingUrl: e.target.value})} placeholder="https://booking.com/..." />
                </div>
              </div>

              <div className="flex gap-4 justify-end border-t border-gray-200 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-secondary">Cancelar</button>
                <button type="submit" className="btn btn-primary">Publicar Propiedad</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
