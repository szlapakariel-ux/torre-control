# Invoker IA V1

Primer paso real hacia ejecución automática. El Invoker es el puente entre una orden Torre y un operador IA: detecta que hay orden, decide a quién llamar, llama al adaptador correspondiente, y deja constancia del intento. **No toma el lock, no archiva, no cierra ciclos.** Solo invoca y reporta.

Estado V1: cañería completa con **stubs honestos**. Los adaptadores reales (Claude, Codex) no están conectados todavía — los stubs explican exactamente qué falta.

## Qué es y qué no es

- **Es** un orquestador en bash que valida una orden y dispatcha a un adaptador.
- **Es** un punto de entrada para los workflows de GitHub: el workflow `torre-trigger-v1` lo llama tras detectar cambios en `.torre/`.
- **No es** Torre IA: no decide qué orden emitir; solo reacciona a una orden ya escrita.
- **No es** ejecutor: no escribe código, no hace merge, no pushea, no toca producción.
- **No es** cierre automático del ciclo: el operador real, cuando exista, sigue siendo el responsable de archivar y liberar el lock.

## Cómo se entera de una orden

Tres caminos, uno solo automático en V1:

1. **Manual local**: cualquiera corre `.torre/scripts/invoke_operator.sh` desde su terminal. Útil para depurar.
2. **GitHub Action automático**: cada `push`/`pull_request` que toca `.torre/**` dispara el workflow `torre-trigger-v1`, que primero detecta estado del ciclo y luego llama al Invoker. Resultado en step summary del job.
3. **Trigger externo (futuro V2)**: webhook desde un sistema externo (mail, Telegram, cron) → API → escribe orden en inbox → Invoker corre. **No implementado.**

## Cómo decide a quién llamar

El Invoker lee `.torre/inbox/orden_actual.md` y se fija en cinco cosas, en este orden:

1. **¿La inbox está en placeholder?** Si encuentra la frase canónica `sin orden activa`, sale con exit 10 (no aplica).
2. **¿La orden tiene `REQUIERE_IA: si`?** Si no está esa marca, el Invoker considera que es una orden manual y sale con exit 10. Las órdenes existentes hasta ORD-2026-04-25-12 **no llevan** este campo y por lo tanto el Invoker las ignora — retro-compatibilidad sin acción.
3. **¿Tiene los 5 campos obligatorios de identidad?** (`PROYECTO_FUNCIONAL`, `REPO_TECNICO`, `RAMA_TRABAJO`, `RAMA_DESTINO`, `EJECUTOR`). Si falta alguno, exit 20.
4. **¿El `REPO_TECNICO` coincide con el repo actual?** Verifica con `git remote get-url origin`. Si no coincide, exit 30 (guardrail). Esto evita que el Invoker dispare en el repo equivocado por error.
5. **¿Quién es el `EJECUTOR`?**
   - `humano` → exit 10 (no aplica al Invoker; la orden espera intervención manual).
   - `claude` → llama `.torre/scripts/operators/claude.sh`.
   - `codex` → llama `.torre/scripts/operators/codex.sh`.
   - cualquier otro → exit 40 (operador desconocido).

## Qué acciones son automáticas

V1 deja automáticas solo las acciones de **detección y dispatch**:

- Validar campos.
- Validar identidad (regla dura).
- Elegir adaptador.
- Llamar adaptador.
- Capturar exit code y mensaje.
- Si el reporte está en placeholder, escribir un reporte parcial inicial (no pisa reportes reales).

**Ninguna acción operativa real es automática en V1**: los adaptadores son stubs.

## Qué acciones requieren humano

Todo lo demás. Específicamente:

- Tomar el lock (`EN_PROCESO_POR`) — sigue siendo del operador real cuando exista.
- Ejecutar las tareas concretas que pide la orden.
- Escribir el reporte definitivo que reemplace al parcial.
- Archivar el ciclo en `historial/`.
- Restaurar inbox/outbox a placeholder.
- Liberar el lock.
- Mergear PRs.
- Activar flags / deployar / borrar archivos.

## Adaptadores

Cada adaptador es un script bash en `.torre/scripts/operators/<operador>.sh` con interfaz simple:

```
adaptador.sh <path-orden> <path-reporte>
```

Recibe el archivo de la orden y el archivo donde puede agregar su parte del reporte. Exit codes esperados:

- `0` → ejecución real exitosa (V1 nunca devuelve esto: todos los adaptadores son stubs).
- `99` → adaptador respondió pero como STUB (operador real no configurado).
- otro → error real (que el Invoker propaga sin tocar).

### `claude.sh` — adaptador Claude

Stub V1. Documenta en su salida qué falta para invocación real:
1. CLI Claude Code instalado en el runner.
2. `ANTHROPIC_API_KEY` como repository secret.
3. Política de sandbox (qué archivos puede modificar).
4. Modo no interactivo.
5. Aprobación humana antes de mergear.
6. Manejo de costos.
7. Trazabilidad completa.

### `codex.sh` — adaptador Codex

Stub V1. Mismas dependencias que Claude más una decisión previa: qué se entiende por "Codex" hoy (CLI propio, GPT vía API, Copilot CLI, etc.). El modelo Codex original (`code-davinci`) está retirado.

## Workflow integrado

`.github/workflows/torre-trigger.yml` corre dos steps en secuencia:

1. **Detector** (`check_cycle_closed.sh`) — informa estado del ciclo.
2. **Invoker** (`invoke_operator.sh`) — corre con `if: always()`, así dispara incluso cuando el detector reportó "ciclo abierto" (es justo el escenario donde puede haber orden activa).

Ambos vuelcan su resultado al `GITHUB_STEP_SUMMARY` del job. El workflow falla solo si el Invoker devolvió error real (exit 20 o 30); para 0/10/99 la conclusión es success.

## Guardrails (resumen)

- **No mergea, no deploya, no activa flags, no borra archivos.** Solo lee y dispatcha.
- **No usa secretos** todavía. Cuando se pasen secretos para el adaptador real, deben ser scoped y limitados.
- **No ejecuta si falta contexto** (campos obligatorios, identidad de proyecto).
- **No ejecuta si el repo actual no coincide** con `REPO_TECNICO`.
- **No toma el lock**.

## Ejemplo de orden compatible con V1

```markdown
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: claude/feature-x
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude
- **TIPO_ORDEN**: local
- **REPO_ORIGEN**: szlapakariel-ux/torre-control
- **REQUIERE_IA**: si
```

Con esos campos, el Invoker:
1. Detecta inbox no-placeholder.
2. Verifica `REQUIERE_IA: si`.
3. Valida los 5 campos de identidad.
4. Verifica que el repo actual coincide.
5. Dispatcha a `claude.sh`.
6. El stub responde con exit 99 y nota explicativa en el reporte.

## Lo que Invoker V1 NO hace

- No notifica externamente (mail / Telegram).
- No detecta transición; reporta el estado de cada push.
- No mide tiempo entre dispatch y respuesta del operador real.
- No retoca el lock ni el cierre.
- No verifica `TIPO_ORDEN` (deja eso al protocolo; el Invoker actúa solo si `REQUIERE_IA: si`).

Todo eso es V2 / iteraciones siguientes.
