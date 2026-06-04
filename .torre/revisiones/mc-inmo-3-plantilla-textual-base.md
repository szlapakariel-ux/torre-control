# Plantilla textual base — MC-INMO-3
# Oferta personalizada inmobiliaria — Guadalupe Cabrera

> **Microciclo:** MC-INMO-3
> **Autoridad emisora:** Torre de Control
> **Tipo:** definición documental de plantilla textual (NO es contenido final, NO toca el repo del proyecto)
> **Estado del proyecto:** `conocido / no iniciado`
> **Antecedentes:** MC-INMO-1 (`a3e389f`) · MC-INMO-2 (`3d7f2bb`) · MC-ALTA-3 (`337c653`)

> ⚠️ **Esta plantilla NO es contenido final.** Es un modelo reutilizable con variables y bloques editables. Ningún texto de este documento debe publicarse sin reemplazar las variables con datos reales verificados y obtener los permisos correspondientes.

---

## 1. Objetivo de la plantilla

Proveer una estructura textual base para que Guadalupe pueda presentar propiedades de forma:

- **profesional** — con estructura clara y lenguaje de agente, no de portal
- **clara** — datos precisos, sin ruido ni relleno
- **cercana** — tono humano, de "te acompaño", no de ficha fría
- **replicable** — mismo esquema aplicable a cualquier propiedad con solo cambiar las variables
- **propia de Guadalupe** — que refleje su identidad como agente, no una copia anónima
- **no copiada de portales** — inspirada en estructura de mercado, pero con texto y tono propios

---

## 2. Principio comercial

La oferta debe vender **tres cosas al mismo tiempo**, en este orden de prioridad:

1. **La propiedad** — datos, fotos, valor diferencial.
2. **El acompañamiento de Guadalupe como agente** — confianza, proceso, experiencia.
3. **La captación de propietarios** (secundario) — "si querés vender, también puedo ayudarte".

### Cómo debe sonar

✅ **Sí:**
- "Te muestro una propiedad que puede ser exactamente lo que buscás."
- "Te acompaño a decidir sin presión."
- "Si estás buscando comprar o vender, puedo ayudarte en todo el proceso."

❌ **No:**
- Ficha fría de portal (solo datos técnicos, sin voz)
- Copia de ZonaProp o RE/MAX (lenguaje institucional genérico)
- Promesas exageradas ("la mejor del mercado", "oportunidad única")
- Texto robótico ("la unidad se encuentra ubicada en la localidad de...")

---

## 3. Variables reutilizables

### Obligatorias

```
{{nombre_agente}}          — Ej: Guadalupe Cabrera
{{telefono_agente}}        — Ej: +54 9 11 XXXX-XXXX
{{zona}}                   — Ej: Palermo, Belgrano, Villa Urquiza
{{barrio}}                 — Ej: Palermo Soho
{{tipo_propiedad}}         — Ej: departamento, PH, casa, local
{{operacion}}              — Ej: venta, alquiler
{{precio}}                 — Ej: USD 120.000 / $ 850.000/mes
{{ambientes}}              — Ej: 3 ambientes
{{dormitorios}}            — Ej: 2 dormitorios
{{banos}}                  — Ej: 1 baño
{{superficie_cubierta}}    — Ej: 65 m²
{{superficie_total}}       — Ej: 80 m² (con balcón)
{{estado_propiedad}}       — Ej: a estrenar, reciclado, a reciclar
{{beneficio_principal}}    — Ej: "luz natural todo el día, piso alto con vista"
{{diferencial_1}}          — Ej: "Cocina integrada renovada"
{{diferencial_2}}          — Ej: "Balcón amplio orientado al norte"
{{diferencial_3}}          — Ej: "Edificio con portero 24h"
{{cta_whatsapp}}           — Ej: "Escribime al XXXXXX y coordinamos una visita"
```

### Opcionales

```
{{expensas}}               — Ej: Expensas: $45.000/mes
{{amenities}}              — Ej: Pileta, gimnasio, SUM
{{cochera}}                — Ej: Cochera incluida / opcional $X
{{orientacion}}            — Ej: Frente / contrafrente / lateral
{{piso}}                   — Ej: Piso 4 de 8
{{antiguedad}}             — Ej: 10 años
{{link_propiedad}}         — Link de referencia si existe
{{diferencial_4}}          — Cuarto diferencial si aplica
{{nota_legal}}             — Aviso sobre datos a verificar, si aplica
```

---

## 4. Plantilla textual madre

> Todos los textos entre `{{}}` son variables. Todo lo demás es estructura modelo.  
> El texto en *cursiva* son indicaciones internas, no texto a publicar.

---

