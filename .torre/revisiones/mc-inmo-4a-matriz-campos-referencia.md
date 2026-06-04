# Matriz de campos de referencia — MC-INMO-4A
# Oferta personalizada inmobiliaria — Guadalupe Cabrera

> **Microciclo:** MC-INMO-4A
> **Autoridad emisora:** Torre de Control
> **Tipo:** definición documental de matriz de campos (NO crea oferta final, NO publica, NO toca el repo del proyecto)
> **Estado del proyecto:** `conocido / no iniciado`
> **Antecedentes:** MC-INMO-4 (`a14ecf1`) · MC-INMO-3 (`709dfc5`) · MC-INMO-2 (`3d7f2bb`) · MC-INMO-1 (`a3e389f`) · MC-ALTA-3 (`337c653`)

---

## A. Objetivo

Transformar los datos de ejemplo aportados por Ariel en una **matriz de campos estructurada** para preparar futuras ofertas inmobiliarias de Guadalupe Cabrera.

Este ciclo:
- ✅ ordena campos de referencia
- ✅ documenta qué datos suelen estar disponibles en publicaciones de portales
- ✅ documenta qué datos adicionales son necesarios para una oferta personalizada

Este ciclo **NO**:
- ❌ crea una oferta real
- ❌ usa los datos como propiedad de Guadalupe para publicar
- ❌ crea contenido final ni habilita diseño

---

## B. Origen de los datos de ejemplo

Ariel aportó datos extraídos de publicaciones inmobiliarias tipo RE/MAX / ZonaProp como material de referencia estructural.

### Declaración de uso

| Ítem | Estado |
|---|---|
| Son datos de referencia | ✅ |
| Son propiedad real de Guadalupe para publicar | ❌ |
| Habilitan contenido final | ❌ |
| Habilitan diseño | ❌ |
| Habilitan publicación | ❌ |
| Habilitan scraping | ❌ |
| Habilitan tocar el repo `szlapakariel-ux/Inmobiliaria-` | ❌ |

> El propósito de estos datos es **entender qué campos aparecen** en publicaciones inmobiliarias reales, para definir qué pedirle a Guadalupe cuando se trabaje con una propiedad concreta.

---

## C. Datos detectados — matriz de campos

### C.1 Identificación comercial

| Campo | Tipo de dato | Observaciones |
|---|---|---|
| Nombre de la propiedad | texto | título comercial de la publicación |
| Operación | enum | venta / alquiler / alquiler temporario |
| Tipo de propiedad | enum | departamento / casa / PH / local / terreno / otro |
| Barrio / zona | texto | puede ser barrio, partido o zona general |
| Ubicación exacta | texto | dirección o intersección; nivel de detalle a definir con Guadalupe |
| Código MLS / ID | alfanumérico | identificador único del portal o sistema interno |
| Contacto agente | texto | WhatsApp, email, teléfono |
| Corredores responsables | texto | nombre y matrícula del corredor habilitado |

### C.2 Precio y costos

| Campo | Tipo de dato | Observaciones |
|---|---|---|
| Precio | numérico | con moneda (USD / ARS) |
| Expensas | numérico | monto mensual, moneda y qué incluye |
| Opciones de financiamiento | texto | contado, crédito hipotecario, financiación propia, otro |

### C.3 Características principales

| Campo | Tipo de dato | Observaciones |
|---|---|---|
| Ambientes | numérico | total de ambientes incluyendo cocina |
| Dormitorios | numérico | solo dormitorios; diferente a ambientes |
| Baños | numérico | baños completos |
| Superficie cubierta | numérico (m²) | área techada |
| Superficie total | numérico (m²) | cubierta + semicubierta + descubierta |
| Superficie semicubierta | numérico (m²) | balcón cubierto, galería, etc. |
| Antigüedad | numérico o texto | en años, o "a estrenar", "en pozo" |
| Pisos de la propiedad | texto | piso N de N; o planta baja |
| Apto crédito | booleano | sí / no / a consultar |

### C.4 Material visual y descripción

| Campo | Tipo de dato | Observaciones |
|---|---|---|
| Fotos disponibles | numérico + detalle | cantidad y tipos (fachada, living, cocina, baño, balcón, plano, etc.) |
| Descripción | texto | texto comercial propio; nunca copiado de portal |

---

## D. Campos faltantes — para completar manualmente con Guadalupe

Estos campos no suelen aparecer en publicaciones de portales, pero son **esenciales** para una oferta personalizada de Guadalupe:

| Campo | Por qué es necesario |
|---|---|
| Estado general | determina habitabilidad y expectativas del comprador/inquilino |
| Permiso de uso de fotos | sin autorización confirmada, las fotos no pueden usarse |
| Puntos fuertes | base del texto comercial; diferencia una oferta de una ficha técnica |
| Diferenciales | qué hace única a esta propiedad respecto a otras de la zona |
| Público ideal | define el tono y el canal prioritario de difusión |
| CTA deseado | qué acción se quiere que tome quien ve la oferta |
| Restricciones o datos legales | hipoteca, inhibición, estado dominial, restricciones de uso |
| Notas adicionales | cualquier dato relevante no contemplado en los campos anteriores |

