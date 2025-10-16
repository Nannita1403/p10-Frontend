import "./Login.css";
import { Header } from "../../components/PartsPage/HeaderNav/HeaderNav";
import { apiRequest } from "../../Utils/ApiRequest";
import { loginForm } from "../../Data/Formularios";
import { UserForm } from "../../components/Forms/UserForm/UserForm";
import { Home } from "../Home/Home";
import { showToast } from "../../components/Toasty/Toasty";

const loginLayout = () => {
  const main = document.querySelector('main');
  main.innerHTML = '';
  const loginSection = document.createElement('section');
  loginSection.id = 'login';

  UserForm(loginSection, 'Login', loginForm);

  const form = loginSection.querySelector('form');
  if (form) {
    form.addEventListener('submit', loginSubmit);
  }

  main.append(loginSection);
};

  export const loginRequest = async (username, password) => {
  const data = await apiRequest({
    endpoint: 'users/login',
    method: 'POST',
    body: { username, password },
  });

  if (!data) return;

  if (data.token && data.user) {
  const safeUser = {
    _id: data.user._id,
    username: data.user.username,
    email: data.user.email,
    role: data.user.role,
    profilePic: data.user.profilePic
  };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(safeUser));

    Header();
    Home();
    showToast(`¡Bienvenido, ${safeUser.username}!`, "success");
  }else {

    showToast(data.message || "Nombre de usuario o contraseña incorrectos", "error");
  }
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    const username = document.querySelector("#username").value;
    const password = document.querySelector("#password").value;
    loginRequest(username, password);
  };

  export const Login = () => {
  loginLayout();
};
