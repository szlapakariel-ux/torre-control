# Trigger V1 — aviso de cierre de ciclo

Primera versión del aviso. Objetivo: que Torre/Ariel se enteren de cuándo un ciclo `.torre/` terminó, sin tener que abrir el repo y leer `estado.md` a mano.

## Implementación elegida

**Opción B: GitHub Action + script bash**, sin dependencias externas.

Por qué B y no las otras:

- **A (watcher local)**: requiere un proceso corriendo en alguna máquina; solo lo ve quien lo levantó; muere si la máquina se apaga.
- **B (GitHub Action)**: corre en la infraestructura del repo, sin tokens, sin servicios externos, accesible a cualquiera con permiso de lectura. Cero dependencias nuevas.
- **C (WhatsApp/Telegram)**: requiere bot, token, número, webhook, y un canal donde mandar. Todo eso es V2 — necesita decisiones de producto que V1 no quiere tomar todavía.

V1 es deliberadamente boring: detecta + muestra. La capa de notificación externa va sobre esto cuando exista.

## Componentes

```
.torre/scripts/check_cycle_closed.sh   detector (bash, sin deps)
.github/workflows/torre-trigger.yml    workflow que lo dispara en GitHub Actions
.torre/trigger.md                      este documento
```

## Cómo se detecta un ciclo cerrado

El script `check_cycle_closed.sh` mira tres cosas en el repo:

1. `.torre/estado.md` debe tener `EN_PROCESO_POR: ninguno`.
2. `.torre/inbox/orden_actual.md` debe estar en placeholder (contiene la frase `sin orden activa`).
3. `.torre/historial/` debe tener al menos un par `<dir>/reporte_actual.md` archivado.

Si las tres condiciones se cumplen → **CICLO CERRADO** (exit 0). Si alguna falla → **CICLO ABIERTO** (exit 1). Si faltan archivos esperados → **ERROR** (exit 2).

Cuando el ciclo está cerrado, el script imprime también:

- cantidad total de ciclos archivados,
- slug del último ciclo (carpeta dentro de `historial/`),
- ID de la última orden cerrada (extraído del último reporte archivado).

**Orden del "último ciclo"**: se determina por el timestamp del commit más reciente que tocó cada directorio dentro de `historial/` (`git log -1 --format=%ct -- <dir>`). No se usa orden alfabético (ambiguo cuando varios slugs comparten prefijo de fecha) ni `mtime` filesystem (un clone fresco lo resetea). Si un directorio aún no está commiteado, se le asigna timestamp `0` y queda al final.

## Cómo se informa

El workflow `torre-trigger-v1` se dispara automáticamente en cada `push` o `pull_request` que toca `.torre/**` (o el propio workflow). Corre el script y vuelca el resultado en el **Step Summary** del job, visible en la pestaña Actions del repo y en el check del PR.

V1 no manda notificaciones externas. La superficie de aviso es:

- log del job en la UI de Actions,
- step summary en formato Markdown,
- check status del PR (verde si ciclo cerrado o abierto-pero-normal; rojo solo si hubo error real al chequear, ej. archivo faltante).

El workflow **no falla** un PR por tener el ciclo abierto a mitad: durante el desarrollo de un ciclo es normal que `EN_PROCESO_POR` apunte a un operador. Falla solo si hay un error genuino (`exit 2`), ej. `estado.md` borrado.

## Cómo se usa

### Localmente (cualquiera, en cualquier momento)

```sh
.torre/scripts/check_cycle_closed.sh
```

Imprime estado + sale con código. Útil para que un operador IA o un humano confirme rápido si el sistema está en reposo antes de empujar trabajo nuevo.

### En GitHub (automático)

No hay que hacer nada. Cualquier push o PR que cambie algo bajo `.torre/` dispara el workflow. El resultado se ve en:

- **Pestaña Actions** del repo → últimos runs de `torre-trigger-v1`.
- **PRs** que tocan `.torre/` → check status `torre-trigger-v1 / detect-cycle-closure`.

### Lectura del summary

El step summary muestra la salida cruda del script y una línea de interpretación al final:

- `Resultado: CICLO CERRADO. El sistema postal está en reposo.`
- `Resultado: CICLO ABIERTO. Hay trabajo en curso o el sistema todavía no completó un ciclo.`
- `Resultado: ERROR. Revisar archivos de .torre/.`

## Lo que Trigger V1 NO hace todavía

- No manda mensajes a WhatsApp / Telegram / mail.
- No detecta transición (de abierto → cerrado); solo reporta el estado actual.
- No distingue "ciclo recién cerrado" de "sistema en reposo desde hace tiempo".
- No alerta sobre lock huérfano (eso es otro chequeo, separado).

Esas son piezas de V2.
