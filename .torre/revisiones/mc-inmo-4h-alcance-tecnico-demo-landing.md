# Alcance técnico mínimo de primera demo de landing — MC-INMO-4H
# Link → Oferta → Landing propia · Oferta personalizada inmobiliaria — Guadalupe Cabrera

> **Microciclo:** MC-INMO-4H
> **Autoridad emisora:** Torre de Control
> **Tipo:** definición de alcance técnico mínimo (documental; NO habilita implementación, NO crea código/app/frontend/backend, NO deploya, NO toca el repo del proyecto ni Railway)
> **Estado del proyecto:** `conocido / no iniciado`
> **Antecedentes:** MC-INMO-4G (`c49aea2`) · MC-INMO-4F (`13b1bde`) · MC-INMO-4E (`59acd91`) · MC-INMO-4D (`5940623`) · MC-INFRA-1 (`2118c95`)
> **Nota de reconstrucción:** el orden original llegó truncado en la sección H. Las secciones H (cierre) a R fueron completadas autónomamente bajo autorización explícita de Ariel (Opción 2), siguiendo el patrón de MC-INMO-4E a 4G y el contrato técnico ya definido, sin habilitar implementación ni agregar alcance nuevo.

> ## Frase madre: **De link genérico a oferta profesional con tu sello.**

---

## A. Objetivo

Definir el **alcance técnico mínimo** para una futura primera demo de landing inmobiliaria.

La demo futura debe validar la idea:

> transformar un link genérico o datos de una propiedad en una landing profesional con el sello de Guadalupe.

> Este documento **NO** habilita implementación.

---

## B. Qué debe demostrar la primera demo futura

La primera demo técnica futura debe demostrar solo:

1. Que una propiedad puede presentarse mejor que con un link genérico.
2. Que Guadalupe puede tener una landing propia.
3. Que la landing se ve bien en celular.
4. Que el CTA a WhatsApp es claro.
5. Que los datos se muestran ordenados.
6. Que la pieza parece de Guadalupe, no de un portal.
7. Que el flujo es replicable para otras propiedades.

---

## C. Alcance máximo de la primera demo

La primera demo futura debe limitarse a:

- una sola landing
- una sola propiedad demo
- datos ficticios o autorizados
- fotos placeholder o autorizadas
- CTA de WhatsApp placeholder o controlado
- sin backend si no es necesario
- sin base de datos si no es necesario
- sin login
- sin scraping
- sin extracción automática real
- sin publicación comercial real
- sin dominio definitivo
- sin producción

---

## D. Datos permitidos para la demo

La demo futura podrá usar una de estas opciones:

| Opción | Descripción |
|---|---|
| **Opción 1 — Más segura** | datos ficticios claramente marcados como demo |
| **Opción 2 — Controlada** | datos reales aportados por Guadalupe, con autorización explícita |
| **Opción 3 — Referencia transformada** | datos inspirados en ejemplos externos, anonimizados y reescritos, sin copiar textos ni imágenes |

> **Regla:** todo dato debe quedar marcado como `ficticio`, `autorizado`, `pendiente`, `no disponible` o `requiere validación humana`.

---

## E. Fotos permitidas

La demo futura solo podrá usar:

- ✅ placeholders
- ✅ imágenes libres con licencia compatible
- ✅ fotos propias autorizadas
- ✅ fotos aportadas por Guadalupe con permiso explícito

Prohibido:

- ❌ descargar fotos de ZonaProp
- ❌ descargar fotos de RE/MAX
- ❌ usar imágenes de portales como propias
- ❌ usar fotos reales sin permiso
- ❌ simular autorización

---

## F. WhatsApp en la demo

| Opción | Descripción |
|---|---|
| **Opción segura** | botón visible pero no funcional |
| **Opción controlada** | botón a número de prueba |
| **Opción real** | botón a WhatsApp de Guadalupe solo si ella lo autoriza explícitamente |

Reglas:

- ❌ No enviar mensajes automáticos.
- ❌ No integrar WhatsApp API.
- ❌ No registrar leads reales.
- ❌ No automatizar seguimiento.

---

## G. Stack técnico futuro sugerido

Solo como **hipótesis**, no como decisión final:

| Aspecto | Sugerencia |
|---|---|
| **Opción simple recomendada** | landing estática con HTML/CSS/JS o framework mínimo |
| **Opción con framework** | Next.js, React o similar solo si aporta valor real |
| **Backend** | no recomendado para la primera demo salvo necesidad clara |
| **Base de datos** | no necesaria para la primera demo |
| **Deploy** | Railway puede considerarse más adelante, pero **no queda habilitado por este ciclo** |

> El stack definitivo requiere autorización técnica separada.

---

## H. Archivos permitidos en una futura demo técnica

Solo como **borrador documental** de una lista mínima posible (no se crean en este ciclo):

```txt
README.md
package.json
src/
public/
docs/
index.html        (si landing estática)
src/styles/        (CSS)
src/assets/        (placeholders e imágenes autorizadas)
src/components/    (si se usa framework)
.gitignore
```

> Esta lista es **orientativa**. La lista definitiva, su ubicación y el repo destino se confirman en el microciclo técnico que autorice la demo. Ningún archivo de código se crea en MC-INMO-4H.

---

## I. Criterios de éxito de la demo futura

La demo futura se considerará exitosa si:

