# Orden Torre — ORD-2026-04-25-06

- **ID**: ORD-2026-04-25-06
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_OBJETIVO**: claude/trigger-torre-mvp-rSWiS
- **EJECUTOR**: claude

## Objetivo

Registrar en el sistema `.torre` una regla obligatoria de identidad de proyecto, para evitar que los operadores ejecuten una orden en el repo equivocado.

## Contexto

El nombre funcional ("Torre de Control", "Secretaria IA", etc.) no siempre coincide con el slug técnico del repo (`torre-control`, `agente-saas`, etc.). Una orden que solo dice el nombre funcional puede terminar ejecutándose en el repo incorrecto.

## Tareas concretas

Toda orden debe incluir obligatoriamente cuatro campos:

- `PROYECTO_FUNCIONAL` — nombre humano del proyecto.
- `REPO_TECNICO` — slug exacto `<owner>/<repo>` en GitHub.
- `RAMA_OBJETIVO` — branch sobre el que se trabaja.
- `EJECUTOR` — identificador del operador asignado.

**Regla dura**: si el repo actual del operador no coincide con `REPO_TECNICO`, el operador **no ejecuta** la orden.

Aplicar a:

1. `.torre/protocolo.md` — nueva sección "Identidad de proyecto" + checks obligatorios pre-ejecución.
2. `.torre/templates/orden_template.md` — añadir los tres campos nuevos al frente.
3. `.torre/flujo.md` — incorporar el chequeo de identidad como paso explícito.
4. `.torre/roles.md` — obligación del operador de verificar el repo antes de actuar.
5. `.torre/estado.md` — incluir `PROYECTO_FUNCIONAL` y `REPO_TECNICO` para que el estado declare en qué instancia de Torre vive.

## Restricciones

- No tocar `backend/` ni `frontend/`.
- No agregar dependencias.
- No ejecutar ninguna orden externa.
- Solo documentación/templates del sistema `.torre`.

## Criterio de aceptación

- [ ] `protocolo.md` con sección "Identidad de proyecto" y regla de no-ejecución por mismatch.
- [ ] `orden_template.md` con los 4 campos al frente (PROYECTO_FUNCIONAL, REPO_TECNICO, RAMA_OBJETIVO, EJECUTOR).
- [ ] `flujo.md` con chequeo de identidad como paso explícito de la ejecución.
- [ ] `roles.md` con obligación del operador de verificar repo.
- [ ] `estado.md` con `PROYECTO_FUNCIONAL` y `REPO_TECNICO`.
- [ ] Reporte escrito.
- [ ] Par archivado en `.torre/historial/2026-04-25_identidad-proyecto/`.
- [ ] Inbox y outbox en placeholder.
- [ ] `EN_PROCESO_POR: ninguno` al cerrar.
- [ ] Todo en el mismo PR.

## Formato de reporte esperado

```
[ESTADO]
[ARCHIVOS MODIFICADOS]
[CAMBIO REALIZADO]
[DIFF RESUMIDO]
[RIESGO]
[SIGUIENTE PASO]
[EN_PROCESO_POR]
```
