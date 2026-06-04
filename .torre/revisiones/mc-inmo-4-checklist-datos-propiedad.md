# Checklist de datos por propiedad — MC-INMO-4
# Oferta personalizada inmobiliaria — Guadalupe Cabrera

> **Microciclo:** MC-INMO-4
> **Autoridad emisora:** Torre de Control
> **Tipo:** definición documental de checklist (NO crea oferta final, NO publica, NO toca el repo del proyecto)
> **Estado del proyecto:** `conocido / no iniciado`
> **Antecedentes:** MC-INMO-3 (`709dfc5`) · MC-INMO-2 (`3d7f2bb`) · MC-INMO-1 (`a3e389f`) · MC-ALTA-3 (`337c653`) · MC-ALTA-1/2 (`3ece45f`/`839c34a`)

---

## A. Objetivo

Definir **qué datos mínimos necesita Guadalupe** para transformar una publicación inmobiliaria en una **oferta propia, profesional y replicable**.

Este documento usa dos publicaciones de ZonaProp como **ejemplos de estructura y campos**, no como contenido a copiar.

### Reglas de uso de las publicaciones de referencia

- ✅ Se analizan **solo** como ejemplos de estructura, jerarquía de información y campos típicos de una publicación inmobiliaria.
- ❌ NO se copian textos.
- ❌ NO se copian imágenes.
- ❌ NO se copia diseño.
- ❌ NO se usa la marca ZonaProp.
- ❌ NO se publica contenido derivado.
- ❌ NO se hace scraping automático.

> El objetivo es que Guadalupe tenga una **lista de campos** que pedir/relevar por cada propiedad, para que cada oferta nazca con identidad propia y datos completos.

---

## B. Fuentes de ejemplo

Dos URLs provistas por Ariel como referencia de campos:

| # | Operación | Tipo | Zona | URL | Estado de extracción |
|---|---|---|---|---|---|
| 1 | Venta | Departamento 2 ambientes | Palermo | `zonaprop.com.ar/.../veclapin-departamento-en-venta-2-ambientes-palermo-59276174.html` | ⚠️ pendiente de extracción (HTTP 403) |
| 2 | Alquiler | Departamento | Puerto Madero | `zonaprop.com.ar/.../alclapin-departamento-en-puerto-madero-58833407.html` | ⚠️ pendiente de extracción (HTTP 403) |

> **Nota de acceso:** ambas URLs respondieron **HTTP 403 Forbidden** al intento de lectura automática (el portal bloquea el acceso programático). Conforme a la orden, NO se frena: se registra el bloqueo, se extraen los datos evidentes del slug/URL y se continúa con el checklist general. No se realizan reintentos ni scraping.

### B.1 Datos evidentes extraídos del slug / URL (sin acceder al contenido)

**Ejemplo 1 — Venta**

| Campo | Valor evidente | Fuente |
|---|---|---|
| Operación | Venta | slug (`-en-venta-`) |
| Tipo de propiedad | Departamento | slug (`departamento-`) |
| Ambientes | 2 | slug (`2-ambientes`) |
| Barrio / zona | Palermo | slug (`-palermo-`) |
| Ciudad | CABA (inferido) | barrio Palermo |
| ID de publicación | `59276174` | slug |
| Portal / fuente | ZonaProp | dominio |
| Resto de campos | ⚠️ pendiente de extracción | bloqueo 403 |

**Ejemplo 2 — Alquiler**

| Campo | Valor evidente | Fuente |
|---|---|---|
| Operación | Alquiler | slug (`alclapin-` / contexto) |
| Tipo de propiedad | Departamento | slug (`departamento-`) |
| Barrio / zona | Puerto Madero | slug (`-puerto-madero-`) |
| Ciudad | CABA (inferido) | barrio Puerto Madero |
| ID de publicación | `58833407` | slug |
| Portal / fuente | ZonaProp | dominio |
| Ambientes | ⚠️ no expuesto en slug | — |
| Resto de campos | ⚠️ pendiente de extracción | bloqueo 403 |

> Ambos ejemplos siguen siendo **útiles**: aportan operación, tipo, zona e ID, suficientes para ilustrar la diferencia venta vs alquiler y construir el checklist. Por eso no aplica freno.

