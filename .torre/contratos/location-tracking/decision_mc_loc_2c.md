# MC-LOC-2C — Decisiones pendientes location tracking operativo

## 1. Contexto

MC-LOC-2C parte de **MC-LOC-2B cerrado en main** (PR #26, commit `0ab5de0`) y se ejecuta exclusivamente sobre documentación. **No habilita código, no autoriza implementación, no toca producción.**

Antecedentes:
- **MC-LOC-1** (PR #24): contrato base.
- **MC-LOC-1E** (PR #25): historial de cierre.
- **MC-LOC-2A**: diagnóstico de criterios técnicos habilitantes.
- **MC-LOC-2B** (PR #26): esquema evento v1, retención/rollback, modo demo, decisiones pendientes.

Este documento toma las 9 decisiones enumeradas en `decision_pendiente_mc_loc_2.md` y resuelve cada una con uno de cuatro estados: **CERRADA**, **CERRADA CON LÍMITES**, **BLOQUEADA** o **DERIVADA A MICROCICLO FUTURO**. La regla rectora es la preferencia conservadora ratificada por Torre: si la lista cerrada de archivos técnicos sigue bloqueada, el dictamen final es A.

## 2. Decisiones

### 2.1 Almacenamiento definitivo
- **Decisión**: aún no se elige path técnico definitivo. Se mantiene como preferencia documental el modelo in-repo append-only descripto en `retencion_y_rollback.md`, pero sin ratificar como vinculante.
- **Estado**: **DERIVADA A MICROCICLO FUTURO**.
- **Alcance permitido**: discusión documental, comparación de opciones (in-repo / externo / híbrido), redacción de pros y contras.
- **Alcance prohibido**: crear `.torre/tracking/` u otra ruta; conectar servicios externos; tocar infraestructura.
- **Evidencia requerida antes de técnica**: orden de Torre con opción elegida y justificación; ratificación por Ariel.
- **Bloquea MC-LOC-2 técnico**: SÍ.

### 2.2 Granularidad del evento
- **Decisión**: granularidad **por microciclo** (apertura + cierre) y/o **por transición significativa de `state`** (paso a `bloqueado`, `listo_para_pr`, `mergeado`). No por cada acción menor, no por cada commit.
- **Estado**: **CERRADA CON LÍMITES**.
- **Alcance permitido**: pensar el modelo documental con eventos de baja frecuencia (≈1–5 por microciclo).
- **Alcance prohibido**: instrumentar tracking por cada llamada/herramienta; producir ruido operativo.
- **Evidencia requerida antes de técnica**: confirmación escrita en orden de MC-LOC-2D o equivalente; test de no-ruido en modo demo.
- **Bloquea MC-LOC-2 técnico**: NO (está cerrada con límites).

### 2.3 Quién emite el evento
- **Decisión**: no se automatiza la emisión. En esta fase, los eventos —si existen— son **producidos a mano** por el humano operador o como parte del reporte estructurado de un microciclo. Sin agentes auto-emisores, sin hooks, sin wrappers.
- **Estado**: **DERIVADA A MICROCICLO FUTURO**.
- **Alcance permitido**: mencionar shape de evento en reportes documentales (texto), siempre como ilustración, nunca como persistencia automática.
- **Alcance prohibido**: agentes que escriban eventos; hooks de git; invocadores que emitan side-effects de tracking.
- **Evidencia requerida antes de técnica**: orden separada que defina emisor único, responsabilidad y trazabilidad.
- **Bloquea MC-LOC-2 técnico**: SÍ.

### 2.4 Quién consume el evento
- **Decisión**: consumidor inicial conceptual = **Torre / Ariel**, vía lectura humana directa. No hay aggregator automatizado, no hay dashboard externo, no hay app productiva.
- **Estado**: **CERRADA CON LÍMITES**.
- **Alcance permitido**: lectura humana, copia/pegado a reportes documentales, citación dentro de microciclos.
- **Alcance prohibido**: pipelines de procesamiento; dashboards externos; reescritura automática de `.torre/estado.md`; cualquier consumidor que requiera red.
- **Evidencia requerida antes de técnica**: ninguna mientras el consumo siga siendo humano y manual; si se propone consumidor automatizado, debe abrirse contrato separado.
- **Bloquea MC-LOC-2 técnico**: NO (cerrada con límites).

### 2.5 Lista cerrada de archivos técnicos autorizados
- **Decisión**: **no se autoriza ningún path técnico todavía**. La lista permanece sin valores aprobados. Los paths del bloque "Ejemplo de formato esperado" en `decision_pendiente_mc_loc_2.md` siguen siendo **ilustrativos y no autorizantes**.
- **Estado**: **BLOQUEADA**.
- **Alcance permitido**: nada técnico hasta tener microciclo separado.
- **Alcance prohibido (explícito)**:
  - `.torre/scripts/` **NO** queda autorizado.
  - `.torre/tracking/` **NO** queda autorizado como path final.
  - Cualquier path bajo `backend/`, `frontend/`, workflows, secrets: prohibido.
- **Evidencia requerida antes de técnica**: microciclo dedicado (MC-LOC-2D) que enumere paths exactos, sin globs amplios, con justificación por path y revisión de hooks/CI cuando corresponda.
- **Bloquea MC-LOC-2 técnico**: **SÍ — bloqueante principal**.

### 2.6 Política final de retención
- **Decisión**: mientras location tracking sea **documental/demo**, la persistencia se da por Git (historial inmutable de commits, append-only de hecho). Si en el futuro hubiera datos operativos reales, la política deberá revisarse en microciclo separado.
- **Estado**: **CERRADA CON LÍMITES**.
- **Alcance permitido**: confiar en Git como capa de retención mientras todo lo registrado sea documental o demo.
- **Alcance prohibido**: instalar rotación automática, scripts de archivado, bases externas, almacenamiento por fuera del repo.
- **Evidencia requerida antes de técnica**: nada adicional para fase documental; si aparecen datos operativos, requiere revisión.
- **Bloquea MC-LOC-2 técnico**: NO (cerrada con límites), pero sigue condicionada por §2.5.

### 2.7 Modo demo / test aprobado
- **Decisión**: ratifica `modo_demo_test.md`. Toda prueba futura debe usar **solo datos ficticios**, en **modo demo por defecto**, con **fail-closed**, sin producción, sin secrets, sin endpoints, sin SDKs, sin ubicación real.
- **Estado**: **CERRADA CON LÍMITES**.
- **Alcance permitido**: la lista de pruebas mínimas declarada en `modo_demo_test.md §Evidencia mínima exigida` queda como contrato de validación obligatorio.
- **Alcance prohibido**: pruebas que toquen red, producción, datos personales, ubicación real o cualquier ruta operativa fuera de la zona demo.
- **Evidencia requerida antes de técnica**: ejecución reproducible de las 8 pruebas mínimas; ninguna escritura fuera de la ruta demo; ningún efecto colateral.
- **Bloquea MC-LOC-2 técnico**: NO (cerrada con límites), condicionada por §2.5.

### 2.8 Rollback aprobado
- **Decisión**: ratifica `retencion_y_rollback.md §Rollback documental`. Rollback se ejecuta por **PR de reversa** para documentos; aparición de **campo prohibido** bloquea el ciclo de inmediato; cada incidente se **registra en `.torre/historial/`** con PR ofensor, regla violada, acción tomada y condición de desbloqueo.
- **Estado**: **CERRADA CON LÍMITES**.
- **Alcance permitido**: usar `git revert` o equivalente para documentos; abrir incidente; ejecutar auditoría read-only previa a retomar.
- **Alcance prohibido**: rollbacks que toquen producción; reescritura de historia (`force push`); cualquier acción destructiva sobre `main`.
- **Evidencia requerida antes de técnica**: procedimiento aplicado al menos una vez (incluso simulado) y dejado documentado.
- **Bloquea MC-LOC-2 técnico**: NO (cerrada con límites).

### 2.9 Confirmación de exclusiones
- **Decisión**: **CERRADA**. Quedan prohibidos, sin excepción ni override en este contrato, los siguientes elementos:
  - GPS.
  - Coordenadas (latitud, longitud, altitud, precisión).
  - Geolocalización real / IP-to-location.
  - Ubicación física de personas.
  - IP (IPv4 / IPv6).
  - Huella de dispositivo / user-agent / fingerprint.
  - Datos personales (nombre, email, teléfono, IDs reales).
  - Datos sensibles (salud, religión, finanzas, biometría).
  - Tracking silencioso o encubierto.
  - Producción.
  - Secrets, tokens, credenciales, claves.
- **Estado**: **CERRADA**.
- **Alcance permitido**: ratificar estas exclusiones en cada orden futura.
- **Alcance prohibido**: cualquier tentativa de introducir algo de la lista anterior, aun en "modo demo" o "prueba breve".
- **Evidencia requerida antes de técnica**: re-ratificación por escrito en la orden que abra MC-LOC-2 técnico.
- **Bloquea MC-LOC-2 técnico**: NO (cerrada), pero su violación detendría cualquier microciclo automáticamente.

## 3. Síntesis

| # | Decisión | Estado | Bloquea MC-LOC-2 técnico |
|---|----------|--------|--------------------------|
| 1 | Almacenamiento definitivo | DERIVADA A MICROCICLO FUTURO | SÍ |
| 2 | Granularidad del evento | CERRADA CON LÍMITES | NO |
| 3 | Quién emite el evento | DERIVADA A MICROCICLO FUTURO | SÍ |
| 4 | Quién consume el evento | CERRADA CON LÍMITES | NO |
| 5 | Lista cerrada de archivos técnicos | **BLOQUEADA** | **SÍ (bloqueante principal)** |
| 6 | Política final de retención | CERRADA CON LÍMITES | NO |
| 7 | Modo demo / test aprobado | CERRADA CON LÍMITES | NO |
| 8 | Rollback aprobado | CERRADA CON LÍMITES | NO |
| 9 | Confirmación de exclusiones | CERRADA | NO |

Bloqueantes pendientes: **§2.1 (almacenamiento), §2.3 (emisor), §2.5 (lista cerrada de archivos técnicos)**.

## 4. Dictamen final de MC-LOC-2C

**A) MC-LOC-2 técnico sigue NO habilitado; falta microciclo para lista cerrada de archivos técnicos.**

Además de §2.5 (bloqueante principal), también deben resolverse §2.1 y §2.3 antes de cualquier implementación. Las decisiones cerradas con límites (§2.2, §2.4, §2.6, §2.7, §2.8) y la cerrada absoluta (§2.9) quedan como marco vinculante para futuros microciclos.

## 5. Próximo microciclo recomendado

**MC-LOC-2D — definición documental de lista cerrada de archivos técnicos autorizados.**

- Tipo: documental, sin código.
- Alcance: enumerar paths exactos (sin globs amplios) que un eventual MC-LOC-2 técnico podría crear o modificar, con justificación por path.
- Prohibiciones: `.torre/scripts/` y `.torre/tracking/` siguen sin autorización; cualquier path bajo `backend/`, `frontend/`, workflows o secrets queda fuera por defecto.
- Salida esperada: archivo `.torre/contratos/location-tracking/archivos_tecnicos_autorizados.md`, o equivalente, ratificado por Torre y Ariel.
- Hasta que MC-LOC-2D no esté cerrado en main, **MC-LOC-2 técnico no se abre**.

Recién después de MC-LOC-2D podría abrirse MC-LOC-2E (almacenamiento) y MC-LOC-2F (emisor), siempre en microciclos separados, antes de evaluar implementación real.
