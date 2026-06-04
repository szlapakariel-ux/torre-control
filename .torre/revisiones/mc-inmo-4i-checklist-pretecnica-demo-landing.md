# Checklist pre-técnico completo — MC-INMO-4I
# Link → Oferta → Landing propia · Oferta personalizada inmobiliaria — Guadalupe Cabrera

> **Microciclo:** MC-INMO-4I
> **Autoridad emisora:** Torre de Control
> **Tipo:** checklist pre-técnico (documental; completa el checklist pero NO habilita implementación, NO crea código/app, NO deploya, NO toca el repo del proyecto ni Railway)
> **Estado del proyecto:** `conocido / no iniciado`
> **Antecedentes:** MC-INMO-4H (`be39f6c`) · MC-INMO-4G (`c49aea2`) · MC-INMO-4F (`13b1bde`) · MC-INMO-4E (`59acd91`) · MC-INFRA-1 (`2118c95`)

> ## Frase madre: **De link genérico a oferta profesional con tu sello.**

---

## A. Objetivo

Crear el **checklist pre-técnico completo** para evaluar si una futura demo de landing inmobiliaria puede pasar a una orden técnica mínima.

> Este documento **completa el checklist**, pero **NO habilita implementación**.

---

## B. Decisión de estado

El documento clasifica la preparación técnica en una de estas categorías:

```txt
NO_APTO_PARA_TECNICA
APTO_CON_PENDIENTES
APTO_PARA_ORDEN_TECNICA_DOCUMENTAL
```

> **Regla recomendada:** si todavía faltan stack definitivo, rama técnica, archivos permitidos y datos demo exactos, el dictamen debe ser `APTO_CON_PENDIENTES`. No declarar listo para técnica si faltan decisiones.

---

## C. Checklist pre-técnico

| Campo | Estado | Observación |
|---|---|---|
| Repo técnico confirmado | `confirmado` | `szlapakariel-ux/Inmobiliaria-` |
| Rama técnica definida | `pendiente` | sugerir `docs/demo-landing-inmobiliaria` o `feat/demo-landing-inmobiliaria`, pero no crearla |
| Stack aprobado | `pendiente` | sugerir opciones, no decidir implementación |
| Archivos permitidos | `pendiente` | deben definirse en orden técnica posterior |
| Propiedad demo definida | `pendiente` | puede ser ficticia o autorizada |
| Datos demo definidos | `pendiente` | no usar datos reales sin permiso |
| Fotos permitidas | `pendiente` | placeholders o fotos autorizadas |
| WhatsApp placeholder o autorizado | `pendiente` | no usar WhatsApp real sin autorización |
| Sin scraping | `confirmado` | scraping no habilitado |
| Sin producción | `confirmado` | producción no habilitada |
| Sin secrets | `confirmado` | no usar variables ni tokens |
| Sin dominio definitivo | `confirmado` | dominio no habilitado |
| Railway habilitado explícitamente | `no` | Railway registrado, no habilitado |
| Rollback definido | `pendiente` | debe definirse antes de deploy |
| Criterio de éxito | `parcial` | validar en este documento (sección J) |
| Autorización técnica Torre | `no` | no emitida |

---

## D. Stack sugerido para orden técnica futura

Alternativas, sin decidir implementación:

| Opción | Descripción |
|---|---|
| **Opción A — landing estática simple** | HTML/CSS/JS · sin backend · sin base de datos · sin build complejo · ideal para primera demo controlada |
| **Opción B — app mínima con framework** | Next.js / React / Vite · solo si aporta valor real · requiere definir build y deploy |
| **Opción C — backend simple** | no recomendado para primera demo · solo si se necesita transformar links dinámicamente más adelante |

> **Recomendación documental:** para primera demo, priorizar **landing estática simple** (Opción A) salvo que Torre decida lo contrario.

---

## E. Datos demo permitidos

| Opción | Descripción |
|---|---|
| **Opción 1 — datos ficticios** | más segura |
| **Opción 2 — datos reales autorizados por Guadalupe** | permitida solo con autorización explícita |
| **Opción 3 — datos externos transformados** | solo si están anonimizados, reescritos y sin copiar textos ni fotos |

> **Recomendación:** usar datos ficticios o placeholders para la primera demo técnica.