---

## C. Datos a relevar de cada publicación (modelo de campos)

Como el contenido no pudo extraerse del portal, las tablas siguientes funcionan como **plantilla de relevamiento**: cada campo queda listado con su estado. Cuando una propiedad real se cargue (de Guadalupe o de una lectura habilitada), se completa el valor.

Leyenda de estado: `evidente` (visible en slug/URL) · `⏳ pendiente` (no accesible por bloqueo 403).

### C.1 Identificación

| Campo | Ejemplo 1 (Venta · Palermo) | Ejemplo 2 (Alquiler · Pto Madero) |
|---|---|---|
| URL | evidente | evidente |
| Portal / fuente | ZonaProp | ZonaProp |
| Tipo de operación | Venta | Alquiler |
| Tipo de propiedad | Departamento | Departamento |
| Barrio / zona | Palermo | Puerto Madero |
| Ciudad / provincia | CABA (inferido) | CABA (inferido) |
| Título comercial | ⏳ pendiente | ⏳ pendiente |
| ID / número de publicación | `59276174` | `58833407` |

### C.2 Precio y costos

| Campo | Ejemplo 1 | Ejemplo 2 |
|---|---|---|
| Precio | ⏳ pendiente | ⏳ pendiente |
| Moneda | ⏳ pendiente | ⏳ pendiente |
| Expensas | ⏳ pendiente | ⏳ pendiente |
| Gastos adicionales | ⏳ pendiente | ⏳ pendiente |
| Condiciones de alquiler | n/a | ⏳ pendiente |
| Impuestos / notas económicas | ⏳ pendiente | ⏳ pendiente |

### C.3 Características principales

| Campo | Ejemplo 1 | Ejemplo 2 |
|---|---|---|
| Ambientes | 2 (evidente) | ⏳ pendiente |
| Dormitorios | ⏳ pendiente | ⏳ pendiente |
| Baños | ⏳ pendiente | ⏳ pendiente |
| Toilette | ⏳ pendiente | ⏳ pendiente |
| Superficie total | ⏳ pendiente | ⏳ pendiente |
| Superficie cubierta | ⏳ pendiente | ⏳ pendiente |
| Superficie descubierta | ⏳ pendiente | ⏳ pendiente |
| Antigüedad | ⏳ pendiente | ⏳ pendiente |
| Estado general | ⏳ pendiente | ⏳ pendiente |
| Orientación | ⏳ pendiente | ⏳ pendiente |
| Disposición | ⏳ pendiente | ⏳ pendiente |
| Piso | ⏳ pendiente | ⏳ pendiente |
| Pisos del edificio | ⏳ pendiente | ⏳ pendiente |

### C.4 Equipamiento y comodidades

| Campo | Ejemplo 1 | Ejemplo 2 |
|---|---|---|
| Balcón | ⏳ pendiente | ⏳ pendiente |
| Cochera | ⏳ pendiente | ⏳ pendiente |
| Baulera | ⏳ pendiente | ⏳ pendiente |
| Amenities | ⏳ pendiente | ⏳ pendiente |
| Pileta | ⏳ pendiente | ⏳ pendiente |
| Gimnasio | ⏳ pendiente | ⏳ pendiente |
| Seguridad | ⏳ pendiente | ⏳ pendiente |
| Laundry | ⏳ pendiente | ⏳ pendiente |
| SUM | ⏳ pendiente | ⏳ pendiente |
| Parrilla | ⏳ pendiente | ⏳ pendiente |
| Terraza | ⏳ pendiente | ⏳ pendiente |
| Aire acondicionado | ⏳ pendiente | ⏳ pendiente |
| Calefacción | ⏳ pendiente | ⏳ pendiente |
| Mascotas | ⏳ pendiente | ⏳ pendiente |

### C.5 Ubicación

| Campo | Ejemplo 1 | Ejemplo 2 |
|---|---|---|
| Barrio | Palermo | Puerto Madero |
| Calle / zona aproximada | ⏳ pendiente | ⏳ pendiente |
| Cercanías relevantes | ⏳ pendiente | ⏳ pendiente |
| Transporte cercano | ⏳ pendiente | ⏳ pendiente |
| Puntos de interés | ⏳ pendiente | ⏳ pendiente |
| Mapa / ubicación aproximada | ⏳ pendiente | ⏳ pendiente |

