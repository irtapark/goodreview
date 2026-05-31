// Simulador de Supabase usando LocalStorage
const INITIAL_DATA = {
  properties: [
    {
      id: 1,
      host_id: 101,
      title: "Villa Esmeralda con Vista al Mar",
      location: "Ibiza, España",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      rating: 4.98,
      reviews: 124,
      host: "Carlos M.",
      description: "Espectacular villa de diseño con vistas panorámicas al Mediterráneo.",
      regularPrice: 350,
      basePercent: 20,
      extraPercent: 5,
      platforms: [
        { name: "Airbnb", url: "https://airbnb.com/mock-link-1" },
        { name: "Booking.com", url: "https://booking.com/mock-link-1" }
      ]
    },
    {
      id: 2,
      host_id: 102,
      title: "Ático de Lujo en el Centro Histórico",
      location: "Roma, Italia",
      image: "https://images.unsplash.com/photo-1502672260266-1c1e5250ad99?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 5.0,
      reviews: 89,
      host: "Elena R.",
      description: "Ático renovado del siglo XVIII a pasos del Coliseo.",
      regularPrice: 220,
      basePercent: 15,
      extraPercent: 3,
      platforms: [
        { name: "Booking.com", url: "https://booking.com/mock-link-2" }
      ]
    },
    {
      id: 3,
      host_id: 103,
      title: "Cabaña Moderna en el Bosque",
      location: "Alpes Suizos",
      image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      rating: 4.95,
      reviews: 56,
      host: "Markus T.",
      description: "Desconexión total en la naturaleza con sauna privada.",
      regularPrice: 400,
      basePercent: 20,
      extraPercent: 5,
      platforms: [
        { name: "Airbnb", url: "https://airbnb.com/mock-link-3" },
        { name: "Booking.com", url: "https://booking.com/mock-link-3" }
      ]
    }
  ],
  bookings: [
    {
      id: 10001,
      property_id: 1,
      guest_id: 999,
      host_id: 101,
      external_booking_id: "HMX8YZ2026",
      platform: "Airbnb",
      status: "pending_review",
      nights: 3,
      cashback_amount: 70,
      created_at: new Date().toISOString()
    }
  ],
  users: [
    { id: 101, role: 'host', full_name: 'Carlos M.', wallet_balance: 500 },
    { id: 102, role: 'host', full_name: 'Elena R.', wallet_balance: 0 },
    { id: 103, role: 'host', full_name: 'Markus T.', wallet_balance: 150 },
    { id: 999, role: 'guest', full_name: 'Usuario Invitado' }
  ]
};

if (!localStorage.getItem('goodreview_db_v5')) {
  localStorage.setItem('goodreview_db_v5', JSON.stringify(INITIAL_DATA));
}

export const supabase = {
  from: (tableName) => {
    return {
      select: async (query = '*') => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const db = JSON.parse(localStorage.getItem('goodreview_db_v5'));
        return { data: db[tableName] || [], error: null };
      },
      selectById: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const db = JSON.parse(localStorage.getItem('goodreview_db_v5'));
        const record = (db[tableName] || []).find(item => item.id == id);
        return { data: record, error: record ? null : new Error('Not found') };
      },
      selectByHostId: async (hostId) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const db = JSON.parse(localStorage.getItem('goodreview_db_v5'));
        const records = (db[tableName] || []).filter(item => item.host_id == hostId);
        return { data: records, error: null };
      },
      selectByGuestId: async (guestId) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const db = JSON.parse(localStorage.getItem('goodreview_db_v5'));
        const records = (db[tableName] || []).filter(item => item.guest_id == guestId);
        return { data: records, error: null };
      },
      insert: async (newRecord) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const db = JSON.parse(localStorage.getItem('goodreview_db_v5'));
        if (!db[tableName]) db[tableName] = [];
        
        const recordToInsert = {
          ...newRecord,
          id: Date.now(),
          created_at: new Date().toISOString()
        };
        
        db[tableName].push(recordToInsert);
        localStorage.setItem('goodreview_db_v5', JSON.stringify(db));
        
        return { data: recordToInsert, error: null };
      },
      update: async (id, updates) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const db = JSON.parse(localStorage.getItem('goodreview_db_v5'));
        const index = (db[tableName] || []).findIndex(item => item.id == id);
        
        if (index === -1) return { data: null, error: new Error('Not found') };
        
        db[tableName][index] = { ...db[tableName][index], ...updates };
        localStorage.setItem('goodreview_db_v5', JSON.stringify(db));
        
        return { data: db[tableName][index], error: null };
      }
    };
  },
  
  auth: {
    signUp: async ({ email, password, options }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const db = JSON.parse(localStorage.getItem('goodreview_db_v5'));
      const existing = (db.users || []).find(u => u.email === email);
      if (existing) return { data: null, error: new Error('El usuario ya existe') };
      
      const newUser = {
        id: Date.now(),
        email,
        password, // In real app, this is hashed
        full_name: options?.data?.full_name || email.split('@')[0],
        role: options?.data?.role || 'guest',
        wallet_balance: 0,
        created_at: new Date().toISOString()
      };
      
      if (!db.users) db.users = [];
      db.users.push(newUser);
      localStorage.setItem('goodreview_db_v5', JSON.stringify(db));
      
      // Auto login
      localStorage.setItem('goodreview_auth_token', JSON.stringify(newUser));
      return { data: { user: newUser }, error: null };
    },
    signInWithPassword: async ({ email, password }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const db = JSON.parse(localStorage.getItem('goodreview_db_v5'));
      const user = (db.users || []).find(u => u.email === email && u.password === password);
      if (!user) return { data: null, error: new Error('Credenciales inválidas') };
      
      localStorage.setItem('goodreview_auth_token', JSON.stringify(user));
      return { data: { user }, error: null };
    },
    signOut: async () => {
      await new Promise(resolve => setTimeout(resolve, 200));
      localStorage.removeItem('goodreview_auth_token');
      return { error: null };
    },
    getSession: async () => {
      const token = localStorage.getItem('goodreview_auth_token');
      if (token) {
        return { data: { session: { user: JSON.parse(token) } }, error: null };
      }
      return { data: { session: null }, error: null };
    }
  }
};
