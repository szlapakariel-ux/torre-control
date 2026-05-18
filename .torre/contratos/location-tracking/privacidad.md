# Privacidad — Location Tracking (MC-LOC-1)

## Declaraciones de este microciclo

- **MC-LOC-1 no usa datos reales.** El contrato es puramente documental.
- **No hay ubicación física.** No se registra ni se procesa ninguna ubicación geográfica de personas.
- **No hay coordenadas.** No se capturan latitud, longitud, altitud ni precisión.
- **No hay IPs.** No se registra ni se infiere dirección IP.
- **No hay datos personales.** No se procesa nombre, email, teléfono, identificadores de usuario, sesión ni dispositivo.
- **No hay consentimiento requerido**, porque no se recolectan datos personales ni sensibles. El alcance del contrato es trazabilidad operativa de proceso (repo, branch, microciclo, archivo, estado, agente).

## Regla futura (vinculante)

Si cualquier microciclo posterior — sea MC-LOC-2 técnico o cualquier otro — necesita:

- ubicación real (GPS, coordenadas, geocoding, IP-to-location),
- datos personales,
- datos sensibles,
- monitoreo de personas,

entonces, **antes de escribir una sola línea de código**, debe abrirse un **contrato legal/privacidad separado**, aprobado por Torre y por Ariel, que incluya como mínimo:

1. Base legal del tratamiento.
2. Finalidad explícita y limitada.
3. Mecanismo de consentimiento informado.
4. Política de retención y borrado.
5. Política de acceso y auditoría.
6. Plan de respuesta ante incidentes.
7. Mecanismo de revocación de consentimiento.
8. Declaración de no uso para fines distintos a los autorizados.

Ningún contrato técnico podrá saltarse este paso invocando urgencia, prototipo, modo demo ni "solo para pruebas".

## Alcance de esta declaración
Esta declaración vale exclusivamente para MC-LOC-1. No anticipa, no autoriza y no precondiciona ningún contrato futuro de privacidad: solo establece la regla de que ese contrato será obligatorio antes de tocar datos personales o ubicación real.
