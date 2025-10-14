import { Header } from "../components/PartsPage/HeaderNav/HeaderNav";
import { Home } from "../pages/Home/Home";

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  Header();
  Home();
};
