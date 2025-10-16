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
  { id: 'name', name: 'name', type: 'text', label: 'Nombre del Evento' },
  { id: 'date', name: 'date', type: 'date', label: 'Fecha', min: new Date().toISOString().split("T")[0] },
  { id: 'location', name: 'location', type: 'text', label: 'Lugar' },
  { id: 'price', name: 'price', type: 'number', label: 'Precio (€)', min: 0 },
  { id: 'image', name: 'image', type: 'file', label: 'Imagen' },
  { id: 'description', name: 'description', type: 'textarea', label: 'Descripción' },
  { id: 'artist', name: 'artist', type: 'select', label: 'Artista' },
  { id: 'category', name: 'category', type: 'select', label: 'Categoría' }
];