### C.6 Material visual

| Campo | Ejemplo 1 | Ejemplo 2 |
|---|---|---|
| Cantidad aproximada de fotos | ⏳ pendiente | ⏳ pendiente |
| Fachada | ⏳ pendiente | ⏳ pendiente |
| Living | ⏳ pendiente | ⏳ pendiente |
| Cocina | ⏳ pendiente | ⏳ pendiente |
| Dormitorio | ⏳ pendiente | ⏳ pendiente |
| Baño | ⏳ pendiente | ⏳ pendiente |
| Balcón | ⏳ pendiente | ⏳ pendiente |
| Amenities | ⏳ pendiente | ⏳ pendiente |
| Plano | ⏳ pendiente | ⏳ pendiente |
| Video / tour virtual | ⏳ pendiente | ⏳ pendiente |

### C.7 Texto comercial

> No se copia texto literal. Solo se releva la **forma** del texto. Como el contenido no fue accesible, queda pendiente.

| Aspecto | Ejemplo 1 | Ejemplo 2 |
|---|---|---|
| Tema central | ⏳ pendiente | ⏳ pendiente |
| Beneficios que intenta vender | ⏳ pendiente | ⏳ pendiente |
| Diferenciales destacados | ⏳ pendiente | ⏳ pendiente |
| Tono usado | ⏳ pendiente | ⏳ pendiente |
| Longitud aproximada | ⏳ pendiente | ⏳ pendiente |
| Enfoque (oportunidad / ubicación / amenities / inversión / comodidad) | ⏳ pendiente | ⏳ pendiente |

### C.8 Contacto / agente

| Campo | Ejemplo 1 | Ejemplo 2 |
|---|---|---|
| Inmobiliaria / anunciante | ⏳ pendiente | ⏳ pendiente |
| Agente | ⏳ pendiente | ⏳ pendiente |
| CTA principal | ⏳ pendiente | ⏳ pendiente |
| Forma de contacto visible | ⏳ pendiente | ⏳ pendiente |

### C.9 Legal / restricciones

| Campo | Ejemplo 1 | Ejemplo 2 |
|---|---|---|
| Matrícula | ⏳ pendiente | ⏳ pendiente |
| Aviso legal | ⏳ pendiente | ⏳ pendiente |
| Disponibilidad sujeta a cambios | ⏳ pendiente | ⏳ pendiente |
| Medidas aproximadas | ⏳ pendiente | ⏳ pendiente |
| Datos a verificar | ⏳ pendiente | ⏳ pendiente |

---

## D. Comparación venta vs alquiler

Aunque el detalle de cada publicación quedó pendiente, la estructura general de campos por operación es conocida y se documenta como guía:

| Aspecto | Venta | Alquiler |
|---|---|---|
| **Datos en ambas** | tipo, zona, ambientes, dormitorios, baños, superficie, estado, fotos, contacto | igual |
| **Más importante en esta operación** | precio total, financiación, situación dominial, antigüedad, potencial de revalorización | precio mensual, expensas, requisitos (garantía/depósito), duración de contrato, política de mascotas |
| **Campos que cambian** | "precio" = monto de compra; aparece situación legal/dominial | "precio" = alquiler mensual; aparecen condiciones de alquiler (garantía, depósito, plazo, ajuste) |
| **Información que suele faltar** | expensas reales, gastos de escritura, estado dominial completo | requisitos de garantía, política de mascotas, ajuste del contrato, qué incluye la expensa |
| **Qué pedirle sí o sí a Guadalupe** | precio + moneda, expensas, estado dominial/legal, antigüedad, fotos autorizadas | alquiler + expensas, requisitos de garantía, plazo de contrato, política de mascotas, fotos autorizadas |

> En **venta** pesa el valor patrimonial y la seguridad jurídica de la operación.
> En **alquiler** pesan los costos mensuales totales y las condiciones de acceso (garantía, plazo, mascotas).

---

## E. Checklist mínimo para Guadalupe

Lista para pedirle a Guadalupe los datos de una propiedad real.

### E.1 Obligatorio

