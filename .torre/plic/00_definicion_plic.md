# PLIC — Definición operativa (Etapa 0)

> **Versión:** 1.0
> **Fecha:** 2026-06-12
> **Microciclo de registro:** ORD-20260612-01 (MC-PLIC-1)
> **Estado:** vigente
> **Capa:** 2 (operativa) según `jerarquia_documental.md`
> **Autoridad:** Torre

## Qué es PLIC

**PLIC** = *Power-Law-based Inference and Coordination*.

En este proyecto se entiende como una **capa de inferencia y coordinación** que observa los eventos del sistema, detecta **concentración de impacto** y ayuda a **priorizar qué resolver primero**.

La premisa es la ley de potencias: en la práctica, **unos pocos eventos explican la mayor parte del bloqueo y del retrabajo**. PLIC existe para encontrar esos pocos y atacarlos primero.

## Qué NO es PLIC

- No es una IA autónoma.
- No es una garantía matemática absoluta.
- No reemplaza el criterio de Ariel ni de la Torre.
- No es una automatización completa desde el primer día.
- No es una excusa para crear más arquitectura sin ejecutar.

## Decisión tomada

Usar PLIC como **capa de priorización y coordinación**, no como sistema autónomo. PLIC ordena señales; las decisiones siguen siendo humanas (o de la Torre con criterio explícito).

## Mantra operativo

**Estabilizar → Cerrar → Medir → Subir un nivel.**

1. **Estabilizar** — lograr que una parte del sistema funcione sin romper lo anterior.
2. **Cerrar** — dejar evidencia formal (reporte, commit, PR, decisión documentada, verificación, estado actualizado).
3. **Medir** — evaluar si el ciclo redujo retrabajo, confusión, dependencia de Ariel, errores repetidos, cierres falsos o dispersión.
4. **Subir un nivel** — recién después de estabilizar, cerrar y medir, se permite sumar automatización, agentes, o tocar código más sensible.

## Regla rectora

> **No se ataca lo más ruidoso. Se ataca lo que más desbloquea.**

## Regla anti-caos

- No subir de nivel si no está cerrado.
- No automatizar si no fue probado.
- No sumar agentes si todavía falta protocolo.
- No tocar código si todavía falta diagnóstico.
- No mezclar dos problemas en un mismo ciclo.
- No confundir cierre documental con cierre técnico.
- No festejar estabilidad como final: usarla como base.

> Principio: **la Torre no avanza por entusiasmo. Avanza por cierre verificable.**

## Implementación viva

Esta capa PLIC dejó de ser solo documental en MC-PLIC-1: el backend del app registra cada mensaje como un **evento PLIC**, calcula su score y lo ubica en un **ranking** de prioridades (P0-P3). Ver `02_protocolo_torre_universal_v0_2.md` (fórmula y escalas) y `ranking_inicial.md` (ranking semilla). El código que la implementa: `backend/services/plicScore.js`, `plicStore.js`, `torreBrain.js`.
