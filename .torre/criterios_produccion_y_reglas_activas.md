# Criterios de producción y reglas activas

> **Fuente:** GPT/Torre, consultado el 2026-05-01 03:01.
> **Para:** sistema Torre de Control. Cualquier ejecutor (Claude, Codex, Claude Code) debe usar este documento como contrato verificable.

---

Documento operativo — Checklist de autorización crítica

Principio rector:
Torre no autoriza por intención, promesa o relato.
Torre autoriza solo por evidencia verificable.

Hay dos niveles distintos:

Cambio en producción
Afecta sistema vivo, usuarios, datos, servicios, deploy, variables, infraestructura o comportamiento real.

Activación/modificación de regla activa en configs/reglas_manifest.json
Afecta cómo el sistema clasifica, aprueba, observa, bloquea o deriva mensajes reales.

1) Checklist antes de autorizar un cambio en producción
Resultado posible del gate

APROBADO: puede ejecutarse.

APROBADO CON VENTANA CONTROLADA: puede ejecutarse solo en horario, alcance y condiciones definidas.

BLOQUEADO: no puede ejecutarse.

DEVUELTO A DIAGNÓSTICO: falta evidencia.

DEVUELTO A DOCUMENTAL: el cambio no está suficientemente definido.

A. Identidad del cambio

 Está identificado el repo activo.

 Está identificado el servicio afectado.

 Está identificado el ambiente afectado: producción, staging, preview, local.

 Está identificado el commit exacto que se quiere llevar a producción.

 Está identificado el PR exacto, si corresponde.

 Está identificado el autor del cambio.

 Está identificado el agente ejecutor.

 Está identificado el agente auditor, distinto del ejecutor.

 Está claro si el cambio es técnico, documental, configuración, datos, infraestructura o reglas.

 Está claro qué problema intenta resolver.

B. Alcance autorizado

 El alcance fue escrito antes de ejecutar.

 El alcance no depende de interpretación libre del ejecutor.

 Se listan los archivos permitidos.

 Se listan los archivos prohibidos.

 Se listan servicios que no deben tocarse.

 Se listan variables de entorno que no deben tocarse.

 Se declara si el cambio puede tocar runtime.

 Se declara si el cambio puede tocar producción.

 Se declara si el cambio puede tocar datos reales.

 Se declara si el cambio puede afectar usuarios reales.

C. Autorización explícita de Ariel

 Ariel autorizó el pase a producción de forma explícita.

 La autorización no fue inferida de una conversación anterior.

 La autorización no fue tomada de una aprobación documental.

 Ariel sabe qué se va a modificar.

 Ariel sabe qué riesgo existe.

 Ariel sabe cómo se revierte.

 Ariel no fue usado como cartero técnico.

 Ariel no tuvo que copiar/pegar entre agentes como parte obligatoria del flujo.

 Si Ariel debe intervenir manualmente, está declarado como excepción.

 La excepción tiene causa raíz documentada.

D. Rama, base y sincronización

 La rama nace de la base autorizada.

 La base autorizada está identificada por commit.

 No hay divergencia no explicada contra master o rama principal.

 El PR no está desactualizado.

 El estado de merge está limpio.

 No hay commits ajenos al microciclo.

 No hay arrastre de ramas viejas.

 No hay archivos duplicados por squash anterior.

 No hay cambios residuales no declarados.

 El diff real coincide con el alcance autorizado.

E. Diff exacto

 Se listan todos los archivos modificados.

 Se listan todos los archivos agregados.

 Se listan todos los archivos eliminados.

 Se indica cantidad de líneas agregadas y eliminadas.

 Se revisa si hay cambios en app, runtime, services, config, workflows, secrets, deploy, infra.

 Se verifica que no haya archivos temporales.

 Se verifica que no haya .env, claves, tokens o credenciales.

 Se verifica que no haya logs privados.

 Se verifica que no haya datos reales sensibles.

 Se verifica que no haya cambios ocultos en formato, encoding o finales de línea que alteren comportamiento.

