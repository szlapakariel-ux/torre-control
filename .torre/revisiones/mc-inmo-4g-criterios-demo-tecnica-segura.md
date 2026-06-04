# Criterios de demo técnica segura — MC-INMO-4G
# Link → Oferta → Landing propia · Oferta personalizada inmobiliaria — Guadalupe Cabrera

> **Microciclo:** MC-INMO-4G
> **Autoridad emisora:** Torre de Control
> **Tipo:** definición de criterios (documental; NO habilita demo, NO crea código, NO crea app, NO deploya, NO toca el repo del proyecto ni Railway)
> **Estado del proyecto:** `conocido / no iniciado`
> **Antecedentes:** MC-INMO-4F (`13b1bde`) · MC-INMO-4E (`59acd91`) · MC-INMO-4D (`5940623`) · MC-INFRA-1 (`2118c95`)

> ## Frase madre: **De link genérico a oferta profesional con tu sello.**

---

## A. Objetivo

Definir qué condiciones deben cumplirse **antes** de autorizar una futura demo técnica de landing inmobiliaria para Guadalupe Cabrera.

La demo futura deberá ser:

- controlada
- reversible
- sin producción real
- sin datos sensibles
- sin scraping
- sin publicación comercial real
- sin fotos de terceros sin permiso
- sin tocar clientes reales

> Este documento **NO** habilita la demo. Solo define los criterios.

---

## B. Qué sería una demo técnica segura

Una demo técnica segura podría ser, en un ciclo futuro:

- una landing estática
- con datos ficticios o claramente marcados como demo
- con fotos placeholder o imágenes autorizadas
- sin publicación comercial real
- sin dominio propio
- sin automatización
- sin scraping
- con botón de WhatsApp simulado o controlado
- desplegada **solo si Torre lo autoriza** en otro microciclo

---

## C. Objetivo de la demo futura

La demo futura debería validar:

1. Si la landing comunica mejor que un link genérico.
2. Si Guadalupe entiende el valor del formato.
3. Si la estructura funciona en celular.
4. Si el CTA a WhatsApp queda claro.
5. Si el diseño refuerza la imagen de agente.
6. Si el flujo puede repetirse para otras propiedades.

---

## D. Qué NO debe probar la demo

La demo **NO** debe probar todavía:

- ❌ scraping automático
- ❌ extracción real desde portales
- ❌ publicación automática
- ❌ envío real por WhatsApp
- ❌ CRM
- ❌ login
- ❌ pagos
- ❌ analytics
- ❌ carga masiva de propiedades
- ❌ producción
- ❌ dominio definitivo
- ❌ uso de datos reales sin autorización

---

## E. Datos permitidos para demo futura

La demo futura solo podrá usar:

| Opción | Descripción |
|---|---|
| **Opción segura 1** | datos ficticios claramente marcados como demo |
| **Opción segura 2** | datos reales aportados por Guadalupe, con autorización explícita |
| **Opción segura 3** | datos de ejemplo de portales, pero **anonimizados o transformados**, sin copiar textos ni imágenes |

> **Regla:** todo dato real debe tener permiso o validación humana antes de usarse.

---

## F. Fotos permitidas

La demo futura solo podrá usar:

- ✅ placeholders
- ✅ fotos propias de Guadalupe con permiso
- ✅ fotos libres con licencia compatible
- ✅ fotos reales de una propiedad si hay permiso confirmado

Prohibido:

- ❌ descargar fotos de ZonaProp, RE/MAX u otros portales
- ❌ usar imágenes de terceros como propias
- ❌ simular permiso de uso
- ❌ publicar fotos reales sin autorización

---

## G. WhatsApp en demo futura

El botón de WhatsApp podrá ser:

| Opción | Descripción |
|---|---|
| **Opción 1** | placeholder no funcional |
| **Opción 2** | link controlado a un número de prueba |
| **Opción 3** | link real de Guadalupe, **solo si ella lo autoriza** |

> **Regla:** no enviar mensajes automáticos.

