import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, ShieldCheck, Banknote } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperties() {
      const { data, error } = await supabase.from('properties').select('*');
      if (!error && data) {
        setProperties(data);
      }
      setLoading(false);
    }
    fetchProperties();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 text-center" style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: 'white',
        minHeight: '600px',
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
      }}>
        {/* Overlay oscuro */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
        
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <h1 className="font-bold mb-6" style={{ fontSize: '4.5rem', lineHeight: 1.1, letterSpacing: '-0.02em', textShadow: '0 4px 12px rgba(0,0,0,0.8)' }}>
            <span style={{ color: 'white' }}>Viaja Mejor. </span>
            <span style={{ background: 'linear-gradient(135deg, #38bdf8 0%, #34d399 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block', filter: 'drop-shadow(0 0 12px rgba(56, 189, 248, 0.5))' }}>Paga Menos.</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
            Únete al único club de alquiler vacacional donde tu buena reseña vale dinero real. Garantiza una reseña de 5 estrellas en Airbnb o Booking y obtén un reembolso automático.
          </p>
          <div className="flex justify-center gap-4">
            <a href="#destinos" className="btn btn-primary" style={{ padding: '1.25rem 2.5rem', fontSize: '1.125rem' }}>Explorar Destinos</a>
            <a href="#como-funciona" className="btn" style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '2px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)', padding: '1.25rem 2.5rem', fontSize: '1.125rem', display: 'inline-flex', alignItems: 'center' }}>Cómo funciona</a>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-20 bg-white">
        <div className="container">
          <h2 className="font-bold text-center" style={{ fontSize: '2.5rem', marginBottom: '4rem', marginTop: '2rem', letterSpacing: '0.02em' }}>
            La Garantía GoodReview
          </h2>
          <div className="grid grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full mb-4" style={{ backgroundColor: '#e0f2fe' }}>
                <MapPin size={32} color="var(--primary-dark)" />
              </div>
              <h3 className="font-bold mb-2">1. Reserva tu estancia</h3>
              <p className="text-secondary text-sm">Elige entre miles de propiedades premium y acepta los términos de la Garantía GoodReview.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full mb-4" style={{ backgroundColor: '#fef3c7' }}>
                <Star size={32} color="#d97706" />
              </div>
              <h3 className="font-bold mb-2">2. Disfruta y Reseña</h3>
              <p className="text-secondary text-sm">Vive unas vacaciones increíbles y deja una reseña pública de 5 estrellas al finalizar.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="p-4 rounded-full mb-4 animate-pulse-glow" style={{ backgroundColor: '#d1fae5' }}>
                <Banknote size={32} color="var(--secondary-dark)" />
              </div>
              <h3 className="font-bold mb-2">3. Recibe tu Reembolso</h3>
              <p className="text-secondary text-sm">Validamos la reseña y recibes automáticamente el descuento (cashback) en tu tarjeta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="destinos" className="py-20 bg-gray-50">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Propiedades Destacadas</h2>
            <button className="text-brand font-medium">Ver todas →</button>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-secondary">Cargando propiedades...</div>
          ) : (
            <div className="grid grid-cols-3 gap-8">
              {properties.map(prop => (
                <Link to={`/property/${prop.id}`} key={prop.id} className="card group">
                  <div style={{ position: 'relative', height: '240px', overflow: 'hidden' }}>
                    <img src={prop.image} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} className="group-hover:scale-105" />
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'white', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', fontWeight: 'bold' }}>
                      <Star size={14} fill="#f59e0b" color="#f59e0b" /> {prop.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-secondary mb-1">{prop.location}</p>
                    <h3 className="font-bold mb-4">{prop.title}</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm text-secondary line-through">€{prop.regularPrice} / noche</p>
                        <p className="text-xl font-bold text-green">€{prop.goodReviewPrice} <span className="text-sm font-normal text-secondary">/ noche</span></p>
                      </div>
                      <span className="badge badge-green flex items-center gap-1">
                        <ShieldCheck size={14} /> Garantía
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
