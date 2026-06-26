# PLIC — Ranking inicial (Etapa 2)

> **Versión:** 1.0
> **Fecha:** 2026-06-12
> **Microciclo de registro:** ORD-20260612-01 (MC-PLIC-1)
> **Estado:** vigente
> **Capa:** 2 (operativa)
> **Autoridad:** Torre

Ranking semilla derivado de los patrones del Cierre Punto 1 (`01_cierre_punto_1.md`), calculado con la fórmula de `02_protocolo_torre_universal_v0_2.md` §6.3.

> Regla rectora: **no se ataca lo más ruidoso. Se ataca lo que más desbloquea.**

## Tabla de prioridades

| # | Patrón (description) | event_type | imp | urg | blk | rep | rsk | score | prioridad |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Ariel es el único router humano del sistema | bloqueo | 5 | 5 | 6 | 5 | 4 | 48.5 | **P0** |
| 2 | MCP scope de un solo repo por sesión | bloqueo | 4 | 4 | 5 | 4 | 3 | 41.5 | **P0** |
| 3 | `.torre` con estructura pero sin ejecución automática real | estado | 4 | 3 | 4 | 4 | 2 | 35.0 | **P1** |
| 4 | `claude.sh` y `codex.sh` como STUB (operadores no automatizados) | bloqueo | 4 | 3 | 3 | 4 | 2 | 32.0 | **P1** |
| 5 | Trigger detecta pero no ejecuta el ciclo completo | estado | 3 | 3 | 4 | 4 | 2 | 32.5 | **P1** |
| 6 | Cierres documentales confundidos con cierres técnicos | retrabajo | 3 | 2 | 2 | 4 | 3 | 26.0 | **P2** |
| 7 | PR #18 vs `.mesa/` como protocolos contradictorios | estado | 2 | 2 | 1 | 3 | 2 | 18.0 | **P2** |
| 8 | Portero V1 bloqueado por UUID de Ariel | bloqueo | 2 | 1 | 1 | 2 | 2 | 15.0 | **P3** |

`imp`=impacto, `urg`=urgencia, `blk`=blocked_items, `rep`=repetición, `rsk`=riesgo.

## Lectura del ranking

- **P0 (atacar primero):** los dos cuellos de botella estructurales — Ariel como router humano y el límite de MCP a un repo por sesión. Todo lo demás depende de destrabar estos dos.
- **P1 (atacar después):** la cañería de automatización que existe pero no ejecuta sola (`.torre` sin ejecución real, stubs de operadores, trigger sin ciclo completo). Es la diferencia entre "sistema documentado" y "sistema operativo".
- **P2 / P3:** deuda documental y conflictos puntuales; importantes pero no bloqueantes.

## Cómo se usa este ranking

Este es el ranking **documental** semilla. El motor PLIC del backend (`/api/plic/ranking`) arranca con la base vacía en producción y se va poblando solo con los mensajes del chat.

Para **sembrar** estos patrones en el motor vivo (opcional, decisión de Torre/Ariel), se pueden crear como eventos vía API:

```bash
curl -X POST "$URL/api/events" \
  -H "Authorization: Bearer $API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description":"Ariel es el único router humano del sistema","event_type":"bloqueo","impact":5,"urgency":5,"blocked_items":6,"repetition":5,"risk":4,"source":"torre"}'
```

Mientras no se siembren, este documento es la referencia de prioridades de la Etapa 2.

## Próximo paso recomendado

No sumar más investigación general. La Etapa 3 (diseño del flujo mínimo anti-cartero) debe atacar el **P0 #1** (Ariel como router humano): definir un ciclo simple donde una orden se ejecute sin que Ariel transporte contexto a mano. MC-PLIC-2 puede empezar por habilitar el cierre/reapertura de eventos desde el chat (medir el desbloqueo en vivo).