F. Clasificación de riesgo

 Riesgo bajo, medio, alto o crítico asignado.

 Se justifica la clasificación.

 Se identifica impacto en usuarios.

 Se identifica impacto en datos.

 Se identifica impacto en disponibilidad.

 Se identifica impacto en integraciones externas.

 Se identifica impacto en costos.

 Se identifica impacto en seguridad.

 Se identifica impacto en reglas activas.

 Se define si requiere ventana de baja circulación.

G. Dependencias externas

 Se identifican APIs externas afectadas.

 Se identifican servicios cloud afectados.

 Se identifican proveedores de mensajería, correo, Sheets, WhatsApp, Render, Railway, Vercel u otros.

 Se confirma que las credenciales necesarias ya existen.

 No se crean secrets nuevos sin autorización explícita.

 No se cambian secrets sin autorización explícita.

 No se cambia proveedor sin decisión documental previa.

 No se cambia plan pago sin autorización.

 No se introduce dependencia nueva sin justificarla.

 No se introduce dependencia sin plan de fallback.

H. Variables de entorno y configuración

 Se listan variables leídas por el cambio.

 Se listan variables nuevas, si existen.

 Se listan variables modificadas, si existen.

 Se declara valor esperado sin exponer secretos.

 Se confirma valor por ambiente.

 Se confirma default seguro.

 Se confirma comportamiento si la variable falta.

 Se confirma comportamiento si la variable está mal cargada.

 Se confirma que producción no queda activada por default.

 Se confirma que flags críticos quedan en OFF salvo autorización explícita.

I. Datos reales

 Se confirma si el cambio lee datos reales.

 Se confirma si el cambio escribe datos reales.

 Se confirma si el cambio modifica datos históricos.

 Se confirma si el cambio borra datos.

 Se confirma si el cambio migra datos.

 Se confirma si el cambio crea nuevos campos.

 Se confirma compatibilidad con datos existentes.

 Se confirma fallback ante datos incompletos.

 Se confirma que no se corrompe cache.

 Se confirma que no se mezclan datos demo con datos reales.

J. Seguridad

 No hay credenciales en código.

 No hay tokens en logs.

 No hay datos personales innecesarios.

 No hay endpoints administrativos expuestos sin protección.

 No se amplían permisos sin autorización.

 No se debilitan validaciones.

 No se desactiva autenticación.

 No se desactiva autorización.

 No se permite ejecución remota no controlada.

 No se agrega dependencia riesgosa sin revisión.

K. Compatibilidad funcional

 El flujo principal sigue funcionando.

 Los endpoints existentes siguen respondiendo.

 Los nombres de campos existentes se mantienen.

 Los consumidores actuales no se rompen.

 Las respuestas mantienen formato esperado.

 Los errores siguen siendo claros.

 Los fallbacks siguen activos.

 El modo demo/cache/local, si existe, sigue funcionando.

 No se cambia comportamiento histórico sin documentarlo.

 No se elimina funcionalidad sin autorización.

L. Tests mínimos obligatorios

 Tests unitarios relevantes ejecutados.

 Tests de integración relevantes ejecutados.

 Tests de importación ejecutados.

 Tests de endpoints ejecutados.

 Tests de configuración ejecutados.

 Tests de fallback ejecutados.

 Tests de error ejecutados.

 Tests de datos vacíos ejecutados.

 Tests de datos inválidos ejecutados.

 Tests regresivos ejecutados sobre funcionalidades no tocadas pero cercanas.

M. Evidencia de tests

 Se adjunta comando exacto ejecutado.

 Se adjunta salida relevante.

 Se indica cantidad de tests pasados.

 Se indica cantidad de tests fallidos.

 Se explica cada fallo.

 Se diferencia fallo nuevo de fallo preexistente.

 No se ocultan warnings críticos.

 No se declara éxito si no se ejecutó.

 No se reemplaza test real por opinión.

 No se acepta “debería funcionar” como evidencia.

N. Smoke test previo

 Hay smoke test definido antes del deploy.

 El smoke test cubre health check.

 El smoke test cubre flujo principal.

 El smoke test cubre endpoint crítico.

 El smoke test cubre lectura de configuración.

 El smoke test cubre fallback.

 El smoke test cubre error controlado.

 El smoke test puede repetirse después del deploy.

 El resultado esperado está escrito.

 El resultado bloqueante está escrito.