- ✅ la landing se ve correctamente en celular (mobile-first)
- ✅ el CTA a WhatsApp es visible y claro
- ✅ los datos clave se muestran ordenados y legibles
- ✅ la pieza transmite identidad de Guadalupe, no de un portal
- ✅ Guadalupe entiende y valora el formato
- ✅ el flujo puede repetirse para otra propiedad sin rehacer todo
- ✅ no se usó ningún dato, foto ni texto sin permiso

---

## J. Señales de freno antes de pasar a técnica

Frenar (no iniciar el ciclo técnico) si:

- se necesitan datos reales sin permiso
- se quieren usar fotos de portales
- se intenta publicar para clientes reales
- se intenta conectar WhatsApp real sin autorización
- se intenta crear backend o base de datos innecesarios
- se intenta deployar sin rollback definido
- se intenta tocar producción o secrets
- no hay repo técnico ni rama técnica confirmados
- la checklist pre-técnica (sección K) está incompleta
- se mezclan demo y producto real

---

## K. Checklist pre-técnico

Debe estar **completa y aprobada por Torre** antes de habilitar cualquier ciclo técnico:

```txt
Repo técnico confirmado:
Rama técnica definida:
Archivos permitidos definidos:
Stack confirmado:
Propiedad demo definida:
Datos ficticios o autorizados:
Fotos permitidas confirmadas:
WhatsApp placeholder o autorizado:
Sin scraping:
Sin backend innecesario:
Sin base de datos innecesaria:
Sin producción:
Sin secrets:
Sin dominio definitivo:
Rollback definido:
Criterio de éxito definido:
Autorización Torre:
```

---

## L. Qué queda habilitado

- ✅ Queda **definido a nivel documental** el alcance técnico mínimo de una futura primera demo.
- ✅ Queda lista la base para que un próximo microciclo complete la checklist pre-técnica (sección K) con valores concretos.

> No queda habilitada ninguna acción técnica. Solo queda definido el marco.

---

## M. Qué NO queda habilitado

- ❌ tocar el repo `szlapakariel-ux/Inmobiliaria-`
- ❌ tocar Railway · crear servicio · configurar variables · deployar
- ❌ crear app / frontend / backend / scraper / automatización
- ❌ crear landing real
- ❌ crear JSON / runtime
- ❌ tocar código / scripts / workflows / secrets / producción
- ❌ usar datos reales de portales como propios
- ❌ copiar textos o imágenes de terceros
- ❌ avanzar a MC-LOC-3

---

## N. Controles automáticos para seguir

Avanzar sin volver a preguntar solo si:

- el diff contiene únicamente `.torre/revisiones/mc-inmo-4h-alcance-tecnico-demo-landing.md`
- el contenido es 100% Markdown documental
- no se toca `.torre/proyectos.md`
- no se toca `.torre/estado.md`
- no se toca `.torre/protocolo_alta_proyecto.md`
- no se toca el repo `szlapakariel-ux/Inmobiliaria-`
- no se toca Railway
- no se crea contenido comercial final
- no se usan datos reales de portales como propios
- no se copian textos o imágenes de terceros
- no se crea JSON/runtime
- no se toca código/scripts/workflows/secrets/producción
- CI/checks terminan en success
- `mergeable_state` es clean
- no hay reviews/comentarios pendientes
- no hay commits inesperados

---

## O. Condiciones de freno

Frenar solo si:

- aparece un archivo fuera de scope
- falla CI
- hay conflicto
- aparece review/comentario
- se intenta tocar el repo inmobiliario
- se intenta tocar Railway
- se intenta deployar
- se intenta crear contenido final
- se usan datos reales de portales como propios
- se copian textos o imágenes de terceros
- aparece código/runtime/JSON/secrets/producción
- el dictamen pasa a B o C

---

## P. Próximo microciclo recomendado

**`MC-INMO-4I — Checklist pre-técnica completada para demo de landing`**

Ese ciclo debe completar la checklist de la sección K con valores concretos (repo técnico, rama, archivos, stack, propiedad demo, datos, fotos, WhatsApp, rollback, criterio de éxito) y presentarla a Torre para autorización. Sigue siendo documental.

> Solo después de que Torre apruebe esa checklist podría emitirse una orden técnica para construir la demo.

---

## Q. Reporte final esperado del ciclo

Al cierre de MC-INMO-4H se reporta: rama creada · PR creado · checks/CI · merge realizado · commit final en main · archivo creado · confirmación de que solo se creó el documento de alcance técnico · confirmación de que no se tocó el repo inmobiliario · confirmación de que no se tocó Railway · confirmación de que no se habilitó implementación · próximo microciclo recomendado.

---

## R. Estado final

- **MC-INMO-4H:** CERRADO (definición de alcance técnico mínimo, documental).
- **Proyecto:** `conocido / no iniciado` — sin cambio de estado.
- **Repo `szlapakariel-ux/Inmobiliaria-`:** NO tocado.
- **Railway:** NO tocado · NO configurado · NO desplegado · NO habilitado.
- **Demo técnica:** NO habilitada · solo alcance definido.
- **Código / app / frontend / backend / scraper / automatización / runtime:** NO creados.
- **Datos reales / fotos de terceros:** NO usados.
- **`.torre/proyectos.md` · `.torre/estado.md` · `.torre/protocolo_alta_proyecto.md`:** NO modificados.
- **MC-LOC-3:** NO habilitado.

Cualquier ciclo técnico requiere completar la checklist (sección K), una orden nueva de Torre y autorización explícita.
