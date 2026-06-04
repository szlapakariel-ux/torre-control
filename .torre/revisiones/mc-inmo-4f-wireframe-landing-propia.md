# Wireframe documental de landing propia — MC-INMO-4F
# Link → Oferta → Landing propia · Oferta personalizada inmobiliaria — Guadalupe Cabrera

> **Microciclo:** MC-INMO-4F
> **Autoridad emisora:** Torre de Control
> **Tipo:** wireframe documental (Markdown; NO es diseño final, NO es código, NO deploya, NO toca el repo del proyecto ni Railway)
> **Estado del proyecto:** `conocido / no iniciado`
> **Antecedentes:** MC-INMO-4E (`59acd91`) · MC-INMO-4D (`5940623`) · MC-INFRA-1 (`2118c95`) · MC-INMO-4C (`88499bb`)

> ## Frase madre: **De link genérico a oferta profesional con tu sello.**

---

## A. Objetivo del wireframe

Definir la **estructura visual y funcional** de una landing propia de Guadalupe Cabrera para presentar una propiedad de forma profesional.

Debe servir para mostrar:

- identidad de Guadalupe
- propiedad destacada
- datos clave
- fotos autorizadas
- descripción comercial original
- CTA a WhatsApp
- bloque de confianza
- captación secundaria de propietarios
- aviso de validación de datos

> Este wireframe **NO** es diseño final, **NO** es código y **NO** habilita deploy.

---

## B. Principio de diseño

> La landing debe parecer una **presentación propia de Guadalupe**, no una ficha copiada de ZonaProp, RE/MAX u otro portal.

Debe transmitir:

- claridad
- confianza
- profesionalismo
- cercanía
- acompañamiento
- acción concreta por WhatsApp

---

## C. Wireframe general

```txt
┌──────────────────────────────────────────────┐
│ HEADER                                       │
│ Guadalupe Cabrera · Agente inmobiliaria      │
│ [WhatsApp]                                   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ HERO                                         │
│ Título comercial de la propiedad             │
│ Subtítulo / beneficio principal              │
│ Precio · zona · ambientes · superficie       │
│ [Quiero consultar por WhatsApp]              │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ GALERÍA                                      │
│ Foto principal + miniaturas autorizadas      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ DATOS CLAVE                                  │
│ Precio | Ambientes | Baños | m² | Expensas   │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ DESCRIPCIÓN COMERCIAL                        │
│ Texto original reescrito                     │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ DIFERENCIALES                                │
│ 3 a 5 puntos fuertes                         │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ FICHA TÉCNICA                                │
│ Datos confirmados · pendientes marcados      │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ UBICACIÓN / ZONA                             │
│ Barrio · cercanías (sin dirección exacta)    │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ GUADALUPE TE ACOMPAÑA                        │
│ Bloque de confianza                          │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ CTA FINAL                                    │
│ [Hablar con Guadalupe]                       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ ¿TENÉS UNA PROPIEDAD PARA VENDER?            │
│ Bloque secundario                            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ AVISO DE VALIDACIÓN                          │
│ Datos sujetos a revisión                     │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ FOOTER                                       │
│ Contacto · datos profesionales · aviso       │
└──────────────────────────────────────────────┘
```

---

## D. Versión mobile-first

Orden recomendado para celular (WhatsApp es el canal principal):

1. Header compacto
2. Foto principal
3. Título + precio + zona
4. CTA WhatsApp visible
5. Datos clave
6. Galería
7. Descripción corta
8. Diferenciales
9. Bloque de confianza
10. CTA final
11. Captación secundaria
12. Aviso de validación

> El CTA a WhatsApp debe estar visible temprano (paso 4) y repetirse al final (paso 10).

---

## E. Versión desktop

Estructura posible:

```txt
┌───────────────────────────┬──────────────────┐
│ COLUMNA PRINCIPAL         │ COLUMNA LATERAL  │
│                           │ (sticky)         │
│ · Galería                 │ · Datos clave    │
│ · Descripción             │ · Precio         │
│ · Diferenciales           │ · [CTA WhatsApp] │
│ · Ficha técnica           │ · Contacto       │
│                           │   Guadalupe      │
└───────────────────────────┴──────────────────┘
```

- columna principal con fotos, descripción y diferenciales
- columna lateral sticky con datos clave y CTA
- bloque de Guadalupe visible arriba y abajo
- footer con contacto y aviso