O. Rollback

 Existe plan de rollback.

 El rollback tiene commit o versión objetivo.

 El rollback tiene responsable.

 El rollback tiene pasos concretos.

 El rollback no depende de memoria humana.

 Se sabe qué variable apagar.

 Se sabe qué deploy revertir.

 Se sabe qué archivo restaurar.

 Se sabe qué datos podrían quedar afectados.

 Se sabe cuándo cortar y revertir.

P. Observabilidad

 Hay forma de saber si producción levantó correctamente.

 Hay health check verificable.

 Hay logs accesibles.

 Hay señal de error.

 Hay señal de éxito.

 Hay forma de detectar caída parcial.

 Hay forma de detectar respuesta incorrecta.

 Hay forma de detectar datos vacíos.

 Hay forma de detectar fallback activado.

 Hay forma de distinguir producción real de demo/cache.

Q. Ventana de ejecución

 Se define horario de ejecución.

 Se evita horario crítico salvo urgencia.

 Se define duración máxima.

 Se define quién observa después.

 Se define cuándo se considera estable.

 Se define cuándo se corta.

 Se define si requiere aviso previo.

 Se define si requiere pausa operativa.

 Se define si requiere baja circulación.

 Se define si se permite ejecutar fuera de horario.

R. Comunicación operativa

 Ariel sabe qué se está haciendo.

 Los agentes saben quién ejecuta.

 Los agentes saben quién audita.

 Nadie ejecuta en paralelo sin coordinación.

 Nadie abre otro microciclo encima.

 El reporte final tiene formato definido.

 El reporte final incluye evidencia.

 El reporte final incluye commit final.

 El reporte final incluye estado de producción.

 El reporte final incluye próximos pasos.

S. Anti-cartero

 Ariel no debe mover información entre agentes salvo excepción.

 Si Ariel debe copiar algo, se declara bloqueo del sistema.

 Si GitHub traba el proceso, se documenta causa.

 Si Claude/Codex no puede acceder, se documenta causa.

 Si la Torre debe traducir entre agentes, se documenta.

 Si hay paso manual, se busca eliminarlo luego.

 No se normaliza que Ariel sea puente técnico.

 No se acepta “Ariel lo pasa” como arquitectura.

 Se registra la causa raíz del cartero.

 Se crea pedido futuro para eliminar esa causa.

T. Producción real vs simulada

 Se confirma si el cambio toca producción real.

 Se confirma si el cambio toca staging.

 Se confirma si el cambio toca preview.

 Se confirma si el cambio toca local.

 No se llama “staging” a producción con un flag.

 No se llama “smoke” a una prueba incompleta.

 No se llama “deploy” a un commit sin publicación.

 No se llama “validado” a algo no ejecutado.

 No se llama “cerrado” a algo sin reporte.

 No se llama “seguro” a algo sin rollback.

U. Bloqueos automáticos

El cambio queda bloqueado si ocurre cualquiera de estos puntos:

 No hay autorización explícita de Ariel.

 El diff toca archivos fuera de alcance.

 Hay secrets expuestos.

 Hay datos reales sensibles expuestos.

 No hay rollback.

 No hay smoke test.

 No hay evidencia de tests.

 El ejecutor reportó éxito sin ejecutar.

 El cambio modifica producción sin declararlo.

 El cambio activa flags críticos por default.

 El PR está desactualizado.

 El merge no está limpio.

 El cambio mezcla documental, técnico y producción sin autorización.

 Hay ambigüedad sobre repo activo.

 Hay ambigüedad sobre ambiente activo.

V. Post-deploy obligatorio

 Se verifica health check.

 Se verifica endpoint principal.

 Se verifica logs.

 Se verifica ausencia de errores nuevos.

 Se verifica modo real/demo/cache correcto.

 Se verifica que el commit desplegado sea el autorizado.

 Se verifica que variables críticas estén como se definió.

 Se verifica que no haya caída parcial.

 Se verifica que no haya regresión visible.

 Se documenta resultado.

W. Cierre

 Se registra qué se cambió.

 Se registra por qué se cambió.

 Se registra quién ejecutó.

 Se registra quién auditó.

 Se registra evidencia.

 Se registra estado final.

 Se registra si hubo rollback.

 Se registra si hubo incidentes.

 Se registra deuda técnica.

 Se registra próximo paso autorizado o bloqueo.

