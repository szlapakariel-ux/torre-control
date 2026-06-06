# Orden técnica mínima documental para demo de landing — MC-INMO-4J
# Link → Oferta → Landing propia · Oferta personalizada inmobiliaria — Guadalupe Cabrera

> **Microciclo:** MC-INMO-4J
> **Autoridad emisora:** Torre de Control
> **Tipo:** orden técnica mínima documental (define la orden técnica futura; NO habilita implementación, NO crea código/app/frontend/backend, NO deploya, NO toca el repo del proyecto ni Railway)
> **Estado del proyecto:** `conocido / no iniciado`
> **Antecedentes:** MC-INMO-4I (`4c454ba`) · MC-INMO-4H (`be39f6c`) · MC-INMO-4G (`c49aea2`) · MC-INMO-4F (`13b1bde`) · MC-INMO-4E (`59acd91`) · MC-INFRA-1 (`2118c95`)

> ## Frase madre: **De link genérico a oferta profesional con tu sello.**

---

## A. Objetivo

Definir la **orden técnica mínima documental** para una futura demo segura de landing inmobiliaria.

La futura demo deberá validar:

> De link genérico a oferta profesional con tu sello.

> Este documento **NO habilita implementación**.
> Solo deja preparada la orden técnica mínima que Ariel/Torre podrá autorizar en un ciclo separado.

Este ciclo transforma el dictamen `APTO_CON_PENDIENTES` de MC-INMO-4I en una orden técnica documental clara, resolviendo los pendientes de la sección K de aquel checklist (stack, rama, archivos, datos, fotos, WhatsApp, Railway, rollback, criterio de cierre, prohibiciones).

---

## B. Decisión de alcance técnico futuro

La primera demo técnica futura deberá ser:

- landing estática simple
- una sola propiedad demo
- datos ficticios o autorizados
- fotos placeholder o autorizadas
- sin scraping
- sin backend
- sin base de datos
- sin login
- sin analytics
- sin CRM
- sin pagos
- sin automatización
- sin producción
- sin dominio definitivo

---

## C. Repo técnico futuro

| Campo | Valor |
|---|---|
| Repo técnico | `szlapakariel-ux/Inmobiliaria-` |
| Estado | repo existente |
| Uso futuro | demo controlada de landing inmobiliaria |
| Implementación actual | **NO habilitada** |

> **Regla:** la existencia del repo no habilita tocarlo. Para trabajar en ese repo hace falta una orden técnica separada.

---

## D. Rama técnica futura recomendada

| Tipo | Rama |
|---|---|
| **Recomendada** | `demo/mc-inmo-landing-estatica` |
| **Alternativa aceptable** | `feat/demo-landing-inmobiliaria` |

> **Regla:** no crear la rama en este ciclo. La rama solo podrá crearse en el ciclo técnico autorizado.

---

## E. Stack recomendado

### Stack recomendado para primera demo

Landing estática simple:

- `HTML`
- `CSS`
- `JavaScript` mínimo, solo si hace falta

Motivo:

- menor complejidad
- más rápido de auditar
- sin backend
- sin dependencias innecesarias
- más fácil de revertir
- suficiente para validar valor visual y comercial

### Stack no recomendado para primera demo

No usar todavía:

- backend
- base de datos
- scraping
- login
- dashboard
- integración WhatsApp API
- framework pesado si no aporta valor
- Railway deploy automático

### Framework opcional futuro

`Vite`, `React` o `Next.js` solo deberían considerarse si Torre decide que la demo necesita estructura de app.

---

## F. Archivos permitidos futuros

Lista mínima para una futura demo técnica estática:

```txt
README.md
index.html
styles.css
script.js
assets/
docs/
```

| Archivo | Definición |
|---|---|
| `README.md` | propósito de la demo · que no es producción · cómo correr o visualizar la landing · qué datos son ficticios o autorizados · qué NO está habilitado |
| `index.html` | estructura de la landing |
| `styles.css` | estilos visuales mínimos |
| `script.js` | opcional · solo para interacción mínima no crítica |
| `assets/` | solo placeholders o imágenes autorizadas |
| `docs/` | documentación técnica o evidencia del ciclo |

> **Regla:** la lista definitiva deberá confirmarse en la orden técnica real. Cualquier archivo fuera de la lista debe frenar.

---

## G. Datos demo permitidos

### Opción recomendada

Datos ficticios claramente marcados como demo.

Ejemplo de estado:

```txt
DEMO — datos ficticios, no publicar
```

### Alternativa

Datos reales aportados por Guadalupe solo si hay autorización explícita.

### Prohibido

- ❌ datos reales de portales usados como propios
- ❌ fotos de portales
- ❌ textos copiados
- ❌ dirección exacta sin autorización
- ❌ precio real no confirmado
- ❌ disponibilidad no validada

---

## H. Política de fotos

Permitido para futura demo:

- ✅ placeholders
- ✅ imágenes libres con licencia compatible
- ✅ fotos propias de Guadalupe con permiso explícito
- ✅ fotos reales de una propiedad solo si hay autorización documentada

Prohibido:

- ❌ descargar imágenes de ZonaProp
- ❌ descargar imágenes de RE/MAX
- ❌ usar fotos de terceros como propias
- ❌ simular permiso de uso
- ❌ usar fotos reales sin autorización

---

## I. Política de WhatsApp

Para primera demo futura:

| Opción | Descripción |
|---|---|
| **Opción principal** | botón de WhatsApp visible pero no funcional |
| **Opción secundaria** | número de prueba controlado |
| **Opción real** | WhatsApp real de Guadalupe solo si ella autoriza explícitamente |

