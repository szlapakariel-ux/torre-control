# Especificación funcional de landing propia — MC-INMO-4E
# Link → Oferta → Landing propia · Oferta personalizada inmobiliaria — Guadalupe Cabrera

> **Microciclo:** MC-INMO-4E
> **Autoridad emisora:** Torre de Control
> **Tipo:** especificación funcional de landing (documental; NO crea landing real, NO crea código, NO deploya, NO toca el repo del proyecto ni Railway)
> **Estado del proyecto:** `conocido / no iniciado`
> **Antecedentes:** MC-INMO-4D (`5940623`) · MC-INFRA-1 (`2118c95`) · MC-INMO-4C (`88499bb`) · MC-INMO-4B (`8865955`) · MC-INMO-4A (`008e4a9`)

> ## Frase madre: **De link genérico a oferta profesional con tu sello.**

---

## A. Objetivo de la landing

Definir una **landing propia de Guadalupe** para transformar una publicación inmobiliaria genérica en una presentación profesional con identidad de agente.

La landing debe servir para:

- presentar una propiedad de forma clara
- reforzar la imagen profesional de Guadalupe
- facilitar contacto por WhatsApp
- ordenar datos técnicos y comerciales
- generar confianza
- permitir compartir un **link propio** en vez de un link genérico de portal

---

## B. Concepto central

```txt
Link externo / datos de propiedad
→ ficha normalizada
→ oferta reescrita
→ landing propia de Guadalupe
→ CTA a WhatsApp
```

> La landing **NO** debe ser copia de ZonaProp, RE/MAX ni otro portal. Debe ser una **pieza nueva, revisada y con sello de Guadalupe**.

---

## C. Estructura mínima de la landing

| # | Sección |
|---|---|
| 1 | Header con identidad de Guadalupe |
| 2 | Hero de propiedad |
| 3 | Datos clave |
| 4 | Galería de fotos autorizadas |
| 5 | Descripción comercial original |
| 6 | Diferenciales de la propiedad |
| 7 | Ficha técnica |
| 8 | Ubicación / zona |
| 9 | Bloque "Guadalupe te acompaña" |
| 10 | CTA principal a WhatsApp |
| 11 | Bloque secundario para propietarios |
| 12 | Aviso de validación de datos |
| 13 | Footer con contacto y datos profesionales |

---

## D. Header

Debe incluir:

- nombre de Guadalupe Cabrera
- rol: agente inmobiliaria
- logo o marca personal (si existe)
- botón de WhatsApp
- menú simple posible:
  - propiedad
  - detalles
  - contacto

> No se define diseño visual final. Solo estructura.

---

## E. Hero de propiedad

Debe incluir:

- título comercial reescrito
- subtítulo breve
- zona / barrio
- precio
- imagen principal autorizada
- CTA visible

Estructura de ejemplo, con placeholders:

```txt
{{titulo_reescrito}}

{{tipo_propiedad}} en {{barrio}}, ideal para {{publico_ideal}}.

{{precio}} · {{ambientes}} ambientes · {{superficie_total}}

[Quiero más información por WhatsApp]
```

---

## F. Datos clave

Bloque de cards o datos:

- operación
- precio
- barrio / zona
- ambientes
- dormitorios
- baños
- superficie cubierta
- superficie total
- expensas
- apto crédito (si aplica)
- cochera (si aplica)
- amenities destacados (si aplica)

> **Regla:** si un dato está `pendiente` o `dudoso`, no debe mostrarse como definitivo.

---

## G. Galería

Galería conceptual:

- foto principal
- living
- cocina
- dormitorio
- baño
- balcón / terraza
- amenities
- fachada
- plano (si existe)

### Reglas

- ✅ solo fotos con permiso de uso confirmado
- ❌ no descargar imágenes de terceros
- ❌ no usar fotos de portales sin autorización
- ⚠️ si no hay permiso, mostrar estado **"fotos pendientes de autorización"**

---

## H. Descripción comercial

Debe usar **texto original, no copiado**.

Estructura sugerida:

1. apertura breve
2. beneficio principal
3. descripción del espacio
4. diferenciales
5. para quién puede ser ideal
6. invitación a consultar

### Debe evitar

- ❌ promesas exageradas
- ❌ "oportunidad única" sin evidencia
- ❌ texto frío de portal
- ❌ copia literal de la fuente

---

## I. Ficha técnica

Debe mostrar datos confirmados:

- operación
- tipo de propiedad
- ubicación
- precio
- expensas
- ambientes
- dormitorios
- baños
- superficie
- antigüedad
- estado general
- orientación
- disposición
- amenities
- financiación
- código de referencia
- matrícula / corredor responsable (si aplica)

Cada campo puede tener estado:

```txt
confirmado
pendiente
dudoso
no_disponible
requiere_validacion_humana
```

> Coherente con el contrato de datos de MC-INMO-4D.

---

## J. Ubicación

La landing puede mostrar:

- barrio
- zona aproximada
- cercanías relevantes
- transporte
- puntos de interés

