import './EventForm.css';
import { createEventForm } from '../../../Data/Formularios';
import { UserForm } from '../UserForm/UserForm';
import { listOfEvents } from '../../Events/Section/SectionEvent';
import { showToast } from '../../Toasty/Toasty';
import { Modal } from '../../PartsPage/Modal/Modal';
import { mainRoute } from '../../../Data/Routes';
import { Events } from '../../../pages/Events/Events';

const postEvent = async (e, upcomingEventsDiv) => {
  e.preventDefault();
  const form = e.target; 

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

  const nameInput = form.querySelector('#name');
  const dateInput = form.querySelector('#date');
  if (!nameInput.value || !dateInput.value) {
    showToast('El nombre y la fecha son obligatorios', 'orange');
    return;
  }

  const selectedDate = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0,0,0,0);
  if (selectedDate < today) {
    showToast('No puedes crear eventos en fechas pasadas', 'orange');
    return;
  }

  const imageInput = form.querySelector('#image');
  if (!imageInput || !imageInput.files[0]) {
    showToast('Selecciona una imagen para el evento', 'orange');
    return;
  }

  const formData = new FormData(form);

  try {
    const res = await fetch(`${mainRoute}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const data = await res.json();
  
    if (res.status === 201 && data) {
      showToast(data.message || 'Evento creado con éxito', 'linear-gradient(to right, #00b09b, #96c93d)');
      document.querySelector('#create-event')?.remove();

      if (upcomingEventsDiv) {
        await listOfEvents(upcomingEventsDiv, 'isUpcoming');
      }
        } else {
          showToast(data?.message || 'Error al crear el evento', 'red');
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

export const NewEventForm = (upcomingEventsDiv) => {
  const eventFormContainer = Modal();
  eventFormContainer.id = 'create-event';

  UserForm(eventFormContainer, 'Crea tu propio evento', createEventForm);
  document.body.appendChild(eventFormContainer); 

  const form = eventFormContainer.querySelector('form');
  if (!form) {
    console.error('❌ No se encontró el formulario dentro del modal');
    return;
  }

  // --- Artista ---
  const artistSelectContainer = document.createElement('div');
  artistSelectContainer.classList.add('input-container');
  artistSelectContainer.innerHTML = `
    <label class="iLabel" for="artist">Artista</label>
    <select class="input" id="artist" name="artist" required>
      <option value="">Selecciona un artista</option>
    </select>
  `;
  const submitButton = form.querySelector('button');
  if (submitButton) {
    form.insertBefore(artistSelectContainer, submitButton);
  } else {
    form.appendChild(artistSelectContainer);
  }

  const artistSelect = form.querySelector('#artist');
  fetch(`${mainRoute}/artists`)
    .then(res => res.json())
    .then(listOfArtists => {
      for (const artist of listOfArtists) {
        const option = document.createElement('option');
        option.value = artist._id; 
        option.textContent = artist.name;
        artistSelect.append(option);
      }
    })
    .catch(err => console.error('Error cargando artistas:', err));

  // --- Precio ---
  if (!form.querySelector('#price')) {
    const priceContainer = document.createElement('div');
    priceContainer.classList.add('input-container');
    priceContainer.innerHTML = `
      <label class="iLabel" for="price">Precio (€)</label>
      <input class="input" type="number" id="price" name="price" min="0" step="0.01" placeholder="Ej: 20" required>
    `;
    if (submitButton) {
      form.insertBefore(priceContainer, submitButton);
    } else {
      form.appendChild(priceContainer);
    }
  }

  // --- Vista previa de imagen ---
  const imageInput = form.querySelector('#image');
  if (imageInput) {
    const previewDiv = document.createElement('div');
    previewDiv.id = 'image-preview';
    previewDiv.classList.add('image-preview-container');
    imageInput.insertAdjacentElement('afterend', previewDiv);
    imageInput.addEventListener('change', previewImage);
  }

  form.addEventListener('submit', (e) => postEvent(e, upcomingEventsDiv));
};
