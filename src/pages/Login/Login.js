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
  main.append(loginSection);
};

  export const loginRequest = async (username, password) => {
  const res = await apiRequest({
    endpoint: 'users/login',
    method: 'POST',
    body: { username, password },
  });

  if (!res) return;

  if (res.status === 200) {
  const data = await res.json();
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
    const data = await res.json();
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
  document.querySelector("#login form").addEventListener("submit", loginSubmit);
  };