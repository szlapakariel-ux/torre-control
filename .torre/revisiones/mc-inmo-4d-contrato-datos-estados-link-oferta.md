# Contrato funcional de datos y estados — MC-INMO-4D
# Link → Oferta · Oferta personalizada inmobiliaria — Guadalupe Cabrera

> **Microciclo:** MC-INMO-4D
> **Autoridad emisora:** Torre de Control
> **Tipo:** contrato funcional de datos y estados (documental; NO crea JSON, NO crea runtime, NO toca código, NO toca el repo del proyecto)
> **Estado del proyecto:** `conocido / no iniciado`
> **Antecedentes:** MC-INFRA-1 (`2118c95`) · MC-INMO-4C (`88499bb`) · MC-INMO-4B (`8865955`) · MC-INMO-4A (`008e4a9`) · MC-INMO-4 (`a14ecf1`)

---

## A. Frase madre

> ## **De link genérico a oferta profesional con tu sello.**

Norte del contrato. La estructura de datos y estados existe para servir a esta transformación.

---

## B. Objetivo del contrato

Definir la **estructura funcional de datos** para transformar un link inmobiliario en una oferta propia de Guadalupe, y las **reglas de estado** que gobiernan cuándo una oferta puede avanzar.

> ⚠️ Este ciclo **NO** crea JSON, **NO** crea runtime y **NO** toca código. Es un contrato a nivel funcional, base para futuros ciclos técnicos.

---

## C. Entidad principal: `Propiedad`

Definición funcional de la entidad `Propiedad`, con campos agrupados. Cada campo es un **nombre funcional**, no una estructura técnica.

### C.1 Identificación

| Campo | Descripción |
|---|---|
| `fuente_url` | URL del link de origen |
| `fuente_portal` | portal de origen (ZonaProp, RE/MAX, etc.) |
| `fecha_carga` | fecha de extracción o carga manual |
| `tipo_operacion` | venta / alquiler |
| `tipo_propiedad` | departamento / casa / PH / local / etc. |
| `titulo_original` | título tal como aparece en la fuente (referencia, no se publica) |
| `titulo_reescrito` | título propio generado para la oferta de Guadalupe |
| `codigo_referencia` | ID interno o MLS |
| `agente_origen` | agente/inmobiliaria de la fuente, si aparece |
| `agente_destino` | Guadalupe Cabrera (fijo) |

### C.2 Ubicación

| Campo | Descripción |
|---|---|
| `barrio` | barrio |
| `zona` | zona general |
| `direccion_visible` | dirección si está disponible |
| `ciudad` | ciudad |
| `provincia` | provincia |
| `ubicacion_aproximada` | referencia aproximada cuando no hay dirección exacta |
| `cercanias` | puntos de interés / transporte cercano |

### C.3 Precio y costos

| Campo | Descripción |
|---|---|
| `precio` | monto |
| `moneda` | USD / ARS |
| `expensas` | monto mensual |
| `impuestos` | impuestos o notas económicas |
| `financiacion` | opciones de financiamiento |
| `condiciones_alquiler` | garantía, depósito, plazo, ajuste (solo alquiler) |

### C.4 Características

| Campo | Descripción |
|---|---|
| `ambientes` | total de ambientes |
| `dormitorios` | dormitorios |
| `banos` | baños completos |
| `toilettes` | toilettes |
| `superficie_cubierta` | m² cubiertos |
| `superficie_semicubierta` | m² semicubiertos |
| `superficie_total` | m² totales |
| `antiguedad` | años o "a estrenar" / "en pozo" |
| `estado_general` | a estrenar / reciclado / habitable |
| `piso` | piso de la unidad |
| `orientacion` | orientación |
| `disposicion` | frente / contrafrente / interno |

### C.5 Comodidades