- [ ] Operación (venta / alquiler)
- [ ] Tipo de propiedad
- [ ] Barrio / zona
- [ ] Precio (con moneda)
- [ ] Ambientes
- [ ] Dormitorios
- [ ] Baños
- [ ] Superficie
- [ ] Expensas (si aplica)
- [ ] Fotos autorizadas (con permiso de uso confirmado)
- [ ] Datos de contacto de Guadalupe
- [ ] Estado de disponibilidad
- [ ] Puntos fuertes de la propiedad
- [ ] Link de referencia (si existe)

### E.2 Muy recomendable

- [ ] Diferenciales
- [ ] Amenities
- [ ] Orientación
- [ ] Antigüedad
- [ ] Estado general
- [ ] Cercanías
- [ ] Perfil de comprador / inquilino ideal
- [ ] Motivo por el que vale la pena verla

### E.3 Opcional

- [ ] Plano
- [ ] Video
- [ ] Tour virtual
- [ ] Historia de la propiedad
- [ ] Detalles de financiación
- [ ] Datos legales ampliados

---

## F. Briefing para primera oferta real

Ficha modelo en formato copiable para que Ariel o Guadalupe completen **antes** de producir una oferta. Esto NO es una oferta: es el insumo de datos.

```txt
Nombre de la propiedad:
Operación:
Tipo de propiedad:
Barrio / zona:
Precio:
Expensas:
Ambientes:
Dormitorios:
Baños:
Superficie cubierta:
Superficie total:
Estado general:
Fotos disponibles:
Permiso de uso de fotos:
Puntos fuertes:
Diferenciales:
Público ideal:
CTA deseado:
Contacto de Guadalupe:
Link de referencia:
Restricciones o datos legales:
Notas:
```

> Cuando esta ficha esté completa con una propiedad real y fotos autorizadas, recién entonces puede emitirse una orden para producir la primera oferta usando la plantilla de MC-INMO-3.

---

## G. Riesgos

| Riesgo | Descripción |
|---|---|
| **Tomar el bloqueo 403 como dato real** | la ausencia de campos es por bloqueo del portal, no porque la propiedad no los tenga |
| **Copiar de ZonaProp al completar campos** | los valores deben venir de Guadalupe o de fuente legítima, no del texto del portal |
| **Producir oferta con ficha incompleta** | sin campos obligatorios la oferta queda débil o inexacta |
| **Usar fotos sin permiso** | problema legal y de derechos de imagen |
| **Confundir checklist con oferta** | este documento define datos a pedir, no contenido publicable |
| **Avanzar sin permiso de uso de fotos** | bloquea cualquier producción real |

---

## H. Próximo microciclo recomendado

**`MC-INMO-5 — Primera oferta real con propiedad concreta de Guadalupe`**

Objetivo: tomar la ficha de briefing (sección F) completada con una propiedad real y material autorizado, y producir un primer borrador de oferta aplicando la plantilla de MC-INMO-3.

**Prerrequisito:** briefing completo + fotos con permiso de uso confirmado + tono/branding de Guadalupe. Sin esos insumos, no queda habilitado.

Alternativa si se desea releer las publicaciones de referencia:

- `MC-INMO-REF-1` — análisis de la estructura de las publicaciones de ejemplo a partir de datos aportados manualmente por Ariel (sin scraping), para completar las tablas de la sección C.

---

## I. Estado final

- **MC-INMO-4:** CERRADO (definición documental de checklist).
- **Proyecto:** `conocido / no iniciado` — sin cambio de estado.
- **Repo `szlapakariel-ux/Inmobiliaria-`:** NO tocado.
- **Publicaciones de ejemplo:** registradas · extracción de contenido `pendiente` por bloqueo 403 · datos de slug/URL relevados.
- **Contenido comercial final / oferta real:** NO creado.
- **Fotos / imágenes de terceros:** NO usadas · NO descargadas.
- **Scraping:** NO realizado.
- **`.torre/proyectos.md` · `.torre/estado.md` · `.torre/protocolo_alta_proyecto.md`:** NO modificados.
- **MC-LOC-3:** NO habilitado.

Cualquier paso hacia producción de una oferta real requiere el briefing completo (sección F) y una orden nueva de Torre.
