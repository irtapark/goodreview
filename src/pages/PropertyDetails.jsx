import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MapPin, ShieldCheck, CheckCircle2, ChevronLeft, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProperty() {
      const { data, error } = await supabase.from('properties').selectById(id);
      if (!error && data) {
        setProperty(data);
      }
      setLoading(false);
    }
    fetchProperty();
  }, [id]);

  if (loading) return <div className="container py-20 text-center">Cargando detalles...</div>;
  if (!property) return <div className="container py-20 text-center">Propiedad no encontrada</div>;

  return (
    <div className="bg-white">
      <div className="container py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-secondary hover:text-primary transition-colors mb-6 font-medium">
          <ChevronLeft size={20} /> Volver a resultados
        </Link>
        
        <h1 className="text-4xl font-bold mb-2">{property.title}</h1>
        <div className="flex items-center gap-4 text-sm font-medium mb-6">
          <span className="flex items-center gap-1"><Star size={16} fill="#f59e0b" color="#f59e0b"/> {property.rating} ({property.reviews} reseñas)</span>
          <span className="text-gray-300">|</span>
          <span className="flex items-center gap-1 text-secondary"><MapPin size={16}/> {property.location}</span>
          <span className="text-gray-300">|</span>
          <div className="flex gap-2">
            {property.platforms && property.platforms.map((p, index) => (
              <span key={index} className="badge badge-blue">{p.name}</span>
            ))}
          </div>
        </div>

        <div style={{ height: '500px', borderRadius: 'var(--radius-xl)', overflow: 'hidden', marginBottom: '2rem' }}>
          <img src={property.image} alt={property.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        <div className="grid grid-cols-3 gap-12">
          <div className="col-span-2">
            <h2 className="text-2xl font-bold mb-4">Sobre este espacio</h2>
            <p className="text-secondary leading-relaxed mb-8">{property.description}</p>
            
            <h3 className="text-xl font-bold mb-4">Anfitrión: {property.host}</h3>
            <div className="flex items-center gap-2 mb-8">
              <ShieldCheck color="var(--primary-color)" />
              <span className="text-secondary">Identidad verificada en GoodReview</span>
            </div>
            
            <hr className="mb-8" style={{ borderColor: 'var(--border-color)' }} />
            
            <h3 className="text-xl font-bold mb-4">Servicios principales</h3>
            <ul className="grid grid-cols-2 gap-4 text-secondary mb-8">
              <li className="flex items-center gap-2"><CheckCircle2 size={18} color="var(--secondary-color)"/> Piscina Privada</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={18} color="var(--secondary-color)"/> Wi-Fi de alta velocidad</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={18} color="var(--secondary-color)"/> Cocina completa</li>
              <li className="flex items-center gap-2"><CheckCircle2 size={18} color="var(--secondary-color)"/> Aire acondicionado</li>
            </ul>
          </div>

          <div>
            <div className="card p-6" style={{ position: 'sticky', top: '100px' }}>
              <h3 className="text-xl font-bold mb-4">Reservar Propiedad</h3>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl font-bold">€{property.regularPrice}</span>
                <span className="text-secondary">/ noche aprox.</span>
              </div>
              
              <div className="mt-4 p-4 rounded-lg animate-pulse-glow" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div className="flex items-center gap-2 mb-2 text-green font-bold">
                  <ShieldCheck size={20} />
                  Cashback Escalonado
                </div>
                <div className="text-xl font-bold text-green mb-1">
                  {property.basePercent}% <span className="text-sm font-normal">la 1ª noche</span>
                </div>
                <div className="text-lg font-bold text-green mb-2">
                  + {property.extraPercent}% <span className="text-sm font-normal">cada noche extra</span>
                </div>
                <p className="text-xs text-secondary mt-2">
                  Cuantas más noches reserves, mayor será el reembolso proporcional. Regístrate aquí tras reservar para asegurar tu pago.
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <div className="text-sm font-bold text-secondary mb-1">1. Reservar en:</div>
                {property.platforms && property.platforms.map((p, index) => (
                  <a key={index} href={p.url} target="_blank" rel="noreferrer" className="btn btn-secondary flex items-center justify-between" style={{ padding: '0.75rem 1rem' }}>
                    <span className="flex items-center gap-2">
                      <ExternalLink size={16} /> {p.name}
                    </span>
                  </a>
                ))}
                
                <hr className="my-2" style={{ borderColor: 'var(--border-color)' }} />
                
                <Link to={`/claim/${id}`} className="btn btn-primary text-center" style={{ width: '100%', padding: '1rem' }}>
                  2. Registrar Reserva (Cashback)
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
