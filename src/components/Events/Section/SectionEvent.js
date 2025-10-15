import './SectionEvent.css';
import { dateComparator, sortByDate } from '../../../Utils/datesRequest';
import { EventCard } from '../Card/CardEvent';
import { apiRequest } from '../../../Utils/ApiRequest';

export const EventsSection = ({ title, eventTiming }) => {
  const eventSection = document.createElement('section');
  eventSection.classList.add('events', eventTiming);
  const eventsTitle = document.createElement('h2');
  const eventDiv = document.createElement('div');
  eventsTitle.textContent = title;
  eventSection.append(eventsTitle);
  eventDiv.classList.add('events-container'); 
  eventDiv.innerHTML = '';
  eventSection.append(eventDiv);

  return eventSection;
};

export const listOfEvents = async (parentNode, eventTiming) => {
  const events = await apiRequest ({ method: 'GET', endpoint: 'events' });

  parentNode.innerHTML ='';

  sortByDate(events);

  for (let event of events) {
    event = dateComparator(event);

    if (event[eventTiming]) {
      if (event.date) {
        const dateObj = new Date(event.date);
        if (!isNaN(dateObj)) {
          const day = String(dateObj.getDate()).padStart(2, '0');
          const month = String(dateObj.getMonth() + 1).padStart(2, '0');
          const year = dateObj.getFullYear();
          event.date = `${day}/${month}/${year}`;
        }
      }
    if (event.price && !isNaN(event.price)) {
          event.price = `${event.price} €`;
        } else {
          event.price = 'Precio a confirmar';
        }

        const eventCard = EventCard(event);
        parentNode.append(eventCard);
      }
    }
};