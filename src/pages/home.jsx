// Obtener datos del usuario desde las cookies
const userId = getCookie('userId');
const userName = getCookie('userName');
const userEmail = getCookie('userEmail');
const userRole = getCookie('userRole');

// Función helper para obtener cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}