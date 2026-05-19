# MC-LOC-2I — Decisión de almacenamiento y emisor del evento

## 1. Contexto

- MC-LOC-2I nace porque `decision_mc_loc_2c.md` dejó **dos bloqueantes derivados a microciclo futuro**:
  - §2.1 **almacenamiento definitivo**,
  - §2.3 **quién emite el evento**.
- MC-LOC-2D (PR #28, commit `098ed4d`) ya cerró la **lista documental de archivos técnicos potenciales** bajo `.torre/contratos/location-tracking/lista_archivos_tecnicos_autorizados_mc_loc_2d.md`.
- Este documento **no implementa nada**. No crea archivos técnicos, no toca código, no toca producción.
- Este documento **no habilita MC-LOC-2 técnico automáticamente**. Cierra dos puntos con límites; la habilitación técnica requiere auditoría, PR, merge de este documento y luego orden explícita separada.

Antecedentes:
- MC-LOC-1 (PR #24): contrato base.
- MC-LOC-1E (PR #25): registro histórico de cierre.
- MC-LOC-2A: diagnóstico de criterios técnicos habilitantes.
- MC-LOC-2B (PR #26): esquema evento v1 + retención/rollback + modo demo + decisiones pendientes.
- MC-LOC-2C (PR #27): cierre documental de las 9 decisiones; bloqueantes derivados: §2.1, §2.3, §2.5.
- MC-LOC-2D (PR #28): cierre de §2.5 (lista de archivos técnicos).
- MC-LOC-2I (este documento): cierre con límites de §2.1 y §2.3.

## 2. Decisión sobre almacenamiento

### 2.1 Almacenamiento permitido para futuro MC-LOC-2 técnico mínimo/demo

**Estado: CERRADO CON LÍMITES.**

Único almacenamiento potencial permitido, **si y solo si** luego se autoriza MC-LOC-2 técnico por orden separada:

- `.torre/location-tracking/demo_eventos.jsonl`

Este path ya figura en la lista cerrada de §3.1 de `lista_archivos_tecnicos_autorizados_mc_loc_2d.md`. MC-LOC-2I lo ratifica como **único almacenamiento operativo posible** para la fase técnica inicial.

Condiciones (todas obligatorias, sin excepción):

- Solo **datos ficticios** (ver `modo_demo_test.md`).
- Solo **modo demo**.
- Solo **eventos operativos** conforme al esquema v1 (`esquema_evento_v1.md`).
- **Auditable por Git**: cada escritura ocurre en el contexto de un commit y un PR documental previamente aprobado.
- **Sin producción**.
- **Sin ubicación real** (GPS, geocoding, IP-to-location).
- **Sin datos personales** (nombre, email, teléfono, IDs reales).
- **Sin IP** (IPv4 / IPv6).
- **Sin huella de dispositivo**, user-agent, fingerprint.
- **Sin secrets**, tokens, credenciales, claves.
- **Sin automatización**: nada de hooks, cron, daemons, schedulers.
- **Sin escritura silenciosa**: cada escritura debe quedar visible en un diff revisable por humano.

### 2.2 Almacenamiento NO permitido

Quedan prohibidos como destinos de location tracking bajo este contrato:

- **Bases de datos** (SQL, NoSQL, KV stores, etc.).
- **Servicios externos** (cloud, SaaS, observabilidad, telemetry-as-a-service).
- **Producción** (cualquier sistema en marcha que sirva usuarios reales).
- **Backend** productivo (`backend/`, runtimes activos).
- **Frontend** productivo (`frontend/`, builds desplegados).
- **Endpoints** HTTP/RPC propios o ajenos.
- **APIs reales** (Google, Apple, mapas, geocoding, identity providers, etc.).
- **Workflows** (`.github/workflows/`).
- **Scripts automáticos** (`.torre/scripts/`, hooks, pre-commit, schedulers).
- **Logs productivos** (de aplicaciones reales, agregadores, ELK, etc.).
- **Cualquier archivo fuera de `.torre/location-tracking/`** como destino de eventos.
- **Cualquier almacenamiento con datos personales o sensibles**, aun "para pruebas".

La aparición de cualquiera de estos destinos en un PR descalifica automáticamente el microciclo (rollback documental, ver `retencion_y_rollback.md §Rollback documental`).

### 2.3 Almacenamiento futuro no-demo

Aclaración vinculante:

- **Cualquier almacenamiento real o productivo queda fuera de MC-LOC-2.** No se introduce a través de este contrato.
- Una eventual fase real (más allá del demo in-repo) **requiere contrato separado**, con título distinto, alcance explícito y revisión documental dedicada.
- Esa fase **requiere capítulo de privacidad/seguridad** propio, con base legal, política de retención, política de acceso, plan de incidentes y procedimiento de revocación.
- Esa fase **requiere autorización explícita de Ariel/Torre** por escrito. Ni el agente, ni Claude, ni ningún hook pueden activarla.

Hasta que ese contrato separado exista y esté firmado, location tracking **se mantiene exclusivamente en demo in-repo**, sin excepciones.

## 3. Decisión sobre emisor del evento

### 3.1 Emisor permitido para futuro MC-LOC-2 técnico mínimo/demo

**Estado: CERRADO CON LÍMITES.**

Emisor inicial conceptual permitido:

- **Agente ejecutor autorizado por Torre**, actuando durante un microciclo técnico explícitamente aprobado, con cada emisión visible en el diff del PR que abre.

En la práctica, esto significa que un evento se "emite" como parte de los cambios documentados del PR — no como side-effect en runtime de un servicio.

Condiciones (todas obligatorias):

- **Emisión manual o controlada dentro del diff del PR**: cada línea agregada a `demo_eventos.jsonl` es parte del cambio revisable, no un side-effect oculto.
- **Sin hook automático** (git, OS, IDE).
- **Sin cron**.
- **Sin workflow** (`.github/workflows/` no genera eventos).
- **Sin daemon** ni proceso de fondo.
- **Sin endpoint**: no hay servidor que reciba o publique eventos.
- **Sin app productiva**: ningún producto real emite.
- **Sin lectura de secrets**: el emisor no necesita ni puede acceder a credenciales.
- **Sin integración externa**: nada de webhooks salientes, llamadas HTTP, SDKs.

### 3.2 Emisores NO permitidos

Quedan prohibidos como emisores bajo este contrato:

- **App productiva** (cualquier producto en marcha que sirva usuarios reales).
- **Backend productivo**.
- **Frontend productivo**.
- **GitHub Actions** (cualquier workflow que escriba eventos automáticamente).
- **Hooks automáticos** (git, IDE, OS).
- **Cron jobs** / schedulers.
- **Bots conectados a producción** (Slack bots productivos, integraciones reales).
- **SDKs externos** (sin nuevas dependencias para "emitir más fácil").
- **Servicios externos** (eventbus, message queues, telemetry pipelines).
- **Cualquier proceso que escriba sin revisión humana** previa al commit.

Aparición de cualquiera de estos emisores en un PR técnico descalifica automáticamente el microciclo.

### 3.3 Consumidor inicial

Aclaración vinculante:

- **Consumidor inicial sigue siendo Torre/Ariel** mediante **revisión documental** o **revisión de PR** (lectura humana directa de `demo_eventos.jsonl`).
- **No hay dashboard operativo**.
- **No hay automatización anti-cartero** todavía: la regla anti-cartero (no propagar mensajes a destinos no autorizados) se mantiene sin emisión automática asociada.
- **No hay integración con app real**: ningún consumidor productivo lee estos eventos.

Cualquier consumidor distinto (dashboard, agregador, sistema de alertas, app productiva) requiere contrato separado y orden explícita.

## 4. Checklist actualizada para abrir MC-LOC-2 técnico futuro

Para autorizar MC-LOC-2 técnico, deben cumplirse **todas** las siguientes condiciones (consolida la checklist de `lista_archivos_tecnicos_autorizados_mc_loc_2d.md §7` + las decisiones de §2 y §3 de este documento):

- [ ] **MC-LOC-2I mergeado en `main`**.
- [ ] **PR técnico futuro con diff limitado a la lista de MC-LOC-2D** (paths bajo `.torre/location-tracking/`, exclusivamente §3.1 y §3.2).
- [ ] **Almacenamiento limitado a `.torre/location-tracking/demo_eventos.jsonl`** (más README y schema/ejemplos como datos, no como código ejecutable).
- [ ] **Emisor limitado a agente ejecutor autorizado por Torre**, con emisión visible en el diff del PR.
- [ ] **Datos 100% ficticios** en todos los archivos creados.
- [ ] **Modo demo explícito**: si existe flag/variable, por defecto `MODE=demo`; cualquier otro modo requiere orden por escrito.
- [ ] **Validación fail-closed**: si el evento no valida contra el schema v1, no se persiste.
- [ ] **Evento válido de ejemplo** reproducible localmente.
- [ ] **Rechazo de campo prohibido** (ej. `ip` presente → rechazo).
- [ ] **Rechazo de `state` inválido** (valor fuera del enum → rechazo).
- [ ] **Sin código fuera de la lista autorizada** (cero archivos en `backend/`, `frontend/`, `app/`, `src/`, manifiestos, etc.).
- [ ] **Sin scripts automáticos** (nada en `.torre/scripts/`, ni hooks, ni cron, ni schedulers).
- [ ] **Sin workflows** (nada en `.github/workflows/`).
- [ ] **Sin producción**.
- [ ] **Sin endpoints** (sin servidores, sin handlers HTTP/RPC).
- [ ] **Sin SDKs externos** (sin nuevas dependencias).
- [ ] **Sin secrets** (sin tokens, claves, credenciales; sin `.env`).
- [ ] **Sin tracking real** (cero geolocalización, GPS, geocoding, IP-to-location).
- [ ] **Sin ubicación real** (cero datos físicos de personas o dispositivos).
- [ ] **Autorización explícita de Ariel/Torre** por escrito para cada paso (apertura, PR, merge).
- [ ] **Auditoría documental previa** (estilo MC-LOC-1A / MC-LOC-2B-A / MC-LOC-2E) con dictamen apto.
- [ ] **Rollback documental previsto** y registrado por escrito antes del primer PR técnico.

Si **cualquier** punto falta, MC-LOC-2 técnico queda **bloqueado**.

## 5. Dictamen final

**A) Almacenamiento y emisor cerrados con límites; MC-LOC-2 técnico sigue NO habilitado hasta auditoría/PR/merge de este documento y orden separada.**

Justificación:
- **§2.1** queda **CERRADO CON LÍMITES**: único path posible `demo_eventos.jsonl`, in-repo, auditable por Git, solo demo, sin PII.
- **§2.2** y **§2.3** dejan **explícitamente fuera** bases de datos, servicios externos, producción, backend, frontend, endpoints, APIs reales, workflows, scripts automáticos.
- **§3.1** queda **CERRADO CON LÍMITES**: emisor único = agente ejecutor autorizado, con emisión visible en diff.
- **§3.2** prohíbe app productiva, GitHub Actions, hooks, cron, bots productivos, SDKs externos, servicios externos.
- **§3.3** ratifica consumidor humano (Torre/Ariel).
- **§4** consolida 22 condiciones bloqueantes antes de habilitar implementación.
- Este documento no crea archivos técnicos ni autoriza implementación; la habilitación requiere orden separada después de su auditoría/PR/merge.

## 6. Próximo microciclo recomendado

**MC-LOC-2I-A — auditoría read-only del documento de almacenamiento y emisor antes de PR.**

Tipo: read-only sobre `decision_almacenamiento_emisor_mc_loc_2i.md`. Verifica:
- que el diff contenga exclusivamente este archivo,
- que §2 y §3 mantengan estados CERRADO CON LÍMITES,
- que las prohibiciones de §2.2 y §3.2 sigan completas,
- que la checklist de §4 mantenga las 22 condiciones,
- que ningún término sensible esté usado en contexto afirmativo,
- que MC-LOC-2 técnico siga declarado como NO habilitado.

Tras MC-LOC-2I-A, la secuencia esperada:
- **MC-LOC-2I-B** — apertura de PR documental.
- **MC-LOC-2I-C** — verificación pre-merge.
- **MC-LOC-2I-D** — merge squash autorizado por Torre.

Solo después de mergear MC-LOC-2I en `main` y con orden separada por escrito, Torre podría considerar abrir un MC-LOC-2 técnico que cumpla la checklist de §4.
