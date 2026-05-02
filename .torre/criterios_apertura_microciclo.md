# Criterios de apertura de microciclo

> **Fuente:** GPT/Torre, consultado el 2026-05-01 02:51.
> **Para:** sistema Torre de Control. Cualquier ejecutor (Claude, Codex, Claude Code) debe usar este documento como contrato verificable.

---

Sí. Como Torre del proyecto Torre de Control, antes de autorizar la apertura de un microciclo, aplico este checklist.

No es checklist de merge. Es el gate previo para decidir si un ciclo puede empezar.

Checklist previo para AUTORIZAR APERTURA de microciclo
1. Existencia mínima obligatoria

 Existe un objetivo concreto del microciclo.

 Existe un problema, necesidad o decisión previa que justifique abrirlo.

 Está claro de qué proyecto estamos hablando.

 Está identificado el repositorio correcto.

 Está identificado el estado actual del proyecto.

 Está claro cuál fue el último ciclo cerrado.

 Está claro si hay PRs abiertos, pendientes o bloqueantes.

 Está claro si el microciclo depende de una decisión de Ariel.

 Existe una fuente de verdad para operar:

.mesa/estado.md

.torre/estado.md

pedido previo

revisión previa

comentario de PR

dictamen de Torre

Si alguno de estos puntos no existe, no se abre microciclo.

2. Tipo de microciclo

Antes de autorizar, debe quedar definido qué tipo de ciclo es:

 Documental.

 Diagnóstico read-only.

 Corrección técnica.

 Smoke test local.

 Smoke test staging.

 Preparación de PR.

 Reconciliación de ramas/PRs.

 Validación funcional.

 Cierre de ciclo.

 Otro tipo, pero nombrado explícitamente.

Regla:
si no puedo nombrar el tipo de microciclo, todavía no está listo para abrirse.

3. Objetivo del microciclo

El objetivo debe estar escrito de forma verificable.

 Tiene una frase principal clara.

 No mezcla varios objetivos grandes.

 No incluye “ya que estamos”.

 No intenta resolver todo el proyecto.

 Tiene un resultado esperado concreto.

 Se puede saber objetivamente si se cumplió o no.

 Está escrito en lenguaje operativo, no aspiracional.

Ejemplo válido:

Crear un documento en .mesa/pedidos/ que ordene el flujo desde mensaje entrante hasta feedback/revisión, sin tocar código ni producción.

Ejemplo inválido:

Ordenar todo el sistema y dejarlo bien armado.

4. Alcance permitido

Antes de abrir, debe quedar definido exactamente qué se puede tocar.

 Archivos permitidos.

 Carpetas permitidas.

 Tipo de cambios permitidos.

 Acciones permitidas.

 Herramientas permitidas.

 Nivel de intervención permitido.

 Si se puede crear archivo nuevo.

 Si se puede modificar archivo existente.

 Si se puede abrir PR.

 Si se puede comentar en un PR.

 Si se puede ejecutar tests.

 Si se puede hacer push.

 Si se puede mergear.

Regla central:

Todo lo que no está explícitamente permitido queda prohibido.

5. Alcance prohibido

Antes de abrir, debe quedar escrito qué NO se puede tocar.

Checklist mínimo:

 Prohibido tocar producción.

 Prohibido tocar secrets.

 Prohibido tocar variables de entorno.

 Prohibido tocar workflows de GitHub Actions, salvo autorización explícita.

 Prohibido tocar deploys.

 Prohibido tocar Render, Railway, Vercel u otro proveedor.

 Prohibido modificar runtime si el ciclo es documental.

 Prohibido modificar lógica de negocio si el ciclo es diagnóstico.

 Prohibido cambiar arquitectura sin aprobación de Torre.

 Prohibido hacer refactors amplios.

 Prohibido “limpiar de paso”.

 Prohibido corregir errores no incluidos en el objetivo.

 Prohibido borrar archivos.

 Prohibido renombrar archivos sin autorización.

 Prohibido cerrar PRs sin orden explícita.

 Prohibido mergear sin checklist de merge.

 Prohibido hacer push directo a master o main.

 Prohibido activar flags funcionales sin autorización.

 Prohibido cambiar permisos, tokens o credenciales.

 Prohibido introducir dependencias nuevas sin autorización.

 Prohibido modificar contratos de API sin autorización.

 Prohibido cambiar comportamiento visible al usuario si el ciclo no lo autoriza.

6. Decisión de autoridad