---

## H. Railway como entorno futuro

Railway puede considerarse para una demo futura si se cumplen condiciones mínimas:

- repo técnico definido
- rama técnica definida
- app mínima revisada
- sin secrets expuestos
- sin producción real
- sin dominio definitivo
- rollback claro
- deploy autorizado por Torre
- evidencia de build local o equivalente
- checklist pre-deploy aprobado

> Este documento **NO** habilita Railway.

---

## I. Criterios mínimos antes de tocar código

Antes de cualquier ciclo técnico futuro, debe existir:

1. Documento de alcance técnico mínimo.
2. Repo confirmado: `szlapakariel-ux/Inmobiliaria-`.
3. Rama técnica definida.
4. Archivos permitidos definidos.
5. Stack sugerido definido.
6. Datos de demo definidos.
7. Política de fotos definida.
8. Política de WhatsApp definida.
9. Criterio de rollback.
10. Prohibición explícita de producción.
11. Autorización separada de Torre.

---

## J. Stack técnico futuro sugerido

Solo como **hipótesis**, no como decisión final:

- frontend simple
- landing estática o app mínima
- deploy futuro posible en Railway
- sin backend en primera demo si no es necesario
- sin base de datos en primera demo si no es necesario
- sin scraping automático
- sin autenticación en primera demo, salvo que Torre lo exija

> El stack definitivo requiere microciclo propio.

---

## K. Alcance máximo de una primera demo técnica futura

La primera demo técnica futura debería limitarse a:

- una sola landing
- una propiedad ficticia o autorizada
- un único diseño base
- un CTA controlado
- datos estáticos
- sin formularios reales
- sin base de datos
- sin login
- sin analytics
- sin automatización

---

## L. Señales de freno para demo futura

Frenar si:

- se necesitan datos reales sin permiso
- se quieren usar fotos de portales
- se intenta publicar para clientes reales
- se intenta conectar WhatsApp real sin autorización
- se intenta crear backend innecesario
- se intenta deployar sin rollback
- se intenta tocar producción
- se intenta usar secrets
- se mezclan demo y producto real

---

## M. Checklist pre-demo futura

```txt
Repo técnico confirmado:
Rama técnica definida:
Propiedad demo definida:
Datos ficticios o autorizados:
Fotos permitidas:
WhatsApp placeholder o autorizado:
Sin scraping:
Sin producción:
Sin secrets:
Sin dominio definitivo:
Rollback definido:
Archivos permitidos:
Criterio de éxito:
Autorización Torre:
```

> Esta checklist debe estar **completa y aprobada por Torre** antes de habilitar cualquier demo técnica.

---

## N. Próximo microciclo recomendado

**`MC-INMO-4H — Alcance técnico mínimo de primera demo de landing`**

Ese ciclo debe completar la checklist de la sección M con valores concretos (repo, rama técnica, archivos permitidos, stack, datos demo, política de fotos y WhatsApp, rollback, criterio de éxito) y presentarla a Torre para autorización. Sigue siendo documental: define el alcance, no implementa.

> Ningún paso queda habilitado automáticamente por este ciclo.

---

## O. Estado final

- **MC-INMO-4G:** CERRADO (definición de criterios de demo técnica segura, documental).
- **Proyecto:** `conocido / no iniciado` — sin cambio de estado.
- **Repo `szlapakariel-ux/Inmobiliaria-`:** NO tocado.
- **Railway:** NO tocado · NO configurado · NO desplegado · NO habilitado.
- **Demo técnica:** NO habilitada · solo criterios definidos.
- **Código / app / frontend / backend / runtime:** NO creados.
- **Datos reales / fotos de terceros:** NO usados.
- **`.torre/proyectos.md` · `.torre/estado.md` · `.torre/protocolo_alta_proyecto.md`:** NO modificados.
- **MC-LOC-3:** NO habilitado.

Cualquier demo técnica requiere completar la checklist (sección M), una orden nueva de Torre y un microciclo técnico separado con autorización explícita.