> No mostrar dirección exacta si no está autorizada. No integrar mapas reales en este ciclo.

---

## K. Bloque de confianza

```txt
Guadalupe te acompaña en todo el proceso

Te ayudo a revisar la información, coordinar una visita y entender si esta propiedad se ajusta a lo que estás buscando.
```

> Debe reforzar que Guadalupe no solo muestra una propiedad: **acompaña la decisión**.

---

## L. CTA principal

CTA principal:

```txt
Quiero consultar por WhatsApp
```

Variantes posibles:

```txt
Coordinar una visita
Pedir más información
Consultar por esta propiedad
Hablar con Guadalupe
```

> El CTA debe dirigir a WhatsApp en una implementación futura. **Este ciclo no crea links reales ni automatización.**

---

## M. Bloque secundario para propietarios

Bloque suave:

```txt
¿Tenés una propiedad para vender?

También puedo ayudarte a presentarla de forma profesional y acompañarte durante el proceso.
```

> Objetivo: captar propietarios **sin distraer** del objetivo principal de la propiedad.

---

## N. Avisos de validación

Aviso funcional:

```txt
La información publicada debe ser revisada y validada antes de su uso comercial. Precio, disponibilidad, medidas, expensas, fotos y datos legales pueden requerir confirmación.
```

> La landing **no reemplaza** revisión legal, inmobiliaria ni comercial.

---

## O. Estados de la landing

```txt
borrador
datos_incompletos
lista_para_revision
aprobada_para_compartir
bloqueada
archivada
```

| Estado | Significado |
|---|---|
| `borrador` | generada desde link o datos iniciales |
| `datos_incompletos` | faltan datos obligatorios |
| `lista_para_revision` | tiene datos mínimos, pero falta revisión humana |
| `aprobada_para_compartir` | validada por Ariel o Guadalupe |
| `bloqueada` | faltan permisos, hay datos dudosos o riesgo legal |
| `archivada` | no se usará |

---

## P. URL futura

Opciones conceptuales (solo a nivel de idea):

```txt
/inmobiliaria/ofertas/{{slug_propiedad}}
/ofertas/{{barrio}}-{{tipo_propiedad}}-{{codigo}}
/guadalupe/{{slug_propiedad}}
```

> No se crea dominio. No se configuran rutas. No se deploya.

---

## Q. Relación con Railway

Railway queda como **infraestructura futura disponible** (MC-INFRA-1) para una demo o landing controlada.

Uso futuro posible:

- alojar landing demo
- alojar backend simple
- servir páginas de propiedades
- probar flujo Link → Oferta → Landing

Este ciclo **NO** habilita:

- ❌ servicio Railway
- ❌ deploy
- ❌ variables de entorno
- ❌ dominio
- ❌ producción
- ❌ backend
- ❌ frontend
- ❌ app

---

## R. MVP visual mínimo futuro

Qué podría incluir una primera demo futura:

- landing estática de una propiedad **ficticia**
- datos inventados claramente marcados como **demo**
- botón de WhatsApp no funcional o placeholder
- sin fotos reales o con placeholders
- sin scraping
- sin publicación real
- sin dominio propio

> Esto requerirá **otro microciclo técnico separado**.

---

## S. Riesgos

| Riesgo | Descripción |
|---|---|
| **Parecer copia de un portal** | resultado genérico, sin sello propio |
| **Usar fotos sin permiso** | problema legal y de derechos de imagen |
| **Mostrar datos no validados** | publicar precio/medidas sin confirmar |
| **Propiedad sin autorización** | presentar una propiedad sin permiso del propietario/agente |
| **Confundir demo con oferta real** | publicar datos ficticios como reales |
| **Habilitar deploy sin checklist** | desplegar sin validaciones |
| **Mezclar landing pública con datos dudosos** | exponer información incierta |
| **Avanzar a código antes de cerrar contrato visual/funcional** | implementar sin diseño validado |

---

## T. Próximo microciclo recomendado

**`MC-INMO-4F — Wireframe documental de landing propia`**

Ese ciclo debe dibujar la estructura en Markdown, con bloques y orden visual, pero **sin código y sin deploy**.

---

## U. Estado final

- **MC-INMO-4E:** CERRADO (especificación funcional de landing, documental).
- **Proyecto:** `conocido / no iniciado` — sin cambio de estado.
- **Repo `szlapakariel-ux/Inmobiliaria-`:** NO tocado.
- **Railway:** NO tocado · NO configurado · NO desplegado.
- **Landing:** especificada a nivel funcional · NO creada · sin código, frontend, backend ni runtime.
- **Contenido comercial final / salidas:** NO creados.
- **Fotos / contenido de terceros:** NO usados · NO descargados.
- **`.torre/proyectos.md` · `.torre/estado.md` · `.torre/protocolo_alta_proyecto.md`:** NO modificados.
- **MC-LOC-3:** NO habilitado.

Cualquier paso hacia wireframe con código o deploy requiere una orden nueva de Torre con un microciclo técnico separado.
