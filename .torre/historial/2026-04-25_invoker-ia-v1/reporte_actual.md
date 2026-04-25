# Reporte Operador — ORD-2026-04-25-13

- **Orden ejecutada**: ORD-2026-04-25-13
- **Operador**: Claude Code (`claude`)
- **Fecha de cierre**: 2026-04-25
- **RAMA_TRABAJO declarada**: `claude/invoker-ia-v1`
- **Rama real**: `claude/trigger-torre-mvp-rSWiS` (restricción del harness)
- **RAMA_DESTINO**: `main`
- **Repo**: `szlapakariel-ux/torre-control` (REPO_TECNICO ✓)
- **Commit final**: pendiente al momento de redactar

## [ESTADO]

OK — Invoker IA V1 implementado con 4 archivos nuevos + workflow extendido. Probado end-to-end en 6 escenarios. Cero cambios de producto, cero dependencias, cero secretos. Stubs honestos: ningún operador real invoca al modelo todavía, los adaptadores documentan exactamente qué falta.

## [QUÉ SE IMPLEMENTÓ]

- **Orquestador**: `.torre/scripts/invoke_operator.sh` lee la orden, valida 5 campos obligatorios + regla dura de identidad, decide a qué adaptador llamar según `EJECUTOR`, captura su exit code y propaga.
- **Convención `REQUIERE_IA: si`**: campo opcional en la orden. Si está, el Invoker actúa; si no, sale con "no aplica". Retro-compatible con todas las órdenes previas.
- **Adaptadores stub**: `.torre/scripts/operators/claude.sh` y `codex.sh` con interfaz `<orden> <reporte>`. Devuelven exit 99 (stub) y escriben en el reporte qué falta para hacerlos reales.
- **Workflow extendido**: `.github/workflows/torre-trigger.yml` ahora tiene un step adicional que llama al Invoker tras el detector. Vuelca resultados al step summary del job. Falla solo en errores reales (orden inválida, guardrail).
- **Documentación**: `.torre/invoker.md` con el mapa completo (qué es, cómo se entera, cómo decide, guardrails, ejemplos).

## [ARCHIVOS CREADOS/MODIFICADOS]

Creados:
- `.torre/scripts/invoke_operator.sh` (ejecutable)
- `.torre/scripts/operators/claude.sh` (ejecutable)
- `.torre/scripts/operators/codex.sh` (ejecutable)
- `.torre/invoker.md`
- `.torre/historial/2026-04-25_invoker-ia-v1/{orden,reporte}_actual.md` (archivado)

Modificados:
- `.github/workflows/torre-trigger.yml` (step nuevo "Intentar invocar operador IA si la orden lo pide").
- `.torre/estado.md` (lock tomado y devuelto).

## [QUÉ PARTE YA ES AUTOMÁTICA]

Funciona sin intervención humana:

- Detección de orden activa en `inbox/`.
- Validación de campos obligatorios.
- Validación de identidad de proyecto contra el repo actual.
- Dispatch al adaptador correcto según `EJECUTOR`.
- Logging del resultado en step summary del workflow.
- Disparo automático en cada push/PR sobre `.torre/**`.

## [QUÉ PARTE QUEDA COMO STUB]

La parte central: la invocación real al modelo IA.

- `claude.sh` no llama a ningún CLI ni API. Escribe su nota explicativa y sale con 99.
- `codex.sh` igual.
- El reporte parcial que escribe el Invoker tampoco corresponde a un trabajo real — es solo el preamble que dice "se intentó invocar".
- El operador real, cuando exista, debería sobreescribir ese reporte parcial con uno definitivo y cerrar el ciclo (archivar, placeholders, liberar lock). Eso sigue siendo manual.

## [QUÉ FALTA PARA INVOCAR CLAUDE REAL]

Documentado en `claude.sh`. Resumen:

1. **CLI Claude Code instalado en el runner**: `npm install -g @anthropic-ai/claude-code` o equivalente vigente.
2. **Repository secret `ANTHROPIC_API_KEY`** expuesto al workflow con scope mínimo (no lo agregamos en este ciclo: la orden prohibió usar secretos).
3. **Política de sandbox**: regla explícita de qué puede modificar el operador automático (sugerencia inicial: solo `.torre/**`).
4. **Modo no interactivo**: invocar Claude Code en modo headless con prompt = contenido de la orden.
5. **Aprobación humana antes de mergear**: el operador automático abre PR; un humano mergea. Nunca auto-merge.
6. **Límite duro de tokens/llamadas** por orden y por día para evitar gasto descontrolado.
7. **Audit trail**: log del prompt enviado y de la respuesta cruda recibida, además del reporte que escribe el operador.

## [QUÉ FALTA PARA INVOCAR CODEX REAL]

Documentado en `codex.sh`. Resumen:

