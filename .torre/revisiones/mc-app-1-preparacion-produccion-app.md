# MC-APP-1 — Preparación de producción del app torre-control + gate de producción

> **Microciclo:** MC-APP-1
> **Autoridad emisora:** Torre de Control (ORD-20260609-01)
> **Ejecutor:** Claude Code
> **Estado del microciclo (preparación técnica):** CERRADO
> **Resultado del gate de producción:** **DEVUELTO A AUTORIZACIÓN** — no APROBADO (faltan auditor independiente, autorización explícita de Ariel y verificación de rollback).
> **Rama:** `claude/eager-fermat-vr2ee4` · **PR:** #58

---

## 1. Propósito

Dos cosas distintas, deliberadamente separadas:

1. **Acta de cierre** del microciclo MC-APP-1: la preparación técnica del app (backend Express + frontend) para que sea desplegable. Esto está **hecho y verificado**.
2. **Gate de producción**: la evaluación, contra `criterios_produccion_y_reglas_activas.md`, de si el pase a producción real está autorizado. Esto **no lo cierra el ejecutor**: el principio rector de Torre dice que se autoriza solo por evidencia verificable y con auditor distinto del ejecutor.

---

## 2. Qué quedó hecho (preparación técnica)

| Área | Antes | Ahora |
|---|---|---|
| Persistencia | JSON en disco (`fs.writeFileSync`, race + volátil) | SQLite WAL + migración idempotente |
| Config | `localhost`/puerto hardcodeados | `PORT`, `ALLOWED_ORIGIN`, `DATA_DIR`, `API_TOKEN` por entorno |
| CORS | `origin: '*'` | lista de orígenes; mismo origen al servir el front desde el back |
| Auth | ninguna | token Bearer en endpoints de escritura |
| Hardening | ninguno | helmet, rate limit, límite de payload, manejo de errores global, shutdown ordenado |
| Frontend | URL/token hardcodeados, indentación rota | config externa, token en `localStorage`, servido por el backend |
| Deploy | inexistente; `node_modules` versionado | Dockerfile + railway.toml + .dockerignore + .env.example + DEPLOY.md + .gitignore; `node_modules` desversionado |

Verificación local: `npm ci --omit=dev` resuelve; backend levanta; `GET /` sirve el frontend; `/api/health` ok; escritura sin token → 401, con token → 200; JSON inválido → 400.

---

## 3. Gate de producción — checklist (`criterios_produccion_y_reglas_activas.md`)

> Leyenda: ✅ cubierto con evidencia · ⚠️ parcial · ❌ pendiente (lo cierra Torre/Ariel/auditor).

### A. Identidad del cambio
- ✅ Repo activo: `szlapakariel-ux/torre-control`.
- ✅ Servicio afectado: backend Express del app + frontend estático.
- ⚠️ Ambiente: producción nueva (Railway). No hay staging. Declarado.
- ✅ Commits exactos: `d7d4a8d`, `2a4e63d`, `743f760` + commit de este cierre (rama `claude/eager-fermat-vr2ee4`).
- ✅ PR exacto: #58.
- ✅ Autor del cambio: Claude Code (bajo orden de Torre).
- ✅ Agente ejecutor: Claude Code (`claude_code`).
- ❌ **Agente auditor, distinto del ejecutor: NO asignado.** Requisito del checklist sin cubrir.
- ✅ Tipo de cambio: técnico (código + infraestructura de deploy).
- ✅ Problema que resuelve: app no desplegable / inseguro para producción.

### B. Alcance autorizado
- ✅ Alcance escrito antes de cerrar (ORD-20260609-01).
- ✅ Archivos permitidos: `backend/**`, `frontend/**`, artefactos de deploy en raíz, y `.torre/` solo para este cierre.
- ✅ Archivos/áreas prohibidas: otros repos, otros proyectos, resto de `.torre/`.
- ✅ Se declara que el cambio puede tocar runtime y producción (es su finalidad).
- ✅ Datos reales: la migración mueve 1 mensaje + 2 decisiones legacy (datos de prueba, no PII de clientes).
- ⚠️ Usuarios reales: el app es de uso del dueño; sin usuarios externos hoy.

### C. Autorización explícita de Ariel
- ❌ **Autorización explícita del pase a producción: PENDIENTE.** Ariel pidió preparar el deploy y creó el proyecto en Railway, pero el gate exige una autorización explícita, no inferida, con conocimiento de riesgo y rollback. Debe quedar registrada acá antes de declarar APROBADO.
- ⚠️ Ariel sabe qué se modifica y el riesgo (resumido en este documento y en el PR).
- ❌ Rollback: definido conceptualmente (revertir PR / no montar volumen), **no verificado en la práctica**.
- ✅ Ariel no fue usado como cartero técnico ni copiando/pegando entre agentes.

### D. Rama, base y sincronización
- ✅ Rama `claude/eager-fermat-vr2ee4` nace de `main`.
- ⚠️ Base por commit: confirmar que el PR #58 está al día con `main` antes del merge.
- ✅ Sin commits ajenos al microciclo (todos los commits de la rama pertenecen a MC-APP-1).
- ✅ Sin arrastre de ramas viejas ni duplicados por squash.

---

## 4. Resultado del gate

**DEVUELTO A AUTORIZACIÓN.** No se declara APROBADO. Faltan, explícitamente:

1. **Auditor independiente** (distinto de Claude Code) que revise el cambio.
2. **Autorización explícita de Ariel** del pase a producción, registrada (no inferida de esta conversación).
3. **Verificación de rollback** (probar que se puede revertir el deploy / restaurar estado).

Hasta que esos tres puntos estén cerrados, el merge a `main` y el deploy se hacen **bajo decisión directa de Ariel como dueño**, no como pase de producción aprobado por el gate de Torre.

---

## 5. Cómo cerrar el gate (próxima orden)

1. Torre asigna auditor (ej. Codex u otra instancia) con scope read-only sobre la rama.
2. Ariel deja autorización explícita escrita (en una orden o en este documento).
3. Se prueba el rollback en Railway (revertir a la imagen previa / quitar volumen y restaurar).
4. Con los tres ✅, se actualiza este documento a **APROBADO** y se registra en `estado.md`.

---

## 6. Estado final

- **MC-APP-1 (preparación técnica):** CERRADO.
- **Gate de producción:** DEVUELTO A AUTORIZACIÓN (auditor + Ariel explícito + rollback pendientes).
- **Torre:** en reposo, sin orden activa tras este cierre.
- **Otras líneas (MC-LOC-3, location-tracking técnico):** sin cambios, NO habilitadas.
