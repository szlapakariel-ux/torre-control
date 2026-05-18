# Esquema de evento operativo v1 — Location Tracking

## Naturaleza

Este documento define **conceptualmente** el evento operativo de location tracking en Torre. No es código, no está implementado y no autoriza implementación. Es la pieza documental que MC-LOC-2A identificó como bloqueante.

**Recordatorio**: "location" aquí significa ubicación de trabajo (repo, branch, microciclo, archivo, estado, agente). **No es ubicación física**, no es **geolocalización**, no es **GPS**, no es **IP**, no es **monitoreo de personas**. Cualquier intento de usar este esquema para esos fines viola `alcance.md` y `privacidad.md`.

## Campos permitidos (v1)

| Campo | Tipo | Obligatorio | Ejemplo | Validación | Prohibido en el campo |
|-------|------|-------------|---------|------------|-----------------------|
| `schema_version` | integer | SÍ | `1` | entero positivo, igual al de esta versión del contrato | cualquier valor distinto de `1` mientras esta sea la v1 |
| `project` | string | SÍ | `"torre-control"` | slug ASCII, `[a-z0-9-]`, 1–64 caracteres | nombres de personas, emails, organizaciones reales |
| `repo` | string | SÍ | `"szlapakariel-ux/torre-control"` | formato `owner/repo`, ambos slugs ASCII | URLs completas, paths locales, credenciales |
| `branch` | string | SÍ | `"claude/mc-loc-2-...""` | nombre git válido, 1–200 caracteres | tokens, secrets, datos sensibles incrustados |
| `microcycle` | string | SÍ | `"MC-LOC-2B"` | patrón `MC-[A-Z0-9-]+` | descripciones libres, frases con PII |
| `agent` | string | SÍ | `"claude-code"` | enum abierto controlado: `claude-code`, `codex`, `portero`, `humano:<alias>` | nombres reales, emails, IDs de cuenta externos |
| `state` | string | SÍ | `"diagnostico"` | uno de los valores del enum cerrado (ver abajo) | cualquier valor fuera del enum |
| `area` | string | SÍ | `".torre/contratos/location-tracking/"` | path relativo dentro del repo, sin `..`, sin URLs | rutas absolutas del FS host, URLs externas, paths fuera del repo |
| `timestamp` | string | SÍ | `"2026-05-18T16:00:00Z"` | ISO-8601 UTC con sufijo `Z`, segundos enteros o con ms | timestamps con zona horaria local, epoch sin TZ, fechas humanas en prosa |
| `next_action` | string | NO | `"abrir checklist técnica"` | texto plano corto, ≤ 200 caracteres, sin saltos de línea | nombres de personas, emails, números de teléfono, tokens, ubicaciones físicas, IPs |

### Regla transversal de validación

Todo campo, además de su validación específica, debe cumplir:

- No puede contener GPS, coordenadas, latitud/longitud.
- No puede contener IP (IPv4 ni IPv6).
- No puede contener email, teléfono, ni nombres reales de personas físicas.
- No puede contener tokens, secrets, credenciales, claves.
- No puede contener datos de producción.

Si cualquier validación falla, el evento es **inválido** y no se persiste (regla fail-closed, ver `modo_demo_test.md`).

## Enum cerrado `state`

Valores permitidos (exhaustivos, sin extensión sin nueva versión del esquema):

- `diagnostico` — el microciclo está en lectura/análisis read-only.
- `documental` — el microciclo crea o modifica documentación, sin código.
- `tecnico` — el microciclo modifica código, scripts, configuración o automatización.
- `bloqueado` — el microciclo está detenido por incumplimiento de criterio o por decisión de Torre.
- `listo_para_pr` — el microciclo terminó su trabajo local y espera apertura de PR.
- `mergeado` — el microciclo cerró en `main` vía merge.

Cualquier otro valor invalida el evento.

## Ejemplo conceptual

> **No es código.** No está implementado. Sirve solo como ilustración del shape esperado.

```json
{
  "schema_version": 1,
  "project": "torre-control",
  "repo": "szlapakariel-ux/torre-control",
  "branch": "main",
  "microcycle": "MC-LOC-2B",
  "agent": "claude-code",
  "state": "documental",
  "area": ".torre/contratos/location-tracking/",
  "timestamp": "2026-05-18T16:00:00Z",
  "next_action": "esperar revisión de Torre"
}
```

## Alcance de este documento

- Define el shape canónico v1 del evento.
- **No** define dónde se almacena (ver `retencion_y_rollback.md` + `decision_pendiente_mc_loc_2.md`).
- **No** define quién emite ni con qué frecuencia.
- **No** habilita implementación.

Cualquier MC-LOC-2 técnico que se proponga deberá implementar exactamente este esquema, o bien proponer un esquema v2 documentado y aprobado por Torre antes de tocar código.
