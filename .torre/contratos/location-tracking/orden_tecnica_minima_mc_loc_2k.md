# MC-LOC-2K — Orden técnica mínima documental

## 1. Contexto

- MC-LOC-2K parte de **MC-LOC-2J cerrado en main** (PR #30, commit `56c2aa3`), que dejó el preflight de habilitación técnica con conteo cerrado: 3 CUMPLIDA + 12 CUMPLIDA CON LÍMITES + 4 NO CUMPLIDA + 3 BLOQUEANTE = 22.
- Este documento **NO es ejecución técnica**: no crea archivos técnicos, no toca código, no toca producción, no implementa nada.
- Este documento **NO habilita MC-LOC-2 técnico automáticamente**. Solo redacta una orden técnica mínima **candidata** para revisión humana por Ariel/Torre.
- Cualquier ejecución requiere orden separada explícita por escrito en el formato del §5.

Antecedentes:
- MC-LOC-1 (PR #24): contrato base.
- MC-LOC-1E (PR #25): registro histórico.
- MC-LOC-2A: diagnóstico de criterios técnicos habilitantes.
- MC-LOC-2B (PR #26): esquema evento v1 + retención/rollback + modo demo + decisiones pendientes.
- MC-LOC-2C (PR #27): cierre de las 9 decisiones.
- MC-LOC-2D (PR #28): lista cerrada de archivos técnicos.
- MC-LOC-2I (PR #29): decisión de almacenamiento y emisor.
- MC-LOC-2J (PR #30): preflight de habilitación técnica.
- MC-LOC-2K (este documento): redacción de orden técnica mínima documental.

## 2. Objetivo técnico candidato

Crear una implementación **demo/documental** de location tracking operativo que:

- Registre **eventos ficticios** en `.torre/location-tracking/demo_eventos.jsonl`, uno por línea, conforme al esquema v1 de `esquema_evento_v1.md`.
- Agregue **validaciones/ejemplos** bajo `.torre/location-tracking/` (schema JSON + 3 archivos `.json` de ejemplos: evento válido, evento rechazado por campo prohibido, evento rechazado por `state` inválido).
- Documente cómo se valida, cómo se prueba y cómo se revierte, en un `README.md` dentro de `.torre/location-tracking/`.

Restricciones del objetivo:
- **Sin producción.** Ningún sistema en marcha consume estos archivos.
- **Sin ubicación real.** Cero coordenadas, GPS, geocoding, IP.
- **Sin automatización.** Cero hooks, cron, workflows, daemons.
- **Sin datos personales.** Cero PII, ni siquiera como placeholder.

El objetivo es **probar el contrato**, no abrir una capacidad operativa.

## 3. Archivos técnicos candidatos permitidos

La orden técnica futura, si se autoriza, podría tocar **exclusivamente** los siguientes 6 paths (ya ratificados como lista cerrada en `lista_archivos_tecnicos_autorizados_mc_loc_2d.md §3.1 + §3.2`):

- `.torre/location-tracking/README.md`
- `.torre/location-tracking/demo_eventos.jsonl`
- `.torre/location-tracking/schema_evento_v1.json`
- `.torre/location-tracking/ejemplos/evento_valido.json`
- `.torre/location-tracking/ejemplos/evento_rechazado_campo_prohibido.json`
- `.torre/location-tracking/ejemplos/evento_rechazado_state_invalido.json`

Aclaraciones:
- **Esta lista no se ejecuta en MC-LOC-2K.** El microciclo actual solo la redacta como propuesta.
- **Esta lista no habilita creación de archivos todavía.** Crear cualquiera de estos paths antes de la orden de Ariel/Torre viola el contrato.
- **Cualquier archivo fuera de esta lista bloquea el ciclo técnico futuro.** No se admite ampliación dentro del PR técnico; cualquier path adicional requiere nuevo microciclo documental.

## 4. Prohibiciones absolutas

Quedan prohibidos en el eventual MC-LOC-2 técnico, sin excepción:

- Código de app.
- Backend.
- Frontend.
- Scripts automáticos (`.torre/scripts/`, hooks, pre-commit, etc.).
- Hooks (git, IDE, OS).
- Cron / schedulers.
- Workflows (`.github/workflows/`).
- Endpoints HTTP/RPC propios o ajenos.
- SDKs externos (sin nuevas dependencias).
- Secrets, tokens, credenciales, claves; `.env`.
- Producción (cualquier sistema en marcha).
- Ubicación real (GPS, geocoding, IP-to-location).
- GPS, coordenadas (latitud, longitud, altitud, precisión).
- IP (IPv4 y IPv6).
- Huella de dispositivo, user-agent, fingerprint.
- Datos personales (nombre, email, teléfono, IDs reales).
- Datos sensibles (salud, religión, finanzas, biometría).
- APIs reales (Google, Apple, mapas, geocoding, identity providers, etc.).

La aparición de cualquiera de estos elementos en un PR descalifica automáticamente el microciclo y dispara rollback documental (ver `retencion_y_rollback.md §Rollback documental`).

## 5. Condiciones obligatorias para una futura ejecución técnica

La orden técnica futura **solo puede ejecutarse** si Ariel/Torre autoriza explícitamente, por escrito, con la frase:

> **"Autorizo MC-LOC-2 técnico mínimo demo"**

Y esa orden debe incluir, en formato verificable:

- **Diff limitado a la lista cerrada de §3.** Cero archivos fuera de los 6 paths.
- **Datos 100% ficticios** en todos los archivos creados.
- **Modo demo** explícito; cualquier modo distinto exige flag + orden adicional.
- **Validación fail-closed**: si el evento no valida contra `schema_evento_v1.json`, no se persiste.
- **Evento válido** de ejemplo reproducible localmente (`ejemplos/evento_valido.json`).
- **Rechazo de campo prohibido** verificado (`ejemplos/evento_rechazado_campo_prohibido.json`).
- **Rechazo de `state` inválido** verificado (`ejemplos/evento_rechazado_state_invalido.json`).
- **Auditoría read-only posterior** (estilo MC-LOC-1A, MC-LOC-2B-A, MC-LOC-2E, MC-LOC-2I-A, MC-LOC-2J-A/C).
- **PR técnico separado** (no acumular con cambios documentales en el mismo PR).
- **No merge sin autorización explícita** de Ariel/Torre en la fase pre-merge.

Sin esta orden completa, MC-LOC-2 técnico **no se abre**.

## 6. Borrador de orden técnica futura

> **NO EJECUTAR ESTA ORDEN.**
> **ESTE BLOQUE ES SOLO BORRADOR DOCUMENTAL.**
> **MC-LOC-2 TÉCNICO SIGUE NO HABILITADO.**
>
> ---
>
> *Claude, ejecutá MC-LOC-2 técnico mínimo demo — implementación documental/demo de location tracking operativo.*
>
> *Contexto:*
> *- MC-LOC-2J cerrado en main (PR #30).*
> *- MC-LOC-2K redactó esta orden como borrador y quedó cerrado en main.*
> *- Las 22 condiciones del preflight están cubiertas/documentadas; las 3 humanas bloqueantes (#20, #21, #22) las resuelve esta orden.*
>
> *Objetivo: crear, exclusivamente, los siguientes 6 archivos bajo `.torre/location-tracking/`:*
>
> *1. `.torre/location-tracking/README.md` — propósito de la carpeta, modo demo, cómo se valida, cómo se revierte.*
> *2. `.torre/location-tracking/schema_evento_v1.json` — JSON Schema correspondiente a `esquema_evento_v1.md`.*
> *3. `.torre/location-tracking/ejemplos/evento_valido.json` — caso happy-path, valida ok.*
> *4. `.torre/location-tracking/ejemplos/evento_rechazado_campo_prohibido.json` — caso con `ip` presente, debe ser rechazado.*
> *5. `.torre/location-tracking/ejemplos/evento_rechazado_state_invalido.json` — caso con `state: "foo"`, debe ser rechazado.*
> *6. `.torre/location-tracking/demo_eventos.jsonl` — append-only con 1 a 3 eventos válidos ficticios.*
>
> *Alcance permitido:*
> *- Solo los 6 archivos arriba.*
> *- Sin código ejecutable (los `.json`/`.jsonl` son datos; el `README.md` es texto).*
> *- Sin scripts, sin workflows, sin secrets, sin endpoints, sin SDKs, sin producción.*
> *- Sin ubicación real, sin GPS, sin IP, sin datos personales.*
> *- Modo demo por defecto y por construcción (no hay flag de runtime porque no hay runtime).*
>
> *Comandos:*
> *1. git checkout main && git pull --ff-only origin main*
> *2. git checkout -b claude/mc-loc-3-tecnico-minimo-demo*
> *3. mkdir -p .torre/location-tracking/ejemplos*
> *4. Crear los 6 archivos.*
> *5. git status / diff / check (verificación de scope).*
> *6. git add / commit / push.*
> *7. NO abrir PR. Esperar orden separada para MC-LOC-3-A (auditoría) y MC-LOC-3-B (PR).*
>
> *Esta orden no se ejecuta hasta que Ariel/Torre la emita explícitamente.*
>
> ---
>
> **FIN DEL BORRADOR — NO EJECUTAR.**

## 7. Riesgos de ejecutar antes de tiempo

- **Convertir demo en producción**: si el JSONL empieza a leerse desde código real, deja de ser demo. Mitigación: §3 + §4 + monitoreo manual de PRs.
- **Registrar datos reales por error**: un commit apurado podría incluir un email/IP real entre los "ficticios". Mitigación: revisión de PR, validador fail-closed contra el schema, regla de PII.
- **Sumar scripts prematuramente**: la tentación de "automatizar la validación con un script" cae fuera de scope. Mitigación: §4 prohíbe scripts; cualquier script requiere su propio microciclo.
- **Crear automatización sin protocolo**: agregar hooks/workflows porque "es solo demo". Mitigación: §4 prohíbe automatización; el preflight §5 exige PR técnico separado y revisión humana.
- **Volver a Ariel cartero**: que la emisión de eventos termine generando notificaciones / propagación. Mitigación: `decision_almacenamiento_emisor_mc_loc_2i.md §3.3` deja a Torre/Ariel como consumidor humano único.
- **Romper el estándar de Torre como proyecto guía**: ejecutar técnica antes de orden saltea el patrón que se viene sosteniendo desde MC-LOC-0. Mitigación: §5 exige frase explícita "Autorizo MC-LOC-2 técnico mínimo demo"; §6 marca el borrador como NO EJECUTABLE.

## 8. Dictamen final

**A) Orden técnica mínima redactada documentalmente; MC-LOC-2 técnico sigue NO habilitado.**

Justificación:
- El documento redacta una orden mínima, conservadora y verificable.
- §3 fija los 6 paths exactos posibles, alineados con la lista cerrada de MC-LOC-2D.
- §4 reitera las prohibiciones absolutas.
- §5 exige la frase explícita de autorización y 10 condiciones obligatorias.
- §6 incluye el borrador con el aviso triple "NO EJECUTAR / ESTE BLOQUE ES SOLO BORRADOR / MC-LOC-2 TÉCNICO SIGUE NO HABILITADO".
- §7 documenta los riesgos para que la decisión humana se tome con todos los frentes a la vista.

Este documento **no autoriza implementación**. Solo la prepara como propuesta.

## 9. Próximo microciclo recomendado

**MC-LOC-2K-A — auditoría read-only de la orden técnica mínima documental.**

Tipo: read-only sobre `orden_tecnica_minima_mc_loc_2k.md`. Verifica:
- que el documento no incluya código ejecutable;
- que la lista de §3 esté limitada a los 6 paths bajo `.torre/location-tracking/`;
- que §6 mantenga los avisos "NO EJECUTAR" y la marca "MC-LOC-2 TÉCNICO SIGUE NO HABILITADO";
- que ningún término sensible esté usado en contexto afirmativo;
- que el dictamen §8 mantenga A.

Tras MC-LOC-2K-A, la secuencia esperada:
- **MC-LOC-2K-B** — apertura de PR documental.
- **MC-LOC-2K-C** — verificación pre-merge.
- **MC-LOC-2K-D** — merge squash autorizado.

Solo después de mergear MC-LOC-2K en `main`, y con orden explícita de Ariel ("Autorizo MC-LOC-2 técnico mínimo demo"), podría considerarse abrir el microciclo técnico (probablemente renombrado **MC-LOC-3**, para marcar el salto a fase técnica).
