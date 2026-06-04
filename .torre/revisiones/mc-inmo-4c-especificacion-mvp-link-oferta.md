# Especificación funcional MVP — MC-INMO-4C
# Link → Oferta · Oferta personalizada inmobiliaria — Guadalupe Cabrera

> **Microciclo:** MC-INMO-4C
> **Autoridad emisora:** Torre de Control
> **Tipo:** especificación funcional documental (NO implementa código, NO crea interfaz, NO toca el repo del proyecto)
> **Estado del proyecto:** `conocido / no iniciado`
> **Antecedentes:** MC-INMO-4B (`8865955`) · MC-INMO-4A (`008e4a9`) · MC-INMO-4 (`a14ecf1`) · MC-INMO-3 (`709dfc5`) · MC-INMO-2 (`3d7f2bb`) · MC-INMO-1 (`a3e389f`)

---

## A. Frase madre

> ## **De link genérico a oferta profesional con tu sello.**

Norte funcional del MVP. Toda decisión de flujo, dato o salida debe servir a esta transformación.

---

## B. Objetivo del MVP

Definir un **flujo mínimo** que permita:

1. Recibir un link inmobiliario externo.
2. Extraer o registrar datos visibles de la propiedad.
3. Normalizar esos datos en una ficha interna.
4. Detectar faltantes o datos dudosos.
5. Reescribir la información en lenguaje propio, claro y comercial.
6. Generar una oferta revisable con identidad de Guadalupe.
7. Preparar salidas para WhatsApp, PDF e Instagram.

> ⚠️ El MVP **NO publica nada automáticamente**. Toda salida es un borrador revisable.

---

## C. Usuario principal

| Rol | Usuario | Función |
|---|---|---|
| **Principal** | Guadalupe Cabrera | agente inmobiliaria · dueña de la oferta y su sello |
| Secundario | Ariel | coordinador / operador inicial |
| Secundario | Potenciales compradores | destinatarios de la oferta |
| Secundario | Propietarios interesados en vender | objetivo de captación secundaria |

---

## D. Entrada principal del sistema

```txt
Link de publicación inmobiliaria externa
```

### Fuentes de ejemplo

- ZonaProp
- RE/MAX
- Argenprop
- MercadoLibre Inmuebles
- publicación propia previa
- link enviado por WhatsApp

> ⚠️ **El link es fuente de datos, no autorización para copiar.** Habilita leer hechos (precio, ambientes, superficie), no reproducir textos, fotos ni diseño ajenos.

---

## E. Datos que el sistema debe intentar obtener

### E.1 Datos básicos

- operación: venta / alquiler
- tipo de propiedad
- barrio / zona
- ubicación
- precio
- expensas
- ambientes
- dormitorios
- baños
- superficie cubierta
- superficie total

### E.2 Datos complementarios

- antigüedad
- estado general
- apto crédito
- financiación
- amenities
- piso
- orientación
- disposición
- cochera
- balcón
- terraza
- baulera

### E.3 Datos comerciales

- beneficio principal
- diferenciales
- público ideal
- puntos fuertes
- motivo para verla
- CTA sugerido

### E.4 Datos de control

- fuente original
- fecha de extracción o carga
- permiso de uso de fotos
- disponibilidad validada
- datos legales revisados
- contacto correcto de Guadalupe

---

## F. Estados posibles de cada dato

Cada campo de la ficha lleva un estado:

```txt
confirmado
pendiente
dudoso
no disponible
requiere validación humana
```

> **Regla:** todo dato dudoso o no validado debe aparecer **marcado**. No se pueden inventar datos. La ausencia de un dato nunca se completa con una suposición.

---

## G. Flujo funcional MVP

| Paso | Acción | Responsable |
|---|---|---|
| 1 | Usuario pega link | usuario |
| 2 | Sistema intenta leer datos visibles | sistema |
| 3 | Sistema muestra ficha normalizada | sistema |
| 4 | Sistema marca faltantes | sistema |
| 5 | Usuario completa o confirma datos | usuario |
| 6 | Sistema genera borrador de oferta | sistema |
| 7 | Usuario revisa | usuario |
| 8 | Sistema prepara salidas | sistema |
| 9 | Usuario decide si copia / envía / descarga | usuario |
| 10 | **Nada se publica automáticamente** | — |

---

## H. Salidas del MVP

### H.1 WhatsApp

- mensaje breve
- CTA claro
- tono cercano
- datos principales
- invitación a coordinar visita

### H.2 PDF

- estructura textual para ficha
- portada sugerida
- datos técnicos
- descripción comercial
- contacto de Guadalupe

### H.3 Instagram

- guion de carrusel
- textos por slide
- CTA final
- bloque secundario para propietarios

### H.4 Checklist de faltantes

- datos que faltan
- datos dudosos
- datos legales a revisar
- fotos sin permiso confirmado

---

## I. Reglas de transformación

