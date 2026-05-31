import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Banknote, Star, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ClaimCashback() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [bookingId, setBookingId] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [nights, setNights] = useState(1);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    async function fetchProperty() {
      const { data, error } = await supabase.from('properties').selectById(id);
      if (!error && data) {
        setProperty(data);
        if (data.platforms && data.platforms.length > 0) {
          setSelectedPlatform(data.platforms[0].name);
        }
      }
      setLoading(false);
    }
    fetchProperty();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    const baseValue = property.regularPrice * (property.basePercent / 100);
    const extraValue = property.regularPrice * (nights - 1) * (property.extraPercent / 100);
    const totalCashback = Math.round(baseValue + (nights > 1 ? extraValue : 0));
    
    const newClaim = {
      property_id: property.id,
      guest_id: 999, // Usuario simulado
      host_id: property.host_id,
      external_booking_id: bookingId,
      platform: selectedPlatform,
      status: 'pending_stay', // Pasa a pending_review cuando hacen check-out
      nights: nights,
      cashback_amount: totalCashback
    };

    const { error } = await supabase.from('bookings').insert(newClaim);
    
    setProcessing(false);
    if (!error) {
      setSuccess(true);
    } else {
      alert("Hubo un error registrando tu cashback.");
    }
  };

  if (loading) return <div className="container py-20 text-center">Cargando...</div>;
  if (!property) return <div className="container py-20 text-center">Propiedad no encontrada</div>;

  const baseValue = property.regularPrice * (property.basePercent / 100);
  const extraValue = property.regularPrice * (nights - 1) * (property.extraPercent / 100);
  const totalCashback = Math.round(baseValue + (nights > 1 ? extraValue : 0));

  if (success) {
    return (
      <div className="container py-20 text-center max-w-2xl">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-8" style={{ backgroundColor: '#d1fae5' }}>
          <CheckCircle size={48} color="var(--secondary-dark)" />
        </div>
        <h1 className="text-4xl font-bold mb-4">¡Registro Exitoso!</h1>
        <p className="text-xl text-secondary mb-8">
          Hemos enlazado tu reserva de {selectedPlatform} ({bookingId}) con éxito.
        </p>
        <div className="p-6 rounded-lg mb-8 text-left" style={{ backgroundColor: '#f8fafc', border: '1px solid var(--border-color)' }}>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Banknote color="var(--secondary-color)"/> Instrucciones para tu Reembolso</h3>
          <ul className="space-y-3 text-secondary">
            <li>1. Disfruta tu estancia en <strong>{property.title}</strong>.</li>
            <li>2. Al finalizar, deja una reseña de 5 estrellas en <strong>{selectedPlatform}</strong>.</li>
            <li>3. Vuelve aquí o responde al correo que te enviaremos para confirmar tu reseña.</li>
            <li>4. Verificaremos la reseña y te transferiremos <strong>€{totalCashback}</strong> a tu cuenta.</li>
          </ul>
        </div>
        <Link to="/" className="btn btn-primary">Volver al Inicio</Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 md:py-12">
      <div className="container max-w-4xl">
        <Link to={`/property/${id}`} className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6 md:mb-8 font-medium">
          <ArrowLeft size={20} /> Volver a Propiedad
        </Link>
        
        <h1 className="text-3xl font-bold mb-6 md:mb-8">Reclamar Cashback de GoodReview</h1>

        <div className="grid grid-cols-1 md-grid-cols-2 gap-8 md:gap-12">
          {/* Form */}
          <div>
            <form onSubmit={handleSubmit} className="card p-6 bg-white mb-6 md:mb-8">
              <h2 className="text-xl font-bold mb-6">Detalles de tu Reserva</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Plataforma donde reservaste</label>
                <select 
                  className="w-full p-3 rounded border bg-white focus:outline-none focus:border-brand" 
                  style={{ borderColor: 'var(--border-color)' }}
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                >
                  {property.platforms && property.platforms.map((p, i) => (
                    <option key={i} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">ID de Reserva (Ej: HMX8Y...)</label>
                <input 
                  type="text" 
                  required
                  placeholder={`Tu ID de reserva en ${selectedPlatform}`}
                  className="w-full p-3 rounded border focus:outline-none focus:border-brand" 
                  style={{ borderColor: 'var(--border-color)' }}
                  value={bookingId}
                  onChange={(e) => setBookingId(e.target.value)}
                />
                <p className="text-xs text-secondary mt-1">Encuéntralo en tu correo de confirmación de {selectedPlatform}.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Número de noches reservadas</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  className="w-full p-3 rounded border" 
                  style={{ borderColor: 'var(--border-color)' }}
                  value={nights}
                  onChange={(e) => setNights(parseInt(e.target.value) || 1)}
                />
              </div>

              <div className="p-4 rounded-xl border-2 mb-6" style={{ borderColor: agreed ? 'var(--secondary-color)' : 'var(--border-color)', backgroundColor: agreed ? '#f0fdf4' : 'white', transition: 'all 0.3s' }}>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input 
                    type="checkbox" 
                    required
                    className="mt-1 w-5 h-5"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  <span className="font-medium text-sm">Me comprometo a dejar una reseña de 5 estrellas en {selectedPlatform} al finalizar mi estancia para poder recibir este cashback.</span>
                </label>
              </div>

              <button 
                type="submit"
                className="btn btn-primary w-full text-lg py-4"
                disabled={!agreed || processing || !bookingId}
                style={{ opacity: (agreed && bookingId) ? 1 : 0.5, cursor: (agreed && bookingId) ? 'pointer' : 'not-allowed' }}
              >
                {processing ? 'Registrando...' : 'Registrar Reserva y Asegurar Cashback'}
              </button>
            </form>
          </div>

          {/* Summary */}
          <div>
            <div className="card p-6 sticky top-24">
              <div className="flex gap-4 mb-6">
                <img src={property.image} alt="Property" className="w-24 h-24 object-cover rounded-lg" />
                <div>
                  <p className="text-xs text-secondary mb-1">PROPIEDAD</p>
                  <h3 className="font-bold leading-tight mb-2">{property.title}</h3>
                  <p className="text-xs flex items-center gap-1"><Star size={12} fill="#f59e0b" color="#f59e0b"/> {property.rating}</p>
                </div>
              </div>

              <hr className="my-6" style={{ borderColor: 'var(--border-color)' }} />

              <h3 className="font-bold mb-4 flex items-center gap-2"><ShieldCheck color="var(--secondary-color)"/> Resumen de Cashback</h3>
              
              <div className="flex justify-between mb-2 text-secondary">
                <span>Noches reservadas</span>
                <span>{nights}</span>
              </div>
              <div className="flex justify-between mb-2 text-secondary">
                <span>1ª Noche ({property.basePercent}%)</span>
                <span>€{Math.round(baseValue)}</span>
              </div>
              {nights > 1 && (
                <div className="flex justify-between mb-2 text-secondary">
                  <span>Noches extra ({property.extraPercent}%)</span>
                  <span>€{Math.round(extraValue)}</span>
                </div>
              )}
              <hr className="my-4 border-green-200" />
              <div className="flex justify-between font-bold text-2xl text-green mb-2">
                <span>Total a Reembolsar</span>
                <span>€{totalCashback}</span>
              </div>
              <p className="text-xs text-secondary text-right mb-6">Este monto será transferido a tu cuenta bancaria después de verificar tu reseña.</p>

              <div className="bg-gray-100 p-4 rounded-lg text-sm text-secondary">
                <strong>Importante:</strong> GoodReview no cobra la reserva. El pago de la estancia lo realizas directamente en {selectedPlatform}.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
