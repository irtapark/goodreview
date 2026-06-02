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
    { id: 101, role: 'host', full_name: 'Carlos M.', email: 'carlos@goodreview.com', password: 'password', wallet_balance: 500, avatar_url: '', iban: '' },
    { id: 102, role: 'host', full_name: 'Elena R.', email: 'elena@goodreview.com', password: 'password', wallet_balance: 0, avatar_url: '', iban: '' },
    { id: 103, role: 'host', full_name: 'Markus T.', email: 'markus@goodreview.com', password: 'password', wallet_balance: 150, avatar_url: '', iban: '' },
    { id: 999, role: 'guest', full_name: 'Usuario Invitado', email: 'guest@goodreview.com', password: 'password', avatar_url: '', iban: '' },
    { id: 1000, role: 'admin', full_name: 'Super Admin', email: 'admin@goodreview.com', password: 'password', avatar_url: '', iban: '' }
  ],
  transactions: [
    { id: 1, user_id: 101, type: 'deposit', amount: 500, status: 'completed', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 2, user_id: 103, type: 'deposit', amount: 150, status: 'completed', created_at: new Date(Date.now() - 172800000).toISOString() }
  ]
};

const DB_KEY = 'goodreview_db_v7';

if (!localStorage.getItem(DB_KEY)) {
  localStorage.setItem(DB_KEY, JSON.stringify(INITIAL_DATA));
}

export const supabase = {
  from: (tableName) => {
    return {
      select: async (query = '*') => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const db = JSON.parse(localStorage.getItem(DB_KEY));
        return { data: db[tableName] || [], error: null };
      },
      selectById: async (id) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const db = JSON.parse(localStorage.getItem(DB_KEY));
        const record = (db[tableName] || []).find(item => item.id == id);
        return { data: record, error: record ? null : new Error('Not found') };
      },
      selectByHostId: async (hostId) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const db = JSON.parse(localStorage.getItem(DB_KEY));
        const records = (db[tableName] || []).filter(item => item.host_id == hostId);
        return { data: records, error: null };
      },
      selectByGuestId: async (guestId) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const db = JSON.parse(localStorage.getItem(DB_KEY));
        const records = (db[tableName] || []).filter(item => item.guest_id == guestId);
        return { data: records, error: null };
      },
      selectByUserId: async (userId) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const db = JSON.parse(localStorage.getItem(DB_KEY));
        const records = (db[tableName] || []).filter(item => item.user_id == userId);
        // sort by created_at descending
        records.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        return { data: records, error: null };
      },
      insert: async (newRecord) => {
        await new Promise(resolve => setTimeout(resolve, 500));
        const db = JSON.parse(localStorage.getItem(DB_KEY));
        if (!db[tableName]) db[tableName] = [];
        
        const recordToInsert = {
          ...newRecord,
          id: Date.now(),
          created_at: new Date().toISOString()
        };
        
        db[tableName].push(recordToInsert);
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        
        return { data: recordToInsert, error: null };
      },
      update: async (id, updates) => {
        await new Promise(resolve => setTimeout(resolve, 300));
        const db = JSON.parse(localStorage.getItem(DB_KEY));
        const index = (db[tableName] || []).findIndex(item => item.id == id);
        
        if (index === -1) return { data: null, error: new Error('Not found') };
        
        db[tableName][index] = { ...db[tableName][index], ...updates };
        localStorage.setItem(DB_KEY, JSON.stringify(db));
        
        // Si actualizamos un usuario logueado, actualizar su token en localstorage
        const currentToken = localStorage.getItem('goodreview_auth_token');
        if (currentToken && tableName === 'users') {
          const parsedToken = JSON.parse(currentToken);
          if (parsedToken.id == id) {
            localStorage.setItem('goodreview_auth_token', JSON.stringify(db[tableName][index]));
          }
        }
        
        return { data: db[tableName][index], error: null };
      }
    };
  },
  
  auth: {
    signUp: async ({ email, password, options }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const db = JSON.parse(localStorage.getItem(DB_KEY));
      const existing = (db.users || []).find(u => u.email === email);
      if (existing) return { data: null, error: new Error('El usuario ya existe') };
      
      const newUser = {
        id: Date.now(),
        email,
        password, // In real app, this is hashed
        full_name: options?.data?.full_name || email.split('@')[0],
        role: options?.data?.role || 'guest',
        wallet_balance: 0,
        avatar_url: '',
        iban: '',
        created_at: new Date().toISOString()
      };
      
      if (!db.users) db.users = [];
      db.users.push(newUser);
      localStorage.setItem(DB_KEY, JSON.stringify(db));
      
      // Auto login
      localStorage.setItem('goodreview_auth_token', JSON.stringify(newUser));
      return { data: { user: newUser }, error: null };
    },
    signInWithPassword: async ({ email, password }) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      const db = JSON.parse(localStorage.getItem(DB_KEY));
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
        // Obtenemos los datos frescos del usuario desde la DB local por si han cambiado
        const db = JSON.parse(localStorage.getItem(DB_KEY));
        const userId = JSON.parse(token).id;
        const freshUser = (db.users || []).find(u => u.id == userId);
        if (freshUser) {
          localStorage.setItem('goodreview_auth_token', JSON.stringify(freshUser));
          return { data: { session: { user: freshUser } }, error: null };
        }
      }
      return { data: { session: null }, error: null };
    }
  }
};
