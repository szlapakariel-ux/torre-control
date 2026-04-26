# Claude CLI — Feasibility test (uso manual)

> **Estado**: PROPUESTA. Workflow en `.github/workflows/claude-cli-feasibility-test.yml`. Producido por ORD-2026-04-26-19. **No se ejecuta automáticamente.** Requiere acción humana después del merge: configurar el secret y disparar el workflow desde la UI.

## 1. Qué es

Un **workflow aislado** que valida end-to-end que Claude Code CLI puede correr en un runner real con todos los controles necesarios para V0:

- Auth no interactiva con `ANTHROPIC_API_KEY` como secret.
- Modo `--print --bare` (decisión 11.1 del contrato).
- `--output-format json` (parseable, auditable).
- `--max-budget-usd 0.10` (cap de costo conservador).
- Sin modificar archivos del repo.
- Sin imprimir el secret en logs.

## 2. Qué NO es

- **No es** el adaptador real `claude.sh`. El adaptador sigue siendo stub.
- **No corre el flujo Torre**. No usa el Invoker, no toma lock, no abre PR.
- **No se dispara automáticamente**. No corre en push, ni en PR, ni en schedule.
- **No modifica nada del repo**. El workflow tiene `permissions: contents: read`.

Este workflow vive en paralelo al workflow principal `torre-trigger-v1` y **no afecta** la cañería existente.

## 3. Cómo se dispara

Solo manualmente desde la UI de GitHub Actions:

1. Configurar el secret una sola vez:
   - Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**.
   - Name: `ANTHROPIC_API_KEY`.
   - Value: tu API key de Anthropic.
2. Una vez merged este PR a `main` (o sobre la rama del PR mientras está draft, si el repo permite `workflow_dispatch` desde branches no-default):
   - Ir a **Actions** → seleccionar workflow **`claude-cli-feasibility-test`** → **Run workflow** → elegir branch → **Run**.
3. Mirar el step summary del run.

Si el secret no está configurado, el workflow falla en el step de verificación con un mensaje claro y código de salida 2.

## 4. Qué hace, paso a paso

| Step | Qué hace | Qué falla si rompe |
|---|---|---|
| 1 | `actions/checkout@v4` | (estándar; valida que git funciona) |
| 2 | Verificar entorno (OS, Node, jq) | error de runner |
| 3 | Instalar `@anthropic-ai/claude-code@2.1.119` (versión pineada) | red, registry, npm — exit 1 |
| 4 | Verificar que `ANTHROPIC_API_KEY` está, **sin imprimirla** | exit 2 si no está |
| 5 | Invocar Claude con prompt `Respondé solamente: OK TORRE`, JSON, cap USD 0.10, modelo Sonnet | exit del CLI ≠ 0, JSON inválido (exit 3), o working tree modificado (exit 4) |
| 6 | Volcar resumen al `GITHUB_STEP_SUMMARY` | (informativo) |
| 7 | Confirmar que no hay commits nuevos | exit 5 si los hay |

## 5. Qué se valida

| Pregunta del plan V0 § 14 | Cómo la responde este test |
|---|---|
| #1 — flag exacto del modo no interactivo | `--print` confirmado en el feasibility check; este test lo prueba en runner real |
| #2 — auth no interactiva con `ANTHROPIC_API_KEY` | Step 4 valida presencia; step 5 prueba que el CLI la consume sin login interactivo |
| #3 — funciona en `ubuntu-latest` Node 20+ | El runner es exactamente eso; si pasa, queda confirmado |
| #4 — `gh pr create` viable | **No probado por este test** (este test no abre PR). `gh` viene preinstalado en `ubuntu-latest`; se valida en una orden posterior |
| #7/#8 — cómo se mide costo / tokens | El step summary muestra `keys` del JSON y busca `usage`, `meta`, `response_meta`. Esto destapa si el CLI los expone |
| #9 — testear sin gastar | `--max-budget-usd 0.10` cap duro |
| #10 — versionado del CLI | Versión pineada a `2.1.119` |

## 6. Qué NO valida

- **Apertura de PR** (`gh pr create`) — orden separada.
- **Modificación de archivos por Claude** — este test pide solo respuesta de texto, no edición.
- **Lock del sistema postal** — no usa `EN_PROCESO_POR`.
- **Creación de rama por Claude** — no aplica al test.

Esos puntos van a validarse cuando el adaptador real se implemente, en órdenes Torre dedicadas.

## 7. Resultado esperado en la UI de Actions

**Run verde**, step summary con:

- Versión del CLI.
- Las 3 validaciones en OK.
- Cap de costo declarado.
- Las claves del JSON (`keys`) que devuelve el CLI.
- Campo `usage` o equivalente (si existe).
- Snippet de hasta 200 chars del campo de respuesta.

**Costo estimado**: ≤ USD 0.10. Realísticamente, un prompt de ~10 tokens y respuesta de ~3 tokens debería costar centavos.

## 8. Si el test falla

Cada exit code identifica el motivo:

| Exit | Diagnóstico |
|---|---|
| 1 | Falla de instalación del CLI (red, registry npm) |
| 2 | Secret `ANTHROPIC_API_KEY` no configurado |
| 3 | Output del CLI no es JSON parseable |
| 4 | Working tree fue modificado durante la invocación |
| 5 | Hubo commits nuevos durante el run |
| ≠ 0 (sin de los anteriores) | Error del CLI: auth inválida, quota agotada, server 5xx, timeout. Revisar log del step |

**Cualquier falla bloquea la implementación V0**: hay que entender la causa antes de seguir. No reabrir el flujo de implementación hasta que este test pase verde al menos una vez.

## 9. Después de un run verde

El siguiente paso natural es la **orden Torre de implementación V0 paso 1** (dry-run de prechecks del adaptador real), citando este test como evidencia de que el CLI es viable.

## 10. Después de un run rojo

- Si exit=2: configurar el secret y reintentar.
- Si exit=3: el CLI cambió el formato de output. Verificar si `2.1.119` sigue siendo la versión correcta o pinear a otra.
- Si exit=4: hay un bug grave (Claude modificó archivos sin pedirlo). Reportar al equipo de Anthropic.
- Si error del CLI: leer el log, decidir si retry o reabrir la decisión 11.1 del contrato.

## 11. Costo acumulado

Este test se ejecuta **manualmente**, una sola vez (o pocas veces si hay debugging). El cap por invocación es USD 0.10. **No hay riesgo de gasto descontrolado**: no se dispara automáticamente y no tiene retries.