| Campo | Descripción |
|---|---|
| `balcon` | sí / no |
| `cochera` | sí / no / cantidad |
| `baulera` | sí / no |
| `terraza` | sí / no |
| `patio` | sí / no |
| `amenities` | lista de amenities |
| `seguridad` | tipo de seguridad |
| `laundry` | sí / no |
| `sum` | sí / no |
| `parrilla` | sí / no |
| `pileta` | sí / no |
| `gimnasio` | sí / no |

### C.6 Material visual

| Campo | Descripción |
|---|---|
| `fotos_detectadas` | cantidad detectada en la fuente |
| `fotos_autorizadas` | fotos con permiso de uso confirmado |
| `permiso_uso_fotos` | estado del permiso |
| `video` | sí / no |
| `tour_virtual` | sí / no |
| `plano` | sí / no |

### C.7 Comercial

| Campo | Descripción |
|---|---|
| `beneficio_principal` | una frase de valor diferencial |
| `diferenciales` | lo que hace única a la propiedad |
| `publico_ideal` | perfil del comprador/inquilino |
| `motivo_para_verla` | argumento de conversión |
| `cta_whatsapp` | llamada a la acción principal |
| `bloque_servicio_guadalupe` | texto del acompañamiento de Guadalupe |
| `bloque_captacion_propietarios` | texto de captación secundaria |

### C.8 Legal / control

| Campo | Descripción |
|---|---|
| `matricula` | matrícula del corredor |
| `corredor_responsable` | nombre del corredor habilitado |
| `disponibilidad_validada` | estado de disponibilidad confirmado |
| `datos_legales_revisados` | estado de revisión legal |
| `restricciones` | hipoteca, inhibición, situación dominial |
| `notas` | cualquier dato adicional relevante |

---

## D. Estado de cada dato

Cada campo puede tener uno de estos estados:

```txt
confirmado
pendiente
dudoso
no_disponible
requiere_validacion_humana
```

| Estado | Significado |
|---|---|
| `confirmado` | dato validado por Guadalupe o Ariel; apto para usar |
| `pendiente` | dato aún no aportado; falta cargar |
| `dudoso` | dato presente pero de confiabilidad incierta; no usar como definitivo |
| `no_disponible` | dato que no existe o no aplica para esta propiedad |
| `requiere_validacion_humana` | dato presente (típicamente extraído de la fuente) que necesita validación antes de usarse |

### Reglas de estado de dato

- Todo dato extraído de un link externo entra como `requiere_validacion_humana`, salvo que Ariel o Guadalupe lo confirmen.
- Todo dato comercial generado por IA entra como **borrador** (no es un valor definitivo).
- Ningún dato `dudoso` puede publicarse como definitivo.
- `precio`, medidas, `ubicacion`, `expensas`, `disponibilidad_validada` y datos legales **siempre** requieren validación humana, sin importar la fuente.

---

## E. Estados de la oferta

Una oferta (no un dato individual) puede tener estos estados:

```txt
borrador_inicial
datos_incompletos
lista_para_revision
revisada_por_humano
aprobada_para_uso
bloqueada
archivada
```

---

## F. Reglas de avance de estado de la oferta

| Estado | Condición de entrada |
|---|---|
| `borrador_inicial` | se crea cuando entra un link o datos manuales |
| `datos_incompletos` | faltan campos obligatorios |
| `lista_para_revision` | están presentes los campos mínimos (ver F.1) |
| `revisada_por_humano` | Ariel o Guadalupe revisaron los datos clave |
| `aprobada_para_uso` | además están validados los campos críticos (ver F.2) |
| `bloqueada` | se detecta una condición de bloqueo (ver F.3) |
| `archivada` | se decide no avanzar con la oferta |

### F.1 `lista_para_revision` requiere

- operación
- tipo de propiedad
- barrio / zona
- precio
- ambientes o superficie
- contacto de Guadalupe
- CTA
- fuente original registrada

### F.2 `aprobada_para_uso` requiere (además de la revisión humana)

