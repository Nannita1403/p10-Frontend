import './EventForm.css';

import { createEventForm } from '../../../Data/Formularios';
import { UserForm } from '../UserForm/UserForm';
import { listOfEvents } from '../../Events/Section/SectionEvent';
import { apiRequest } from '../../../Utils/ApiRequest';
import { showToast } from '../../Toasty/Toasty';
import { Modal } from '../../PartsPage/Modal/Modal';

const postEvent = async e => {
  e.preventDefault();

  const artistName = document.querySelector('#artist').value;
  const dataList = document.querySelector('#list-of-Artists');

  const body = {
    name: document.querySelector('#name').value,
    date: document.querySelector('#date').value,
    location: document.querySelector('#location').value,
    artist: dataList
      .querySelector(`[value="${artistName}"]`)
      .getAttribute('#data-id'),
  };

  const res = await apiRequest({
    endpoint: 'events',
    method: 'POST',
    body,
  });

  const response = await res.json();
  if (res.status === 201) {
    const { message } = response;
    showToast(message, 'linear-gradient(to right, #00b09b, #96c93d)');
    document.querySelector('#create-event').remove();
    const upcomingEventsDiv = document.querySelector(
      'section.isUpcoming > div'
    );
    await listOfEvents(upcomingEventsDiv, 'isUpcoming');
  } else {
    showToast(response, 'red');
  }
};
export const NewEventForm = () => {
  const eventFormContainer = Modal();
  eventFormContainer.id = 'create-event';

  UserForm(eventFormContainer, 'Crea tu propio evento', createEventForm);
  eventFormContainer
    .querySelector('[type="date"]')
    .addEventListener('change', e => {
      const inputDate = new Date(e.target.value);
      const now = new Date();
      if (now > inputDate) {
        alert('La fecha del evento debe ser futura');
      }
    });
  const artistInputContainer = document.createElement('div');
  artistInputContainer.classList.add('input-container');
  artistInputContainer.innerHTML = `  <label class="iLabel" for="artist">Artist</label>
  <input class="input" list="list-of-Artists" id="artist" name="artist">
  <datalist id="list-of-Artists"></datalist>`;

  document.body.append(eventFormContainer);
  document
    .querySelector('#create-event button')
    .insertAdjacentElement('beforebegin', artistInputContainer);

  const datalistOfArtist = document.querySelector('#list-of-Artists');
  apiRequest({ method: 'get', endpoint: 'artists' })
    .then(res => res.json())
    .then(listofArtists => {
      for (const artist of listofArtists) {
        const option = document.createElement('option');
        option.value = artist.name;
        option.setAttribute('data-id', artist._id);
        datalistOfArtist.append(option);
      }
    });
  document
    .querySelector('#create-event form')
    .addEventListener('submit', postEvent);
};