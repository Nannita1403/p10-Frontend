import './Register.css';
import { UserForm } from '../../components/Forms/UserForm/UserForm';
import { registerForm } from '../../Data/Formularios';
import { Login, loginRequest } from '../Login/Login';
import { showToast } from '../../components/Toasty/Toasty';
import { apiRequest } from '../../Utils/ApiRequest';

const registerLayout = () => {
  const main = document.querySelector('main');
  main.innerHTML = '';

  const registerSection = document.createElement('section');
  registerSection.id = 'register';

  UserForm(registerSection, 'Register', registerForm);

  const isRegisteredQuery = document.createElement('p');
  isRegisteredQuery.innerHTML = ` ¿Ya estás registrado? <a href=#>Login</a>`;
  const title = registerSection.querySelector('h2');
  title.insertAdjacentElement('afterend', isRegisteredQuery);
  isRegisteredQuery.querySelector('a').addEventListener('click', Login);

  main.append(registerSection);
};

const registerSubmit = async e => {
  e.preventDefault();
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  const email = document.querySelector('#email').value;

  try {
    const response = await apiRequest({
      endpoint: 'users/register',
      method: 'POST',
      body: { username, email, password },
    });

    if (!response) return; 

    const data = await response.json();

    if (response.status !== 201) {
      showToast(data.message || "Error al registrarse", "error");
    } else {
      showToast("Registro exitoso, iniciando sesión...", "success");
      loginRequest(username, password);
    }
  } catch (error) {
    console.error("Error en registerSubmit:", error);
    showToast(error.message || "Error en la comunicación con el servidor", "error");
  }
  };

  export const Register = () => {
    registerLayout();
    document.querySelector("#register form").addEventListener("submit", registerSubmit);
  };