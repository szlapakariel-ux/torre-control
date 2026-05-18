# Criterios de habilitación técnica — MC-LOC-2

Este documento define qué evidencia debe existir **antes** de que Torre pueda autorizar un microciclo técnico (MC-LOC-2) que implemente location tracking según el alcance del contrato.

## Principio

MC-LOC-1 **no habilita implementación técnica automáticamente**. Crear este contrato no es permiso para escribir código. Es la condición previa, no la autorización.

## Checklist obligatoria

Para autorizar MC-LOC-2, deben cumplirse **todos** los puntos:

- [ ] **Contrato documental aprobado.** README, alcance, privacidad y este documento revisados y aprobados por Torre.
- [ ] **Alcance cerrado.** No queda interpretación abierta sobre qué se registra y qué no.
- [ ] **Datos permitidos definidos.** Lista explícita de campos que sí pueden registrarse (ej. `repo`, `branch`, `microciclo`, `archivo`, `estado`, `agente`).
- [ ] **Datos prohibidos definidos.** Lista explícita de campos que no pueden aparecer en ningún evento (GPS, IP, datos personales, etc.).
- [ ] **Archivos técnicos autorizados.** Lista cerrada y mínima de archivos que MC-LOC-2 puede crear o modificar. Todo lo que no esté en la lista queda fuera.
- [ ] **Formato de evento definido.** Esquema documentado del registro de tracking (campos, tipos, ejemplo).
- [ ] **Retención definida.** Cuánto tiempo vive el registro, dónde, y cuándo se borra o archiva.
- [ ] **Modo demo / test definido.** Cómo se prueba sin tocar datos reales ni producción.
- [ ] **Sin producción.** MC-LOC-2 declara explícitamente que producción queda fuera.
- [ ] **Sin ubicación real.** Confirmado por escrito que el microciclo no recolecta ubicación física, GPS, IP ni geocoding.
- [ ] **Sin secrets.** No se introducen credenciales, tokens ni variables sensibles.
- [ ] **Sin workflows.** No se modifican workflows de CI/CD ni se agregan automatizaciones externas.
- [ ] **Rollback documental previsto.** Procedimiento explícito para revertir MC-LOC-2 dejando documentación coherente.

## Faltante

Si **cualquier** punto no se cumple, MC-LOC-2 queda **bloqueado**. No se abre microciclo técnico parcial: o se cumple toda la checklist, o se amplía primero el contrato documental.

## Dictamen final de MC-LOC-1

**MC-LOC-1 no habilita implementación técnica automáticamente.**
MC-LOC-1 cierra el frente documental mínimo. La habilitación de MC-LOC-2 requiere una orden separada de Torre, con esta checklist verificada punto por punto.
