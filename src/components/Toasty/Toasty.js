import Toastify from "toastify-js";
import "./Toasty.css" 

export const showToast = (text, type = "info") => {
  const colors = {
    success: "linear-gradient(to right, #00b09b, #96c93d)",
    error: "linear-gradient(to right, #ff5f6d, #ffc371)",
    info: "linear-gradient(to right, #2193b0, #6dd5ed)",
    warning: "linear-gradient(to right, #f7971e, #ffd200)",
  };

  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  };

  Toastify({
    text: `${icons[type] || ""} ${text}`,
    duration: 3500,
    close: true,
    gravity: "top",   
    position: "center",  
    stopOnFocus: true,
    offset: { y: 70 },   
    className: "toastify", 
    style: {
      background: colors[type] || colors.info,
      color: "#fff",
    },
  }).showToast();
};
