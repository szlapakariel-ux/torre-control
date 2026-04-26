# Modelo de mesas locales — Arquitectura V0

Este documento define la arquitectura conceptual V0 de Torre de Control con mesas locales por repositorio, Guardián de Flujo y ejecutores intercambiables. Es el documento de referencia para la plantilla en `.torre/templates/mesa-local/` y el piloto en `.torre/proyectos/agente-saas/`.

---

## 1. Roles

### 1.1 Torre central
- Coordina, prioriza, define el qué y el para qué.
- Mantiene memoria transversal entre proyectos.
- Conserva decisión final en todo lo sensible (cliente, dinero, legal, reputación, producción).
- Vive en este repo (`torre-control`) en `.torre/`.
- **No reemplaza** a los ejecutores. **No ejecuta** trabajo técnico dentro de los repos destino.

### 1.2 Mesa local (`.mesa/`)
- Vive a futuro dentro de cada repo técnico, en la carpeta `.mesa/`.
- Es **extensión operativa de Torre**, no runtime del producto.
- No la lee el sistema en producción. No toca código productivo. No es deploy.
- Sirve para coordinar tareas técnicas dentro del scope del repo.
- Define el **cómo técnico posible** dentro de las restricciones del repo.
- Hoy, en V0, la mesa local **no existe todavía** en ningún repo. Se modela primero desde Torre con el piloto `agente-saas` (ver `.torre/proyectos/agente-saas/`).

### 1.3 Guardián de Flujo
- Vive conceptualmente en Torre.
- Controla continuidad: exige `[ACK_AGENTE]` y `[FIN_AGENTE]`, detecta bloqueos, evita falsos cierres.
- Diferencia parche, mitigación temporal y solución real.
- Controla severidad: puede recomendar cambios y alertar si un caso parece SEV-1.
- Reporta **excepciones**, no actividad normal — no genera ruido.
- Debe pasar **preflight** antes de operar.
- Modos: `simulación` → `sombra` → `activo`. Una falla menor lo baja a degradado; una crítica lo devuelve a simulación.

### 1.4 Ejecutores intercambiables
Claude Code, Codex, Antigravity, Visual Codex, agentes de imagen/video, humano técnico u otros futuros. Torre no se casa con una herramienta. La elección depende de:
- capacidad,
- disponibilidad,
- scope autorizado,
- velocidad,
- calidad,
- riesgo.

Ver `.torre/templates/mesa-local/ejecutores_permitidos.md` para el formato por repo.

### 1.5 Ariel / Torre humana
- Conserva la decisión final.
- Aprueba acciones sensibles (ver §6).
- Puede recibir comunicación por capas cuando está saturado.

---

## 2. Estructura mínima de una mesa local

Cuando un repo técnico habilite su mesa, debe tener:

```
.mesa/
├── README.md                  (qué es esta mesa, alcance, reglas)
├── estado.md                  (tablero de tareas activas)
├── memoria.md                 (aprendizajes locales)
├── ejecutores_permitidos.md   (qué ejecutores pueden trabajar acá)
├── pedidos/                   (entrada: pedidos de Torre o internos)
├── ordenes/                   (órdenes ejecutivas con anexos)
├── revisiones/                (resultados, sign-off)
└── tareas-humanas/            (lo que requiere acción humana externa)
```

La plantilla replicable está en `.torre/templates/mesa-local/`.

---

## 3. ACK y FIN

Todo agente convocado debe emitir **ACK** antes de tomar la tarea.

### 3.1 Formato `[ACK_AGENTE]`

```
[ACK_AGENTE]

TAREA:
AGENTE:
REPO:
ENTENDIDO:
PRIMER_PASO:
TIEMPO_ESTIMADO:
BLOQUEOS:
```

### 3.2 Formato `[FIN_AGENTE]`