---

## F. Política de fotos

Permitido:

- ✅ placeholders
- ✅ imágenes libres con licencia compatible
- ✅ fotos propias autorizadas
- ✅ fotos aportadas por Guadalupe con permiso explícito

Prohibido:

- ❌ descargar fotos de portales
- ❌ usar fotos de ZonaProp / RE/MAX como propias
- ❌ usar imágenes reales sin permiso
- ❌ simular autorización

---

## G. Política de WhatsApp

Opciones:

- botón no funcional
- link a número de prueba
- link real de Guadalupe solo si ella autoriza

> **Para primera demo:** recomendar botón placeholder o número de prueba.

Prohibido:

- ❌ envío automático
- ❌ WhatsApp API
- ❌ registro de leads reales
- ❌ seguimiento automático

---

## H. Railway

Railway está disponible como **infraestructura futura**, pero **no habilitada**.

Antes de usar Railway debe existir:

- orden técnica separada
- repo técnico y rama definidos
- stack aprobado
- build local o equivalente validado
- variables definidas o confirmación de que no hay variables
- rollback
- entorno no productivo
- autorización explícita de Torre

> Este ciclo **NO** toca Railway.

---

## I. Archivos permitidos futuros

Lista borrador para una futura demo estática:

```txt
README.md
index.html
styles.css
script.js
assets/
docs/
```

Aclaraciones:

- esta lista **no habilita** crear archivos ahora
- la lista definitiva debe quedar en una orden técnica posterior
- cualquier archivo extra requerirá freno o nueva autorización

---

## J. Criterio de éxito de la futura demo

La futura demo se considerará exitosa si:

- ✅ la landing comunica la frase madre
- ✅ se entiende en menos de 2 minutos
- ✅ se ve bien en celular
- ✅ el CTA es claro
- ✅ no usa contenido de terceros sin permiso
- ✅ no publica nada real
- ✅ puede mostrarse a Guadalupe como prototipo controlado
- ✅ permite decidir si vale la pena avanzar a MVP técnico

---

## K. Pendientes antes de técnica

- definir stack final
- definir rama técnica
- definir archivos permitidos
- definir datos demo exactos
- definir política final de imágenes
- definir si WhatsApp será placeholder o número de prueba
- definir si Railway entra en la primera demo
- definir rollback
- definir criterio de cierre técnico

---

## L. Dictamen del checklist

> ## **Dictamen: `APTO_CON_PENDIENTES`**

El proyecto está **suficientemente ordenado** para preparar una orden técnica mínima documental, pero **todavía no está habilitado para tocar código**.

Razón: siguen abiertos los pendientes de la sección K (stack final, rama técnica, archivos permitidos, datos demo exactos, política final de imágenes, decisión de WhatsApp, decisión de Railway, rollback, criterio de cierre técnico).

---

## M. Próximo microciclo recomendado

**`MC-INMO-4J — Orden técnica mínima documental para demo landing inmobiliaria`**

Ese ciclo deberá definir:

- repo técnico
- rama técnica
- stack elegido
- archivos permitidos
- datos demo
- política de fotos
- política de WhatsApp
- si Railway entra o no
- rollback
- criterio de cierre
- prohibiciones técnicas

> Sigue siendo documental: define la orden técnica, no la ejecuta.

---

## N. Qué NO queda habilitado

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

## O. Estado final

- **MC-INMO-4I:** CERRADO (checklist pre-técnico completo, documental).
- **Dictamen:** `APTO_CON_PENDIENTES`.
- **Proyecto:** `conocido / no iniciado` — sin cambio de estado.
- **Repo `szlapakariel-ux/Inmobiliaria-`:** NO tocado.
- **Railway:** NO tocado · NO configurado · NO desplegado · NO habilitado.
- **Implementación técnica:** NO habilitada.
- **Código / app / frontend / backend / runtime:** NO creados.
- **Datos reales / fotos de terceros:** NO usados.
- **`.torre/proyectos.md` · `.torre/estado.md` · `.torre/protocolo_alta_proyecto.md`:** NO modificados.
- **MC-LOC-3:** NO habilitado.

El paso a orden técnica requiere resolver los pendientes de la sección K y una orden nueva de Torre (MC-INMO-4J).
