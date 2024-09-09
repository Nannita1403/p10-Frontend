
import { mainRoute } from "../Data/Routes";

export const apiRequest = async ({ 
  endpoint, 
  id = '', 
  method, 
  body }) => {
  const token = localStorage.getItem('token');
  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : null,
    },
    method: method.toUpperCase(),
    body: JSON.stringify(body),
  };
 try {
  const res = await fetch(`${mainRoute}/${endpoint}/${id}`, options);
 } catch (error) {
  console.log(error);
  
 }
  

};