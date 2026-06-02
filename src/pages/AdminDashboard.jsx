import React, { useState, useEffect } from 'react';
import { Users, Home as HomeIcon, CheckSquare, ShieldCheck, Activity, TrendingUp, AlertCircle, Database } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
    } else {
      fetchData();
    }
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    const usersRes = await supabase.from('users').select('*');
    const propRes = await supabase.from('properties').select('*');
    const claimRes = await supabase.from('bookings').select('*');
    
    if (usersRes.data) setUsers(usersRes.data);
    if (propRes.data) setProperties(propRes.data);
    if (claimRes.data) setClaims(claimRes.data);
    
    setLoading(false);
  };

  if (loading) return <div className="container py-20 text-center">Cargando Panel de Administración...</div>;

  // Cálculos para métricas
  const hosts = users.filter(u => u.role === 'host');
  const guests = users.filter(u => u.role === 'guest');
  const totalWalletBalance = hosts.reduce((acc, curr) => acc + (curr.wallet_balance || 0), 0);
  const totalCashbackPaid = claims.filter(c => c.status === 'paid').reduce((acc, curr) => acc + curr.cashback_amount, 0);
  const pendingClaims = claims.filter(c => c.status !== 'paid');

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Header */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="container py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
                <ShieldCheck size={32} className="text-blue-400" />
                GoodReview <span className="font-light text-slate-400">| Backoffice</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">Modo SuperAdministrador: Tienes acceso total a los datos globales.</p>
            </div>
            <div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 flex items-center gap-3">
              <Activity size={20} className="text-emerald-400" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estado del Sistema</div>
                <div className="text-sm font-bold text-emerald-400">Operativo</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <nav className="flex flex-row md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 host-tabs-container">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg font-medium transition-colors host-tab-item ${activeTab === 'overview' ? 'bg-slate-900 text-white' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
              >
                <TrendingUp size={18} /> Resumen Global
              </button>
              <button 
                onClick={() => setActiveTab('hosts')}
                className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg font-medium transition-colors host-tab-item ${activeTab === 'hosts' ? 'bg-slate-900 text-white' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
              >
                <Users size={18} /> Anfitriones ({hosts.length})
              </button>
              <button 
                onClick={() => setActiveTab('properties')}
                className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg font-medium transition-colors host-tab-item ${activeTab === 'properties' ? 'bg-slate-900 text-white' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
              >
                <HomeIcon size={18} /> Propiedades ({properties.length})
              </button>
              <button 
                onClick={() => setActiveTab('claims')}
                className={`flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg font-medium transition-colors host-tab-item ${activeTab === 'claims' ? 'bg-slate-900 text-white' : 'hover:bg-gray-200 bg-white border border-gray-200'}`}
              >
                <Database size={18} /> Reclamos / Reservas
              </button>
            </nav>
          </div>

          {/* Contenido Principal */}
          <div className="md:col-span-3 space-y-6">
            
            {/* TAB: Overview */}
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-secondary text-sm font-bold uppercase mb-1">Usuarios Totales</div>
                    <div className="text-3xl font-bold">{users.length}</div>
                    <div className="text-xs text-secondary mt-2">{hosts.length} Anfitriones / {guests.length} Huéspedes</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-secondary text-sm font-bold uppercase mb-1">Total Fondeado (Wallet)</div>
                    <div className="text-3xl font-bold text-blue-600">€{totalWalletBalance.toFixed(2)}</div>
                    <div className="text-xs text-secondary mt-2">Saldos retenidos en la plataforma</div>
                  </div>
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="text-secondary text-sm font-bold uppercase mb-1">Cashback Pagado</div>
                    <div className="text-3xl font-bold text-emerald-600">€{totalCashbackPaid.toFixed(2)}</div>
                    <div className="text-xs text-secondary mt-2">A través de {claims.filter(c => c.status === 'paid').length} reclamos</div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><AlertCircle className="text-amber-500" /> Alertas del Sistema</h3>
                  {pendingClaims.length > 0 ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                      Hay <strong>{pendingClaims.length} reservas/reclamos</strong> pendientes de verificación o pago. Recuerda a los anfitriones que revisen sus paneles.
                    </div>
                  ) : (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm">
                      No hay alertas críticas. Todos los cashbacks han sido procesados.
                    </div>
                  )}
                </div>
              </>
            )}

            {/* TAB: Hosts */}
            {activeTab === 'hosts' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold">Gestión de Anfitriones</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-secondary uppercase text-xs">
                      <tr>
                        <th className="p-4 font-bold">ID</th>
                        <th className="p-4 font-bold">Nombre / Correo</th>
                        <th className="p-4 font-bold">IBAN</th>
                        <th className="p-4 font-bold text-right">Saldo Wallet</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {hosts.map(host => (
                        <tr key={host.id} className="hover:bg-gray-50">
                          <td className="p-4 font-mono text-gray-500">{host.id}</td>
                          <td className="p-4">
                            <div className="font-bold">{host.full_name}</div>
                            <div className="text-xs text-gray-500">{host.email}</div>
                          </td>
                          <td className="p-4 font-mono text-xs">{host.iban || <span className="text-gray-400 italic">No configurado</span>}</td>
                          <td className="p-4 text-right font-bold text-emerald-600">€{(host.wallet_balance || 0).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: Properties */}
            {activeTab === 'properties' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold">Propiedades Globales</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-secondary uppercase text-xs">
                      <tr>
                        <th className="p-4 font-bold">Propiedad</th>
                        <th className="p-4 font-bold">Anfitrión ID</th>
                        <th className="p-4 font-bold">Cashback Est.</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {properties.map(prop => (
                        <tr key={prop.id} className="hover:bg-gray-50">
                          <td className="p-4">
                            <div className="font-bold">{prop.title}</div>
                            <div className="text-xs text-gray-500">{prop.location}</div>
                          </td>
                          <td className="p-4 font-mono text-gray-500">{prop.host_id}</td>
                          <td className="p-4">
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">
                              {prop.basePercent}% + {prop.extraPercent}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: Claims */}
            {activeTab === 'claims' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-xl font-bold">Auditoría de Reservas / Reclamos</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200 text-secondary uppercase text-xs">
                      <tr>
                        <th className="p-4 font-bold">ID Ext.</th>
                        <th className="p-4 font-bold">IDs (Huésped / Anfitrión)</th>
                        <th className="p-4 font-bold">Monto</th>
                        <th className="p-4 font-bold">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {claims.map(claim => (
                        <tr key={claim.id} className="hover:bg-gray-50">
                          <td className="p-4 font-mono text-xs">{claim.external_booking_id}</td>
                          <td className="p-4 text-xs text-gray-500">
                            G: {claim.guest_id} <br/> H: {claim.host_id}
                          </td>
                          <td className="p-4 font-bold">€{claim.cashback_amount}</td>
                          <td className="p-4">
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${
                              claim.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                              claim.status === 'pending_review' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {claim.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