Antes de abrir, debe estar claro quién puede decidir qué.

 Qué puede decidir solo Claude/ejecutor.

 Qué debe ratificar Torre.

 Qué requiere autorización explícita de Ariel.

 Qué queda fuera del ciclo.

 Qué debe frenarse si aparece durante la ejecución.

Regla de seguridad:

Si durante el microciclo aparece una decisión que cambia alcance, riesgo o producción, el ejecutor debe frenar y pedir nueva autorización.

7. Rama y base de trabajo

Antes de abrir un microciclo con Git, debe estar definido:

 Rama base.

 HEAD esperado de la rama base.

 Nombre tentativo de la rama nueva.

 Si la rama debe crearse limpia desde master/main.

 Si se permite reutilizar rama previa.

 Si hay riesgo de arrastrar commits viejos.

 Si hay PRs abiertos relacionados.

 Si hay que cerrar algún PR antes de abrir otro.

 Si el ciclo debe ser local, remoto o ambos.

Regla:

Si hay duda sobre la base, primero se hace diagnóstico read-only. No se abre ciclo de escritura.

8. Estado del repo

Antes de abrir, debe verificarse o declararse:

 Repo correcto.

 Rama correcta.

 Último commit conocido.

 PRs relacionados.

 Diferencias pendientes.

 Si hay commits locales no enviados.

 Si hay archivos modificados sin commit.

 Si hay conflictos posibles.

 Si el ciclo depende de un PR ya mergeado.

 Si el ciclo depende de un PR todavía abierto.

Regla:

No se autoriza trabajo técnico sobre un repo ambiguo.

9. Evidencia requerida

Antes de abrir, debe quedar claro qué evidencia tendrá que devolver el ejecutor.

Mínimo esperado:

 Qué archivo creó o modificó.

 Qué comandos ejecutó, si corresponde.

 Qué diff produjo.

 Qué tests corrió, si corresponde.

 Qué endpoints probó, si corresponde.

 Qué PR abrió, si corresponde.

 Qué comentario publicó, si corresponde.

 Qué quedó pendiente.

 Qué no tocó.

 Qué riesgos detectó.

Regla:

Sin evidencia esperada, después no hay forma de auditar el ciclo.

10. Condición de cierre

Antes de abrir, debe estar definida la condición exacta para considerar cerrado el microciclo.

 Cierra con archivo creado.

 Cierra con PR abierto.

 Cierra con PR mergeado.

 Cierra con diagnóstico emitido.

 Cierra con smoke test realizado.

 Cierra con comentario en PR.

 Cierra con decisión documentada.

 Cierra con reporte sin cambios.

 Cierra con bloqueo informado.

Debe incluir:

 Qué resultado cuenta como éxito.

 Qué resultado cuenta como bloqueo.

 Qué resultado obliga a pedir nueva autorización.

 Qué NO cuenta como cierre.

11. Tamaño del microciclo

Antes de abrir, Torre valida que sea chico.

 Se puede explicar en pocas líneas.

 Tiene un solo eje.

 No mezcla diagnóstico, implementación y despliegue salvo autorización.

 No intenta resolver varias capas al mismo tiempo.

 No abre más preguntas de las que puede cerrar.

 No depende de supuestos invisibles.

 No pone a Ariel de cartero permanente.

Regla:

Si el microciclo es grande, se parte en microciclos menores.

12. Riesgo operativo

Antes de abrir, Torre clasifica el riesgo.

 Riesgo bajo: documental o read-only.

 Riesgo medio: código sin producción.

 Riesgo alto: runtime, deploy, variables, producción, datos reales.

 Riesgo crítico: credenciales, automatizaciones externas, acciones irreversibles.

Según riesgo:

 Bajo: puede avanzar con orden clara.

 Medio: requiere dictamen de Torre.

 Alto: requiere autorización explícita de Ariel.

 Crítico: requiere doble confirmación y plan de rollback.

13. Datos reales y privacidad

Antes de abrir, debe quedar prohibido o regulado:

 Usar datos reales de usuarios/clientes/pasajeros sin necesidad.

 Exponer datos sensibles en logs.

 Subir capturas con información privada.

 Pegar tokens o credenciales.

 Publicar datos operativos internos.

 Usar nombres reales si no son necesarios.

 Mezclar datos de prueba con producción.

Regla:

Todo smoke test debe usar datos controlados, mínimos y no sensibles, salvo autorización explícita.

14. Producción

Antes de abrir, debe decirse explícitamente si producción queda fuera o dentro.