1. **Decidir qué se entiende por "Codex" hoy**: el modelo original está retirado. Opciones:
   - OpenAI Codex CLI (preview).
   - GPT-4o / GPT-4.1 vía `openai` CLI o `curl` directo a la API.
   - GitHub Copilot CLI (otro producto, otra auth).
2. `OPENAI_API_KEY` (o equivalente) como secret.
3. Sandbox + no-interactivo + aprobación humana + límites de costo + trazabilidad (idénticos a Claude).

## [VERIFICACIÓN]

Probado localmente con 6 escenarios. Los exit codes confirman cada rama:

| Test | Setup | Exit esperado | Exit real |
|---|---|---|---|
| Inbox en placeholder | sin orden | 10 | 10 ✓ |
| Orden sin `REQUIERE_IA` | ORD-13 actual | 10 | 10 ✓ |
| Orden con `REQUIERE_IA: si` + `EJECUTOR: claude` | simulada | 99 (stub) | 99 ✓ |
| `EJECUTOR: humano` | simulada | 10 | 10 ✓ |
| `EJECUTOR: gemini` (unknown) | simulada | 40 | 40 ✓ |
| Campo `REPO_TECNICO` faltante | simulada | 20 | 20 ✓ |
| `REPO_TECNICO: agente-saas` (mismatch) | simulada | 30 (guardrail) | 30 ✓ |

Validación de YAML del workflow: `python3 -c "import yaml; yaml.safe_load(open(...))"` → OK.

## [RIESGOS]

1. **Discrepancia futura entre adaptadores stub y reales.** Cuando se conecte Claude o Codex de verdad, el contrato (paths por argumento, exit 99 = stub) tiene que sobrevivir. Mitigación: el contrato está documentado en `invoker.md` y en cada adaptador.
2. **Loop accidental.** Si el Invoker corre en CI sobre cada push y eventualmente conecta a un operador real que también pushea cambios, se puede generar un loop infinito (push → workflow → invocar → push → ...). Mitigación cuando se conecte: el workflow debe ignorar pushes hechos por el actor automático (por nombre o por etiqueta de commit). En V1 no aplica porque los stubs no escriben commits.
3. **Costos cuando se conecte de verdad.** Cada push que toque `.torre/**` invocaría el modelo. Sin guardrails de límite, una iteración de docs puede gatillar muchas llamadas. Mitigación: filtrar más fino el `paths` del workflow (solo `inbox/orden_actual.md` cambiado a no-placeholder), o usar un commit message marker para skip.
4. **Reporte parcial pisado por error.** Si el Invoker corre dos veces antes de que un operador real responda, la primera vez escribe el preámbulo y las siguientes ven outbox no-placeholder y no escriben — es seguro. Pero si un humano edita parcialmente el outbox, el Invoker no lo detecta. Aceptable para V1.
5. **Guardrails dependen de un solo grep**. La detección de `REQUIERE_IA: si` y la coincidencia de `REPO_TECNICO` con `origin` son matches simples. Una orden con formato raro puede romper el parsing. El Invoker se cae a "no aplica" o "campo faltante" — comportamiento conservador, correcto.
6. **El Invoker NO toma el lock**. Eso es deliberado (V1). Pero si un operador real arranca a actuar sin tomar el lock, un humano que quiera retomar el ciclo puede pisarlo. Cuando se conecte el operador real, lo primero que debería hacer su adaptador es setear `EN_PROCESO_POR=<su-id>` antes de modificar nada.

## [SIGUIENTE PASO]

En orden de utilidad y costo:

1. **Conectar Claude real** detrás de `claude.sh`. Pasos discretos: (a) decisión de modelo y CLI; (b) crear el repository secret `ANTHROPIC_API_KEY`; (c) extender el workflow con step de instalación del CLI; (d) modificar el adaptador para llamarlo con prompt = orden y capturar output; (e) política de sandbox y aprobación humana; (f) límite de tokens.
2. **Filtrado más fino del trigger del workflow** para evitar que cada cambio en `.torre/**` invoque al modelo. Sugerencia: solo `.torre/inbox/orden_actual.md` o solo cuando ese archivo deja de ser placeholder.
3. **Conectar Codex** detrás de `codex.sh`, después de Claude (para tener un patrón de referencia).
4. **Probar el patrón cross-repo del Invoker**: una orden remota emitida desde `torre-control` se transporta a `agente-saas`; cuando llegue al inbox de `agente-saas`, el Invoker en ese repo debería invocar local.
5. **(Independiente)** Volver a Secretaria IA / Portero V1 una vez que Claude esté conectado, para que la primera orden remota real ya use el operador automático.

## [EN_PROCESO_POR]

- **Operador que tomó la orden**: claude
- **Liberación al cierre confirmada**: sí
