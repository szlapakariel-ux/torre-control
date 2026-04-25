# Orden Torre — ORD-2026-04-25-14

- **ID**: ORD-2026-04-25-14
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: torre/invoker-v1.1
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude
- **TIPO_ORDEN**: local
- **REPO_ORIGEN**: szlapakariel-ux/torre-control
- **REQUIERE_IA**: no

## Objetivo

Endurecer el Invoker IA V1 antes de cualquier conexión real a Claude/Codex. Cinco frentes: filtrar cuándo corre, agregar `[skip torre]`, normalizar `REPO_TECNICO`, documentar persistencia efímera, y agregar logs claros para cada motivo de "no corre".

## Tareas concretas

1. **Filtro de disparo del Invoker**: en el step del workflow, antes de llamar a `invoke_operator.sh`, verificar con `git diff` si en el último push cambió `.torre/inbox/orden_actual.md`. Si no cambió, omitir la invocación con log claro.
2. **`[skip torre]`**: si el último commit message contiene la marca `[skip torre]`, omitir la invocación con log claro.
3. **`REPO_TECNICO` exacto**: agregar función `normalize_repo()` en `invoke_operator.sh` que acepte `https://`, `git@`, y `owner/repo`. Comparar exacto contra `REPO_TECNICO` normalizado. Si no coincide, exit 30.
4. **Persistencia efímera**: documentar en `invoker.md` que las escrituras del Invoker en `outbox/reporte_actual.md` cuando corre en GitHub Actions ocurren en el runner temporal y NO se persisten en el repo salvo commit/push o artifact. V1.1 no implementa ninguno de los dos.
5. **Logs claros**: cada motivo de "no corre" debe tener mensaje propio en el step summary del workflow.

## Restricciones

- No conectar Claude real.
- No usar secrets.
- No instalar CLI de Claude ni de OpenAI.
- No agregar dependencias.
- No auto-merge ni auto-commit desde GitHub Actions.
- No tocar `backend/`/`frontend/`.
- No borrar ramas.
- No avanzar con Secretaria/Portero V1.
- Stubs `claude.sh` y `codex.sh` quedan intactos.

## Criterio de aceptación

- [ ] Branch nueva `torre/invoker-v1.1` creada desde `main`.
- [ ] Workflow sigue válido (parseable, ejecuta los steps existentes).
- [ ] Invoker solo se ejecuta si cambió `.torre/inbox/orden_actual.md`.
- [ ] `[skip torre]` evita la invocación.
- [ ] `REPO_TECNICO` se valida por comparación exacta normalizada.
- [ ] `invoker.md` documenta la persistencia efímera del runner.
- [ ] Stubs Claude/Codex intactos.
- [ ] Tests locales cubren al menos 7 escenarios listados en la orden.
- [ ] Reporte escrito en outbox.
- [ ] `estado.md` actualizado.
- [ ] Par archivado en `.torre/historial/2026-04-25_invoker-v1.1-blindaje/`.
- [ ] Inbox y outbox vuelven a placeholder.
- [ ] PR abierto contra `main`.
- [ ] No mergear sin autorización humana.

## Formato de reporte esperado

Reporta rama, archivos, pruebas, riesgos restantes, link del PR, mergeable, próximo paso.
