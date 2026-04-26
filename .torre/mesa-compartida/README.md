# Mesa compartida central — Torre de Control

Esta carpeta funciona como mesa de trabajo central entre Ariel, ChatGPT/Torre y agentes ejecutores.

Ariel no debe hacer de cartero entre repos.

Ariel plantea problemas en Torre de Control. Torre de Control ordena, decide proyecto y repo técnico. Los repos técnicos ejecutan órdenes derivadas. ChatGPT/Torre revisa las respuestas y confirma el siguiente paso.

---

## Regla #0 — Identificación obligatoria

Toda entrada debe empezar con:

```text
PROYECTO_FUNCIONAL:
REPO_TECNICO:
```

Sin estos dos campos, el problema no se acepta.

`REPO_TECNICO` debe escribirse como `owner/repo`, no solo como nombre corto.

Ejemplo:

```text
PROYECTO_FUNCIONAL: Secretaria
REPO_TECNICO: szlapakariel-ux/agente-saas
```

---

## Repos técnicos conocidos

| PROYECTO_FUNCIONAL | REPO_TECNICO |
|---|---|
| Secretaria | szlapakariel-ux/agente-saas |

---

## Flujo de trabajo

1. Ariel plantea un problema en lenguaje natural.
2. ChatGPT/Torre convierte el problema en una orden clara.
3. Torre define el repo técnico responsable.
4. El agente ejecutor trabaja sobre el repo técnico.
5. El agente sube respuesta o PR.
6. ChatGPT/Torre revisa.
7. Si no cierra, Torre corrige o deriva.
8. Si cierra, Torre confirma y actualiza el estado.

---

## Roles

### Ariel

Plantea el problema y toma decisiones finales cuando haya ambigüedad.

### ChatGPT / Torre

Ordena el problema, define responsable, revisa respuestas y decide si el ciclo continúa o se cierra.

### Agente ejecutor

Trabaja la orden, modifica archivos permitidos, reporta qué hizo y deja PR o respuesta.

### Repo técnico

No es mesa de entrada. Solo ejecuta órdenes derivadas desde Torre.

---

## Cuándo frenar y consultar a Ariel

Esta mesa adopta como base los criterios de corte de Torre.

ChatGPT o el agente deben frenar si:

- falta `PROYECTO_FUNCIONAL` o `REPO_TECNICO`,
- el problema es ambiguo,
- falta criterio de éxito,
- el repo indicado no coincide,
- se pide tocar código sin autorización,
- se pide tocar producción, secrets, variables o deploy,
- se intenta modificar archivos fuera del scope,
- aparece conflicto,
- no se puede abrir PR,
- hay riesgo de loop,
- la decisión requiere criterio humano.

Si una regla de esta carpeta contradice una regla de Torre, prevalece Torre.

---

## Estados válidos

```text
ABIERTA
EN_PROCESO
EN_REVISION
EN_CORRECCION
DERIVADA
APROBADA
RECHAZADA
CERRADA
```

---

## Plantilla mínima de orden

```text
PROYECTO_FUNCIONAL:
REPO_TECNICO:

ID:
FECHA:
ESTADO:

PROBLEMA_DE_ARIEL:

ORDEN_GENERADA_POR_CHATGPT:

RESPONSABLE_ACTUAL:

ARCHIVOS_A_TOCAR:

ARCHIVOS_PROHIBIDOS:

CRITERIO_DE_EXITO:

RESPUESTA_DEL_AGENTE:

REVISION_DE_CHATGPT:

PROXIMO_RESPONSABLE:

ESTADO_FINAL:
```

---

## Regla de seguridad

No subir claves, tokens, credenciales ni información sensible.

No usar esta carpeta para guardar datos personales, secretos ni dumps de producción.
