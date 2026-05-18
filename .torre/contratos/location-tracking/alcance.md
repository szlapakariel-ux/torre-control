# Alcance — Location Tracking (MC-LOC-1)

## Alcance incluido
Location tracking en Torre, dentro de este contrato, se limita a registrar:

- **Repo activo** — nombre del repositorio en el que ocurre el trabajo.
- **Branch activa** — branch sobre la que opera el agente.
- **Microciclo activo** — identificador del microciclo en curso (ej. `MC-LOC-1`).
- **Archivo / área documental tocada** — ruta o sección de `.torre/` o del repo afectada por el paso.
- **Estado operativo** — uno de: `diagnostico`, `documental`, `tecnico`, `bloqueado`, `listo_para_pr`, `mergeado`.
- **Agente responsable** — identidad del operador (ej. Claude, Codex, Portero, humano nombrado).

## Alcance excluido
Quedan explícitamente **fuera** de este contrato:

- Ubicación GPS.
- Geolocalización de usuarios finales.
- Direcciones IP.
- Datos personales (nombre, email, teléfono, identificadores reales).
- Datos sensibles (salud, religión, finanzas, biometría, etc.).
- Tracking en producción.
- Tracking silencioso o encubierto.
- Tracking sin consentimiento explícito cuando aplique.

Si un paso futuro necesita cualquiera de estos elementos, este contrato **no alcanza** y debe abrirse uno nuevo (ver `privacidad.md`).

## Interpretaciones descartadas
Torre descarta de forma explícita, para este contrato, las siguientes lecturas de "location tracking":

- **A. Geolocalización de usuarios finales.** Descartada. No hay base legal ni técnica documentada, ni producto que la justifique en este microciclo.
- **B. Ubicación física de agentes/personas.** Descartada. Torre no rastrea cuerpos.
- **C. Tracking de IP / dispositivo.** Descartada. No se recolecta huella de red ni de hardware.
- **D. Monitoreo productivo automático.** Descartada. Torre no mide presencia ni rendimiento personal automatizado.

## Consecuencia
Cualquier microciclo futuro que invoque "location tracking" debe ajustarse al alcance incluido. Si requiere cualquiera de los puntos descartados, queda **bloqueado** hasta abrir un contrato separado y aprobado por Torre y Ariel.