### BLOQUE 1 — Encabezado / identidad de Guadalupe

```
{{nombre_agente}}
Agente inmobiliaria
📱 {{telefono_agente}}
```

*Este bloque va en portada de PDF, pie de carrusel de Instagram y firma de WhatsApp.*

---

### BLOQUE 2 — Título comercial

```
[Título de gancho — no técnico]

Ejemplo estructural:
"{{ambientes}} en {{zona}} con {{beneficio_principal}}"
"{{tipo_propiedad}} ideal para [perfil del comprador] en {{barrio}}"
```

*El título debe describir la experiencia de vivir ahí, no solo los datos.*

---

### BLOQUE 3 — Datos clave (línea de resumen)

```
📍 {{zona}} · {{barrio}}
🏠 {{tipo_propiedad}} en {{operacion}}
💰 {{precio}}
📐 {{superficie_cubierta}} cubiertos / {{superficie_total}} totales
🛏 {{dormitorios}} · 🚿 {{banos}}
✨ {{estado_propiedad}}
```

*{{expensas}}, {{cochera}}, {{piso}}, {{orientacion}} se agregan solo si suman valor.*

---

### BLOQUE 4 — Beneficio principal

```
Lo que hace diferente a esta propiedad:
{{beneficio_principal}}
```

*Una sola frase. No listar todo. El objetivo es crear deseo antes de que el comprador llegue a los datos técnicos.*

---

### BLOQUE 5 — Descripción orientada a valor

```
[Apertura — describir la experiencia de la propiedad en 2-3 líneas]

Ejemplo estructural:
"Entrás y se nota: [experiencia sensorial o práctica]. [Característica destacada que impacta en la vida diaria]. 
[Dato de contexto del barrio o edificio que sume valor]."
```

*Tono conversacional. Hablar de cómo se vive, no de metros cuadrados.*

---

### BLOQUE 6 — Diferenciales

```
✅ {{diferencial_1}}
✅ {{diferencial_2}}
✅ {{diferencial_3}}
[✅ {{diferencial_4}} — opcional]
```

*Máximo 4 diferenciales. Cada uno en una línea. Concretos, no genéricos.*

---

### BLOQUE 7 — Detalles técnicos

```
Datos de la propiedad:
- Tipo: {{tipo_propiedad}}
- Operación: {{operacion}}
- Superficie cubierta: {{superficie_cubierta}}
- Superficie total: {{superficie_total}}
- Ambientes: {{ambientes}}
- Dormitorios: {{dormitorios}}
- Baños: {{banos}}
- Estado: {{estado_propiedad}}
[- Expensas: {{expensas}}]
[- Amenities: {{amenities}}]
[- Cochera: {{cochera}}]
[- Piso: {{piso}} · Orientación: {{orientacion}}]
[- Antigüedad: {{antiguedad}}]
```

*Los campos entre `[]` son opcionales: incluir solo si aplican y suman.*

---

### BLOQUE 8 — Llamado a la acción (CTA)

```
¿Te interesa conocerla?
{{cta_whatsapp}}
```

*Directo, sin fricción. No pedir que "completen formulario" ni redireccionar a portal.*

---

### BLOQUE 9 — Acompañamiento de Guadalupe

```
Mi trabajo es acompañarte en cada paso:
desde la primera visita hasta la firma.
Sin presión. Con toda la información que necesitás.

— {{nombre_agente}}, agente inmobiliaria
📱 {{telefono_agente}}
```

---

### BLOQUE 10 — Captación de propietarios (secundario)

```
¿Tenés una propiedad para vender?
También puedo ayudarte a mostrarla y encontrar el comprador adecuado.
Escribime y te cuento cómo trabajo.
```

---

## 5. Versión WhatsApp

> Tres variantes según el momento del contacto. Todas deben ser cortas, directas y con CTA claro.

### Variante 1 — Directa (primera presentación)

```
Hola [nombre]! 👋
Te comparto una propiedad que puede interesarte:

{{tipo_propiedad}} en {{zona}}
💰 {{precio}} | 🛏 {{dormitorios}} | 📐 {{superficie_cubierta}}
{{beneficio_principal}}

✅ {{diferencial_1}}
✅ {{diferencial_2}}

¿Querés que coordinemos una visita?
```

### Variante 2 — Consultiva (para leads que ya mostraron interés)

```
Hola [nombre], te paso los datos de la propiedad que te comenté:

📍 {{zona}} — {{tipo_propiedad}} en {{operacion}}
💰 {{precio}} · {{ambientes}} · {{superficie_cubierta}}
{{beneficio_principal}}

Podemos coordinar para que la conozcas cuando quieras.
¿Cuándo te queda bien?
```