```
[FIN_AGENTE]

TAREA:
AGENTE:
ESTADO:
QUÉ_HICE:
ARCHIVOS_REVISADOS:
ARCHIVOS_MODIFICADOS:
PR_O_COMMIT:
TESTS_O_DIAGNÓSTICO:
BLOQUEOS:
PRÓXIMO_PASO:
```

### 3.3 Reglas

- `[FIN_AGENTE]` debe ir **solo** en una línea propia. Menciones en prosa no cuentan como finalización.
- `[FIN_AGENTE]` **no cierra el expediente**. Solo indica que el agente terminó su parte. El cierre final depende de la severidad y del criterio de cierre del caso (ver §5).
- Si no hay ACK, el Guardián considera la tarea no tomada.
- Si pasa el tiempo estimado sin novedades, el Guardián recomienda escalada (no la decide solo).

---

## 4. Severidades

| Nivel | Nombre | Definición |
|---|---|---|
| **SEV-1** | Crítico | Cliente afectado, riesgo legal, dinero, turno perdido, sistema caído o daño reputacional. |
| **SEV-2** | Alto | Función importante falla, pero existe alternativa temporal. |
| **SEV-3** | Medio | Error molesto, afecta eficiencia, pero no rompe operación. |
| **SEV-4** | Bajo | Mejora, documentación, ajuste visual o limpieza. |

### 4.1 Reglas de asignación
- Severidad inicial puede sugerirla Guardián, Claude Code, Codex, mesa local o cualquier ejecutor.
- Si involucra **cliente, dinero, legal, reputación o producción**, la severidad final la confirma Ariel/Torre.
- Solo Ariel/Torre puede cambiar severidad.
- El Guardián puede recomendar cambio y alertar si parece SEV-1.

### 4.2 Formato `[CAMBIO_SEVERIDAD]`

```
[CAMBIO_SEVERIDAD]

EXPEDIENTE:
SEVERIDAD_ANTERIOR:
SEVERIDAD_NUEVA:
QUIÉN_PROPONE:
QUIÉN_APRUEBA:
MOTIVO:
EVIDENCIA_NUEVA:
FECHA:
```

Los cambios quedan en el expediente con trazabilidad.

---

## 5. Mitigación vs solución

Una mitigación temporal **no es** solución definitiva. El sistema distingue:

| Estado | Significado |
|---|---|
| `PARCHE` | Cambio mínimo que tapa el síntoma puntual. |
| `MITIGACION_TEMPORAL` | Reduce impacto pero no resuelve causa. Tiene vencimiento. |
| `SOLUCION_PROPUESTA` | Diseño aprobado, no implementado. |
| `SOLUCION_IMPLEMENTADA` | Cambio aplicado, pendiente validación. |
| `CAUSA_RAIZ_IDENTIFICADA` | Origen real diagnosticado. |
| `PREVENCION_DEFINIDA` | Cambio que evita recurrencia. |
| `CIERRE_VALIDABLE` | Cumple los 8 requisitos de cierre. |
| `CIERRE_RECHAZADO` | Falla algún requisito; el caso vuelve a abrirse. |

### 5.1 Requisitos de cierre

Para cerrar un caso debe existir:

1. Qué pasó.
2. Causa raíz.
3. Mitigación si hubo.
4. Solución aplicada o propuesta.
5. Prueba realizada.
6. Prevención.
7. Riesgos restantes.
8. Validación de Torre/Ariel según severidad.

### 5.2 Reglas extra
- Las mitigaciones temporales tienen **vencimiento** explícito.
- Patrones repetidos: primero local, luego sistémico. Si el patrón se vuelve sistémico, abre tarea macro y se congelan los parches repetidos.
- Tareas humanas externas se registran en `tareas-humanas/` de la mesa local y también en Torre.

---

## 6. Autorizaciones sensibles

Toda acción sensible requiere autorización explícita de Ariel/Torre. Acciones sensibles:

- código productivo,
- producción,
- secrets,
- variables de entorno,
- base de datos,
- deploy,
- datos de clientes reales,
- dinero,
- legal,
- reputación,
- merge a `main`,
- cambios irreversibles,
- cambios de criterio ya cerrado.

### 6.1 Formato `[SOLICITUD_AUTORIZACION]`

```
[SOLICITUD_AUTORIZACION]

EXPEDIENTE:
ACCIÓN_SOLICITADA:
POR_QUÉ_ES_NECESARIA:
RIESGO:
IMPACTO:
REVERSIBILIDAD:
PLAN_DE_REVERSA:
QUIÉN_LA_EJECUTA:
QUÉ_PASA_SI_NO_SE_AUTORIZA:
DECISIÓN_REQUERIDA:
```

### 6.2 Nivel de riesgo operativo
- Por defecto: **INTERMEDIO CONTROLADO**.
- Avanzar sin autorización solo en: documentación, arquitectura, plantillas, estructura de carpetas, ordenamiento de mesa, checklists, glosarios, criterios de replicación, PR documental sin merge, análisis de riesgos, recomendaciones.
- Frenar y reportar: cualquier acción sensible de la lista 6.

---

## 7. Comunicación con clientes

Los agentes pueden preparar borradores. **Ninguna respuesta a cliente real se envía sin aprobación de Ariel/Torre.**

### 7.1 Formato `[BORRADOR_CLIENTE]`

```
[BORRADOR_CLIENTE]

CASO:
CLIENTE_AFECTADO:
OBJETIVO_DEL_MENSAJE:
TONO_RECOMENDADO:
MENSAJE_PROPUESTO:
QUÉ_NO_DECIR:
RIESGO_LEGAL_O_REPUTACIONAL:
REQUIERE_APROBACIÓN_DE:
```

---

## 8. Memoria

- **Memoria local por repo**: vive en `.mesa/memoria.md`. Aprendizajes técnicos del repo, causas raíz repetidas, decisiones locales.
- **Memoria central**: vive en Torre. Cruza proyectos, registra decisiones macro y aprendizajes transversales.
- Aprendizajes incorrectos se conservan **rechazados con motivo**, no se borran.
- Decisiones débiles de Ariel/Torre se registran como aprendizaje de criterio + regla preventiva.
- Conflictos Torre vs mesa local se formalizan: no se resuelven en chat sin registro.

Ver formatos de propuesta y rechazo en `.torre/templates/mesa-local/memoria.md`.

---

## 9. Modos del Guardián

| Modo | Descripción |
|---|---|
| `simulación` | El Guardián observa, no actúa. Usado para validar reglas. |
| `sombra` | Recomienda en privado, sin alertar al equipo. |
| `activo` | Alerta y exige acciones (ACK, FIN, cambio de severidad). |
| `degradado` | Activo pero con capacidad reducida tras falla menor. |

Reglas:
- MVP validado por Torre/ChatGPT; operación crítica validada también por un segundo agente.
- Falla menor → modo degradado.
- Falla crítica → vuelve a simulación + reporta a Ariel/Torre.

---

## 10. Resultados esperados de un ciclo

Resultado ideal de una orden ejecutiva:
- **Issue** (en GitHub, scope claro, criterio de cierre, severidad).
- **Carpeta `revisiones/`** poblada en la mesa local con el reporte y la validación.

La mesa local **no recibe** un mensaje pelado tipo WhatsApp ni una novela imposible. Recibe **carátula clara + referencias**.

---

## 11. Referencias cruzadas

- Las 40 decisiones operativas cerradas: `.torre/arquitectura/decisiones-operativas.md`.
- Plantilla replicable de mesa local: `.torre/templates/mesa-local/`.
- Piloto modelado: `.torre/proyectos/agente-saas/`.
- Sistema postal MVP existente (orden, reporte, ciclos): `.torre/sistema.md`, `.torre/flujo.md`, `.torre/protocolo.md`.
