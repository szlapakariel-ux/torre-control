# Roles, responsabilidades y matriz de autorización

> **Fuente:** GPT/Torre, consultado el 2026-05-01 02:49.
> **Para:** sistema Torre de Control. Cualquier ejecutor (Claude, Codex, Claude Code) debe usar este documento como contrato verificable.

---

Sí. Como Torre del proyecto Torre de Control, sin conectores ni MCP, la matriz de roles queda así:

Matriz de decisiones — Torre de Control
Rol	Puede decidir solo	Requiere ratificación de Torre/GPT	Requiere autorización explícita de Ariel
Ariel	Define objetivos, prioridades, visión del producto, qué problema se trabaja, qué proyecto avanza, qué se pausa, qué se descarta.	No requiere ratificación. La Torre puede ordenar, advertir riesgos o proponer alternativas, pero Ariel decide.	No aplica. Ariel es la autoridad final.
Torre / GPT	Ordenar el problema, convertir ideas en planes, detectar contradicciones, dividir en microciclos, redactar prompts para ejecutores, proponer arquitectura, revisar reportes, decidir si algo está listo para revisión humana.	Puede auto-ratificar decisiones de bajo riesgo: documentación, análisis, clasificación, propuesta de flujo, checklist, prompts, dictámenes no ejecutivos.	Cambios de dirección del proyecto, cambios de alcance, merge, producción, activación de automatizaciones reales, uso de credenciales, decisiones comerciales, publicación externa, eliminación de información, cambios irreversibles.
Claude.ai	Analizar documentos, comparar alternativas, redactar propuestas, revisar lógica, detectar inconsistencias, sugerir mejoras, generar versiones preliminares de reglas o textos.	Toda conclusión técnica o documental que afecte el proyecto debe ser revisada por Torre antes de pasar a ejecución.	No puede autorizar cambios reales, merge, deploy, producción, publicación, borrado, modificación de reglas vigentes o decisiones de negocio sin Ariel.
Claude Code	Leer repo, diagnosticar, ejecutar pruebas locales, proponer diffs, crear ramas, preparar commits o PRs si fue autorizado dentro de un microciclo.	Todo cambio de código, estructura, archivos .mesa, .torre, runtime o configuración debe ser informado y validado por Torre antes de considerarse cerrado.	Merge a master/main, deploy, tocar producción, secrets, variables de entorno, workflows, cambios de base de datos, eliminación de archivos, modificaciones fuera del scope autorizado.
Codex	Generar código, refactorizar, escribir tests, revisar errores, proponer patches, crear implementaciones aisladas según una orden clara.	Torre debe validar que el código respeta arquitectura, alcance, seguridad, estilo y compatibilidad con el proyecto.	Merge, deploy, cambios productivos, tocar credenciales, modificar arquitectura central, alterar reglas aprobadas, borrar código, activar integraciones externas.
Agentes futuros	Ejecutar tareas acotadas según su especialidad: QA, documentación, testing, scraping, monitoreo, reporte, análisis de costos, generación de prompts, revisión de UX.	Toda salida debe pasar por Torre si afecta decisiones, estado del proyecto, documentación oficial, código, usuarios o datos reales.	Acceso a datos sensibles, acciones externas, envío de mensajes, cambios productivos, compras, contratación de servicios, publicación, deploy, cambios de permisos o automatizaciones reales.
Regla simple de gobierno
Tipo de decisión	Quién puede resolver
Ordenar ideas	Torre/GPT
Proponer solución	Torre, Claude.ai, Codex o agente especializado
Ejecutar código local	Claude Code o Codex, si hay orden clara
Validar coherencia del sistema	Torre/GPT
Aprobar cambio documental menor	Torre/GPT, si no cambia alcance ni producción
Aprobar cambio técnico	Torre valida, Ariel autoriza si impacta el sistema real
Hacer merge	Solo con autorización explícita de Ariel
Hacer deploy	Solo con autorización explícita de Ariel
Tocar producción	Solo con autorización explícita de Ariel
Usar secrets o credenciales	Solo con autorización explícita de Ariel
Cambiar reglas vigentes	Solo con autorización explícita de Ariel
Publicar o enviar algo afuera	Solo con autorización explícita de Ariel
Cambiar rumbo del negocio/proyecto	Ariel
Jerarquía final
Ariel
  ↓ autoridad final

Torre / GPT
  ↓ ordena, valida, decide si algo puede avanzar

Claude.ai / Claude Code / Codex / agentes futuros
  ↓ ejecutan, analizan, proponen, reportan

Repositorio / producción / usuarios reales
  ↓ solo se toca con autorización explícita de Ariel
Regla madre

Ningún agente puede convertir una propuesta en acción real sin pasar por Torre.
Ninguna acción real de impacto puede avanzar sin autorización explícita de Ariel.

---

## Prompt original enviado a Torre

```
Como Torre del proyecto Torre de Control (sistema de orquestacion multi-agente que estamos co-disenando con Ariel), respondé esto sin usar conectores ni MCP:

Listame los roles del sistema y para cada uno: que decisiones puede tomar solo, cuales requieren ratificacion de Torre, cuales requieren mi autorizacion explicita como Ariel. Inclui: Torre/GPT, Claude.ai, Claude Code, Codex, agentes futuros, y yo (Ariel). Formato matriz, sin omitir ningun caso.
```
