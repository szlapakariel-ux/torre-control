// Configuración del frontend.
//
// El backend sirve este frontend desde el mismo origen, así que por defecto
// las llamadas van a rutas relativas (/api/...). Dejá backendUrl en '' para eso.
//
// Solo seteá una URL absoluta si servís el frontend en un host distinto del
// backend (p.ej. GitHub Pages → 'https://torre-control.up.railway.app').
//
// El token de escritura NO se guarda acá (no versionar secretos). Se pide una
// vez por el navegador y queda en localStorage bajo la clave "TC_TOKEN".
window.TC_CONFIG = {
  backendUrl: '',
};
