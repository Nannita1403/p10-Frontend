import './EventForm.css';
import { UserForm } from '../UserForm/UserForm';
import { listOfEvents } from '../../Events/Section/SectionEvent';
import { showToast } from '../../Toasty/Toasty';
import { Modal } from '../../PartsPage/Modal/Modal';
import { mainRoute } from '../../../Data/Routes';
import { createEventForm } from '../../../Data/Formularios';

const postEvent = async (e, upcomingEventsDiv) => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button');

  // Validaciones
  const artist = form.querySelector('#artist');
  const category = form.querySelector('#category');
  const price = form.querySelector('#price');
  const name = form.querySelector('#name');
  const date = form.querySelector('#date');
  const location = form.querySelector('#location');
  const image = form.querySelector('#image');
  const description = form.querySelector('#description');

  if (!artist.value) return showToast('Selecciona un artista válido', 'warning');
  if (!category.value) return showToast('Selecciona una categoría', 'warning');
  if (!price.value || Number(price.value) < 0) return showToast('Precio inválido', 'warning');
  if (!name.value || !date.value || !location.value) return showToast('Nombre, fecha y ubicación son obligatorios', 'warning');

  const selectedDate = new Date(date.value);
  const today = new Date(); today.setHours(0,0,0,0);
  if (selectedDate < today) return showToast('No puedes crear eventos en fechas pasadas', 'warning');

  if (!image.files[0]) return showToast('Selecciona una imagen', 'warning');
  if (!description.value.trim()) return showToast('Agrega una descripción', 'warning');

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
    } else showToast(data?.message || 'Error al crear el evento', 'error');
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
  reader.onload = () => preview.innerHTML = `<img src="${reader.result}" class="preview-img"/>`;
  reader.readAsDataURL(file);
};

const ensureSelect = (form, fieldId, options) => {
  let field = form.querySelector(`#${fieldId}`);
  if (!field) return;

  if (field.tagName.toLowerCase() !== 'select') {
    const select = document.createElement('select');
    select.id = fieldId;
    select.name = fieldId;
    select.className = 'input';
    field.replaceWith(select);
    field = select;
  }

field.innerHTML = '<option value="" disabled selected>Selecciona...</option>';
  options.forEach(opt => {
    const option = document.createElement('option');
    if (typeof opt === 'string') {
      option.value = opt;
      option.textContent = opt;
    } else {
      option.value = opt._id;
      option.textContent = opt.name;
    }
    field.append(option);
  });
};

export const NewEventForm = (upcomingEventsDiv) => {
  const modal = Modal();
  modal.id = 'create-event';

  // Aquí usamos el formulario que ya viene completo
  UserForm(modal, 'Crea tu propio evento', createEventForm);
  document.body.appendChild(modal);

  const form = modal.querySelector('form');
  if (!form) return console.error('No se encontró el formulario');

  // Preview de imagen
  const imageInput = form.querySelector('#image');
  if (imageInput) {
    const previewDiv = document.createElement('div');
    previewDiv.id = 'image-preview';
    previewDiv.className = 'image-preview-container';
    imageInput.insertAdjacentElement('afterend', previewDiv);
    imageInput.addEventListener('change', previewImage);
  }

    // Llenar artistas desde API
  fetch(`${mainRoute}/artists`)
    .then(res => res.json())
    .then(list => Array.isArray(list) && ensureSelect(form, 'artist', list))
    .catch(err => console.error('Error cargando artistas:', err));

  // Categorías fijas
  ensureSelect(form, 'category', ['Pop', 'Rock', 'Indie', 'Electrónica', 'Reggae', 'Metal', 'Mix']);

  form.addEventListener('submit', e => postEvent(e, upcomingEventsDiv));
};