2) Checklist antes de activar o modificar una regla activa en configs/reglas_manifest.json
Regla base

Modificar configs/reglas_manifest.json es más sensible que un cambio documental porque puede alterar decisiones reales del sistema.

Una regla activa puede:

aprobar un mensaje,

marcarlo como importante,

derivarlo a revisión,

rechazarlo,

generar falsos positivos,

generar falsos negativos,

afectar entrenamiento operativo,

modificar el criterio real del sistema.

Resultado posible del gate

APROBADO PARA CONFIG ACTIVA

APROBADO SOLO EN MODO OBSERVACIÓN

APROBADO SOLO CON FLAG OFF

BLOQUEADO

DEVUELTO A DOCUMENTAL

DEVUELTO A CORPUS DE CASOS

DEVUELTO A AUDITORÍA HUMANA

A. Identidad de la regla

 La regla tiene ID único.

 El ID coincide con la nomenclatura vigente.

 El ID no duplica otra regla.

 El ID no contradice variantes existentes.

 El nombre describe comportamiento real.

 La regla tiene descripción operativa.

 La regla tiene estado declarado.

 La regla tiene versión.

 La regla tiene fecha de modificación.

 La regla tiene responsable documental.

B. Tipo de cambio

 Se indica si es activación nueva.

 Se indica si es modificación de regla activa.

 Se indica si es desactivación.

 Se indica si es cambio de severidad.

 Se indica si es cambio de condición.

 Se indica si es cambio de prioridad.

 Se indica si es cambio de canal.

 Se indica si es cambio de línea ferroviaria.

 Se indica si es cambio de mensaje sugerido.

 Se indica si es cambio de comportamiento de revisión.

C. Fuente documental

 Existe documento base aprobado.

 Existe dictamen previo.

 Existe justificación de negocio.

 Existe justificación normativa si corresponde.

 Existe ejemplo real que originó la regla.

 Existe decisión de Ariel si la regla cambia criterio.

 Existe criterio de aceptación.

 Existe criterio de rechazo.

 Existe alcance explícito.

 Existe lista de casos fuera de alcance.

D. Relación con normativa y matriz

 La regla no contradice la Matriz Medio Mensaje.

 La regla no inventa obligación operativa.

 La regla no exige datos que el operador no puede saber.

 La regla no exige hora estimada de demora si todavía no corresponde.

 La regla no fuerza precisión falsa.

 La regla no reemplaza criterio operativo de otra área.

 La regla respeta canal de publicación.

 La regla respeta estructura vigente.

 La regla respeta prioridad de componentes.

 La regla distingue entre error grave, importante y observación.

E. Alcance ferroviario y operativo

 Se indica línea afectada.

 Se indica si aplica a todas las líneas.

 Se indica si aplica solo a Línea San Martín u otra.

 Se indica canal afectado.

 Se indica tipo de mensaje afectado.

 Se indica si aplica a tren específico.

 Se indica si aplica a servicio general.

 Se indica si aplica a cancelación.

 Se indica si aplica a demora.

 Se indica si aplica a contingencia técnica, operativa, climática u otra.

F. Compatibilidad con reglas existentes

 Se revisan reglas similares.

 Se revisan reglas superpuestas.

 Se revisan reglas contradictorias.

 Se revisan reglas más generales.

 Se revisan reglas más específicas.

 Se define precedencia.

 Se define desempate.

 Se evita duplicación.

 Se evita doble penalización.

 Se evita que una regla tape a otra más precisa.

G. Estructura del manifest

 configs/reglas_manifest.json mantiene JSON válido.

 No hay coma sobrante.

 No hay claves duplicadas.

 No hay IDs repetidos.

 No hay campos obligatorios faltantes.

 No hay valores fuera del catálogo.

 No hay cambios de schema no autorizados.

 No hay comentarios inválidos dentro del JSON.

 No hay encoding extraño.

 El archivo puede ser parseado por el runtime.

H. Campos obligatorios de la regla

 ID.

 Nombre.

 Descripción.

 Estado.

 Severidad.

 Condiciones.

 Ejemplos positivos.

 Ejemplos negativos.

 Acción esperada.

 Fuente o referencia documental.

