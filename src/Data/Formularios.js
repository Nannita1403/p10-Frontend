export const registerForm = [
    { id: 'username', name: 'Usuario', type: 'text' },
    { id: 'email', name: 'Email', type: 'email' },
    { id: 'password', name: 'Contraseña', type: 'password' }
  ];
  export const loginForm = [
    { id: 'username', name: 'Usuario', type: 'text' },
    { id: 'password', name: 'Contraseña', type: 'password' }
  ];
  
  export const createEventForm = [
    { id: 'name', name: 'Nombre del Evento', type: 'text' },
    { 
      id: 'date', 
      name: 'Fecha', 
      type: 'date',
      min: new Date().toISOString().split("T")[0]
    },
    { id: 'location', name: 'Lugar', type: 'text' },
    { id: 'price', name: 'Precio', type: 'number' },
    { id: 'img', name: 'Imagen', type: 'file' }
  ];