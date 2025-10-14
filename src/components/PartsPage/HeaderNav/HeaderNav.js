import { Events } from '../../../pages/Events/Events';
import { Home } from '../../../pages/Home/Home';
import { Login } from '../../../pages/Login/Login';
import { Register } from '../../../pages/Register/Register';
import { logout } from '../../../Utils/session';
import { profileIcon } from '../ImgProfile/ImgProfile';
import './HeaderNav.css';


const navLayout = () => {
  const token = localStorage.getItem('token');
  const user = token ? JSON.parse(localStorage.getItem('user')) : null;
  const profile = user?.profilePic || ''; 

  return `
    <ul class="flex-container">
      <li>
        <a href="#" id="events-link">Eventos</a>
      </li>
      <li id="log-link">
        ${
          token
            ? profileIcon(profile)
            : 'Identificarse'
        }
      </li>
    </ul>
  `;
};

const loginMenuLayout = () => {
  const menuContainer = document.createElement('div');
  menuContainer.id = 'menu-login';

  const loginLink = document.createElement('a');
  loginLink.id = 'login-link';
  loginLink.innerText = 'Ingresar';

  const registerLink = document.createElement('a');
  registerLink.id = 'register-link';
  registerLink.innerText = 'Registrarme';

  loginLink.addEventListener('click', Login);
  registerLink.addEventListener('click', Register);

  menuContainer.append(loginLink, registerLink);
  return menuContainer;
};


export const Header = () => {
  const header = document.querySelector('header nav');
  header.innerHTML = navLayout();

  // Eventos de navegación
  document.querySelector('#bombo-logo')?.addEventListener('click', Home);
  document.querySelector('#events-link')?.addEventListener('click', Events);

  const logLink = document.querySelector('#log-link');

  if (localStorage.getItem('token')) {
    logLink.addEventListener('click', logout);
  } else {
    logLink.append(loginMenuLayout());
  }
};


export const cleanHeader = () => {
  const headerLinks = document.querySelectorAll('header > nav > ul > li');
  headerLinks.forEach(link => link.classList.remove('current-location'));
};
