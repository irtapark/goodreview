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
      <section className="hero-section">
        <div className="hero-overlay" aria-hidden="true"></div>
        
        <div className="container hero-content">
          <h1 className="hero-title font-bold mb-6">
            <span>Viaja Mejor. </span>
            <span className="hero-text-highlight">Paga Menos.</span>
          </h1>
          <p className="hero-subtitle text-lg md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto px-2">
            Únete al único club de alquiler vacacional donde tu buena reseña vale dinero real. Garantiza una reseña de 5 estrellas en Airbnb o Booking y obtén un reembolso automático.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4">
            <a href="#destinos" className="btn btn-primary btn-hero focus-visible-ring">Explorar Destinos</a>
            <a href="#como-funciona" className="btn btn-hero-glass focus-visible-ring">Cómo funciona</a>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className="py-24 md:py-32 section-bg-light">
        <div className="container">
          <h2 className="font-bold text-center text-3xl md:text-4xl section-title mb-16 md:mb-20">
            La Garantía GoodReview
          </h2>
          <div className="grid grid-cols-1 md-grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center p-4">
              <div className="icon-wrapper bg-blue-light mb-4" aria-hidden="true">
                <MapPin size={32} className="text-primary-dark" />
              </div>
              <h3 className="font-bold mb-2 text-xl">1. Reserva tu estancia</h3>
              <p className="text-secondary text-sm">Elige entre miles de propiedades premium y acepta los términos de la Garantía GoodReview.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="icon-wrapper bg-yellow-light mb-4" aria-hidden="true">
                <Star size={32} className="text-yellow-600" />
              </div>
              <h3 className="font-bold mb-2 text-xl">2. Disfruta y Reseña</h3>
              <p className="text-secondary text-sm">Vive unas vacaciones increíbles y deja una reseña pública de 5 estrellas al finalizar.</p>
            </div>
            <div className="flex flex-col items-center p-4">
              <div className="icon-wrapper bg-green-light mb-4 animate-pulse-glow" aria-hidden="true">
                <Banknote size={32} className="text-secondary-dark" />
              </div>
              <h3 className="font-bold mb-2 text-xl">3. Recibe tu Reembolso</h3>
              <p className="text-secondary text-sm">Validamos la reseña y recibes automáticamente el descuento (cashback) en tu tarjeta.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="destinos" className="py-20 md:py-28 bg-color-surface">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Propiedades Destacadas</h2>
            <button className="text-brand font-medium focus-visible-ring">Ver todas →</button>
          </div>
          
          {loading ? (
            <div className="text-center py-12 text-secondary" role="status" aria-live="polite">Cargando propiedades...</div>
          ) : (
            <div className="grid grid-cols-1 sm-grid-cols-2 md-grid-cols-3 gap-6 md:gap-8">
              {properties.map(prop => (
                <Link to={`/property/${prop.id}`} key={prop.id} className="card group focus-visible-ring">
                  <div className="prop-image-container">
                    <img src={prop.image} alt={`Vista exterior o interior de la propiedad: ${prop.title} en ${prop.location}`} className="prop-image group-hover:scale-105" loading="lazy" />
                    <div className="prop-rating" aria-label={`Valoración de ${prop.rating} estrellas`}>
                      <Star size={14} className="fill-yellow text-yellow" aria-hidden="true" /> {prop.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-secondary mb-1">{prop.location}</p>
                    <h3 className="font-bold mb-3 text-lg">{prop.title}</h3>
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-xs text-secondary line-through">€{prop.regularPrice} / noche</p>
                        <p className="text-lg font-bold text-green">€{prop.goodReviewPrice} <span className="text-xs font-normal text-secondary">/ noche</span></p>
                      </div>
                      <span className="badge badge-green flex items-center gap-1 text-xs">
                        <ShieldCheck size={12} aria-hidden="true" /> Garantía
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
