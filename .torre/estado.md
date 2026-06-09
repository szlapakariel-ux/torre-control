# Estado Torre

- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **Última actualización**: 2026-06-09
- **Última orden cerrada**: MC-APP-1 — preparación de producción del app (backend + frontend) (ORD-20260609-01, PR #58)
- **Operador del último ciclo**: Claude Code (`claude_code`)
- **Rama destino del último ciclo**: `main` (vía PR #58, pendiente de merge)
- **Archivo del último ciclo**: `.torre/revisiones/mc-app-1-preparacion-produccion-app.md`
- **Gate de producción del app**: **DEVUELTO A AUTORIZACIÓN** — no APROBADO. Faltan auditor independiente, autorización explícita de Ariel y verificación de rollback. Ver el archivo del último ciclo.
- **Orden activa**: NO (inbox en placeholder)
- **EN_PROCESO_POR**: ninguno
- **ORDENES_REMOTAS_EN_VUELO**: 0
- **Bloqueos**: ninguno
- **MC-LOC-2 técnico**: NO habilitado (requiere orden explícita de Torre; ver saga location-tracking más abajo).
- **Nomenclatura location-tracking (decisión de Torre, tras MC-LOC-2K-A)**: **MC-LOC-2 = fase documental** (cerrada); **MC-LOC-3 = futura fase técnica mínima demo**, solo si Ariel/Torre la autoriza más adelante. Esta decisión **no habilita implementación**.
- **Órdenes en suspenso**: ORD-2026-04-25-10 (`.torre/inbox/suspendidas/ORD-2026-04-25-10.md`) — diagnóstico Portero V1 en agente-saas, congelada hasta nueva decisión de Torre.

## Resumen del estado del sistema

- `.torre/` instalado y documentado: protocolo, sistema, roles, flujo, decisiones, README, templates, estado, trigger, propuesta de Torre Central (aprobada e implementada), invoker (gates V1.1 + matcher V1.2 estricto), contrato Claude real (mergeado), plan V0 (mergeado), workflow del feasibility test (mergeado).
- **MC-1**: protocolo principal `WhatsApp → Portero Local → Torre → Repo Activo` registrado en `.torre/protocolo_principal.md`; jerarquía documental declarada en `.torre/jerarquia_documental.md` (3 capas con regla de prevalencia); 10 documentos pasan a consulta histórica subordinada según `.torre/historico.md` (sin moverlos físicamente); ORD-2026-04-25-10 preservada en `.torre/inbox/suspendidas/`.
- **Saga location-tracking (toda documental, cerrada hasta MC-LOC-2K / PR #31)**: contrato bajo `.torre/contratos/location-tracking/`. Recorrido cerrado en `main`:
  - MC-LOC-1 (PR #24) — contrato documental base. Cierre histórico en `.torre/historial/2026-05-18_mc-loc-1-location-tracking-cierre.md`.
  - MC-LOC-2B (PR #26) — esquema evento v1 + retención/rollback + modo demo + decisiones pendientes.
  - MC-LOC-2C (PR #27) — cierre de las 9 decisiones pendientes.
  - MC-LOC-2D (PR #28) — lista cerrada de 6 archivos técnicos autorizados.
  - MC-LOC-2I (PR #29) — decisión de almacenamiento y emisor.
  - MC-LOC-2J (PR #30) — preflight de habilitación técnica (22 condiciones).
  - MC-LOC-2K (PR #31) — orden técnica mínima documental (borrador NO EJECUTABLE).
  - MC-LOC-2K-A (auditoría read-only de la orden técnica mínima) — cerrada **APTA** (dictamen A).
  - **MC-LOC-2 técnico sigue NO habilitado.** Regla central: el nombre de una branch no autoriza implementación. Tras MC-LOC-2K-A, Torre fijó la nomenclatura definitiva: **la fase documental es MC-LOC-2** y **la futura fase técnica mínima demo será MC-LOC-3**, que solo se abre con orden explícita de Torre y la frase de autorización definida en el contrato. Nada de código/scripts/workflows/producción se tocó en toda la saga.
- **Bloque MC-2 (proyecto activo / alias / alta de proyecto) — CERRADO, toda documental**: dotó a la Torre de un mapa de proyectos, sistema de alias y protocolo de altas. Recorrido cerrado en `main`:
  - MC-2A — auditoría read-only de menciones de proyecto/repo dispersas (sin cambios de archivo).
  - MC-2B (PR #34, commit `bdcb646`) — crea `.torre/proyectos.md`, registro operativo de proyectos, repos y alias (torre / saas / sofse). Fuente de verdad del mapa.
  - MC-2C (PR #35, commit `a674727`) — crea `.torre/protocolo_alta_proyecto.md`, protocolo de alta de proyecto nuevo (11 campos, 5 estados, reglas de seguridad).
  - MC-2D (PR #36, commit `88264d0`) — smoke test documental del protocolo con proyecto ficticio (`Proyecto Demo Controlado`); clasificado `conocido / no iniciado`. NO dado de alta realmente. `.torre/revisiones/mc-2d-smoke-test-alta-proyecto.md`.
  - MC-2E (PR #37, commit `908a78f`) — acta de cierre del bloque. `.torre/revisiones/mc-2e-cierre-bloque-proyectos-alias.md`.
  - **Qué quedó habilitado**: usar alias para identificar proyectos, consultar proyecto activo por defecto (`torre`), evaluar altas nuevas, clasificar proyectos incompletos, preparar una futura alta real mediante orden separada.
  - **Qué NO quedó habilitado**: JSON/runtime, lectura por código, implementación técnica automática, creación de repos reales, producción, automatización. El JSON consumible por runtime (ej. `.torre/proyectos.json`) queda **diferido** a otro microciclo con autorización explícita de Torre. Cero código/scripts/workflows tocados.
- `main` protegido (PR obligatorio, status check `detect-cycle-closure`, force/delete bloqueados).
- Stubs Claude/Codex intactos.
- Workflow principal `torre-trigger-v1` intacto.
- Workflow `claude-cli-feasibility-test`: APROBADO en feasibility manual de Torre.
- `inbox/orden_actual.md` y `outbox/reporte_actual.md` en placeholder — no hay orden activa.
- **Hasta MC-2**: backend y frontend sin cambios, cero dependencias, cero código tocado en MC-1 ni en la saga MC-LOC.
- **MC-APP-1 (2026-06-09, ORD-20260609-01, PR #58)** — primer microciclo de la línea **MC-APP** (el app como producto técnico). Dejó el app desplegable: persistencia en SQLite (migración idempotente de los JSON legacy), config por entorno (`PORT`/`ALLOWED_ORIGIN`/`DATA_DIR`/`API_TOKEN`), CORS cerrado, auth Bearer en escrituras, helmet + rate limit + manejo de errores + apagado ordenado, frontend servido desde el backend, y artefactos de deploy (`Dockerfile`, `railway.toml`, `.dockerignore`, `.env.example`, `DEPLOY.md`, `.gitignore`); `node_modules` desversionado. **El gate de producción NO quedó aprobado** (ver más abajo). Detalle: `.torre/revisiones/mc-app-1-preparacion-produccion-app.md`.
- **Deploy de preview y decisiones de producto (2026-06-09, post-MC-APP-1)** — Ariel desplegó el app en Railway desde la rama `claude/eager-fermat-vr2ee4` (URL `torre-control-production-3589.up.railway.app`), como decisión directa del dueño (el gate formal sigue pendiente). Build OK tras agregar build-tools al Dockerfile para compilar `better-sqlite3` (commit `b391cc8`). Decisiones de Ariel: (1) **lectura pública** (los `GET` siguen sin token; escritura sigue con token); (2) **datos demo fuera de producción** — se quitaron `backend/data/messages.json` y `knowledge.json` del repo; prod arranca con base vacía.

## Sugerencias acumuladas para próximas órdenes

1. ~~**MC-2** — Mecánica mínima de proyecto activo y alias~~ — **CERRADO documentalmente** (bloque MC-2B→MC-2E). La variante JSON/runtime (`.torre/proyectos.json`, `.torre/inbox/proyecto_activo.json`) queda diferida a un microciclo futuro con orden explícita.
2. **MC-3** — Formato de escalamiento Portero → Torre (`.torre/inbox/escalamientos/`), 12 campos del protocolo principal sección 9.
3. **MC-4** — Estados, opciones numeradas y avance verificable estructurado.
4. **MC-5** — Watcher de 15 minutos y recuperación interna.
5. **MC-6** — Puente real Portero → Torre, si corresponde.
6. **MC documental aparte** — archivado físico de documentos históricos a `.torre/historial/protocolos_v0/` (solo si Torre lo decide).
7. **MC documental aparte** — formalizar mesa local (`.mesa/{estado.md, pedidos/, revisiones/}`) en repos de proyecto.
8. Pendiente de plan V0: revisar PR del paso 1, disparar `claude-adaptor-prechecks`, etc. (cola previa a MC-1, decide Torre si retoma).
9. **Limpieza de ramas pendiente** (ramas viejas sin mergear).
10. Validador CI de campos obligatorios en `inbox/orden_actual.md`.
11. **PRs #1 y #2 pendientes de decisión**: ambos *draft*, de Copilot (2026-04-25), duplicados sobre lectura de URLs/browser en el chat. Sin tocar desde su apertura. Torre debe decidir cerrarlos, retomarlos o descartarlos.

## Pendientes abiertos (resumen)

- **PRs #1 / #2**: draft, duplicados (browser/URL reading), esperan decisión de Torre.
- **Limpieza de ramas** viejas.
- **ORD-2026-04-25-10**: suspendida, congelada.

## Próxima decisión recomendada

- **Sobre MC-APP-1 / gate de producción**: la preparación técnica está cerrada, pero el pase a producción **no está aprobado**. Para cerrar el gate hace falta: (1) auditor independiente distinto del ejecutor, (2) autorización explícita de Ariel registrada (no inferida), (3) verificación de rollback. Mientras tanto, si Ariel mergea #58 y despliega, lo hace como decisión directa del dueño, no como pase aprobado por el gate de Torre.
- **Sobre el bloque MC-2**: cerrado por completo (MC-2B→MC-2E en `main`). La Torre ya puede gestionar proyectos y alias documentalmente. Próximo uso posible (requiere orden separada): alta documental de un proyecto real, selección de proyecto activo por alias, auditoría de proyectos registrados, o preparación de un JSON/runtime si Torre lo autoriza.
- **Sobre location-tracking**: la fase documental (MC-LOC-2) está cerrada y auditada (MC-LOC-2K-A apta). La futura fase técnica mínima demo (**MC-LOC-3**) **solo** se abre con orden explícita de Torre que incluya la frase de autorización del contrato. Mientras tanto, MC-LOC técnico permanece NO habilitado. **No hay orden activa**; Torre queda en reposo a la espera de una eventual orden MC-LOC-3.
- **Sobre PRs #1/#2**: decidir cierre o retoma.

## Próximo trigger esperado

Torre publica una nueva orden en `.torre/inbox/orden_actual.md` con los 7 campos obligatorios. Hasta entonces, los operadores IA no actúan.