I. Estado de activación

 Se declara si queda activa.

 Se declara si queda inactiva.

 Se declara si queda en observación.

 Se declara si queda detrás de flag.

 Se declara si queda solo para test.

 Se declara si afecta producción.

 Se declara si afecta validadores humanos.

 Se declara si afecta reportes.

 Se declara si afecta feedback a operadores.

 Se declara si afecta clasificación automática.

J. Severidad

 La severidad está justificada.

 La severidad no es más alta de lo necesario.

 La severidad no es más baja de lo necesario.

 Se diferencia error bloqueante de observación.

 Se diferencia incumplimiento normativo de mejora de redacción.

 Se diferencia falta de dato obligatorio de dato deseable.

 Se diferencia estructura incorrecta de variante aceptable.

 Se define si la regla genera revisión humana.

 Se define si la regla genera rechazo.

 Se define si la regla solo informa.

K. Condiciones de disparo

 Las condiciones son verificables.

 Las condiciones no dependen de intuición.

 Las condiciones no son demasiado amplias.

 Las condiciones no son demasiado estrechas.

 Las condiciones contemplan sinónimos reales.

 Las condiciones contemplan errores comunes.

 Las condiciones contemplan variantes válidas.

 Las condiciones contemplan ausencia de datos.

 Las condiciones contemplan orden distinto de componentes.

 Las condiciones no capturan mensajes sanos.

L. Casos positivos

 Hay casos reales donde debe disparar.

 Hay casos sintéticos mínimos.

 Hay casos con redacción normal.

 Hay casos con redacción imperfecta.

 Hay casos con abreviaturas.

 Hay casos con hora.

 Hay casos con origen/destino.

 Hay casos con causa.

 Hay casos con datos faltantes.

 Hay casos límite.

M. Casos negativos

 Hay casos donde no debe disparar.

 Hay casos parecidos pero válidos.

 Hay casos de otra variante.

 Hay casos de otra línea.

 Hay casos de otro canal.

 Hay casos con redacción válida alternativa.

 Hay casos con causa válida.

 Hay casos sin causa pero no aplicables.

 Hay casos históricos aprobados.

 Hay casos límite donde debe ir a revisión, no rechazo.

N. Corpus mínimo de prueba

 El corpus tiene mensajes reales.

 El corpus tiene mensajes aprobados.

 El corpus tiene mensajes rechazados.

 El corpus tiene mensajes en revisión.

 El corpus tiene variantes cercanas.

 El corpus tiene ejemplos viejos.

 El corpus tiene ejemplos recientes.

 El corpus tiene casos simples.

 El corpus tiene casos ambiguos.

 El corpus tiene cantidad suficiente para no validar con un solo ejemplo.

O. Falsos positivos

 Se identifican posibles falsos positivos.

 Se mide cuántos casos válidos serían marcados.

 Se revisan mensajes históricamente correctos.

 Se revisan mensajes de operadores reales.

 Se revisa si castiga estilo y no estructura.

 Se revisa si castiga ausencia de dato no obligatorio.

 Se revisa si castiga una variante aprobada.

 Se revisa si duplica otra observación.

 Se revisa si escala severidad indebidamente.

 Se define umbral máximo aceptable.

P. Falsos negativos

 Se identifican casos que deberían disparar y no disparan.

 Se prueban redacciones incompletas.

 Se prueban errores frecuentes.

 Se prueban mensajes con orden alterado.

 Se prueban mensajes con abreviaturas.

 Se prueban mensajes con errores ortográficos.

 Se prueban mensajes con datos mínimos.

 Se prueban mensajes con causa ausente.

 Se prueban mensajes con confusión de variante.

 Se define umbral máximo aceptable.

Q. Prioridad y orden de ejecución

 Se define prioridad frente a reglas generales.

 Se define prioridad frente a reglas específicas.

 Se define prioridad frente a reglas de ortografía.

 Se define prioridad frente a reglas de estructura.

 Se define prioridad frente a reglas de canal.

 Se define prioridad frente a reglas de contingencia.

 Se evita que una regla secundaria bloquee una principal.

 Se evita doble clasificación contradictoria.

 Se define qué regla gana ante conflicto.

 Se documenta el motivo de la prioridad.