---

## E. Clasificación operativa para futuras ofertas

### E.1 Obligatorios para armar una oferta mínima

- [ ] Operación (venta / alquiler)
- [ ] Tipo de propiedad
- [ ] Barrio / zona
- [ ] Precio (con moneda)
- [ ] Expensas (si aplica)
- [ ] Ambientes
- [ ] Dormitorios (si aplica)
- [ ] Baños
- [ ] Superficie cubierta
- [ ] Superficie total
- [ ] Fotos disponibles con permiso de uso confirmado
- [ ] Contacto agente (Guadalupe)
- [ ] Descripción base o puntos fuertes
- [ ] Disponibilidad (activa / reservada / vendida)
- [ ] Link de referencia (si existe)

### E.2 Muy recomendables

- [ ] Ubicación exacta o zona precisa
- [ ] Antigüedad
- [ ] Apto crédito
- [ ] Financiación
- [ ] Superficie semicubierta
- [ ] Estado general
- [ ] Diferenciales
- [ ] Público ideal
- [ ] CTA deseado
- [ ] Corredor responsable / matrícula (si aplica)

### E.3 Opcionales

- [ ] Historia de la propiedad
- [ ] Amenities ampliados
- [ ] Plano
- [ ] Video
- [ ] Tour virtual
- [ ] Notas adicionales

---

## F. Brecha detectada entre datos de portal y oferta personalizada

Los portales suelen mostrar **muchos datos técnicos** (superficie, ambientes, precio, fotos). Lo que falta para una oferta personalizada de Guadalupe:

| Dato ausente en portales | Por qué importa para la oferta de Guadalupe |
|---|---|
| Por qué conviene verla | justifica la visita; es el argumento de conversión |
| Para quién es ideal | permite segmentar el mensaje según el perfil del comprador/inquilino |
| Qué la hace diferente | diferencia la oferta de Guadalupe de una ficha genérica de portal |
| Qué rol cumple Guadalupe | el servicio de acompañamiento es parte de la propuesta de valor |
| Qué mensaje enviar por WhatsApp | el canal principal requiere texto específico, no una copia del portal |
| Qué CTA usar | la acción deseada varía (agendar visita, pedir más info, consultar precio) |
| Permiso sobre fotos | sin este dato, no hay oferta publicable |
| Tono a usar | cada propiedad y cada público requieren un registro diferente |

> Esta brecha es el motivo por el que el **briefing de Guadalupe** (sección G) requiere más campos que una ficha de ZonaProp.

---

## G. Briefing mejorado para Guadalupe

Versión ampliada del briefing, incorporando los campos detectados en esta matriz. Formato copiable para completar antes de producir cualquier oferta:

```txt
Nombre comercial de la propiedad:
Operación:
Tipo de propiedad:
Barrio / zona:
Ubicación exacta:
Precio:
Expensas:
Ambientes:
Dormitorios:
Baños:
Superficie cubierta:
Superficie semicubierta:
Superficie total:
Antigüedad:
Estado general:
Apto crédito:
Financiación:
Piso / pisos del edificio:
Fotos disponibles:
Permiso de uso de fotos:
Descripción base:
Puntos fuertes:
Diferenciales:
Público ideal:
CTA deseado:
Contacto de Guadalupe:
Código interno / MLS / referencia:
Corredor responsable / matrícula:
Restricciones legales:
Disponibilidad:
Link de referencia:
Notas adicionales:
```

> Cuando este briefing esté completo con una propiedad real y fotos autorizadas, recién entonces puede emitirse una orden para producir la primera oferta usando la plantilla de MC-INMO-3.

---

## H. Próximo microciclo recomendado

**`MC-INMO-5 — Briefing de primera propiedad real de Guadalupe`**

Objetivo: completar la ficha de briefing (sección G) con datos reales de una propiedad concreta aportada por Ariel o Guadalupe, y verificar que el material cumple todos los requisitos para avanzar a producción.

**Condición:** solo avanza si Ariel o Guadalupe aportan:
- datos reales de una propiedad concreta (todos los campos obligatorios de E.1)
- permiso de uso de fotos confirmado

Sin esos insumos, MC-INMO-5 no queda habilitado.

---

## I. Estado final

- **MC-INMO-4A:** CERRADO (definición documental de matriz de campos).
- **Proyecto:** `conocido / no iniciado` — sin cambio de estado.
- **Repo `szlapakariel-ux/Inmobiliaria-`:** NO tocado.
- **Datos de ejemplo:** registrados como referencia estructural · NO usados como propiedad de Guadalupe · NO publicados.
- **Contenido comercial final / oferta real:** NO creado.
- **Fotos / imágenes de terceros:** NO usadas · NO descargadas.
- **Scraping:** NO realizado.
- **`.torre/proyectos.md` · `.torre/estado.md` · `.torre/protocolo_alta_proyecto.md`:** NO modificados.
- **MC-LOC-3:** NO habilitado.

Cualquier paso hacia producción de una oferta real requiere el briefing completo (sección G) con datos reales y una orden nueva de Torre.
