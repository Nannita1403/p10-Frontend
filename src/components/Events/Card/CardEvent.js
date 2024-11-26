import { EventAssistanceButton } from '../AssistanceButton/AssistanceButton';
import { DeleteEventButton } from '../DeleteButton/DeleteButton';
import './CardEvent.css';

export const EventCard = eventObject => {

  const eventContainer = document.createElement('article');
  eventContainer.classList.add('flex-container');
  eventContainer.innerHTML = `
  <div class="img-container">
<img src="${eventObject.image || 'https://tse4.mm.bing.net/th?id=OIP.1O0V14wWiWQFJBdteza4DgAAAA&pid=Api&P=0&h=180'}" alt="${eventObject.name}" />  
  </div>
  <div class="event-info flex-container">
    <div>
      <h4>${eventObject.name}</h4>
      <p>${eventObject?.location || 'Ubicación a confirmar'}</p>
      <p>${eventObject.artists?.name || 'Artistas a confirmar'}</p>
      <p>${eventObject.date?.split('T')[0] || 'Fecha a confirmar'}</p>
      <p>${eventObject.price || 'Precio a confirmar'}</p>
    </div>
  </div>
  `;

  // <img src="${eventObject.img || 'https://tse4.mm.bing.net/th?id=OIP.1O0V14wWiWQFJBdteza4DgAAAA&pid=Api&P=0&h=180'}" alt="${
  //   eventObject.name}"/>
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