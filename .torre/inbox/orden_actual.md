# ORDEN ACTUAL

Para iniciar un ciclo, la Torre debe reemplazar este archivo con una orden basada en `.torre/templates/orden_template.md`. La orden debe incluir los siete campos obligatorios:

- `PROYECTO_FUNCIONAL`
- `REPO_TECNICO`
- `RAMA_TRABAJO`
- `RAMA_DESTINO`
- `EJECUTOR`
- `TIPO_ORDEN` (`local` | `remota`)
- `REPO_ORIGEN`

Opcionalmente, agregar `REQUIERE_IA: si` para que el Invoker IA (`.torre/scripts/invoke_operator.sh`) intente invocar al adaptador correspondiente. Sin esa marca, la orden se trata como manual.

Ver `protocolo.md`, secciones "Identidad de proyecto", "Órdenes remotas" y "Control de concurrencia". Ver también `invoker.md` para el comportamiento del Invoker (gates V1.1 + matcher estricto V1.2 incluidos).
