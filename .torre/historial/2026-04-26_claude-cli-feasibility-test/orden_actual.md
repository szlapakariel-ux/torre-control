# Orden Torre — ORD-2026-04-26-19

- **ID**: ORD-2026-04-26-19
- **Fecha**: 2026-04-26
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: torre/claude-cli-feasibility-test
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude
- **TIPO_ORDEN**: local
- **REPO_ORIGEN**: szlapakariel-ux/torre-control
- **REQUIERE_IA**: no

## Objetivo

Preparar (no ejecutar) una **prueba real mínima** del Claude Code CLI, con cap de costo USD 0.10, para confirmar:

1. `ANTHROPIC_API_KEY` (configurado a futuro como secret) llega al runner.
2. Claude responde en `--print --bare`.
3. `--output-format json` devuelve estructura parseable.
4. `--max-budget-usd` limita el costo.
5. La API key NO aparece en logs.
6. El working tree NO se modifica.

La prueba se ejecuta solo por `workflow_dispatch` manual desde la UI de Actions. **No se dispara por push, ni por PR.** El workflow vive en un archivo separado del workflow principal `torre-trigger.yml`, así no hay riesgo de afectar la cañería existente.

## Tarea concreta

Crear dos archivos:

1. **`.github/workflows/claude-cli-feasibility-test.yml`** — workflow `workflow_dispatch` only, sin push/PR triggers. Permisos `contents: read` (no escribe). Timeout 5 min. Versión del CLI **pinned** a `2.1.119` (la verificada en el feasibility check). Los pasos: instalar CLI, verificar entorno, verificar que `ANTHROPIC_API_KEY` está presente sin imprimirla, invocar Claude con prompt mínimo (`Respondé solamente: OK TORRE`), validar JSON, validar que no se modifique el working tree, volcar resumen al step summary.
2. **`.torre/claude_cli_feasibility_test.md`** — doc explicando qué hace el workflow, cómo se dispara manualmente, qué resultado esperar, y qué hacer si falla.

## Restricciones

- NO tocar `.torre/scripts/operators/claude.sh` (sigue stub).
- NO tocar `.torre/scripts/operators/codex.sh`.
- NO tocar `.torre/scripts/invoke_operator.sh`.
- NO tocar `.torre/scripts/check_cycle_closed.sh`.
- NO tocar `.github/workflows/torre-trigger.yml` (workflow principal).
- NO usar el Invoker.
- NO modificar archivos de producción.
- NO conectar Claude real al sistema postal (la prueba es aislada).
- NO mergear el PR.
- NO auto-commit, NO auto-merge desde el workflow.
- NO abrir PR automático desde Claude.
- NO imprimir secrets.
- El workflow se dispara solo manualmente.

## Comando candidato (extracto del feasibility check)

```sh
echo "Respondé solamente: OK TORRE" \
  | claude \
    --print \
    --bare \
    --no-session-persistence \
    --output-format json \
    --max-budget-usd 0.10 \
    --model sonnet
```

## Resultado esperado de la prueba

- Exit code 0 del paso del workflow.
- Respuesta JSON parseable.
- "OK TORRE" presente en el contenido.
- Costo declarado por el CLI bajo (≤ USD 0.10 por el cap).
- `git status` limpio post-invocación (sin archivos modificados).
- Step summary con resumen del run.
- Secret no visible en logs (verificación: log dice `ANTHROPIC_API_KEY presente (longitud=N)` en lugar de la clave).

## Criterio de aceptación

- [ ] `.github/workflows/claude-cli-feasibility-test.yml` creado con `workflow_dispatch` only.
- [ ] `.torre/claude_cli_feasibility_test.md` creado con doc.
- [ ] YAML válido.
- [ ] Stubs y workflow principal intactos.
- [ ] Reporte escrito.
- [ ] Par archivado.
- [ ] Inbox/outbox en placeholder.
- [ ] PR draft contra `main`. NO mergear.
- [ ] La prueba **no se ejecuta** en este ciclo. La ejecución es decisión humana posterior, después de configurar el secret.

## Formato de reporte esperado

Reporta archivos creados, link del PR, riesgos, cómo se correría manualmente, qué hacer si falla.