> No se crea diseño visual final.

---

## F. Componentes funcionales

| Componente | Contenido |
|---|---|
| **Header** | nombre de Guadalupe · rol · botón WhatsApp |
| **Hero** | título reescrito · beneficio principal · datos resumidos · CTA |
| **Galería** | fotos autorizadas · placeholders si no hay permiso |
| **Datos clave** | cards o lista de información principal |
| **Ficha técnica** | datos confirmados · datos pendientes marcados |
| **Descripción** | texto original reescrito · sin copia de terceros |
| **Diferenciales** | 3 a 5 puntos fuertes |
| **Bloque Guadalupe** | acompañamiento · confianza · contacto |
| **CTA WhatsApp** | consulta · visita · más información |
| **Bloque propietarios** | captación secundaria suave |
| **Aviso** | validación de datos |

---

## G. Estados visuales

Cómo debería mostrarse cada estado de dato (coherente con el contrato de MC-INMO-4D):

```txt
confirmado                  → mostrar normal
pendiente                   → mostrar como "pendiente de confirmación"
dudoso                      → no mostrar como definitivo
no_disponible               → ocultar o marcar como no disponible
requiere_validacion_humana  → mostrar alerta interna, no pública
```

> Una landing pública futura **solo debería mostrar datos `confirmado` o `aprobado`**. Los estados intermedios son para uso interno de revisión, no para el visitante.

---

## H. Placeholders permitidos

```txt
{{nombre_agente}}
{{telefono_agente}}
{{titulo_reescrito}}
{{beneficio_principal}}
{{tipo_propiedad}}
{{barrio}}
{{zona}}
{{precio}}
{{ambientes}}
{{dormitorios}}
{{banos}}
{{superficie_total}}
{{superficie_cubierta}}
{{expensas}}
{{diferencial_1}}
{{diferencial_2}}
{{diferencial_3}}
{{cta_whatsapp}}
{{aviso_validacion}}
```

---

## I. Copy de ejemplo con datos ficticios

> ⚠️ **Datos ficticios — no publicar.** No se usan datos reales de portales.

```txt
Departamento 2 ambientes en Palermo

Una opción luminosa y funcional para quienes buscan vivir cerca de todo, con espacios cómodos y buena conexión.

USD 118.000 · 2 ambientes · 48 m²

[Consultar por WhatsApp]
```

> Este ejemplo es solo ilustrativo del tono y la estructura. Los valores son inventados.

---

## J. Reglas de contenido

- ❌ no copiar textos de terceros
- ❌ no usar fotos sin permiso
- ❌ no usar marcas de portales como propias
- ❌ no prometer resultados comerciales
- ❌ no publicar datos no validados
- ❌ no mostrar dirección exacta sin autorización
- ❌ no usar "oportunidad única" sin evidencia
- ❌ no convertir demo en oferta real

---

## K. Relación con Railway

Railway queda como **infraestructura futura posible** para demo o landing (MC-INFRA-1), pero este wireframe **NO** habilita:

- ❌ servicio Railway
- ❌ deploy
- ❌ dominio
- ❌ variables
- ❌ backend
- ❌ frontend
- ❌ producción

---

## L. Próximo microciclo recomendado

**`MC-INMO-4G — Criterios de demo técnica segura para landing inmobiliaria`**

Ese ciclo debe definir las **condiciones mínimas** para una futura demo técnica, todavía **antes de tocar código**.

---

## M. Estado final

- **MC-INMO-4F:** CERRADO (wireframe documental).
- **Proyecto:** `conocido / no iniciado` — sin cambio de estado.
- **Repo `szlapakariel-ux/Inmobiliaria-`:** NO tocado.
- **Railway:** NO tocado · NO configurado · NO desplegado.
- **Landing:** dibujada a nivel wireframe · NO creada · sin código, frontend, backend ni runtime.
- **Datos del copy de ejemplo:** ficticios · marcados como "no publicar".
- **Contenido de terceros:** NO copiado · fotos NO descargadas.
- **`.torre/proyectos.md` · `.torre/estado.md` · `.torre/protocolo_alta_proyecto.md`:** NO modificados.
- **MC-LOC-3:** NO habilitado.

Cualquier paso hacia demo técnica o código requiere una orden nueva de Torre con un microciclo técnico separado.