Prohibido:

- ❌ WhatsApp API
- ❌ envío automático
- ❌ seguimiento automático
- ❌ captura de leads reales
- ❌ mensajes reales a clientes

---

## J. Railway

Railway queda disponible como **infraestructura futura**, pero **NO entra en la primera demo** salvo autorización separada.

Para usar Railway en el futuro debe existir:

- orden técnica separada
- rama técnica definida
- stack aprobado
- build local o equivalente validado
- confirmación de si hay o no variables
- rollback definido
- entorno no productivo
- autorización explícita de Torre

> **Dictamen para este ciclo:** `Railway disponible, pero NO habilitado.`

---

## K. Rollback futuro

Rollback mínimo para cualquier demo técnica futura:

- si hay deploy, debe poder apagarse
- si hay link público, debe poder retirarse
- si hay contenido dudoso, debe poder reemplazarse
- si se detectan datos reales no autorizados, bloquear la demo
- si se toca archivo fuera de scope, frenar
- si el resultado parece producción, frenar
- si hay dudas legales o de permisos, volver a estado documental

---

## L. Criterio de cierre técnico futuro

La futura demo técnica solo podrá considerarse cerrada si:

- ✅ respeta archivos permitidos
- ✅ no toca producción
- ✅ no usa secrets
- ✅ no usa datos reales sin autorización
- ✅ no usa fotos de terceros sin permiso
- ✅ no hace scraping
- ✅ no publica automáticamente
- ✅ muestra la landing en modo demo
- ✅ comunica la frase madre
- ✅ se ve correctamente en celular
- ✅ tiene CTA claro
- ✅ puede ser revertida o apagada
- ✅ deja evidencia de verificación

---

## M. Checklist final para futura autorización técnica

```txt
Repo técnico confirmado: szlapakariel-ux/Inmobiliaria-
Rama técnica definida:
Stack aprobado:
Archivos permitidos:
Datos demo definidos:
Datos marcados como ficticios o autorizados:
Fotos permitidas:
WhatsApp placeholder o autorizado:
Sin scraping:
Sin backend:
Sin base de datos:
Sin producción:
Sin secrets:
Sin dominio definitivo:
Railway habilitado explícitamente: sí/no
Rollback definido:
Criterio de éxito:
Autorización técnica Torre:
```

---

## N. Señales de freno técnico

Frenar si:

- se intenta usar datos reales sin permiso
- se intenta usar fotos de portales
- se intenta copiar diseño o texto
- se intenta conectar WhatsApp real sin autorización
- se intenta usar Railway sin orden separada
- se intenta deployar directo
- se intenta agregar backend sin necesidad
- se intenta crear login, CRM o pagos
- se intenta usar secrets
- se intenta publicar para clientes reales
- se mezcla demo con producción

---

## O. Qué queda habilitado por este documento

Solo queda habilitado:

- ✅ preparar una futura orden técnica
- ✅ tener criterios claros para una demo segura
- ✅ definir alcance mínimo
- ✅ elegir una recomendación documental de stack
- ✅ listar archivos posibles futuros

No queda habilitado:

- ❌ tocar código
- ❌ tocar repo del proyecto
- ❌ tocar Railway
- ❌ deployar
- ❌ crear app
- ❌ crear landing real

---

## P. Dictamen documental

> ## **Dictamen: `APTO PARA FUTURA ORDEN TÉCNICA MÍNIMA`**

> **Aclaración:** ese dictamen no autoriza implementación. Solo indica que ya existe base suficiente para que Torre emita una orden técnica separada.

---

## Q. Próximo microciclo recomendado

**`MC-INMO-5A — Demo técnica mínima local de landing estática`**

**Condición:** solo puede avanzar si Ariel/Torre emite autorización técnica explícita para tocar el repo `szlapakariel-ux/Inmobiliaria-`.

La autorización deberá declarar:

- repo
- rama
- stack
- archivos permitidos
- datos demo
- política de imágenes
- WhatsApp placeholder o autorizado
- prohibición de producción
- prohibición de Railway salvo autorización explícita
- criterio de rollback

---

## R. Qué NO queda habilitado

- ❌ tocar el repo `szlapakariel-ux/Inmobiliaria-`
- ❌ tocar Railway · crear servicio · configurar variables · deployar
- ❌ crear app / frontend / backend / scraper / automatización
- ❌ crear landing real
- ❌ crear PDF final / publicaciones finales
- ❌ descargar imágenes · copiar contenido de terceros
- ❌ crear JSON / runtime
- ❌ tocar código / scripts / workflows / secrets / producción
- ❌ avanzar a MC-LOC-3

---

## S. Estado final

- **MC-INMO-4J:** CERRADO (orden técnica mínima documental).
- **Dictamen:** `APTO PARA FUTURA ORDEN TÉCNICA MÍNIMA`.
- **Proyecto:** `conocido / no iniciado` — sin cambio de estado.
- **Repo `szlapakariel-ux/Inmobiliaria-`:** NO tocado.
- **Railway:** NO tocado · NO configurado · NO desplegado · NO habilitado.
- **Implementación técnica:** NO habilitada.
- **Código / app / frontend / backend / runtime:** NO creados.
- **Datos reales / fotos de terceros:** NO usados.
- **`.torre/proyectos.md` · `.torre/estado.md` · `.torre/protocolo_alta_proyecto.md`:** NO modificados.
- **MC-LOC-3:** NO habilitado.

El paso a demo técnica real requiere una orden nueva de Torre (MC-INMO-5A) con autorización técnica explícita para tocar el repo del proyecto.
