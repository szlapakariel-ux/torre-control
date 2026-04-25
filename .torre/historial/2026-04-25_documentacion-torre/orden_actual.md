# Orden Torre — ORD-2026-04-25-02

- **ID**: ORD-2026-04-25-02
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **Operador asignado**: Claude Code

## Objetivo

Documentar el sistema postal `.torre/` de forma clara, técnica y mantenible.

## Contexto

El sistema postal ya está implementado y funcionando. Existe `protocolo.md` y se ejecutó un ciclo completo (ORD-20260425-01). Falta documentación dedicada para que cualquier persona u operador IA entienda qué es la Torre, quién hace qué, cómo fluye un ciclo y por qué se diseñó así.

## Tareas concretas

Crear dentro de `.torre/`:

1. `sistema.md` — qué es la Torre, problema que resuelve, arquitectura, componentes (inbox, outbox, estado, historial).
2. `roles.md` — Torre (decide), Operador IA (ejecuta), Repo (fuente de verdad), Ariel (interviene en alto impacto).
3. `flujo.md` — flujo completo paso a paso (creación de orden, ejecución, reporte, cierre, archivado) + ejemplo real de ORD-20260425-01.
4. `decisiones.md` — por qué GitHub como centro postal, por qué una orden por ciclo, por qué cierre en el mismo PR, qué problemas evita el diseño.

## Restricciones

- No modificar archivos existentes (`protocolo.md`, templates, etc.).
- No agregar dependencias.
- No tocar backend/frontend.
- No inventar funcionalidades.
- Basarse solo en lo que YA existe.

## Criterio de aceptación

- [ ] `.torre/sistema.md` creado.
- [ ] `.torre/roles.md` creado.
- [ ] `.torre/flujo.md` creado con ejemplo real ORD-20260425-01.
- [ ] `.torre/decisiones.md` creado.
- [ ] Markdown claro, lenguaje técnico simple.
- [ ] Reporte escrito en `.torre/outbox/reporte_actual.md`.
- [ ] `.torre/estado.md` actualizado.
- [ ] Par orden+reporte archivado en `.torre/historial/2026-04-25_documentacion-torre/`.
- [ ] Inbox y outbox en placeholder al cerrar.
- [ ] Todo en el mismo PR.

## Formato de reporte esperado

```
[ESTADO]
[ARCHIVOS CREADOS]
[RESUMEN DE CONTENIDO]
[DIFF RESUMIDO]
[RIESGO]
[SIGUIENTE PASO]
```