Por defecto:

 Producción queda fuera.

 No se deploya.

 No se activan flags.

 No se modifican variables.

 No se toca infraestructura.

 No se ejecutan acciones sobre usuarios reales.

 No se cambia comportamiento público.

Si producción entra en alcance, debe existir:

 Motivo.

 Riesgo.

 Plan de prueba.

 Plan de reversa.

 Autorización explícita de Ariel.

 Evidencia previa suficiente.

15. Flags y configuración

Antes de abrir, Torre verifica:

 Si hay feature flags involucradas.

 Si están OFF por defecto.

 Si se permite activarlas.

 En qué entorno se pueden activar.

 Con qué usuario o allowlist.

 Cómo se revierte.

 Qué evidencia confirma que no impactó producción.

Regla:

Ningún flag se activa en producción por arrastre o comodidad.

16. Tests o validaciones

Antes de abrir, debe estar definido qué validación corresponde.

Según el caso:

 No requiere tests porque es documental.

 Requiere inspección de diff.

 Requiere tests unitarios.

 Requiere smoke test local.

 Requiere smoke test staging.

 Requiere validación manual.

 Requiere comparación contra comportamiento anterior.

 Requiere evidencia de no regresión.

Regla:

Si hay código, tiene que haber alguna forma de validarlo.

17. PR y merge

Antes de abrir, debe estar claro si el microciclo puede llegar a PR o no.

 Puede crear rama.

 Puede abrir PR.

 Puede dejar PR abierto.

 Puede preparar pero no abrir PR.

 Puede mergear solo si hay autorización posterior.

 No puede mergear en el mismo ciclo.

 No puede hacer squash sin checklist de merge.

Regla:

Autorizar apertura de microciclo no equivale a autorizar merge.

18. Anti-dispersión

Antes de abrir, Torre bloquea expansión lateral.

 No se agregan ideas nuevas durante la ejecución.

 No se cambia el objetivo por oportunidad.

 No se resuelven problemas colaterales.

 No se agregan mejoras estéticas.

 No se cambia arquitectura por intuición.

 No se mezclan proyectos.

 No se cambia de repo salvo contradicción documentada.

Regla:

Si aparece algo nuevo, se registra como pendiente, no se ejecuta.

19. Relación con ciclos anteriores

Antes de abrir, debe verificarse:

 Qué ciclo anterior habilita este.

 Qué decisión anterior se está ejecutando.

 Qué pedido previo se está cumpliendo.

 Qué condición pendiente se intenta cerrar.

 Si existe una contradicción con una decisión anterior.

 Si el ciclo nuevo pisa trabajo ya mergeado.

 Si hay que reconciliar antes de avanzar.

Regla:

No se abre un microciclo que contradice una decisión vigente sin documentar primero la contradicción.

20. Formato de orden al ejecutor

Antes de abrir, la orden debe contener:

 Rol del ejecutor.

 Objetivo.

 Contexto mínimo.

 Alcance permitido.

 Alcance prohibido.

 Archivos esperados.

 Comandos permitidos, si aplica.

 Evidencia requerida.

 Condición de cierre.

 Instrucción de frenar ante desvíos.

 Prohibición de avanzar a producción.

 Prohibición de mergear si no está autorizado.

Gate final de apertura

Torre solo autoriza abrir el microciclo si puede responder estas preguntas:

 ¿Qué vamos a hacer?

 ¿Por qué lo hacemos ahora?

 ¿Dónde se va a hacer?

 ¿Qué se puede tocar?

 ¿Qué no se puede tocar?

 ¿Quién decide si aparece una duda?

 ¿Cómo se prueba o verifica?

 ¿Cómo se cierra?

 ¿Qué evidencia tiene que volver?

 ¿Qué queda expresamente fuera?

Si alguna respuesta queda borrosa:

NO SE AUTORIZA APERTURA.
Primero se pide aclaración, diagnóstico o partición del ciclo.

Dictamen operativo

Un microciclo puede abrirse solamente cuando cumple esta fórmula:

Objetivo claro + scope chico + repo correcto + prohibiciones explícitas + evidencia esperada + condición de cierre + autoridad definida.

Si falta una de esas piezas, el ciclo no está maduro.

---

## Prompt original enviado a Torre

```
Como Torre del proyecto Torre de Control, respondé esto sin usar conectores ni MCP:

Listame en formato chequeo los criterios que aplicas antes de AUTORIZAR LA APERTURA de un microciclo. Que tiene que existir, que tiene que estar definido, que tiene que estar prohibido. Mismo nivel de detalle y formato que el checklist de merge. Sin omitir ninguno.
```
