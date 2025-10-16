import './SectionEvent.css';
import { dateComparator, sortByDate } from '../../../Utils/datesRequest';
import { EventCard } from '../Card/CardEvent';
import { apiRequest } from '../../../Utils/ApiRequest';

export const EventsSection = ({ title, eventTiming }) => {
  const eventSection = document.createElement('section');
  eventSection.classList.add('events', eventTiming);

  const eventsTitle = document.createElement('h2');
  eventsTitle.textContent = title;

  const eventDiv = document.createElement('div');
  eventDiv.classList.add('events-container');

  eventSection.append(eventsTitle, eventDiv);
  return eventSection;
};

export const listOfEvents = async (parentNode, eventTiming) => {
  const events = await apiRequest({ method: 'GET', endpoint: 'events' });
  parentNode.innerHTML = '';

  if (!events || !events.length) return;

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

  // Esperar a que todas las imágenes carguen antes de iniciar el carrusel
  const images = parentNode.querySelectorAll('img');
  let loadedImages = 0;
  if (images.length === 0) {
    autoScrollEvents(parentNode);
  } else {
    images.forEach(img => {
      if (img.complete) {
        loadedImages++;
      } else {
        img.addEventListener('load', () => {
          loadedImages++;
          if (loadedImages === images.length) autoScrollEvents(parentNode);
        });
      }
    });
    if (loadedImages === images.length) autoScrollEvents(parentNode);
  }
};

const autoScrollEvents = (container) => {
  if (!container) return;

  const cards = container.querySelectorAll('.event-card');
  if (!cards.length) return;

  let scrollPosition = 0;
  let interval = null;

  const cardWidth = cards[0]?.offsetWidth + 20 || 270; 
  const maxScroll = Math.max(cardWidth * cards.length - container.offsetWidth, 0);

  const startAutoScroll = () => {
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      if (window.innerWidth <= 700) return;
      scrollPosition += cardWidth;
      if (scrollPosition > maxScroll) scrollPosition = 0;
      container.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }, 3000);
  };

  startAutoScroll();

  container.addEventListener('mouseenter', () => clearInterval(interval));
  container.addEventListener('mouseleave', startAutoScroll);

  window.addEventListener('resize', () => {
    scrollPosition = 0;
    startAutoScroll();
  });
};
