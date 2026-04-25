# Orden Torre — ORD-2026-04-25-05

- **ID**: ORD-2026-04-25-05
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **EJECUTOR**: claude

## Objetivo

Documentar el caso "lock huérfano": qué es, cuándo ocurre, quién y cómo lo libera. Sin liberarlo automáticamente todavía.

## Tareas concretas

1. Extender la sección "Control de concurrencia" en `.torre/protocolo.md` con un bloque "Lock huérfano" cubriendo:
   - qué es
   - cuándo ocurre
   - quién puede liberarlo
   - cómo se libera
   - regla explícita: NO liberación automática todavía
2. Añadir referencia breve en `.torre/roles.md` (qué rol está habilitado a liberar).

## Restricciones

- No tocar `backend/` ni `frontend/`.
- No agregar dependencias.
- No implementar liberación automática (solo documentar).
- No cambiar estructura de carpetas.

## Criterio de aceptación

- [ ] `protocolo.md` con bloque "Lock huérfano" completo.
- [ ] `roles.md` referencia quién libera.
- [ ] Reporte escrito.
- [ ] `estado.md` actualizado.
- [ ] Par archivado en `.torre/historial/2026-04-25_lock-huerfano/`.
- [ ] Inbox y outbox en placeholder.
- [ ] `EN_PROCESO_POR: ninguno` al cerrar.
- [ ] Todo en el mismo PR.

## Formato de reporte esperado

```
[ESTADO]
[ARCHIVOS MODIFICADOS]
[CAMBIO REALIZADO]
[DIFF RESUMIDO]
[RIESGO]
[SIGUIENTE PASO]
[EN_PROCESO_POR]
```
