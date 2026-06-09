// Configuración del frontend.
//
// En desarrollo apunta al backend local. En producción, reemplazá backendUrl
// por la URL pública del backend desplegado (p.ej. https://torre-control.up.railway.app).
//
// El token de escritura NO se guarda acá (no versionar secretos). Se pide una
// vez por el navegador y queda en localStorage bajo la clave "TC_TOKEN".
window.TC_CONFIG = {
  backendUrl: 'http://localhost:3001',
};