R. Acción resultante

 Se define si aprueba.

 Se define si observa.

 Se define si marca importante.

 Se define si envía a revisión.

 Se define si bloquea.

 Se define si genera feedback.

 Se define si impacta reporte.

 Se define si impacta tablero.

 Se define si impacta operador.

 Se define si impacta solo auditor interno.

S. Mensaje de feedback

 El feedback es claro.

 El feedback no acusa.

 El feedback explica qué falta.

 El feedback no inventa datos.

 El feedback no exige estimaciones imposibles.

 El feedback no contradice normativa.

 El feedback no es excesivamente largo.

 El feedback permite corregir.

 El feedback distingue obligatorio de sugerido.

 El feedback fue revisado por Torre antes de activar.

T. Modo observación

 Se evalúa si debe entrar primero en modo observación.

 Si es regla nueva, se prefiere observación antes de bloqueo.

 Si modifica regla activa, se evalúa impacto histórico.

 Si hay duda, no se activa en bloqueo.

 Se define duración de observación.

 Se define quién valida los resultados.

 Se define cantidad mínima de casos observados.

 Se define cuándo sube a activa.

 Se define cuándo se revierte.

 Se define cuándo se elimina.

U. Validación humana

 La regla fue revisada por Ariel.

 Si corresponde, fue revisada por Diego/Patricia u operadores validadores.

 Se registró acuerdo o desacuerdo.

 Se registraron dudas.

 Se registraron casos discutidos.

 Se registró dictamen final.

 No se activa por opinión de un solo agente.

 No se activa por un único ejemplo.

 No se activa porque “parece lógico”.

 No se activa si Ariel no entiende qué cambia.

V. Pruebas técnicas

 El manifest carga sin error.

 El runtime levanta con el manifest.

 Los tests de reglas pasan.

 Los tests de regresión pasan.

 Los tests de casos positivos pasan.

 Los tests de casos negativos pasan.

 Los tests de conflicto pasan.

 Los tests de fallback pasan.

 Los tests de mensajes vacíos pasan.

 Los tests de mensajes malformados pasan.

W. Evidencia técnica

 Se adjunta comando exacto de validación.

 Se adjunta resultado del parseo JSON.

 Se adjunta resultado de tests.

 Se adjunta diff exacto de configs/reglas_manifest.json.

 Se adjunta listado de reglas afectadas.

 Se adjunta listado de casos probados.

 Se adjunta resultado esperado contra resultado obtenido.

 Se adjunta comparación antes/después.

 Se adjuntan fallos si existen.

 No se ocultan casos que fallaron.

X. Compatibilidad histórica

 Se prueba contra mensajes históricos aprobados.

 Se prueba contra mensajes históricos observados.

 Se prueba contra mensajes históricos rechazados.

 Se revisa si cambia decisiones anteriores.

 Se documenta si cambia decisiones anteriores.

 Se justifica si cambia decisiones anteriores.

 Se evita reescribir historia sin decisión.

 Se evita invalidar reportes anteriores.

 Se evita alterar métricas sin aviso.

 Se define desde qué fecha aplica.

Y. Rollback de regla

 Se puede volver al manifest anterior.

 Se identifica commit anterior.

 Se identifica campo exacto a revertir.

 Se identifica regla exacta a apagar.

 Se identifica flag, si existe.

 Se sabe si revertir requiere deploy.

 Se sabe si revertir requiere reinicio.

 Se sabe si revertir afecta datos ya clasificados.

 Se sabe cómo marcar clasificaciones dudosas.

 Se sabe quién ejecuta el rollback.

Z. Bloqueos automáticos

La activación o modificación queda bloqueada si ocurre cualquiera de estos puntos:

 No hay documento base aprobado.

 No hay autorización explícita de Ariel.

 No hay casos positivos.

 No hay casos negativos.

 No hay prueba contra corpus histórico.

 No hay validación JSON.

 No hay diff exacto.

 No está claro si queda activa o en observación.

 La regla exige datos imposibles de conocer.

 La regla contradice una variante ya aprobada.

 La regla contradice la Matriz Medio Mensaje.

 La regla cambia severidad sin justificación.

 La regla duplica otra regla.

 La regla genera falsos positivos no medidos.

 La regla genera falsos negativos no medidos.

 La regla afecta producción sin declararlo.

 La regla toca runtime además del manifest sin autorización.

 El ejecutor reporta éxito sin evidencia.

 Ariel no puede explicar qué cambia después de leer el dictamen.

 El cambio mezcla varias reglas en una sola autorización.

