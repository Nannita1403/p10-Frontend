import './EventForm.css';
import { createEventForm } from '../../../Data/Formularios';
import { UserForm } from '../UserForm/UserForm';
import { listOfEvents } from '../../Events/Section/SectionEvent';
import { showToast } from '../../Toasty/Toasty';
import { Modal } from '../../PartsPage/Modal/Modal';
import { mainRoute } from '../../../Data/Routes';

const postEvent = async e => {
  e.preventDefault();

  const form = document.querySelector('#create-event form');
  const formData = new FormData(form);

  const artistSelect = form.querySelector('#artist');
  if (!artistSelect.value) {
    showToast('Selecciona un artista válido', 'orange');
    return;
  }

  const priceInput = form.querySelector('#price');
  if (!priceInput.value || Number(priceInput.value) < 0) {
    showToast('Introduce un precio válido', 'orange');
    return;
  }

  if (!form.querySelector('#name').value || !form.querySelector('#date').value) {
    showToast('El nombre y la fecha son obligatorios', 'orange');
    return;
  }

  const selectedDate = new Date(form.querySelector('#date').value);
  const today = new Date();
  today.setHours(0,0,0,0);
  if (selectedDate < today) {
    showToast('No puedes crear eventos en fechas pasadas', 'orange');
    return;
  }

  const imageInput = form.querySelector('#image');
  if (!imageInput.files[0]) {
    showToast('Selecciona una imagen para el evento', 'orange');
    return;
  }

  try {
    const res = await fetch(`${mainRoute}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (res.status === 201) {
      showToast(data.message || 'Evento creado con éxito', 'linear-gradient(to right, #00b09b, #96c93d)');
      document.querySelector('#create-event')?.remove();
      const upcomingEventsDiv = document.querySelector('section.isUpcoming > div');
      await listOfEvents(upcomingEventsDiv, 'isUpcoming');
    } else {
      showToast(data.message || 'Error al crear el evento', 'red');
    }
  } catch (error) {
    console.error('Error creando evento:', error);
    showToast('Error de conexión al crear el evento', 'red');
  }
};

const previewImage = e => {
  const previewContainer = document.querySelector('#image-preview');
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    previewContainer.innerHTML = `<img src="${reader.result}" alt="Vista previa" class="preview-img" />`;
  };
  reader.readAsDataURL(file);
};

export const NewEventForm = () => {
  const eventFormContainer = Modal();
  eventFormContainer.id = 'create-event';

  UserForm(eventFormContainer, 'Crea tu propio evento', createEventForm);

  const artistSelectContainer = document.createElement('div');
  artistSelectContainer.classList.add('input-container');
  artistSelectContainer.innerHTML = `
    <label class="iLabel" for="artist">Artista</label>
    <select class="input" id="artist" name="artist" required>
      <option value="">Selecciona un artista</option>
    </select>
  `;
  document.querySelector('#create-event form').insertBefore(
    artistSelectContainer,
    document.querySelector('#create-event form button')
  );

  const artistSelect = document.querySelector('#artist');
  fetch(`${mainRoute}/artists`)
    .then(res => res.json())
    .then(listOfArtists => {
      for (const artist of listOfArtists) {
        const option = document.createElement('option');
        option.value = artist._id; 
        option.textContent = artist.name;
        artistSelect.append(option);
      }
    });

  if (!document.querySelector('#price')) {
    const priceContainer = document.createElement('div');
    priceContainer.classList.add('input-container');
    priceContainer.innerHTML = `
      <label class="iLabel" for="price">Precio</label>
      <input class="input" type="number" id="price" name="price" min="0" required>
    `;
    document.querySelector('#create-event form').insertBefore(priceContainer, document.querySelector('#create-event form button'));
  }

   const imageInput = document.querySelector('#image');
  if (imageInput) {
    const previewDiv = document.createElement('div');
    previewDiv.id = 'image-preview';
    previewDiv.classList.add('image-preview-container');
    imageInput.insertAdjacentElement('afterend', previewDiv);
    imageInput.addEventListener('change', previewImage);
  }
  
  document.querySelector('#create-event form').addEventListener('submit', postEvent);
};
