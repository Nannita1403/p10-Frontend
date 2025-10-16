import './EventForm.css';
import { createEventForm } from '../../../Data/Formularios';
import { UserForm } from '../UserForm/UserForm';
import { listOfEvents } from '../../Events/Section/SectionEvent';
import { showToast } from '../../Toasty/Toasty';
import { Modal } from '../../PartsPage/Modal/Modal';
import { mainRoute } from '../../../Data/Routes';

const postEvent = async (e, upcomingEventsDiv) => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button');

  const artistSelect = form.querySelector('#artist');
  if (!artistSelect.value) {
    showToast('Por favor selecciona un artista válido', 'warning');
    return;
  }

  const priceInput = form.querySelector('#price');
  if (!priceInput.value || Number(priceInput.value) < 0) {
    showToast('Introduce un precio válido (>= 0)', 'warning');
    return;
  }

  const nameInput = form.querySelector('#name');
  const dateInput = form.querySelector('#date');
  const locationInput = form.querySelector('#location');
  if (!nameInput.value || !dateInput.value || !locationInput.value) {
    showToast('El nombre, la fecha y la ubicación son obligatorios', 'warning');
    return;
  }

  const selectedDate = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selectedDate < today) {
    showToast('No puedes crear eventos en fechas pasadas', 'warning');
    return;
  }

  const imageInput = form.querySelector('#image');
  if (!imageInput || !imageInput.files[0]) {
    showToast('Selecciona una imagen para el evento', 'warning');
    return;
  }

  const categorySelect = form.querySelector('#category');
  if (!categorySelect.value) {
    showToast('Selecciona una categoría válida', 'warning');
    return;
  }

  const descriptionInput = form.querySelector('#description');
  if (!descriptionInput.value.trim()) {
    showToast('Agrega una descripción para tu evento', 'warning');
    return;
  }

  const formData = new FormData(form);

  submitBtn.classList.add('loading');
  try {
    const res = await fetch(`${mainRoute}/events`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData,
    });

    const data = await res.json();
    submitBtn.classList.remove('loading');

    if (res.status === 201) {
      showToast(data.message || 'Evento creado con éxito', 'success');
      document.querySelector('#create-event')?.remove();
      if (upcomingEventsDiv) await listOfEvents(upcomingEventsDiv, 'isUpcoming');
    } else {
      showToast(data?.message || 'Error al crear el evento', 'error');
    }
  } catch (err) {
    submitBtn.classList.remove('loading');
    showToast('Error de conexión al crear el evento', 'error');
  }
};

const previewImage = (e) => {
  const previewContainer = document.querySelector('#image-preview');
  const file = e.target.files[0];
  if (!file) {
    previewContainer.innerHTML = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    previewContainer.innerHTML = `<img src="${reader.result}" alt="Vista previa de imagen" class="preview-img" />`;
  };
  reader.readAsDataURL(file);
};

const createInputContainer = ({ type = 'text', id, name, placeholder, isTextarea = false }) => {
  const container = document.createElement('div');
  container.classList.add('input-container');

  if (isTextarea) {
    container.innerHTML = `
      <label class="iLabel" for="${id}">${placeholder}</label>
      <textarea class="input" id="${id}" name="${name}" placeholder="${placeholder}" required></textarea>
    `;
  } else if (type === 'select') {
    container.innerHTML = `
      <label class="iLabel" for="${id}">${placeholder}</label>
      <select class="input" id="${id}" name="${name}" required>
        <option value="">Selecciona ${placeholder.toLowerCase()}</option>
      </select>
    `;
  } else {
    container.innerHTML = `
      <label class="iLabel" for="${id}">${placeholder}</label>
      <input class="input" type="${type}" id="${id}" name="${name}" placeholder="${placeholder}" required />
    `;
  }

  return container;
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

  const submitButton = form.querySelector('button');

  form.insertBefore(createInputContainer({ id: 'name', name: 'name', placeholder: 'Nombre del evento' }), submitButton);
  form.insertBefore(createInputContainer({ type: 'date', id: 'date', name: 'date', placeholder: 'Fecha' }), submitButton);
  const dateInput = form.querySelector('#date');
  dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);

  form.insertBefore(createInputContainer({ id: 'location', name: 'location', placeholder: 'Ubicación' }), submitButton);
  form.insertBefore(createInputContainer({ type: 'number', id: 'price', name: 'price', placeholder: 'Precio' }), submitButton);
  const priceInput = form.querySelector('#price');
  priceInput.setAttribute('min', '0');

  const artistContainer = createInputContainer({ type: 'select', id: 'artist', name: 'artist', placeholder: 'Artista' });
  form.insertBefore(artistContainer, submitButton);
  const artistSelect = form.querySelector('#artist');
  fetch(`${mainRoute}/artists`)
    .then(res => res.json())
    .then(listOfArtists => {
      listOfArtists.forEach(artist => {
        const option = document.createElement('option');
        option.value = artist._id;
        option.textContent = artist.name;
        artistSelect.append(option);
      });
    })
    .catch(err => console.error('Error cargando artistas:', err));

  const categoryContainer = createInputContainer({ type: 'select', id: 'category', name: 'category', placeholder: 'Categoría' });
  form.insertBefore(categoryContainer, submitButton);
  const categorySelect = form.querySelector('#category');
  ['Pop','Rock','Indie','Electronica','Reggae','Metal','Mix'].forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categorySelect.append(option);
  });

  form.insertBefore(createInputContainer({ id: 'description', name: 'description', placeholder: 'Descripción', isTextarea: true }), submitButton);

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