### El sistema PUEDE

- ✅ resumir datos
- ✅ ordenar información
- ✅ detectar faltantes
- ✅ reescribir textos desde cero
- ✅ sugerir beneficios comerciales
- ✅ adaptar tono por canal
- ✅ generar borradores revisables

### El sistema NO PUEDE

- ❌ copiar texto literal de terceros
- ❌ copiar imágenes
- ❌ usar marcas ajenas como propias
- ❌ ocultar la fuente original
- ❌ inventar precio, medidas, disponibilidad o datos legales
- ❌ publicar sin revisión humana
- ❌ enviar mensajes automáticamente en esta etapa

---

## J. Revisión humana obligatoria

Antes de usar cualquier salida real, **Guadalupe o Ariel** deben validar:

- [ ] precio
- [ ] disponibilidad
- [ ] medidas
- [ ] expensas
- [ ] ubicación
- [ ] fotos y permiso de uso
- [ ] datos legales
- [ ] contacto
- [ ] tono comercial
- [ ] fuente original
- [ ] autorización para ofrecer esa propiedad

> La revisión humana es un **gate bloqueante**: sin ella, ninguna salida pasa de borrador.

---

## K. Pantallas o módulos conceptuales

Solo a nivel funcional (NO se crea interfaz en este ciclo):

| # | Módulo | Función |
|---|---|---|
| 1 | Entrada de link | recibe el link de origen |
| 2 | Ficha normalizada | muestra los datos ordenados con su estado |
| 3 | Checklist de faltantes | lista lo pendiente/dudoso |
| 4 | Editor de oferta | permite completar y ajustar |
| 5 | Vista WhatsApp | borrador del mensaje |
| 6 | Vista PDF | borrador de la ficha |
| 7 | Vista Instagram | borrador del guion |
| 8 | Panel de revisión | gate de validación humana |
| 9 | Historial de propiedades procesadas | registro de lo trabajado |

> No se crea interfaz real en este ciclo.

---

## L. MVP mínimo realista

### L.1 Incluido en la primera versión funcional futura

- carga manual de link
- extracción o carga manual asistida de datos
- ficha normalizada
- checklist de faltantes
- generación de texto WhatsApp
- generación de estructura PDF
- generación de guion Instagram
- revisión humana obligatoria

### L.2 No incluido todavía

- scraping automático avanzado
- publicación automática
- envío automático de WhatsApp
- generación visual final
- CRM
- login multiusuario
- pagos
- analytics
- integración con portales

---

## M. Riesgos

| Riesgo | Descripción |
|---|---|
| **Copiar contenido de terceros** | reproducir textos/diseño de portales en vez de reescribir |
| **Usar fotos sin permiso** | problema legal y de derechos de imagen |
| **Datos desactualizados como válidos** | publicar precio/disponibilidad vencidos |
| **Oferta sobre propiedad no autorizada** | generar una oferta sin permiso del propietario/agente |
| **Prometer resultados comerciales** | el MVP es herramienta, no garantía de venta |
| **Publicar sin revisión** | saltear el gate humano |
| **Mezclar rol de agente con rol del portal** | que la oferta parezca del portal y no de Guadalupe |
| **Automatizar antes de validar** | convertir el MVP en automatización sin probar el flujo manual |

---

## N. Criterio de éxito del MVP

El MVP es exitoso (versión inicial) si:

- ✅ Guadalupe puede pegar un link.
- ✅ El sistema devuelve una ficha ordenada.
- ✅ El sistema marca faltantes.
- ✅ El sistema genera un borrador de WhatsApp / PDF / Instagram.
- ✅ Guadalupe puede revisar y ajustar.
- ✅ La oferta resultante **parece propia de Guadalupe, no de un portal**.

---

## O. Próximo microciclo recomendado

**`MC-INMO-4D — Contrato funcional de datos y estados Link → Oferta`**

Ese ciclo debe definir:
- la estructura de datos interna
- los estados de validación
- los campos mínimos

…antes de cualquier implementación técnica. Sigue siendo documental.

---

## P. Estado final

- **MC-INMO-4C:** CERRADO (especificación funcional MVP, documental).
- **Proyecto:** `conocido / no iniciado` — sin cambio de estado.
- **Repo `szlapakariel-ux/Inmobiliaria-`:** NO tocado.
- **MVP:** especificado a nivel funcional · NO implementado · sin código, interfaz ni runtime.
- **Contenido comercial final / salidas:** NO creados.
- **Scraper / app / automatización:** NO creados.
- **Fotos / contenido de terceros:** NO usados · NO descargados.
- **`.torre/proyectos.md` · `.torre/estado.md` · `.torre/protocolo_alta_proyecto.md`:** NO modificados.
- **MC-LOC-3:** NO habilitado.

Cualquier paso hacia construcción del MVP requiere el contrato funcional de datos (MC-INMO-4D) y una orden nueva de Torre.
