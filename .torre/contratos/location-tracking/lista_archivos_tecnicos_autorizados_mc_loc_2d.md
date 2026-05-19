# MC-LOC-2D — Lista cerrada de archivos técnicos autorizados

## 1. Contexto

- MC-LOC-2D nace porque **MC-LOC-2C dejó bloqueada la lista cerrada de archivos técnicos** (§2.5 de `decision_mc_loc_2c.md`), señalada como bloqueante principal para cualquier MC-LOC-2 técnico.
- Este documento **no implementa nada**: no crea archivos técnicos, no modifica código, no toca producción.
- Este documento **no habilita MC-LOC-2 técnico automáticamente**. Es la pieza documental que define qué paths podrían quedar autorizables en el futuro, sujetos a una orden separada de Torre/Ariel.
- Cualquier implementación futura requiere **orden separada por escrito**, con auditoría documental previa y verificación de la checklist de §7.

Antecedentes:
- MC-LOC-1 (PR #24): contrato documental base.
- MC-LOC-1E (PR #25): registro histórico.
- MC-LOC-2A: diagnóstico de criterios técnicos habilitantes.
- MC-LOC-2B (PR #26): esquema evento v1 + retención/rollback + modo demo + decisiones pendientes.
- MC-LOC-2C (PR #27): cierre documental de las 9 decisiones, bloqueando §2.5.

## 2. Principio de diseño

La lista respeta los siguientes principios, sin excepción:

- **Mínimo alcance posible.** Solo lo estrictamente necesario para una demo documental futura.
- **Sin producción.** Ninguna ruta toca código de producto en marcha.
- **Sin ubicación real.** Nada de GPS, geocoding, IP-to-location, sensores.
- **Sin datos personales.** Sin nombres, emails, teléfonos, IDs reales.
- **Sin scripts automáticos.** Nada bajo `.torre/scripts/` queda autorizado.
- **Sin workflows.** Nada bajo `.github/workflows/` queda autorizado.
- **Sin endpoints.** Sin servidores HTTP/RPC, sin handlers de red.
- **Sin SDKs.** Sin nuevas dependencias externas para "facilitar" tracking.
- **Sin secrets.** Sin tokens, claves, credenciales.
- **Fail-closed.** Si la validación de esquema falla, no se persiste nada.
- **Trazabilidad por Git.** El historial de commits es la capa de retención.

## 3. Archivos técnicos potencialmente autorizables en un futuro

Esta sección lista **paths candidatos** a quedar habilitados por un microciclo técnico futuro (MC-LOC-2 técnico) bajo orden explícita. **La inclusión aquí no constituye autorización**; solo define el universo cerrado fuera del cual ninguna implementación es legítima.

Todos los paths cuelgan de la nueva raíz **`.torre/location-tracking/`** (no confundir con `.torre/contratos/location-tracking/`, que vive en otra rama del árbol y aloja únicamente documentación).

### 3.1 Archivos de estado / demo permitibles

| Path | Propósito | Condiciones obligatorias |
|------|-----------|--------------------------|
| `.torre/location-tracking/demo_eventos.jsonl` | Append-only de eventos de demostración bajo el esquema v1. | Solo datos ficticios. Solo modo demo. Cero PII. |
| `.torre/location-tracking/README.md` | Explicación humana de qué vive en esa carpeta y cómo se usa en modo demo. | Sin datos reales. Sin instrucciones que requieran red o secrets. |

Reglas:
- Solo datos **ficticios** (ver §5 y `modo_demo_test.md`).
- Solo **modo demo**.
- **No producción.**
- **No ubicación real.**
- **No datos personales.**

### 3.2 Archivos de validación documental / técnica futura

| Path | Propósito | Condiciones obligatorias |
|------|-----------|--------------------------|
| `.torre/location-tracking/schema_evento_v1.json` | Esquema JSON Schema correspondiente al contrato `esquema_evento_v1.md`. | Versionado, sin lógica ejecutable, sin redes. |
| `.torre/location-tracking/ejemplos/evento_valido.json` | Caso happy-path para validar. | Ficticio, sin PII. |
| `.torre/location-tracking/ejemplos/evento_rechazado_campo_prohibido.json` | Caso que debe fallar por incluir un campo no autorizado (ej. `ip: "1.2.3.4"`). | Ficticio, sin PII. |
| `.torre/location-tracking/ejemplos/evento_rechazado_state_invalido.json` | Caso que debe fallar por usar un `state` fuera del enum cerrado. | Ficticio, sin PII. |

Condición transversal:
- Estos archivos **solo pueden crearse si se autoriza MC-LOC-2 técnico** en un microciclo separado, con orden explícita.
- Hasta entonces no existen y no deben aparecer en ningún PR.

### 3.3 Archivos expresamente NO autorizados por ahora

La siguiente lista enumera paths que **quedan fuera** de cualquier microciclo técnico subordinado a este contrato. Aparecer en un PR los descalifica automáticamente:

- `.torre/scripts/` — toda la zona de scripts operativos de Torre.
- `.github/workflows/` — workflows de CI/CD.
- `app/` — código aplicativo.
- `src/` — código fuente.
- `backend/` — backend de Torre y/o productos.
- `frontend/` — frontend de Torre y/o productos.
- `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml` — manifiestos de dependencias.
- `requirements.txt`, `pyproject.toml`, `Pipfile`, `poetry.lock` — manifiestos Python.
- `Dockerfile`, `docker-compose.yml`, `docker-compose.*.yml` — contenedores.
- `railway.json`, `render.yaml`, `vercel.json`, `fly.toml`, `netlify.toml` — config de despliegue.
- `.env`, `.env.*` — cualquier archivo de variables de entorno.
- Cualquier archivo de secrets (`*.secret`, `*.key`, `credentials*`, `service-account*`, etc.).
- Cualquier endpoint productivo.
- Cualquier integración con APIs reales (Google, Apple, mapas, geocoding, etc.).

Cualquier futuro MC-LOC-2 técnico que necesite tocar uno de estos paths **queda automáticamente bloqueado** hasta abrir un contrato separado con doble autorización (Torre + Ariel).

## 4. Rutas prohibidas

Además de los archivos enumerados en §3.3, quedan prohibidas las siguientes **rutas/zonas** completas para cualquier MC-LOC-2 técnico bajo este contrato:

- Cualquier ruta **fuera de `.torre/location-tracking/`** para datos de demo o ejemplos.
- Cualquier ruta de **runtime real** (servidores activos, daemons, schedulers).
- Cualquier ruta de **producción**.
- Cualquier **workflow** (independientemente de su ubicación).
- Cualquier **script automático** (incluyendo hooks de git, pre-commit, etc.).
- Cualquier archivo que **pueda ejecutar código** (`.sh`, `.py`, `.js`, `.ts`, `.rb`, `.go`, `.rs`, etc.) bajo `.torre/location-tracking/` u otras zonas relacionadas.

Excepción única posible: si una orden futura autoriza explícitamente un script bajo `.torre/location-tracking/`, ese script debe pasar por su propio microciclo, su propia auditoría y su propio PR documental previo. Sin esa orden, no se permite.

## 5. Datos permitidos

Los datos que pueden aparecer en cualquier archivo bajo `.torre/location-tracking/` son exclusivamente los del esquema v1, todos en valores **ficticios** o **controlados**:

- `project` — slug de proyecto demo (ej. `"demo-project"`, `"torre-control"`).
- `repo` — `owner/repo` en formato demo (ej. `"demo-owner/demo-repo"`).
- `branch` — nombre git válido y ficticio (ej. `"demo-branch"`).
- `microcycle` — patrón `MC-[A-Z0-9-]+` (ej. `"MC-DEMO-1"`).
- `agent` — identidad controlada (ej. `"claude-code"`, `"humano:demo"`).
- `state` — valor del enum cerrado de `esquema_evento_v1.md`.
- `area` — path relativo dentro del repo, sin `..`, sin URLs.
- `timestamp` — ISO-8601 UTC, fijo o controlado para test (no `now()` de producción).
- `next_action` — texto plano corto, ficticio, ≤ 200 caracteres, sin PII.

## 6. Datos prohibidos

En cualquier archivo bajo `.torre/location-tracking/`, sin excepción, quedan prohibidos:

- **GPS**, coordenadas (latitud, longitud, altitud, precisión).
- **Geolocalización real** / IP-to-location.
- **Ubicación física** de personas o dispositivos.
- **IP** (IPv4 y IPv6).
- **Huella de dispositivo**, user-agent, fingerprint.
- **Datos personales** (nombre, email, teléfono, IDs reales de usuario).
- **Datos sensibles** (salud, religión, finanzas, biometría).
- **Tokens, secrets, credenciales, claves.**
- **Información productiva** (clientes reales, pedidos reales, métricas reales).
- **Tracking silencioso** o encubierto.

La aparición de cualquiera de estos elementos en un PR descalifica automáticamente el microciclo y dispara rollback documental (ver `retencion_y_rollback.md §Rollback documental`).

## 7. Condiciones para habilitar MC-LOC-2 técnico futuro

Para que MC-LOC-2 técnico pueda abrirse, deben cumplirse **todas** las siguientes condiciones:

- [ ] **MC-LOC-2D mergeado en `main`**.
- [ ] **PR técnico futuro con diff limitado a la lista de §3.1 y §3.2** (paths autorizables). Cero archivos fuera de esa lista.
- [ ] **Datos demo / ficticios** en todos los archivos creados.
- [ ] **Validación fail-closed**: si el esquema rechaza un evento, no se persiste nada.
- [ ] **Prueba de evento válido** (caso happy-path) reproducible localmente.
- [ ] **Prueba de rechazo de campo prohibido** (ej. `ip` presente → rechazo).
- [ ] **Prueba de rechazo de `state` inválido** (valor fuera del enum → rechazo).
- [ ] **Sin scripts automáticos** (nada bajo `.torre/scripts/`, ni hooks, ni cron, ni schedulers).
- [ ] **Sin workflows** (nada bajo `.github/workflows/`).
- [ ] **Sin producción**.
- [ ] **Sin secrets** (sin tokens, claves, credenciales; sin `.env`).
- [ ] **Sin endpoints** (sin servidores, sin handlers HTTP/RPC).
- [ ] **Sin SDKs** (sin nuevas dependencias externas).
- [ ] **Autorización explícita de Torre/Ariel** por escrito en la orden de apertura.
- [ ] Auditoría documental previa (estilo MC-LOC-1A / MC-LOC-2B-A) con dictamen apto.

Si **cualquier** punto no se cumple, MC-LOC-2 técnico queda **bloqueado**. No se abre microciclo parcial: o se cumple toda la checklist o se amplía primero el contrato documental.

## 8. Dictamen final

**A) Lista cerrada definida documentalmente, pero MC-LOC-2 técnico sigue NO habilitado.**

Justificación:
- La lista de §3.1 + §3.2 queda **cerrada y conservadora**: solo `.torre/location-tracking/` con demo, README, schema JSON y 3 ejemplos.
- §3.3 y §4 dejan **explícitamente fuera** scripts, workflows, código aplicativo, manifiestos, contenedores, despliegues, secrets y endpoints.
- §7 fija una **checklist de 14 condiciones** que deben cumplirse antes de abrir cualquier microciclo técnico.
- Ninguna parte de este documento crea archivos técnicos ni autoriza implementación. La autorización requiere orden separada.

## 9. Próximo microciclo recomendado

**MC-LOC-2E — auditoría documental read-only de la lista cerrada antes de PR.**

Tipo: read-only sobre `lista_archivos_tecnicos_autorizados_mc_loc_2d.md`. Verifica:
- que la lista permanezca cerrada,
- que §3.3 y §4 no hayan introducido excepciones encubiertas,
- que §7 mantenga las 14 condiciones,
- que ningún término sensible esté usado en contexto afirmativo,
- que MC-LOC-2 técnico siga declarado como NO habilitado.

Tras MC-LOC-2E vendrían:
- **MC-LOC-2F** — apertura de PR documental para MC-LOC-2D.
- **MC-LOC-2G** — verificación pre-merge.
- **MC-LOC-2H** — merge squash autorizado por Torre.

Solo después de mergear MC-LOC-2D en `main`, Torre podría considerar (con nueva orden) abrir un MC-LOC-2 técnico que respete §3.1/§3.2/§7. Hasta entonces, no.