### Variante 3 — Seguimiento (para contacto anterior sin respuesta)

```
Hola [nombre]! Quería saber si pudiste revisar la propiedad que te mandé.
Si tenés alguna pregunta o querés conocerla, estoy disponible para acompañarte.
Cualquier cosa, escribime. 😊
```

---

## 6. Versión PDF

> Textos modelo por sección. No crear PDF real en este ciclo.

### Portada

```
[Foto principal de la propiedad — ocupa toda la portada]

{{tipo_propiedad}} en {{zona}}
{{operacion}} · {{precio}}

{{nombre_agente}} · Agente inmobiliaria
{{telefono_agente}}
```

### Introducción

```
Esta propiedad puede ser exactamente lo que estás buscando.
[1-2 líneas describiendo la experiencia de vivir ahí.]
Recorrela con calma. Estoy para acompañarte en cada pregunta.
```

### Ficha de datos

```
📍 Ubicación: {{zona}}, {{barrio}}
🏠 Tipo: {{tipo_propiedad}} | Operación: {{operacion}}
💰 Precio: {{precio}}
📐 Sup. cubierta: {{superficie_cubierta}} | Sup. total: {{superficie_total}}
🛏 Dormitorios: {{dormitorios}} | 🚿 Baños: {{banos}}
🏢 Ambientes: {{ambientes}} | Estado: {{estado_propiedad}}
[Expensas: {{expensas}}]
[Amenities: {{amenities}}]
```

### Descripción comercial

```
[Texto de 3-5 líneas. Tono propio de Guadalupe. Describir cómo se vive la propiedad,
no solo sus especificaciones técnicas. Incluir contexto del barrio si suma.]
```

### Diferenciales

```
Lo que hace especial a esta propiedad:

✅ {{diferencial_1}}
✅ {{diferencial_2}}
✅ {{diferencial_3}}
```

### Por qué verla

```
[1-2 razones concretas por las que vale la pena visitar esta propiedad antes de decidir.]
```

### Cómo acompaña Guadalupe

```
No trabajo para cerrar ventas. Trabajo para que tomes la mejor decisión.
Te acompaño desde la primera visita, te explico todo el proceso
y estoy disponible para cualquier duda antes, durante y después.

— {{nombre_agente}}
📱 {{telefono_agente}}
```

### Cierre con CTA

```
¿Te gustaría conocerla?
Escribime y coordinamos una visita a tu ritmo.
📱 {{cta_whatsapp}}
```

---

## 7. Versión Instagram (carrusel)

> Textos modelo por slide. No crear publicaciones reales en este ciclo.

| Slide | Tipo | Texto modelo |
|---|---|---|
| 1 | **Gancho / portada** | `"{{tipo_propiedad}} en {{zona}} 👇"` / `"¿Buscás en {{zona}}? Mirá esto 👇"` |
| 2 | **Foto principal / promesa** | `"{{beneficio_principal}}. Y tiene mucho más."` |
| 3 | **Datos clave** | `📍 {{zona}} · 💰 {{precio}} · 🛏 {{dormitorios}} · 📐 {{superficie_cubierta}}` |
| 4 | **Beneficios** | `✅ {{diferencial_1}} / ✅ {{diferencial_2}} / ✅ {{diferencial_3}}` |
| 5 | **Detalles / ambiente** | `[Foto de ambientes con texto breve sobre lo que se ve]` |
| 6 | **Ubicación** | `"En el corazón de {{barrio}}. [Dato de barrio que sume valor]."` |
| 7 | **CTA** | `"¿Querés conocerla? Escribime por WhatsApp 👇" + {{telefono_agente}}` |
| 8 | **Captación secundaria** | `"¿Tenés una propiedad para vender? También puedo ayudarte. Hablemos."` |

---

## 8. Bloque para captar propietarios

> Tres variantes según el tono de la comunicación.

### Variante 1 — Suave

```
¿Tenés una propiedad que querés vender o alquilar?
Puedo ayudarte a mostrarla de forma profesional y encontrar el comprador o inquilino adecuado.
Sin compromiso — hablemos y te cuento cómo trabajo.
📱 {{telefono_agente}}
```

### Variante 2 — Profesional

```
¿Estás pensando en vender o alquilar tu propiedad?
Trabajo con discreción, presentaciones propias y acompañamiento en todo el proceso.
Escribime para coordinar una consulta sin costo.
{{nombre_agente}} · {{telefono_agente}}
```

### Variante 3 — Comercial moderada

```
¿Tu propiedad todavía no encontró comprador?
Quizás falta la presentación correcta.
Trabajo con fotos seleccionadas, textos propios y difusión en canales clave.
Hablemos: {{telefono_agente}}
```

