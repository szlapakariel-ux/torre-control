# Diagnóstico comercial y de materiales — MC-INMO-1
# Oferta personalizada inmobiliaria — Guadalupe Cabrera

> **Microciclo:** MC-INMO-1
> **Autoridad emisora:** Torre de Control
> **Tipo:** diagnóstico documental (NO implementa, NO crea contenido final, NO toca el repo del proyecto)
> **Estado del proyecto:** `conocido / no iniciado`
> **Antecedentes:** MC-ALTA-1 (`3ece45f`) · MC-ALTA-2 (`839c34a`) · MC-ALTA-3 (`337c653`, vinculación en `.torre/proyectos.md`)

---

## 1. Proyecto

| Campo | Valor |
|---|---|
| **Nombre funcional** | Oferta personalizada inmobiliaria — Guadalupe Cabrera |
| **Alias** | `inmobiliaria` · `guadalupe` · `gc-inmo` |
| **Repo del proyecto** | `szlapakariel-ux/Inmobiliaria-` (consulta read-only; estado conocido: existente · vacío) |
| **Estado actual** | `conocido / no iniciado` |
| **Responsable / fuente de verdad** | Ariel · Guadalupe Cabrera |

> El repo del proyecto **no fue modificado**. Su estado (existente, sin contenido relevante) ya fue registrado en MC-ALTA-2; este ciclo no aporta cambios técnicos sobre él.

---

## 2. Qué quiere vender Guadalupe

| Prioridad | Oferta |
|---|---|
| Principal | Su servicio como **agente inmobiliaria** |
| Principal | **Propiedades** |
| Principal | **Bundle**: agente + propiedades |
| Secundario | Captar **propietarios interesados en vender** |

---

## 3. Públicos y canales

### Públicos

- **Compradores / hot leads** — buscan propiedad concreta.
- **Propietarios interesados en vender** — captación para sumar inventario.

### Canales previstos

| Canal | Rol |
|---|---|
| **WhatsApp** | canal principal de contacto y cierre |
| **Instagram** | difusión / vidriera |
| **PDF** | pieza enviable, formato presentación |

---

## 4. Inventario de material

### Material existente informado por Ariel

- Fotos de propiedades provenientes de ZonaProp u otros portales
- Datos de propiedades: precio, ubicación, características
- Contacto y datos de Guadalupe como agente
- Posible logo o branding personal

> ⚠️ Sobre las fotos de portales: son material de origen externo. No pueden usarse como propias ni redistribuirse si están protegidas. Su uso queda condicionado a verificar derechos antes de cualquier producción.

### Material faltante / pendiente de aporte

Registrado como pendiente, sin frenar el diagnóstico:

| Material | Estado |
|---|---|
| Plantilla de Guadalupe | ⏳ pendiente de aporte |
| Publicaciones propias reales | ⏳ pendiente de aporte |
| Logo / branding confirmado | ⏳ pendiente de confirmación |
| Ejemplos concretos de propiedades | ⏳ pendiente de aporte |
| Tono de comunicación de Guadalupe | ⏳ pendiente de definición |
| Oferta o propuesta actual (si existe) | ⏳ pendiente de relevamiento |

---

## 5. Referencia externa inicial

| Campo | Valor |
|---|---|
| **URL** | `https://www.remax.com.ar/421101114-44?associate=420101136` |
| **Tipo** | referencia estratégica de mercado |
| **Estado** | pendiente de análisis detallado |

### Uso permitido

- analizar estructura comercial
- analizar jerarquía de información
- analizar bloques de una publicación inmobiliaria
- analizar tipo de llamada a la acción
- detectar qué datos conviene mostrar en una oferta profesional

### Prohibido

- ❌ copiar textos · imágenes · marca · diseño protegido
- ❌ hacer scraping automático
- ❌ descargar assets
- ❌ publicar derivados

> En este ciclo la referencia solo se **registra**. El análisis detallado de su estructura queda diferido al microciclo que lo autorice.

---

## 6. Diagnóstico inicial

### 6.1 Qué sabemos del proyecto

- Hay un objetivo comercial claro: vender servicio de agente + propiedades, con captación de propietarios como objetivo secundario.
- Hay dos públicos definidos y tres canales previstos.
- Hay repo confirmado (`szlapakariel-ux/Inmobiliaria-`), vacío.
- Hay una referencia de mercado disponible.
- El proyecto está vinculado formalmente en el mapa de Torre (MC-ALTA-3).

