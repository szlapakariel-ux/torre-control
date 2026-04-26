# espejo-mesa-local.md — Cómo se vería `.mesa/` real en agente-saas

Este documento es **espejo / modelo**. Describe cómo debería verse la futura `.mesa/` dentro del repo `agente-saas` el día que se cree. **No crea** la mesa real.

> Plantilla replicable: `.torre/templates/mesa-local/`.
> Decisiones que la afectan: [`decisiones.md`](./decisiones.md).

---

## 1. Estructura esperada

```
agente-saas/
└── .mesa/
    ├── README.md                  (adaptado al contexto Secretaria / agente-saas)
    ├── estado.md                  (con 001 y 002 al inicio)
    ├── memoria.md                 (vacía al crear, se va llenando)
    ├── ejecutores_permitidos.md   (Claude Code activo, Codex alternativa, humano técnico activo)
    ├── pedidos/                   (entrada de pedidos desde Torre)
    ├── ordenes/                   (órdenes ejecutivas con anexos)
    ├── revisiones/                (resultados de 001 y posteriores)
    └── tareas-humanas/            (lo que requiera acción de Ariel u otra persona)
```

## 2. Contenido inicial esperado

### 2.1 `.mesa/README.md`
Adaptado de `.torre/templates/mesa-local/README.md` con:
- Proyecto funcional: Secretaria.
- Repo técnico: `szlapakariel-ux/agente-saas`.
- Aclaración de relación con `data/README_COMPARTIDA.md` (D-003 de [`decisiones.md`](./decisiones.md)).
- Aclaración de que la mesa **no se importa** desde el código productivo.

### 2.2 `.mesa/estado.md`
Versión local del tablero, con 001 y 002 como están en este piloto (ver [`estado.md`](./estado.md) acá).

### 2.3 `.mesa/memoria.md`
Empieza vacía. Cuando 001 cierre con causa raíz, ese aprendizaje se sube acá. Si la causa es transversal (ej. patrón de timezone que también afecta a otros recordatorios o agendas), se eleva a memoria central de Torre.

### 2.4 `.mesa/ejecutores_permitidos.md`
Lista propuesta inicial:

| Ejecutor | Estado | Scope | Notas |
|---|---|---|---|
| Claude Code | activo | `.mesa/`, `app/services/`, `app/cron/` (lectura amplia, escritura solo en rama nueva con `[skip torre]`), sin merges, sin secrets | Primera opción para 001. |
| Codex | activo | mismo scope | Alternativa cuando Claude no esté disponible. |
| Humano técnico (Ariel u otro) | activo | full scope | Para revisión y aprobación final. |
| Antigravity / Visual Codex / agente imagen-video | sombra | a definir | No se invocan todavía en `agente-saas`. |

### 2.5 `pedidos/`, `ordenes/`, `revisiones/`, `tareas-humanas/`
Vacíos al crear. Se llenan a medida que avanzan los ciclos.

## 3. Lo que el día de creación NO va a hacer este PR

> Este documento describe el destino. **No lo ejecuta.**

Cuando se ejecute (en un PR futuro, en el repo `agente-saas`):

- Se copiará `.torre/templates/mesa-local/` → `.mesa/` en `agente-saas`.
- Se adaptarán los README y `ejecutores_permitidos.md` con el contexto real.
- Se poblará `estado.md` con 001 y 002.
- Se documentará la coexistencia o reemplazo de `data/README_COMPARTIDA.md` (D-003).
- Se confirmará que `.mesa/` queda fuera del runtime (no se importa, no se incluye en builds, no rompe deploys).

Nada de esto pasa en este PR.

## 4. Verificaciones a hacer cuando se cree la mesa real

| Verificación | Cómo |
|---|---|
| `.mesa/` no se importa desde código de producción | grep en el repo. |
| `.mesa/` no entra en bundles ni Docker images salvo si es necesario por deploy | revisar `.dockerignore`, build configs, CI. |
| Nombres de ejecutores en `ejecutores_permitidos.md` reflejan disponibilidad real | preguntar a Torre/Ariel. |
| `estado.md` arranca con 001 y 002 y refleja el estado real del día de creación | comparar con `.torre/mesa-compartida/`. |
| Existe entrada en Torre que registra "agente-saas tiene mesa local activa desde fecha X" | actualizar `.torre/estado.md` o equivalente. |
