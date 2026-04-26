# Mesa local — Plantilla replicable

Esta carpeta es la **plantilla oficial** de mesa local de un repositorio técnico. Sirve para copiarla a futuro dentro de cada repo bajo el nombre `.mesa/`. **No** es una mesa real ni se conecta con producción.

> Referencia conceptual: `.torre/arquitectura/modelo-mesas-locales.md`.
> Decisiones cerradas: `.torre/arquitectura/decisiones-operativas.md`.

---

## 1. Qué es una mesa local

Una mesa local es la **extensión operativa de Torre dentro de un repo técnico**. Hospeda la coordinación de tareas que viven en el scope de ese repo: pedidos, órdenes ejecutivas con anexos, revisiones, aprendizajes locales y tareas humanas.

- Vive en `.mesa/` dentro del repo técnico cuando se implemente.
- **No es runtime**: el sistema de producción no la lee, no la ejecuta, no depende de ella.
- **No toca código productivo** ni configuración ni secrets.
- **No es deploy**.
- Es donde Torre y los ejecutores conversan con trazabilidad.

---

## 2. Cuándo se crea una mesa local en un repo

**No** se crea apenas se agrega un repo a Torre. Solo se crea cuando:

1. El piloto inicial (ver `.torre/proyectos/agente-saas/`) está validado por Ariel/Torre.
2. Hay al menos un caso real con causa raíz y cierre completo.
3. El Guardián fue probado en simulación o sombra.
4. Los ejecutores autorizados están definidos.

Ver criterios completos en `.torre/proyectos/agente-saas/criterios-para-replicar.md`.

---

## 3. Estructura mínima

```
.mesa/
├── README.md                  (qué es esta mesa, alcance, reglas locales)
├── estado.md                  (tablero de tareas activas)
├── memoria.md                 (aprendizajes locales)
├── ejecutores_permitidos.md   (qué ejecutores pueden trabajar acá)
├── pedidos/                   (entrada: pedidos de Torre o internos)
├── ordenes/                   (órdenes ejecutivas con anexos)
├── revisiones/                (resultados, sign-off)
└── tareas-humanas/            (lo que requiere acción humana externa)
```

Esta plantilla replica esa estructura con archivos vacíos o de ejemplo.

---

## 4. Reglas operativas (resumen)

Para el detalle completo ver `.torre/arquitectura/modelo-mesas-locales.md`.

### 4.1 ACK / FIN
- Todo agente convocado debe emitir `[ACK_AGENTE]` antes de tomar la tarea.
- Todo agente debe cerrar su parte con `[FIN_AGENTE]` en una línea propia.
- `[FIN_AGENTE]` **no cierra** el expediente.

### 4.2 Severidades
- SEV-1 Crítico, SEV-2 Alto, SEV-3 Medio, SEV-4 Bajo.
- Si involucra cliente, dinero, legal, reputación o producción, la confirma Ariel/Torre.
- Cambios con `[CAMBIO_SEVERIDAD]`.

### 4.3 Mitigación vs solución
- Una mitigación temporal **no es** solución.
- Estados: PARCHE / MITIGACION_TEMPORAL / SOLUCION_PROPUESTA / SOLUCION_IMPLEMENTADA / CAUSA_RAIZ_IDENTIFICADA / PREVENCION_DEFINIDA / CIERRE_VALIDABLE / CIERRE_RECHAZADO.
- El cierre completo exige los 8 requisitos (ver §5 del modelo).

### 4.4 Autorizaciones sensibles
- Toda acción sensible requiere autorización explícita con `[SOLICITUD_AUTORIZACION]`.

### 4.5 Comunicación con clientes
- Borradores con `[BORRADOR_CLIENTE]`. **No se envía** al cliente real sin aprobación.

### 4.6 Memoria
- Aprendizajes técnicos del repo van en `memoria.md`.
- Aprendizajes incorrectos quedan registrados como rechazados (no se borran).

---

## 5. Responsabilidades en una mesa local

| Rol | Quién | Qué hace |
|---|---|---|
| Coordinador | Torre | Define qué + para qué. Aprueba cierre cuando severidad lo exige. |
| Guardián | Torre / agente designado | Vigila ACK, FIN, severidad, mitigación, ruido. |
| Ejecutor | Claude Code, Codex, Antigravity, Visual Codex, agentes de imagen/video, humano técnico | Toma la tarea, emite ACK, ejecuta dentro del scope, cierra con FIN. |
| Revisor | Otro ejecutor o humano | Sign-off en `revisiones/`. |
| Decisor final | Ariel/Torre | Aprueba lo sensible (ver `.torre/arquitectura/decisiones-operativas.md` §2). |

---

## 6. Cómo replicar esta plantilla en otro repo

> **No replicar todavía.** Esta sección documenta el procedimiento para cuando el modelo esté validado.

1. Verificar que el repo cumple los criterios (ver `.torre/proyectos/agente-saas/criterios-para-replicar.md`).
2. Copiar el contenido de `.torre/templates/mesa-local/` al repo destino bajo el nombre `.mesa/`.
3. Adaptar `README.md` con el contexto del repo (nombre del proyecto funcional, repo técnico, ejecutores autorizados).
4. Poblar `ejecutores_permitidos.md` con la lista real para ese repo.
5. Crear `estado.md` con las tareas reales.
6. Confirmar que `.mesa/` **no se importa** desde el código productivo. Verificar `.gitignore`, builds y deploys: la mesa no debe afectarlos.
7. Registrar en Torre que ese repo ahora tiene mesa local activa.

---

## 7. Lo que esta plantilla no es

- No es un sistema de tickets de cliente.
- No es runtime ni configuración del producto.
- No es modelo final si la decisión de Ariel/Torre cambia los criterios. Cualquier cambio se refleja primero acá y se replica luego.
- No reemplaza a `.torre/mesa-compartida/` (que es el modelo experimental V0 anterior, conservado por trazabilidad).
