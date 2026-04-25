# Orden Torre — ORD-2026-04-25-07

- **ID**: ORD-2026-04-25-07
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_OBJETIVO**: main (declarado por Torre; el operador trabaja en `claude/trigger-torre-mvp-rSWiS` por restricción del harness — ver reporte)
- **EJECUTOR**: claude

## Objetivo

Crear un primer sistema de aviso (Trigger V1) para que Torre/Ariel sepan cuándo un ciclo `.torre/` terminó.

## Tareas concretas

1. Detectar cierre de ciclo mirando: `estado.md`, `inbox/orden_actual.md`, `outbox/reporte_actual.md`, `historial/`.
2. Condición de ciclo cerrado:
   - `EN_PROCESO_POR = ninguno`
   - `inbox` = placeholder (sin orden activa)
   - existe al menos un reporte archivado en `historial/`
3. Evaluar tres opciones (A watcher local, B GitHub Action, C WhatsApp/Telegram).
4. Implementar SOLO la más simple y segura.
5. Documentar cómo se detecta, cómo se informa, cómo se usa.

## Restricciones

- No tocar `backend/` ni `frontend/`.
- No agregar dependencias pesadas.
- Solo lo necesario para Trigger V1.

## Criterio de aceptación

- [ ] Implementación elegida documentada con justificación.
- [ ] Script o action funcionando, sin dependencias nuevas.
- [ ] Documentación de uso (cómo dispararlo, cómo leerlo).
- [ ] Reporte escrito.
- [ ] Par archivado en `.torre/historial/2026-04-25_trigger-v1/`.
- [ ] Inbox y outbox en placeholder.
- [ ] `EN_PROCESO_POR: ninguno` al cerrar.
- [ ] Todo en el mismo PR.

## Formato de reporte esperado

```
[ESTADO]
[ARCHIVOS CREADOS/MODIFICADOS]
[IMPLEMENTACIÓN ELEGIDA]
[CÓMO FUNCIONA]
[RIESGO]
[SIGUIENTE PASO]
[EN_PROCESO_POR]
```
