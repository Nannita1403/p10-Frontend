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
  if (!artistSelect.value) return showToast('Selecciona un artista válido', 'warning');

  const priceInput = form.querySelector('#price');
  if (!priceInput.value || Number(priceInput.value) < 0) return showToast('Introduce un precio válido (>=0)', 'warning');

  const nameInput = form.querySelector('#name');
  const dateInput = form.querySelector('#date');
  const locationInput = form.querySelector('#location');
  if (!nameInput.value || !dateInput.value || !locationInput.value)
    return showToast('Nombre, fecha y ubicación son obligatorios', 'warning');

  const selectedDate = new Date(dateInput.value);
  const today = new Date();
  today.setHours(0,0,0,0);
  if (selectedDate < today) return showToast('No puedes crear eventos en fechas pasadas', 'warning');

  const imageInput = form.querySelector('#image');
  if (!imageInput || !imageInput.files[0]) return showToast('Selecciona una imagen', 'warning');

  const categorySelect = form.querySelector('#category');
  if (!categorySelect.value) return showToast('Selecciona una categoría', 'warning');

  const descriptionInput = form.querySelector('#description');
  if (!descriptionInput.value.trim()) return showToast('Agrega una descripción', 'warning');

  const formData = new FormData(form);
  submitBtn.classList.add('loading');

  try {
    const res = await fetch(`${mainRoute}/events`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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
  } catch {
    submitBtn.classList.remove('loading');
    showToast('Error de conexión', 'error');
  }
};

const previewImage = (e) => {
  const preview = document.querySelector('#image-preview');
  const file = e.target.files[0];
  preview.innerHTML = '';
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => preview.innerHTML = `<img src="${reader.result}" class="preview-img" />`;
  reader.readAsDataURL(file);
};

const createInputContainer = ({ type='text', id, name, placeholder, isTextarea=false, options=[] }) => {
  const container = document.createElement('div');
  container.className = 'input-container';

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
    const select = container.querySelector('select');
    options.forEach(opt => {
      const option = document.createElement('option');
      option.value = opt;
      option.textContent = opt;
      select.append(option);
    });
  } else {
    container.innerHTML = `
      <label class="iLabel" for="${id}">${placeholder}</label>
      <input class="input" type="${type}" id="${id}" name="${name}" placeholder="${placeholder}" required />
    `;
  }

  return container;
};

export const NewEventForm = (upcomingEventsDiv) => {
  const modal = Modal();
  modal.id = 'create-event';
  UserForm(modal, 'Crea tu propio evento', createEventForm);
  document.body.appendChild(modal);

  const form = modal.querySelector('form');
  if (!form) return console.error('No se encontró el formulario');

  const submitBtn = form.querySelector('button');

  // Campos del formulario
  form.append(createInputContainer({ id:'name', name:'name', placeholder:'Nombre del evento' }));

  const dateContainer = createInputContainer({ type:'date', id:'date', name:'date', placeholder:'Fecha' });
  form.append(dateContainer);
  dateContainer.querySelector('input').setAttribute('min', new Date().toISOString().split('T')[0]);

  form.append(createInputContainer({ id:'location', name:'location', placeholder:'Ubicación' }));

  const priceContainer = createInputContainer({ type:'number', id:'price', name:'price', placeholder:'Precio' });
  form.append(priceContainer);
  priceContainer.querySelector('input').setAttribute('min','0');

  // Artista
  const artistContainer = createInputContainer({ type:'select', id:'artist', name:'artist', placeholder:'Artista' });
  form.append(artistContainer);
  const artistSelect = artistContainer.querySelector('select');
  fetch(`${mainRoute}/artists`)
    .then(res => res.json())
    .then(list => list.forEach(a => {
      const opt = document.createElement('option');
      opt.value = a._id;
      opt.textContent = a.name;
      artistSelect.append(opt);
    }));

  // Categoría
  const categoryContainer = createInputContainer({
    type:'select',
    id:'category',
    name:'category',
    placeholder:'Categoría',
    options:['Pop','Rock','Indie','Electronica','Reggae','Metal','Mix']
  });
  form.append(categoryContainer);

  // Descripción
  form.append(createInputContainer({ id:'description', name:'description', placeholder:'Descripción', isTextarea:true }));

  const imageInput = form.querySelector('#image');
  if (imageInput) {
    const previewDiv = document.createElement('div');
    previewDiv.id = 'image-preview';
    previewDiv.className = 'image-preview-container';
    imageInput.insertAdjacentElement('afterend', previewDiv);
    imageInput.addEventListener('change', previewImage);
  }

  form.addEventListener('submit', e => postEvent(e, upcomingEventsDiv));
};