### 6.2 Qué falta para producir una oferta profesional

- **Material propio de Guadalupe**: plantilla, branding confirmado, tono de comunicación.
- **Propiedades concretas** con datos y fotos de uso legítimo.
- **Definición de la propuesta de valor** diferencial de Guadalupe frente a un portal.
- **Decisión de formato primario** a validar (PDF, pieza WhatsApp o Instagram).

### 6.3 Riesgos

| Riesgo | Descripción |
|---|---|
| **Copia involuntaria** | usar fotos/textos de ZonaProp/RE/MAX como propios → problema legal y de marca |
| **Avanzar sin identidad** | producir piezas sin branding ni tono de Guadalupe → genéricas, no propias |
| **Confundir referencia con plantilla** | tomar la estructura de RE/MAX como molde literal en vez de inspiración |
| **Saltar a producción** | crear PDF/Instagram final sin validar formato mínimo |
| **Material de terceros como inventario** | tratar fotos de portales como activos disponibles sin verificar derechos |

### 6.4 Qué formato inicial conviene validar primero

**Recomendación:** validar primero **una ficha de propiedad única en formato PDF/imagen**, porque:

- es el mínimo replicable,
- sirve de base adaptable a WhatsApp e Instagram,
- permite probar identidad + datos + CTA sin construir sistema,
- no requiere automatización ni repo técnico.

### 6.5 Qué NO debe hacerse todavía

- ❌ tocar el repo `szlapakariel-ux/Inmobiliaria-`
- ❌ crear app, landing, PDF final o piezas finales de Instagram
- ❌ automatizar WhatsApp
- ❌ hacer scraping
- ❌ copiar contenido de ZonaProp, RE/MAX u otras inmobiliarias
- ❌ usar imágenes de terceros como propias
- ❌ crear JSON / runtime
- ❌ tocar código / scripts / workflows / secrets / producción
- ❌ avanzar a MC-LOC-3

---

## 7. Hipótesis de oferta inicial (NO es contenido final)

Estructura **posible** a validar, a nivel documental únicamente:

1. **Portada / identidad de Guadalupe** — nombre, rol, branding, contacto.
2. **Datos clave de la propiedad** — precio, ubicación, características destacadas.
3. **Fotos seleccionadas** — de uso legítimo, curadas (no volcado de portal).
4. **Argumentos de valor** — por qué esta propiedad / por qué con Guadalupe.
5. **Llamado a WhatsApp** — CTA principal, directo.
6. **Bloque "también te acompaño si querés vender"** — captación de propietarios.
7. **Versión adaptable** — misma base declinada a PDF, WhatsApp e Instagram.

> ⚠️ Esto es una **hipótesis de estructura**, no una pieza terminada. Ningún elemento queda aprobado como contenido final por este diagnóstico.

---

## 8. Próximo microciclo recomendado

**Recomendado:** `MC-INMO-2 — Relevamiento de material propio de Guadalupe`
Objetivo: recoger plantilla, branding, tono y al menos una propiedad concreta con material de uso legítimo, para poder pasar de hipótesis a borrador validable.

Alternativas según lo que Ariel priorice:

- `MC-INMO-REF-1` — análisis documental detallado de la referencia RE/MAX (estructura, bloques, jerarquía, CTA).
- `MC-INMO-FMT-1` — definición del formato mínimo a validar primero (ficha de propiedad).

Ninguno queda habilitado automáticamente por este diagnóstico.

---

## 9. Estado final

- **MC-INMO-1:** CERRADO (diagnóstico documental).
- **Proyecto:** `conocido / no iniciado` — sin cambio de estado.
- **Repo `szlapakariel-ux/Inmobiliaria-`:** NO tocado.
- **Material propio:** pendiente de aporte.
- **Referencia externa:** registrada, análisis diferido.
- **`.torre/proyectos.md` · `.torre/estado.md` · `.torre/protocolo_alta_proyecto.md`:** NO modificados.
- **Contenido comercial final:** NO creado.
- **MC-LOC-3:** NO habilitado.

Cualquier paso hacia contenido, producción o implementación requiere una orden nueva de Torre con material propio declarado.
