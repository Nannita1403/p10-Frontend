import { EventAssistanceButton } from '../AssistanceButton/AssistanceButton';
import { DeleteEventButton } from '../DeleteButton/DeleteButton';
import './CardEvent.css';

export const EventCard = eventObject => {
  const eventContainer = document.createElement('article');
  eventContainer.classList.add('flex-container');

  let formattedDate = 'Fecha a confirmar';
  if (eventObject.date) {
    const dateObj = new Date(eventObject.date);
    if (!isNaN(dateObj)) {
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      formattedDate = `${day}/${month}/${year}`;
    }
  }

  const formattedPrice = eventObject.price
    ? `${eventObject.price} €`
    : 'Precio a confirmar';

  eventContainer.innerHTML = `
    <div class="img-container">
      <img src="${eventObject.image || 'https://media.istockphoto.com/id/1498453054/es/foto/pareja-de-baile-en-concierto.jpg?s=612x612&w=0&k=20&c=TXsegdlFbMckEoKfa_43cXNgJePv5YgW8UIMmjC9AOY='}" alt="${eventObject.name}" />  
    </div>
    <div class="event-info flex-container">
      <div>
        <h4>${eventObject.name}</h4>
        <p>${eventObject.location || 'Ubicación a confirmar'}</p>
        <p>${eventObject.artists?.name || 'Artistas a confirmar'}</p>
        <p>${formattedDate}</p>
        <p>${formattedPrice}</p>
      </div>
    </div>
  `;

  if (localStorage.getItem('user')) {
    DeleteEventButton(eventContainer, eventObject);
  }
  if (eventObject.isUpcoming) {
    EventAssistanceButton(
      eventContainer.querySelector('.event-info'),
      eventObject
    );
  }

  return eventContainer;
};
