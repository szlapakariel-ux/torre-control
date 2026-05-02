# Documentos históricos — consulta subordinada

> **Versión:** 1.0
> **Fecha:** 2026-05-02
> **Microciclo de registro:** ORD-2026-05-02-01 (MC-1)
> **Estado:** vigente
> **Autoridad:** Torre

Este archivo lista los documentos que pasan a **consulta histórica subordinada** (Capa 3 según [`jerarquia_documental.md`](./jerarquia_documental.md)).

---

## Importante

- **Los documentos listados acá NO se eliminan.** Permanecen en su ubicación actual para consulta.
- **No son normativos.** Su contenido no rige el sistema actual.
- **No se modifican.** Se conservan tal como quedaron al momento de su declaración como históricos.
- **Su archivado físico** (mover a `.torre/historial/protocolos_v0/` u otra ubicación) **NO se ejecuta en este microciclo**. Si Torre lo decide, será un microciclo separado.
- Ante cualquier conflicto entre estos documentos y un documento de Capa 1 o Capa 2, **prevalecen las capas superiores**.

---

## Lista de documentos históricos

### Protocolos generados antes del protocolo principal

Documentos producidos en sesiones previas (entre 2026-04-25 y 2026-05-01) que sirvieron como insumo para construir el protocolo principal vigente. Quedan como referencia.

- [`criterios_apertura_microciclo.md`](./criterios_apertura_microciclo.md)
- [`criterios_escalamiento_nivel.md`](./criterios_escalamiento_nivel.md)
- [`criterios_merge.md`](./criterios_merge.md)
- [`criterios_produccion_y_reglas_activas.md`](./criterios_produccion_y_reglas_activas.md)
- [`glosario_operativo.md`](./glosario_operativo.md)
- [`politica_anti_cartero.md`](./politica_anti_cartero.md)
- [`protocolo_manejo_errores.md`](./protocolo_manejo_errores.md)
- [`roles_y_autorizacion.md`](./roles_y_autorizacion.md)

### Briefings y borradores de trabajo

Documentos producidos como insumo para emitir el protocolo principal.

- [`briefing_portero_a_torre.md`](./briefing_portero_a_torre.md) — briefing presentando al Portero Local a Torre. Cumplió su función al motivar la emisión del protocolo principal. Ya incorporado al repo en commit anterior a MC-1.

### Artefactos locales no incorporados al repo

Documentos detectados en filesystem local que **no se incorporan al repo en MC-1**. Quedan declarados acá para trazabilidad. Su incorporación al repo (o su descarte) requiere microciclo posterior.

- `inbox/mapeo_tarea_auditoria.md` — artefacto local detectado, no incorporado al repo en MC-1, pendiente de decisión futura. Era un borrador de mapeo creado fuera de protocolo, sin uso operativo.

---

## Cómo consultar un documento histórico

1. Verificar primero si la pregunta se responde con un documento de Capa 1 ([`protocolo_principal.md`](./protocolo_principal.md)) o de Capa 2 (cañería postal: `sistema.md`, `protocolo.md`, `roles.md`, `flujo.md`, `decisiones.md`, `README.md`, `estado.md`).
2. Si no, consultar el documento histórico relevante.
3. **Si la información del documento histórico contradice un documento vigente**, prevalece el vigente. Declarar conflicto y escalar a Torre si la contradicción afecta una acción concreta a tomar.

---

## Modificación de esta lista

Esta lista es vigente hasta que Torre emita un microciclo que la modifique. Agregar documentos a la lista, sacarlos, o decidir el archivado físico requiere microciclo documental aparte.