Dictamen mínimo antes de aprobar

Antes de autorizar, Torre debe emitir algo así:

DICTAMEN DE TORRE

Tipo de autorización:
[ ] Producción
[ ] Regla activa en configs/reglas_manifest.json

Estado:
[ ] APROBADO
[ ] APROBADO CON CONDICIONES
[ ] BLOQUEADO
[ ] DEVUELTO A DIAGNÓSTICO
[ ] DEVUELTO A DOCUMENTAL

Repo activo:
Commit base:
Commit propuesto:
PR:
Archivos tocados:
Ambiente afectado:
Riesgo:
Rollback:
Smoke test:
Evidencia revisada:
Bloqueos encontrados:
Decisión final:

Autorización requerida de Ariel:
[ ] Sí
[ ] No

Frase de autorización válida:
“Autorizo explícitamente [acción concreta] sobre [ambiente/regla] con alcance [alcance] y rollback [rollback].”
Prompt unificado para pasar a Claude/Codex/ejecutor
Actuá como agente auditor técnico del proyecto Torre de Control.

OBJETIVO
Aplicar un gate estricto antes de autorizar uno de estos dos escenarios:

1) Cambio en producción.
2) Activación o modificación de regla activa en configs/reglas_manifest.json.

MODO DE TRABAJO
No ejecutes cambios.
No hagas merge.
No modifiques archivos.
No actives producción.
No actives reglas.
Solo auditá y reportá.

CHECKLIST OBLIGATORIO
Aplicá el checklist completo correspondiente:

A) Para producción:
- identidad del cambio
- alcance autorizado
- autorización explícita
- rama/base
- diff exacto
- riesgo
- dependencias
- variables
- datos reales
- seguridad
- compatibilidad
- tests
- smoke test
- rollback
- observabilidad
- ventana
- comunicación
- anti-cartero
- producción real vs simulada
- bloqueos automáticos
- post-deploy
- cierre

B) Para configs/reglas_manifest.json:
- identidad de regla
- tipo de cambio
- fuente documental
- relación normativa
- alcance operativo
- compatibilidad con reglas existentes
- estructura JSON
- campos obligatorios
- estado de activación
- severidad
- condiciones de disparo
- casos positivos
- casos negativos
- corpus mínimo
- falsos positivos
- falsos negativos
- prioridad
- acción resultante
- feedback
- modo observación
- validación humana
- pruebas técnicas
- evidencia
- compatibilidad histórica
- rollback
- bloqueos automáticos

SALIDA OBLIGATORIA
Devolvé un dictamen con este formato:

1. Tipo de autorización evaluada
2. Repo activo
3. Rama/base/commit
4. Archivos tocados
5. Diff resumido
6. Evidencia disponible
7. Evidencia faltante
8. Riesgos detectados
9. Bloqueos automáticos
10. Rollback disponible
11. Smoke test disponible
12. Dictamen final:
   - APROBADO
   - APROBADO CON CONDICIONES
   - BLOQUEADO
   - DEVUELTO A DIAGNÓSTICO
   - DEVUELTO A DOCUMENTAL

REGLA FINAL
Si falta una evidencia crítica, no apruebes.
Si el ejecutor dice “funciona” pero no muestra prueba, no apruebes.
Si el cambio afecta producción o reglas activas sin autorización explícita de Ariel, bloqueá.
Si Ariel queda como cartero, declaralo como bloqueo operativo o deuda de arquitectura.

---

## Prompt original enviado a Torre

```
Como Torre del proyecto Torre de Control, respondé esto sin usar conectores ni MCP:

Listame el checklist completo que aplicarias antes de autorizar:
(1) un cambio en produccion
(2) la activacion o modificacion de una regla activa en configs/reglas_manifest.json

Mas estricto que el checklist de merge documental. Sin omitir nada. Mismo nivel de detalle (15+ secciones, ~100 items por checklist si hace falta).
```