---

## 9. Tono recomendado

### Palabras y frases a usar

- "te acompaño"
- "coordinamos una visita"
- "sin presión"
- "podés consultar cuando quieras"
- "lo que hace especial a esta propiedad"
- "luz natural", "espacios amplios", "bien distribuido"
- "a pasos de [referencia del barrio]"
- "ideal para [perfil concreto]"

### Palabras y frases a evitar

- "unidad" (reemplazar por el tipo de propiedad)
- "se encuentra ubicado/a en" (reemplazar por descripción directa)
- "oportunidad única", "no te lo pierdas"
- "precio a convenir" sin más contexto
- "a la brevedad"
- "cualquier consulta no dudes en contactarme"
- lenguaje de portal: "la propiedad cuenta con..."
- promesas de resultado: "se vende rápido", "gran demanda"

### Estilo general

- **Voz activa**, no pasiva.
- **Oraciones cortas**. Máximo 2 líneas por párrafo en versión digital.
- **Tono cercano pero profesional** — como una persona que sabe lo que hace y explica sin apurar.
- **Primera persona** cuando habla Guadalupe, segunda persona cuando habla a la audiencia.
- **Un solo CTA por pieza** — no pedir múltiples acciones al mismo tiempo.

---

## 10. Reglas legales y de cuidado

Todo texto que vaya a publicarse como contenido final debe verificar, antes de publicar:

| Dato | Verificación requerida |
|---|---|
| **Precio** | Confirmado con el vendedor/propietario al momento de publicar |
| **Disponibilidad** | Propiedad activa, no ya vendida o alquilada |
| **Medidas** | Confirmadas por plano o escritura, no de memoria |
| **Expensas** | Monto actual, no estimado |
| **Ubicación** | Dirección exacta o zona autorizada a publicar |
| **Datos legales** | Sin deudas, situación dominial sin conflictos conocidos |
| **Permiso de fotos** | Autorización del propietario o fuente con derechos |
| **Autorización para publicar** | Confirmada con el propietario o Guadalupe |
| **Contacto** | Número y nombre verificados, activos |

> ⚠️ Esta plantilla usa variables de ejemplo. **Ningún dato de esta plantilla es real ni verificado.** El contenido final debe generarse con datos reales aportados por Guadalupe.

---

## 11. Riesgos

| Riesgo | Descripción |
|---|---|
| **Copiar textos de terceros** | Usar texto de ZonaProp, RE/MAX u otro portal sin reescribir → problema de derechos y marca |
| **Sonar como portal** | Mantener lenguaje frío y técnico → pieza genérica que no representa a Guadalupe |
| **Usar fotos sin permiso** | Descargar fotos de portales o listados ajenos → problema legal y de propiedad intelectual |
| **Prometer resultados no verificables** | "Se vende rápido", "gran demanda" → exposición a reclamos comerciales |
| **Textos demasiado largos** | Más de 5-6 líneas por bloque en digital → baja tasa de lectura, pierde impacto |
| **Convertir plantilla en contenido final sin datos reales** | Publicar la plantilla con `{{variables}}` sin reemplazar → error visible y daño de imagen |
| **Mezclar públicos sin jerarquía** | Hablarle al mismo tiempo a compradores y propietarios sin separar bloques → mensaje confuso |

---

## 12. Próximo microciclo recomendado

**`MC-INMO-4 — Checklist de datos por propiedad y briefing para primera oferta real`**

Objetivo: definir el formulario o checklist que Ariel/Guadalupe completa por cada propiedad, para que cada nueva oferta pueda generarse rellenando variables sin partir de cero.

Incluirá:
- campos obligatorios por propiedad
- campos opcionales
- criterio para validar si hay suficiente material para producir una oferta
- briefing mínimo para la primera oferta real cuando el material esté disponible

Este microciclo sigue siendo **documental**: no crea contenido final ni toca el repo del proyecto.

---

## 13. Estado final

- **MC-INMO-3:** CERRADO (plantilla textual base documental).
- **Proyecto:** `conocido / no iniciado` — sin cambio de estado.
- **Repo `szlapakariel-ux/Inmobiliaria-`:** NO tocado.
- **Contenido comercial final:** NO creado — esta plantilla es modelo con variables, no pieza publicable.
- **`.torre/proyectos.md` · `.torre/estado.md` · `.torre/protocolo_alta_proyecto.md`:** NO modificados.
- **MC-LOC-3:** NO habilitado.

Cualquier uso de esta plantilla para generar contenido real requiere datos verificados aportados por Guadalupe y autorización explícita de Torre para avanzar a producción.
