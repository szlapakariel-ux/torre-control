# Orden Torre — ORD-2026-04-25-15

- **ID**: ORD-2026-04-25-15
- **Fecha**: 2026-04-25
- **Emisor**: Torre
- **PROYECTO_FUNCIONAL**: Torre de Control
- **REPO_TECNICO**: szlapakariel-ux/torre-control
- **RAMA_TRABAJO**: torre/invoker-v1.2-skip-strict
- **RAMA_DESTINO**: main
- **EJECUTOR**: claude
- **TIPO_ORDEN**: local
- **REPO_ORIGEN**: szlapakariel-ux/torre-control
- **REQUIERE_IA**: no

## Objetivo

Corregir el gate `[skip torre]` para evitar falsos positivos cuando la frase aparece mencionada dentro de un commit message descriptivo.

## Contexto

PR #6 mergeado correctamente. Verificación post-merge detectó: el merge commit mencionaba literalmente `[skip torre]` describiendo el feature, y el matcher laxo (`grep -qF "[skip torre]"`) lo tomó como instrucción real de skip. No rompió nada porque el placeholder ya estaba en su lugar, pero antes de conectar Claude real hay que endurecer.

## Tareas concretas

1. Reemplazar el matcher en `.github/workflows/torre-trigger.yml` por **Opción A** (preferencia Torre): regex de línea completa.
   - Patrón: `^[[:space:]]*\[skip torre\][[:space:]]*$`
   - Implementación: `grep -qE` sobre el commit message.
2. Actualizar `.torre/invoker.md` con la regla y ejemplos válido/inválido.
3. Probar localmente con tres mensajes:
   - `[skip torre]` solo en línea propia → omite.
   - `Agrega soporte [skip torre] al workflow` → NO omite.
   - sin token → NO omite.

## Restricciones

- No tocar `invoke_operator.sh` ni stubs.
- No tocar protocolo general.
- No conectar Claude real, no usar secrets, no instalar CLIs.
- No auto-merge.

## Criterio de aceptación

- [ ] Branch nueva `torre/invoker-v1.2-skip-strict` creada desde `main`.
- [ ] Solo modifico el gate y `invoker.md`.
- [ ] `[skip torre]` solo en línea omite; dentro de frase no omite.
- [ ] YAML válido.
- [ ] Ciclo archivado en `.torre/historial/2026-04-25_invoker-v1.2-skip-strict/`.
- [ ] Inbox/outbox en placeholder.
- [ ] PR abierto contra `main`.
- [ ] No mergear sin autorización humana.

## Formato de reporte esperado

Reporta rama, archivos, pruebas, link del PR, mergeable, riesgos.
