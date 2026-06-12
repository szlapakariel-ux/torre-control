# PLIC — Cierre Punto 1: Relevamiento forense inicial (Etapa 1)

> **Versión:** 1.0
> **Fecha:** 2026-06-12
> **Microciclo de registro:** ORD-20260612-01 (MC-PLIC-1)
> **Estado:** vigente
> **Capa:** 2 (operativa)
> **Autoridad:** Torre
> **Fuente:** transcripción del documento "Cierre Punto 1 PLIC / Torre" aportado por Ariel.

## Estado

Punto 1 concluido. Se da por cerrado el relevamiento inicial de datos para aplicar PLIC a Torre de Control y Secretaria/o Virtual. Este cierre **no** significa que la Torre esté operativa: significa que hay evidencia suficiente para pasar del relevamiento al ordenamiento/priorización.

## Fuentes relevadas

1. Chat 1 — Torre de Control (construcción inicial de la idea; sistema postal `.torre/`; trigger/timbre; detección de que Watcher, Action Runner e Invoker no estaban operativos).
2. Chat 2 — Torre de Control (evolución del sistema; Invoker, Guardián de Flujo y mesa compartida; confirmación de que seguía faltando canal automático real; repetición del rol de Ariel como cartero).
3. Chat Claude Code — Torre + Secretaria (revisión técnica; bloqueos por MCP scope; `claude.sh` y `codex.sh` como STUB; errores reales abiertos en Secretaria/o Virtual).

## Conclusión principal

La Torre de Control fue construida con **buena arquitectura documental**, pero **no llegó a funcionar como sistema operativo automático**.

La estructura existía (`.torre/`, `estado.md`, `inbox/`, `outbox/`, `historial/`, `protocolo.md`, órdenes, reportes, trigger/timbre), pero el mecanismo real de coordinación no quedó cerrado:

- Watcher no operativo.
- Action Runner no operativo.
- Invoker IA no conectado realmente.
- Claude y Codex dependían de sesiones y permisos manuales.
- El trigger detectaba, pero no ejecutaba un ciclo completo.
- Ariel siguió copiando, pegando, mergeando, verificando y trasladando contexto.

## Diagnóstico PLIC inicial

PLIC detecta un **patrón dominante**:

> **Ariel como router humano es el principal cuello de botella del sistema.**

El problema no fue un error técnico aislado, sino una cadena recurrente:

```
Arquitectura definida
   ↓
Mecanismo automático incompleto
   ↓
Ariel interviene manualmente
   ↓
Se declara avance o cierre parcial
   ↓
El mismo bloqueo reaparece
```

## Patrones PLIC detectados

| Prioridad | Patrón | Estado |
|---|---|---|
| P0 | Ariel como cartero / router humano | abierto |
| P0 | MCP scope de un solo repo por sesión | abierto |
| P0 | `.torre` con estructura pero sin ejecución automática real | parcial |
| P1 | `claude.sh` y `codex.sh` como STUB | abierto/parcial |
| P1 | Trigger detecta pero no ejecuta ciclo completo | parcial |
| P1 | Confusión entre `torre-control` y `agente-saas` | abierto |
| P1 | Cierres documentales confundidos con cierres técnicos | abierto |
| P2 | PR #18 vs `.mesa/` como protocolos contradictorios | pendiente |
| P2 | Bugs de Secretaria/o Virtual arrastrando ciclos de Torre | abierto |
| P2 | Portero V1 bloqueado por UUID de Ariel | pausado |

## Familias de datos que PLIC debe observar

- **Bloqueos**: MCP scope incorrecto, falta de acceso a repo, tarea bloqueada por otra, feature bloqueada por dato externo.
- **Retrabajo**: copia y pega entre agentes, reapertura de sesiones, reportes trasladados manualmente, merges manuales.
- **Arquitectura incompleta**: stubs sin ejecución real, Watcher/Action Runner no operativos, Invoker no conectado.
- **Cierres falsos o parciales**: ciclos cerrados solo documentalmente, PRs sin verificación real, estados "cerrados" con bloqueo estructural pendiente.
- **Errores de Secretaria/o Virtual**: registros duplicados, falsos positivos, fechas relativas no resueltas, estado multi-turno no persistente, Portero V1 bloqueado por UUID.

## Lo que NO se da por cerrado

La Torre como sistema automático, la conexión real de Claude/Codex al flujo, el Watcher operativo, el Action Runner operativo, el Invoker IA real, el Guardián de Flujo, la reparación de Secretaria/o Virtual, el cierre de PR #18, la recuperación del UUID de Ariel. Eso pertenece a etapas siguientes.

## Frase de cierre

> La Torre no falló por falta de arquitectura. Falló porque la arquitectura no llegó a convertirse en un ciclo operativo sin Ariel como puente. PLIC ya tiene suficiente evidencia para ordenar el próximo paso.
