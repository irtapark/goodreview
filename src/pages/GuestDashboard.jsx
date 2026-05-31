import React, { useState, useEffect } from 'react';
import { Wallet, Star, MapPin, ShieldCheck, CheckSquare, Upload, ArrowLeft, ExternalLink, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function GuestDashboard() {
  const [claims, setClaims] = useState([]);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  
  // Form State
  const [reviewText, setReviewText] = useState('');
  const [reviewScreenshot, setReviewScreenshot] = useState('https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=400&q=80');

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);
    
    // Fetch Claims (Bookings) belonging to this guest
    const claimRes = await supabase.from('bookings').selectByGuestId(user.id);
    const propertiesRes = await supabase.from('properties').select('*');
    
    if (claimRes.data) setClaims(claimRes.data);
    if (propertiesRes.data) setProperties(propertiesRes.data);
    
    setLoading(false);
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [user]);

  const handleOpenUpload = (claim) => {
    setSelectedClaim(claim);
    setReviewText('');
    setShowUploadModal(true);
  };

  const handleSubmitEvidence = async (e) => {
    e.preventDefault();
    if (!selectedClaim) return;
    setSubmitting(true);

    const updates = {
      status: 'pending_review',
      review_text: reviewText,
      review_screenshot: reviewScreenshot,
      submitted_at: new Date().toISOString()
    };

    // Update the booking record in simulated supabase
    const { error } = await supabase.from('bookings').update(selectedClaim.id, updates);
    setSubmitting(false);
    
    if (!error) {
      setShowUploadModal(false);
      fetchData(); // reload
    } else {
      alert("Hubo un error subiendo la evidencia.");
    }
  };

  // Helper to map property id to its details
  const getPropertyDetails = (propertyId) => {
    return properties.find(p => p.id === propertyId) || {};
  };

  if (loading) return <div className="container py-20 text-center text-secondary">Cargando Panel de Huésped...</div>;

  const totalEarned = claims.filter(c => c.status === 'paid').reduce((acc, c) => acc + c.cashback_amount, 0);
  const totalPending = claims.filter(c => c.status !== 'paid').reduce((acc, c) => acc + c.cashback_amount, 0);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-4 md:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Mis Reclamos</h1>
              <p className="text-secondary text-sm">Bienvenido, {user.full_name}. Aquí puedes gestionar tus reembolsos.</p>
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex-1 sm:flex-initial flex items-center gap-3 bg-green-50 px-4 py-2.5 rounded-lg border border-green-200">
                <Wallet color="var(--secondary-color)" size={20} />
                <div className="text-left">
                  <div className="text-xs text-secondary font-bold">A HORROS RECIBIDOS</div>
                  <div className="text-xl font-bold text-green">€{totalEarned.toFixed(2)}</div>
                </div>
              </div>
              <div className="flex-1 sm:flex-initial flex items-center gap-3 bg-yellow-50 px-4 py-2.5 rounded-lg border border-yellow-200">
                <Clock color="#d97706" size={20} />
                <div className="text-left">
                  <div className="text-xs text-secondary font-bold">PENDIENTE</div>
                  <div className="text-xl font-bold text-yellow-700" style={{ color: '#d97706' }}>€{totalPending.toFixed(2)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-xl font-bold">Tus Reservas con Garantía de Cashback</h2>

          {claims.length === 0 ? (
            <div className="card p-12 text-center bg-white text-secondary">
              <AlertCircle size={48} className="mx-auto mb-4 text-light" />
              <h3 className="text-lg font-bold mb-2">Aún no has registrado ninguna reserva</h3>
              <p className="text-sm text-secondary mb-6">Explora nuestros destinos premium para realizar tu primera reserva garantizada.</p>
              <Link to="/" className="btn btn-primary">Buscar Propiedades</Link>
            </div>
          ) : (
            <div className="space-y-6">
              {claims.map(claim => {
                const prop = getPropertyDetails(claim.property_id);
                return (
                  <div key={claim.id} className="card bg-white p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 border border-gray-200">
                    <img src={prop.image || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'} alt={prop.title} className="w-full sm:w-48 h-40 sm:h-32 object-cover rounded-lg flex-shrink-0" />
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                          <div>
                            <h3 className="text-lg font-bold leading-tight">{prop.title}</h3>
                            <p className="text-xs text-secondary flex items-center gap-1 mt-0.5"><MapPin size={12}/> {prop.location}</p>
                          </div>
                          <div>
                            {claim.status === 'paid' && (
                              <span className="badge badge-green flex items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                <ShieldCheck size={14} /> Pagado
                              </span>
                            )}
                            {claim.status === 'pending_review' && (
                              <span className="badge badge-blue flex items-center gap-1" style={{ fontSize: '0.75rem' }}>
                                <Clock size={14} /> Esperando Verificación
                              </span>
                            )}
                            {claim.status === 'pending_stay' && (
                              <span className="badge flex items-center gap-1" style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309' }}>
                                <Clock size={14} /> Durante Estancia / En Proceso
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-4 bg-gray-50 p-3 rounded-lg border border-gray-100 text-xs text-secondary">
                          <div>
                            <strong>Noches:</strong> {claim.nights}
                          </div>
                          <div>
                            <strong>Plataforma:</strong> {claim.platform}
                          </div>
                          <div className="col-span-2 sm:col-span-1">
                            <strong>Reserva Externa:</strong> <span className="font-mono">{claim.external_booking_id}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-3 border-t border-gray-100">
                        <div>
                          <p className="text-xs text-secondary font-bold uppercase">Cashback Reembolsable</p>
                          <p className="text-xl font-bold text-green">€{claim.cashback_amount}</p>
                        </div>

                        <div>
                          {claim.status === 'pending_stay' && (
                            <button 
                              onClick={() => handleOpenUpload(claim)}
                              className="btn btn-primary flex items-center gap-2 text-xs py-2.5"
                              style={{ padding: '0.625rem 1.25rem' }}
                            >
                              <Upload size={14} /> Subir Evidencia de Reseña
                            </button>
                          )}
                          
                          {claim.status === 'pending_review' && (
                            <div className="p-2 rounded bg-blue-50 border border-blue-100 text-xs text-secondary flex items-start gap-2">
                              <MessageSquare size={14} className="mt-0.5" color="var(--primary-color)" />
                              <div>
                                <strong>Reseña enviada:</strong>
                                <p className="italic text-gray-500 mt-1">"{claim.review_text}"</p>
                              </div>
                            </div>
                          )}

                          {claim.status === 'paid' && (
                            <div className="text-xs text-secondary font-semibold flex items-center gap-1 text-green bg-green-50 px-3 py-1.5 rounded">
                              <ShieldCheck size={14} /> Fondos transferidos a tu banco
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Upload Evidence Modal */}
      {showUploadModal && selectedClaim && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Upload size={20} color="var(--secondary-color)" /> Subir Evidencia de Reseña 5★
              </h2>
              <button onClick={() => setShowUploadModal(false)} className="text-secondary hover:text-primary">
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSubmitEvidence} className="p-6">
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg text-xs text-secondary mb-6 flex gap-2">
                <ShieldCheck size={18} color="var(--secondary-color)" className="flex-shrink-0" />
                <div>
                  <strong>Garantía de Reembolso:</strong>
                  <p className="mt-0.5">Para validar tu reembolso de <strong>€{selectedClaim.cashback_amount}</strong>, ingresa el texto de la reseña pública que has dejado en <strong>{selectedClaim.platform}</strong> para esta propiedad.</p>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Copia el Texto de tu Reseña (5 Estrellas)</label>
                <textarea 
                  required 
                  className="form-input" 
                  rows="3" 
                  placeholder="Excelente alojamiento! El anfitrión fue muy atento, el espacio super limpio y las vistas espectaculares. 100% recomendado."
                  value={reviewText}
                  onChange={e => setReviewText(e.target.value)}
                ></textarea>
              </div>

              <div className="form-group mb-6">
                <label className="form-label">Captura de Pantalla de la Reseña (Simulada)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 flex flex-col items-center">
                  <Upload size={32} className="text-gray-400 mb-2" />
                  <p className="text-xs text-secondary font-medium">Captura_Airbnb_Review.png</p>
                  <p className="text-[10px] text-secondary mt-1">GoodReview simula la subida de la imagen seleccionando un mockup premium automáticamente.</p>
                </div>
              </div>

              <div className="flex gap-4 justify-end border-t border-gray-200 pt-6">
                <button type="button" onClick={() => setShowUploadModal(false)} className="btn btn-secondary text-xs">Cancelar</button>
                <button 
                  type="submit" 
                  className="btn btn-primary text-xs" 
                  disabled={submitting || !reviewText}
                  style={{ opacity: reviewText ? 1 : 0.5 }}
                >
                  {submitting ? 'Enviando...' : 'Enviar a Verificación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