- permiso de fotos
- disponibilidad
- datos legales mínimos
- precio
- medidas
- contacto

### F.3 `bloqueada` se activa si hay

- falta de permiso de fotos
- datos legales dudosos
- fuente no confiable
- intento de copiar contenido
- propiedad no autorizada

> Una oferta `bloqueada` no puede pasar a `aprobada_para_uso` hasta que se resuelva la causa del bloqueo.

---

## G. Campos obligatorios por canal

### G.1 WhatsApp

- título reescrito
- zona
- precio
- 3 datos clave
- beneficio principal
- CTA
- contacto Guadalupe
- estado de disponibilidad

### G.2 PDF

- título
- datos técnicos
- descripción comercial
- fotos autorizadas
- contacto
- aviso de validación
- datos legales mínimos

### G.3 Instagram

- gancho
- datos clave
- beneficio
- fotos autorizadas
- CTA
- bloque secundario para propietarios

### G.4 Landing futura

- título
- galería autorizada
- ficha técnica
- descripción
- CTA WhatsApp
- datos de Guadalupe
- aviso legal / validación
- estado de disponibilidad

---

## H. Validaciones obligatorias antes de uso real

- [ ] precio confirmado
- [ ] disponibilidad confirmada
- [ ] medidas confirmadas
- [ ] expensas confirmadas
- [ ] ubicación confirmada
- [ ] permiso de fotos confirmado
- [ ] contacto correcto
- [ ] matrícula / corredor responsable (si aplica)
- [ ] autorización de Guadalupe
- [ ] revisión humana final

---

## I. Alertas del sistema (funcionales futuras)

| Alerta | Se dispara cuando |
|---|---|
| `faltan_datos_obligatorios` | falta algún campo mínimo del canal |
| `foto_sin_permiso` | hay fotos sin permiso de uso confirmado |
| `precio_no_confirmado` | el precio no fue validado por humano |
| `medidas_no_confirmadas` | las medidas no fueron validadas |
| `ubicacion_dudosa` | la ubicación está en estado `dudoso` |
| `fuente_externa_no_validada` | la fuente del link no fue verificada |
| `texto_parece_copiado` | el texto se parece demasiado al original de la fuente |
| `datos_legales_pendientes` | faltan datos legales mínimos |
| `oferta_no_apta_para_publicar` | la oferta no cumple condiciones de `aprobada_para_uso` |

---

## J. Relación con Railway

Railway está registrado como **infraestructura futura disponible** por MC-INFRA-1 (`2118c95`), pero **este contrato no habilita deploy**.

Railway podrá considerarse más adelante, bajo orden técnica separada, para:

- demo
- landing
- backend simple
- entorno controlado

> No queda habilitado en este ciclo. Ningún campo ni estado de este contrato implica configurar, tocar o desplegar en Railway.

---

## K. Próximo microciclo recomendado

**`MC-INMO-4E — Especificación de landing propia Link → Oferta`**

Ese ciclo debe definir:
- estructura de la landing
- secciones
- URL pública futura
- CTA
- límites

…antes de cualquier implementación. Sigue siendo documental.

---

## L. Estado final

- **MC-INMO-4D:** CERRADO (contrato funcional de datos y estados, documental).
- **Proyecto:** `conocido / no iniciado` — sin cambio de estado.
- **Repo `szlapakariel-ux/Inmobiliaria-`:** NO tocado.
- **Railway:** NO tocado · NO configurado · NO desplegado.
- **Contrato:** definido a nivel funcional · sin JSON · sin runtime · sin código.
- **Contenido comercial final / salidas:** NO creados.
- **Fotos / contenido de terceros:** NO usados · NO descargados.
- **`.torre/proyectos.md` · `.torre/estado.md` · `.torre/protocolo_alta_proyecto.md`:** NO modificados.
- **MC-LOC-3:** NO habilitado.

Cualquier paso hacia implementación técnica requiere una orden nueva de Torre con un microciclo técnico separado.
