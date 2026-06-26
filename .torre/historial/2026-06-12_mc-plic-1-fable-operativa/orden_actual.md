# Orden Torre — MC-PLIC-1

- **ID**: ORD-20260612-01
- **Fecha**: 2026-06-12
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: claude/zealous-sagan-fgrx25
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude
- **TIPO_ORDEN**: local
- **REPO_ORIGEN**: szlapakariel-ux/torre-control
- **Operador asignado** (descriptivo): Claude Code

## Objetivo

Dejar la Torre de Control operativa bajo la lógica PLIC: registrar PLIC como normativa, construir el motor de eventos/ranking en el backend, conectar un cerebro de IA real (modelo configurable, default barato) con fallback al clasificador por keywords, y mostrar el ranking PLIC vivo en el frontend.

## Contexto

El diagnóstico PLIC (relevamiento forense del dueño) concluyó que la Torre tiene buena arquitectura documental pero nunca operó: el clasificador del chat es por palabras clave (no IA real), los operadores son stubs, y la lógica PLIC no estaba registrada en el repo. Este microciclo abre la línea **MC-PLIC**.

Documentos fuente: PDFs aportados por Ariel (Cierre Punto 1, Documento Maestro de Etapas, Protocolo Torre Universal V0.2). Se transcriben a `.torre/plic/`.

Decisiones de Ariel para este ciclo:
- Alcance completo (PLIC docs + motor + IA + frontend), en un solo ciclo.
- Ariel configura `ANTHROPIC_API_KEY` en Railway/local.
- Modelo de IA **configurable por variable de entorno** (`TORRE_MODEL`), default barato (`claude-haiku-4-5`); Fable/Sonnet opcionales.
- Cierre/reapertura de eventos **desde el chat** queda diferido a MC-PLIC-2 (este ciclo deja cierre solo por API).

## Tareas concretas

1. Registrar PLIC en `.torre/plic/`: `00_definicion_plic.md`, `01_cierre_punto_1.md`, `02_protocolo_torre_universal_v0_2.md`, `ranking_inicial.md`. Anotar en `.torre/historico.md` que entran como Capa 2 vigente.
2. Backend: tabla `events` (`db.js`), motor de score (`plicScore.js`), store de eventos (`plicStore.js`), cerebro IA configurable con fallback (`torreBrain.js`).
3. Backend: `POST /api/message` pasa a async + genera evento PLIC; nuevos endpoints `POST/PATCH /api/events`, `GET /api/events`, `GET /api/plic/ranking`.
4. Dependencia: agregar `@anthropic-ai/sdk`; variables nuevas en `.env.example` (`ANTHROPIC_API_KEY`, `TORRE_MODEL`).
5. Frontend: reemplazar la card estática "Pendiente" por "Prioridades (PLIC)" con ranking vivo (`index.html`, `app.js`, `styles.css`).
6. Verificar ambos caminos (con y sin key) y cerrar el ciclo (reporte + historial + estado).

## Restricciones

- **Autorización explícita de dependencia nueva**: se autoriza agregar `@anthropic-ai/sdk` al backend. (Excepción puntual a la regla general "No agregar dependencias" del protocolo, válida solo para esta orden.)
- **Autorización explícita de conexión a API externa**: se autoriza conectar el app a la API de Anthropic. La regla "No conectar APIs" del protocolo aplica a la automatización del sistema postal `.torre/`, no al app de producto; esta orden la habilita para el app.
- Tocar solo: `backend/`, `frontend/`, `.torre/plic/`, `.torre/historico.md`, y los archivos del ciclo (`inbox/`, `outbox/`, `historial/`, `estado.md`).
- No tocar la automatización del sistema postal (`.torre/scripts/`, workflows, invoker, trigger).
- Mantener compatibilidad hacia atrás del endpoint `/api/message` (el frontend no debe romperse).
- Sin key de API, el sistema debe seguir funcionando con el clasificador por keywords (degradación elegante).

## Criterio de aceptación

- [ ] PLIC registrado en `.torre/plic/` (4 docs) y anotado en `.torre/historico.md`.
- [ ] Tabla `events` + motor de score + store + endpoints funcionando.
- [ ] Clasificación por IA con fallback a keywords (probado en ambos caminos).
- [ ] Ranking PLIC vivo en el sidebar del frontend.
- [ ] Verificación con y sin `ANTHROPIC_API_KEY` documentada.
- [ ] Reporte escrito en `.torre/outbox/reporte_actual.md`.
- [ ] Estado actualizado en `.torre/estado.md`.

## Formato de reporte esperado

```
[ESTADO]
[ARCHIVOS CREADOS]
[ARCHIVOS MODIFICADOS]
[CÓMO SE USA]
[DIFF RESUMIDO]
[RIESGO]
[SIGUIENTE PASO]
[EN_PROCESO_POR]
```
