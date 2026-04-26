# Piloto agente-saas — Modelado desde Torre

`agente-saas` es el **primer piloto** de mesa local. Este directorio modela cómo debería operar la mesa de ese repo, **sin crear todavía** `.mesa/` real dentro del repo `agente-saas`.

> Repositorio técnico modelado: `szlapakariel-ux/agente-saas`.
> Proyecto funcional asociado: Secretaria.

---

## 1. Por qué un piloto modelado desde Torre

Antes de imponer una estructura nueva (`.mesa/`) dentro de un repo técnico activo, Torre primero **modela** cómo debería verse y cómo se usaría. Esto permite:

- Validar la plantilla `.torre/templates/mesa-local/` contra un caso real (recordatorios fuera de horario, Portero V1 notas/tareas).
- Detectar contradicciones antes de tocar el repo destino.
- Que Ariel/Torre revise el modelo antes de habilitarlo.
- Evitar agregar carpetas a `agente-saas` que después haya que rehacer.

## 2. Estado actual del piloto

- **Mesa real en `agente-saas`**: NO existe todavía.
- **Modelo en Torre**: este directorio, en construcción.
- **Tareas activas modeladas**: 001 (recordatorios fuera de horario) y 002 (Portero V1 notas/tareas).
- **Próximo paso**: Ariel/Torre revisa este modelo. Si lo aprueba, se abre PR aparte en `agente-saas` para crear `.mesa/` real.

## 3. Lo que este piloto NO hace

- **No** crea `.mesa/` dentro de `agente-saas`.
- **No** modifica código de `agente-saas`.
- **No** modifica workflows, secrets, configuración, base de datos ni deploy.
- **No** sustituye a `.torre/mesa-compartida/` (que ya tiene tareas reales en curso, conservadas por trazabilidad). El piloto **espeja** esas tareas, no las reemplaza.

## 4. Contenido de este directorio

| Archivo | Para qué |
|---|---|
| [`README.md`](./README.md) | Este archivo. |
| [`estado.md`](./estado.md) | Tablero piloto con 001 y 002. |
| [`tareas.md`](./tareas.md) | Detalle de 001 y 002 con problema, objetivo, contexto, archivos sugeridos, restricciones, entregable, criterio de cierre. |
| [`riesgos.md`](./riesgos.md) | Riesgos detectados al modelar el piloto. |
| [`decisiones.md`](./decisiones.md) | Decisiones específicas del piloto. |
| [`espejo-mesa-local.md`](./espejo-mesa-local.md) | Cómo se vería `.mesa/` real en `agente-saas` el día que se cree. Es espejo, no creación. |
| [`criterios-para-replicar.md`](./criterios-para-replicar.md) | Cuándo el modelo se puede copiar a otros repos. |

## 5. Referencias

- Plantilla replicable: `.torre/templates/mesa-local/`.
- Modelo conceptual: `.torre/arquitectura/modelo-mesas-locales.md`.
- Decisiones operativas cerradas: `.torre/arquitectura/decisiones-operativas.md`.
- Estado real de las tareas en el modelo experimental anterior: `.torre/mesa-compartida/`.
